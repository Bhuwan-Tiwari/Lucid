const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.get("/config", emailController.getEmailConfig);
router.get("/", emailController.getAllEmails);
router.get("/:id", emailController.getEmailById);
router.get("/:id/receiving-chain", emailController.getReceivingChain);
router.get("/:id/esp", emailController.getESPInfo);
router.post("/process", emailController.processEmails);
router.delete("/:id", emailController.deleteEmail);
router.get("/stats/summary", emailController.getEmailStats);

module.exports = router;
