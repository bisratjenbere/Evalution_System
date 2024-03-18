import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const formatImage = (file) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error(
      "Invalid file format. Only images (JPG, JPEG, PNG, GIF) are allowed."
    );
  }

  const base64Image = file.buffer.toString("base64");

  const mimeType = `image/${fileExtension.substring(1)}`;
  const formattedImage = `data:${mimeType};base64,${base64Image}`;

  return formattedImage;
};

export default upload;
