// Tests never talk to real infra (db, S3, email, auth) - everything is
// mocked in individual test files - but env.ts validates these are present
// at import time regardless of environment. Fill in throwaway values,
// syntactically valid enough to satisfy the zod schema, so it parses in an
// environment (like CI) with no real .env file.
process.env.DATABASE_URL ||= "postgresql://test:test@localhost:5432/test";
process.env.BETTER_AUTH_SECRET ||= "test-better-auth-secret-min-32-characters";
process.env.BETTER_AUTH_URL ||= "http://localhost:4000";
process.env.WEB_ORIGIN ||= "http://localhost:3000";
process.env.AWS_REGION ||= "us-east-1";
process.env.AWS_ACCESS_KEY_ID ||= "test-access-key";
process.env.AWS_SECRET_ACCESS_KEY ||= "test-secret-key";
process.env.S3_BUCKET ||= "test-bucket";
process.env.MUAPI_API_KEY ||= "test-muapi-key";
process.env.SENDGRID_API_KEY ||= "test-sendgrid-key";
process.env.EMAIL_FROM ||= "test@example.com";
