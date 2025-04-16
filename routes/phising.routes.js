const express = require("express");
const router = express.Router();
const { 
    createPhishing, 
    getAllPhishing, 
    getPhishingById,
    updatePhishing,
    deletePhishing,
    searchPhishing
} = require("../controllers/phising.controller");

router.post("/phishing", createPhishing);
router.get("/phishing", getAllPhishing);
router.get("/phishing/:id", getPhishingById);
router.get("/search", searchPhishing);
router.patch('/phishing/:id', updatePhishing);
router.delete('/phishing/:id', deletePhishing);

module.exports = router;

