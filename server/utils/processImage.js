const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function processAndSaveImage(buffer) {
  const relativeFolder = "/uploads/contacts";
  const uploadDir = path.join(__dirname, "..", relativeFolder);

  // Ensure directories exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueName = `contact_${Date.now()}_${Math.round(
    Math.random() * 1e9
  )}.jpg`;

  const absoluteFilePath = path.join(uploadDir, uniqueName); // actual disk location

  // Process + save
  await sharp(buffer)
    .resize(600)
    .jpeg({ quality: 85 })
    .toFile(absoluteFilePath);

  return `${relativeFolder}/${uniqueName}`.replace(/\\/g, "/");
}

module.exports = processAndSaveImage;
