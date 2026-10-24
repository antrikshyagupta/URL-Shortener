const express = require("express");
const router = express.Router();

const urlController = require("../controllers/url.controllers");



router.post('/shorten' , urlController.shortenUrl);
router.get("/:shortCode", urlController.redirectUrl);
router.get("/", urlController.getUrls);
router.get("/:shortCode/stats" , urlController.getUrlStats)
router.delete("/:shortCode" , urlController.deleteUrl)

module.exports = router ;