// Tests never talk to real S3, but env.ts validates these are present at
// import time regardless of environment. Fill in throwaway values so the
// schema passes; the S3 module itself is mocked in individual test files.
process.env.AWS_ACCESS_KEY_ID ||= "test-access-key";
process.env.AWS_SECRET_ACCESS_KEY ||= "test-secret-key";
process.env.S3_BUCKET ||= "test-bucket";
process.env.GEMINI_API_KEY ||= "test-gemini-key";
