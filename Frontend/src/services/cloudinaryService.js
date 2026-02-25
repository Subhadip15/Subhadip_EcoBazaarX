const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET?.trim();

export async function uploadProductImage(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary env missing. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Cloudinary upload failed", {
        status: response.status,
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size,
        response: data
      });
    }

    const cloudinaryMessage =
      data?.error?.message ||
      `Image upload failed with status ${response.status}`;

    throw new Error(
      `${cloudinaryMessage}. Check Cloudinary preset name/case and ensure the preset is unsigned.`
    );
  }

  return data.secure_url;
}