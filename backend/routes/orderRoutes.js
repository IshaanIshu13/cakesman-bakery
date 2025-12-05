const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");

// All order routes require authentication
router.use(authMiddleware);

router.post("/", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/admin/all", orderController.getAllOrders);
router.patch("/:id/status", orderController.updateOrderStatus);
router.get("/:id", orderController.getOrder);

module.exports = router;
