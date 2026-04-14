// FICTIONAL EXAMPLE — Rand Industries Inc. is not a real company.
// Scanner test targets:
//   - @aws-sdk/client-s3     → maps to "AWS" via signal_map (known)
//   - @google-cloud/storage  → maps to "Google Cloud" via signal_map (known)
//   - restic (backup CLI)    → NOT in signal_map → Gemma4 fallback expected
//   - backblaze-b2           → NOT in signal_map → Gemma4 fallback (storage)

// Document storage for candidate CVs and assessment files
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ region: process.env.AWS_REGION ?? 'eu-central-1' })

export async function uploadCandidateDocument(
  candidateId: string,
  filename: string,
  content: Buffer
): Promise<string> {
  const key = `candidates/${candidateId}/${filename}`
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: content,
    ServerSideEncryption: 'AES256',
  }))
  return key
}
