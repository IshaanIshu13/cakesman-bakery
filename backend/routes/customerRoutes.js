const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

// All customer routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", customerController.getAllCustomers);
router.get("/search", customerController.searchCustomers);
router.get("/:id", customerController.getCustomerDetails);
router.get("/:id/orders", customerController.getCustomerOrderHistory);
router.patch("/:id", customerController.updateCustomerInfo);

module.exports = router;
