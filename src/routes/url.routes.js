const express = require("express");
const router = express.Router();

const urlController = require("../controllers/url.controllers");
router.post('/shorten' , urlController.shortenUrl);



module.exports = router ;