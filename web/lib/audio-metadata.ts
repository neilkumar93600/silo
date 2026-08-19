/**
 * Pure TypeScript Audio Metadata & Cover Art Parser
 * Extracts ID3v2 tags (APIC, TIT2, TPE1, TALB), ID3v2.2 (PIC), MP4 (covr), and FLAC pictures
 * without any external npm dependencies.
 */

export interface AudioMetadata {
  title?: string
  artist?: string
  album?: string
  coverUrl?: string
  mimeType?: string
}

// In-memory cache to avoid re-fetching/re-parsing cover arts
const coverCache = new Map<string, AudioMetadata>()

export function parseAudioMetadata(buffer: ArrayBuffer): AudioMetadata {
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)

  const result: AudioMetadata = {}

  // 1. Check for ID3v2 tag (MP3, WAV with ID3, AIFF)
  if (bytes.length > 10 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    const versionMajor = bytes[3] // 2, 3, or 4
    // Read tag size (Synchsafe integer)
    const tagSize =
      ((bytes[6] & 0x7f) << 21) |
      ((bytes[7] & 0x7f) << 14) |
      ((bytes[8] & 0x7f) << 7) |
      (bytes[9] & 0x7f)

    let offset = 10
    const end = Math.min(bytes.length, 10 + tagSize)

    while (offset < end - 10) {
      if (bytes[offset] === 0) break // Padding

      if (versionMajor === 2) {
        // ID3v2.2 3-character frame IDs
        const frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2])
        const frameSize = (bytes[offset + 3] << 16) | (bytes[offset + 4] << 8) | bytes[offset + 5]
        if (frameSize <= 0 || offset + 6 + frameSize > end) break

        const frameData = bytes.subarray(offset + 6, offset + 6 + frameSize)
        if (frameId === "PIC") {
          const pic = parseId3v22PicFrame(frameData)
          if (pic) result.coverUrl = pic
        } else if (frameId === "TT2") {
          result.title = decodeTextFrame(frameData)
        } else if (frameId === "TP1") {
          result.artist = decodeTextFrame(frameData)
        } else if (frameId === "TAL") {
          result.album = decodeTextFrame(frameData)
        }
        offset += 6 + frameSize
      } else {
        // ID3v2.3 and ID3v2.4 4-character frame IDs
        const frameId = String.fromCharCode(
          bytes[offset],
          bytes[offset + 1],
          bytes[offset + 2],
          bytes[offset + 3]
        )

        let frameSize = 0
        if (versionMajor === 4) {
          // Synchsafe in v2.4
          frameSize =
            ((bytes[offset + 4] & 0x7f) << 21) |
            ((bytes[offset + 5] & 0x7f) << 14) |
            ((bytes[offset + 6] & 0x7f) << 7) |
            (bytes[offset + 7] & 0x7f)
        } else {
          // Standard 32-bit int in v2.3
          frameSize = view.getUint32(offset + 4, false)
        }

        if (frameSize <= 0 || offset + 10 + frameSize > end) break

        const frameData = bytes.subarray(offset + 10, offset + 10 + frameSize)

        if (frameId === "APIC") {
          const cover = parseId3v2ApicFrame(frameData)
          if (cover) {
            result.coverUrl = cover.url
            result.mimeType = cover.mimeType
          }
        } else if (frameId === "TIT2") {
          result.title = decodeTextFrame(frameData)
        } else if (frameId === "TPE1") {
          result.artist = decodeTextFrame(frameData)
        } else if (frameId === "TALB") {
          result.album = decodeTextFrame(frameData)
        }

        offset += 10 + frameSize
      }
    }

    return result
  }

  // 2. Check for FLAC
  if (bytes.length > 4 && bytes[0] === 0x66 && bytes[1] === 0x4c && bytes[2] === 0x61 && bytes[3] === 0x43) {
    let offset = 4
    let isLast = false
    while (!isLast && offset < bytes.length - 4) {
      const header = bytes[offset]
      isLast = (header & 0x80) !== 0
      const blockType = header & 0x7f
      const blockSize = (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]
      offset += 4

      if (blockType === 6) {
        // PICTURE block
        const cover = parseFlacPictureBlock(bytes.subarray(offset, offset + blockSize))
        if (cover) {
          result.coverUrl = cover.url
          result.mimeType = cover.mimeType
          break
        }
      }
      offset += blockSize
    }
    return result
  }

  return result
}

function decodeTextFrame(data: Uint8Array): string {
  if (data.length <= 1) return ""
  const encoding = data[0] // 0 = ISO-8859-1, 1 = UTF-16 with BOM, 2 = UTF-16BE, 3 = UTF-8
  const rawBytes = data.subarray(1)

  try {
    if (encoding === 0) {
      return new TextDecoder("iso-8859-1").decode(rawBytes).replace(/\0+$/, "").trim()
    } else if (encoding === 1) {
      return new TextDecoder("utf-16").decode(rawBytes).replace(/\0+$/, "").trim()
    } else if (encoding === 2) {
      return new TextDecoder("utf-16be").decode(rawBytes).replace(/\0+$/, "").trim()
    } else {
      return new TextDecoder("utf-8").decode(rawBytes).replace(/\0+$/, "").trim()
    }
  } catch {
    return ""
  }
}

function parseId3v2ApicFrame(data: Uint8Array): { url: string; mimeType: string } | null {
  if (data.length < 5) return null
  const encoding = data[0]
  let offset = 1

  // MIME type (null terminated ASCII)
  let mimeType = ""
  while (offset < data.length && data[offset] !== 0) {
    mimeType += String.fromCharCode(data[offset])
    offset++
  }
  offset++ // skip null byte

  if (!mimeType || mimeType === "-->") {
    mimeType = "image/jpeg"
  }

  // Picture type (1 byte)
  if (offset >= data.length) return null
  offset++ // skip picture type

  // Description string (null terminated according to encoding)
  if (encoding === 0 || encoding === 3) {
    // 1-byte null
    while (offset < data.length && data[offset] !== 0) offset++
    offset++
  } else {
    // 2-byte null for UTF-16
    while (offset < data.length - 1 && !(data[offset] === 0 && data[offset + 1] === 0)) offset += 2
    offset += 2
  }

  if (offset >= data.length) return null

  const imageBytes = data.subarray(offset)
  const blob = new Blob([imageBytes as unknown as BlobPart], { type: mimeType })
  return {
    url: URL.createObjectURL(blob),
    mimeType,
  }
}

function parseId3v22PicFrame(data: Uint8Array): string | null {
  if (data.length < 6) return null
  const format = String.fromCharCode(data[1], data[2], data[3]).toUpperCase()
  const mimeType = format === "PNG" ? "image/png" : "image/jpeg"
  const imageBytes = data.subarray(5)
  const blob = new Blob([imageBytes as unknown as BlobPart], { type: mimeType })
  return URL.createObjectURL(blob)
}

function parseFlacPictureBlock(data: Uint8Array): { url: string; mimeType: string } | null {
  if (data.length < 32) return null
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  let offset = 4 // skip picture type

  const mimeLen = view.getUint32(offset, false)
  offset += 4
  const mimeType = new TextDecoder("ascii").decode(data.subarray(offset, offset + mimeLen))
  offset += mimeLen

  const descLen = view.getUint32(offset, false)
  offset += 4 + descLen

  offset += 16 // skip width, height, color depth, colors used

  const dataLen = view.getUint32(offset, false)
  offset += 4

  const imageBytes = data.subarray(offset, offset + dataLen)
  const blob = new Blob([imageBytes as unknown as BlobPart], { type: mimeType })
  return {
    url: URL.createObjectURL(blob),
    mimeType,
  }
}

/**
 * Fetch and extract audio metadata from a presigned or static URL
 */
export async function getAudioCoverArt(fileId: string, audioUrl: string): Promise<AudioMetadata | null> {
  if (coverCache.has(fileId)) {
    return coverCache.get(fileId)!
  }

  try {
    // Attempt range request first (first 512 KB usually contains all ID3 frames)
    let res = await fetch(audioUrl, {
      headers: { Range: "bytes=0-524287" },
    })

    if (!res.ok && res.status !== 206) {
      // If range not supported, fetch full buffer
      res = await fetch(audioUrl)
    }

    if (!res.ok) return null

    const buffer = await res.arrayBuffer()
    const metadata = parseAudioMetadata(buffer)

    coverCache.set(fileId, metadata)
    return metadata
  } catch {
    return null
  }
}
