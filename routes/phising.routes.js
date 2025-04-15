const express = require("express");
const router = express.Router();
const { createPhishing, getAllPhishing  } = require("../controllers/phising.controller");

router.post("/phishing", createPhishing);
router.get("/phishing", getAllPhishing);

module.exports = router;