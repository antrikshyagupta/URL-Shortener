const express = require("express");
const router = express.Router();

const urlController = require("../controllers/url.controllers");
const authenticateToken = require("../middlewares/auth.middleware");

router.post("/shorten", authenticateToken, urlController.shortenUrl);
router.get("/", authenticateToken, urlController.getUrls);
router.get("/:shortCode/stats", authenticateToken, urlController.getUrlStats);
router.patch("/:shortCode", authenticateToken, urlController.updateUrl);
router.delete("/:shortCode", authenticateToken, urlController.deleteUrl);
router.get("/:shortCode", urlController.redirectUrl);

module.exports = router;