import { isCloudinaryConfigured } from './cloudinaryClient'

export async function checkCloudinaryHealth() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  if (!isCloudinaryConfigured || !cloudName) {
    return {
      ok: false,
      message: 'Thieu VITE_CLOUDINARY_CLOUD_NAME trong file .env.',
    }
  }

  const customHealthPublicId = import.meta.env.VITE_CLOUDINARY_HEALTH_PUBLIC_ID
  const candidates = [customHealthPublicId, 'sample'].filter(Boolean)

  for (const publicId of candidates) {
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/w_20,h_20,c_fill/${publicId}.jpg`

    try {
      const response = await fetch(url, { method: 'GET' })

      if (response.ok) {
        return {
          ok: true,
          message: `Cloudinary OK (kiem tra qua tai nguyen ${publicId}).`,
        }
      }
    } catch {
      // Try next fallback public ID.
    }
  }

  return {
    ok: false,
    message:
      'Cloudinary chua san sang hoac cloud name/public ID chua dung. Kiem tra env va thu lai.',
  }
}
