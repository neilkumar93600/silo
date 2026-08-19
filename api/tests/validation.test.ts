import { describe, it, expect } from "vitest"
import { isDangerousUpload, createUploadSchema, shareFileSchema } from "../src/lib/validation.js"

describe("isDangerousUpload", () => {
  it("blocks known executable/script extensions", () => {
    expect(isDangerousUpload("virus.exe")).toBe(true)
    expect(isDangerousUpload("script.sh")).toBe(true)
    expect(isDangerousUpload("installer.MSI")).toBe(true)
  })

  it("allows ordinary document/media types", () => {
    expect(isDangerousUpload("report.pdf")).toBe(false)
    expect(isDangerousUpload("photo.png")).toBe(false)
    expect(isDangerousUpload("archive.zip")).toBe(false)
  })

  it("treats an extensionless filename as safe", () => {
    expect(isDangerousUpload("README")).toBe(false)
  })
})

describe("createUploadSchema", () => {
  it("rejects a file over the configured size limit", () => {
    const result = createUploadSchema.safeParse({
      filename: "big.bin",
      contentType: "application/octet-stream",
      sizeBytes: 2 * 1024 * 1024 * 1024 + 1,
    })
    expect(result.success).toBe(false)
  })

  it("rejects a zero or negative size", () => {
    expect(
      createUploadSchema.safeParse({ filename: "a.txt", contentType: "text/plain", sizeBytes: 0 }).success,
    ).toBe(false)
  })

  it("accepts a normal upload request", () => {
    const result = createUploadSchema.safeParse({
      filename: "notes.txt",
      contentType: "text/plain",
      sizeBytes: 1024,
    })
    expect(result.success).toBe(true)
  })
})

describe("shareFileSchema", () => {
  it("accepts a valid email and trims it", () => {
    const result = shareFileSchema.parse({ email: "  person@example.com  " })
    expect(result.email).toBe("person@example.com")
  })

  it("rejects a non-email string", () => {
    expect(() => shareFileSchema.parse({ email: "not-an-email" })).toThrow()
  })

  it("lowercases a mixed-case email", () => {
    const result = shareFileSchema.parse({ email: "Person@Example.com" })
    expect(result.email).toBe("person@example.com")
  })
})
