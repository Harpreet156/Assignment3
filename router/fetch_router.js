const express = require("express");
const router = express.Router();
const path = require("path");
const { getRandomFiles, getAllFiles } = require("../util/fileUtils");
const { readFileAsBase64 } = require("../util/base64Util");
const Image = require('../models/file'); 

// Fetch random files from MongoDB
router.get("/multiple", (req, res) => {
  const count = parseInt(req.query.count) || 1;

  Image.aggregate([
    { $sample: { size: count } },
    {
      $project: {
        _id: 0,              // Exclude the _id field
        filename: 1,         // Include the filename field
        contentType: 1,      // Include the contentType field
        imageBuffer: 1       // Include the imageBuffer field (if needed)
      },
    },
  ])
    .then((randomImages) => {
      if (randomImages.length === 0) {
        return res.status(404).send("No files found.");
      }
      if (randomImages.length === 1) {
        res.json(randomImages[0]);
      } else {
        res.json(randomImages);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching file.");
    });
});


// Fetch all files from MongoDB
router.get("/all", (req, res) => {
  Image.find({}, { imageBuffer: 0 })
    .then((allImages) => {
      if (allImages.length === 0) {
        return res.status(404).json({ error: "No files found." });
      }
      const formattedImages = allImages.map((image) => ({
        filename: image.filename,
        contentType: image.contentType,
        imageBuffer: image.imageBufferThumbnail
        ? image.imageBufferThumbnail.toString("base64")
        : "",

      }));
      res.json(formattedImages);
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
      res.status(500).json({ error: "Error fetching files." });
    });
});

// Pagination for MongoDB files
const ITEMS_PER_PAGE = 10;

router.get("/all/pages/:index", (req, res) => {
  const pageIndex = parseInt(req.params.index, 10);

  if (isNaN(pageIndex) || pageIndex < 1) {
    return res.status(400).send("Invalid page index.");
  }

  Image.find({}, { imageBuffer: 0 })
    .skip((pageIndex - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((page_results) => {
      if (page_results.length === 0) {
        return res.status(404).send("Page not found.");
      }
      Image.countDocuments()
        .then((total_images) => {
          const totalPages = Math.ceil(total_images / ITEMS_PER_PAGE);
          const formattedPageItems = page_results.map((image) => ({
            filename: image.filename,
            contentType: image.contentType,
            imageBuffer: image.imageBuffer // Removed thumbnail conversion to keep it consistent
              ? image.imageBuffer.toString("base64")
              : "",
          }));
          const response = {
            page: pageIndex,
            totalPages: totalPages,
            files: formattedPageItems,
          };
          res.json(response);
        })
        .catch((error) => {
          console.error("Error counting Documents:", error);
          res.status(500).send("Error fetching files.");
        });
    })
    .catch((error) => {
      console.error("Error Finding Documents:", error);
      res.status(500).send("Error fetching files.");
    });
});

module.exports = router;
