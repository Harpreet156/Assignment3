const path = require("path");
const fs = require("fs");

const getAllFiles = () => {
  const directoryPath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(directoryPath);
  const fileContents = {};

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const content = fs.readFileSync(filePath, "base64");
    fileContents[file] = content;
  });

  return fileContents;
};

const getRandomFiles = (count) => {
  const directoryPath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(directoryPath);
  const randomFiles = [];
  const usedIndices = new Set();

  while (randomFiles.length < count && usedIndices.size < files.length) {
    const randomIndex = Math.floor(Math.random() * files.length);
    if (!usedIndices.has(randomIndex)) {
      randomFiles.push(files[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  return randomFiles;
};

module.exports = { getAllFiles, getRandomFiles };
