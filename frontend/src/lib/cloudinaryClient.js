import { Cloudinary } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const defaultUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const defaultFolder = import.meta.env.VITE_CLOUDINARY_FOLDER

export const isCloudinaryConfigured = Boolean(cloudName)

const cloudinary = isCloudinaryConfigured
  ? new Cloudinary({
      cloud: {
        cloudName,
      },
      url: {
        secure: true,
      },
    })
  : null

function assertCloudinaryConfig() {
  if (!isCloudinaryConfigured || !cloudinary) {
    throw new Error('Cloudinary chua duoc cau hinh: thieu VITE_CLOUDINARY_CLOUD_NAME.')
  }
}

export async function uploadImageToCloudinary(file, options = {}) {
  assertCloudinaryConfig()

  const uploadPreset = options.uploadPreset || defaultUploadPreset

  if (!uploadPreset) {
    throw new Error('Thieu upload preset. Hay them VITE_CLOUDINARY_UPLOAD_PRESET vao .env.')
  }

  if (!file) {
    throw new Error('Khong co file anh de upload.')
  }

  const resourceType = options.resourceType || 'image'
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
  const formData = new FormData()

  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const folder = options.folder || defaultFolder
  if (folder) {
    formData.append('folder', folder)
  }

  if (options.publicId) {
    formData.append('public_id', options.publicId)
  }

  if (options.tags?.length) {
    formData.append('tags', options.tags.join(','))
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })
  const payload = await response.json()

  if (!response.ok) {
    const errorMessage = payload?.error?.message || 'Upload that bai.'
    throw new Error(`Cloudinary upload loi: ${errorMessage}`)
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id,
    width: payload.width,
    height: payload.height,
    format: payload.format,
    bytes: payload.bytes,
    resourceType: payload.resource_type,
    raw: payload,
  }
}

export function buildCloudinaryImageUrl(publicId, options = {}) {
  assertCloudinaryConfig()

  if (!publicId) {
    throw new Error('Thieu publicId de tao URL anh Cloudinary.')
  }

  const image = cloudinary.image(publicId)

  if (options.width || options.height) {
    image.resize(
      fill()
        .width(options.width || options.height)
        .height(options.height || options.width),
    )
  }

  if (options.format) {
    image.format(options.format)
  }

  if (typeof options.quality !== 'undefined') {
    image.quality(String(options.quality))
  }

  return image.toURL()
}
