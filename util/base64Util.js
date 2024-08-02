const fs = require("fs");
const path = require("path");

const readFileAsBase64 = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "base64");
    return content;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return null;
  }
};

module.exports = { readFileAsBase64 };
