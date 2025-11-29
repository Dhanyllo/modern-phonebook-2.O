const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function processAndSaveImage(buffer, uploadDir) {
  // Make sure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueName = `contact_${Date.now()}_${Math.round(
    Math.random() * 1e9
  )}.jpg`;
  const filePath = path.join(uploadDir, uniqueName);

  // Sharp processing
  await sharp(buffer)
    .resize(600) // resize width to 600px
    .jpeg({ quality: 80 }) // convert to JPEG, compress
    .toFile(filePath);

  return filePath;
}

module.exports = processAndSaveImage;
