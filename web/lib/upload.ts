import { requestUploadUrl, completeUpload, type FileRecord } from "./api"

// XHR, not fetch: fetch has no upload-progress event, and 100MB+ files
// need a real progress bar rather than an indeterminate spinner.
function putWithProgress(url: string, file: File, onProgress: (fraction: number) => void, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Upload cancelled"))
      return
    }

    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream")

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded / event.total)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Upload to storage failed (${xhr.status})`))
      }
    }

    xhr.onerror = () => reject(new Error("Upload to storage failed — check your connection"))
    xhr.onabort = () => reject(new Error("Upload cancelled"))

    signal?.addEventListener("abort", () => xhr.abort())

    xhr.send(file)
  })
}

export async function uploadFile(
  file: File,
  onProgress: (fraction: number) => void,
  folderId?: string,
  signal?: AbortSignal,
): Promise<FileRecord> {
  const { fileId, uploadUrl } = await requestUploadUrl({
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    folderId,
  })

  await putWithProgress(uploadUrl, file, onProgress, signal)

  return completeUpload(fileId)
}
