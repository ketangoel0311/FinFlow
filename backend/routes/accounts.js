const express = require("express");
const Account = require("../models/Account");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.userId });
    res.json(accounts);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json(account);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { bankName, accountType, accountNumber, plaidAccountId } = req.body;

    const account = await Account.create({
      user: req.userId,
      bankName,
      accountType,
      accountNumber,
      plaidAccountId,
    });

    res.status(201).json(account);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
