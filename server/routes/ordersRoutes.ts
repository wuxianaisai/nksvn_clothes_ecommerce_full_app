import express from "express";
import { authorize, protect } from "../middleware/auth.js";
import { createOrder, getAllOrders, getOrder, getOrders, updateOrderStatus } from "../controllers/ordersController.js";

const OrderRouter = express.Router()

OrderRouter.get("/", protect, getOrders)

OrderRouter.get("/:id", protect, getOrder)

OrderRouter.post("/", protect, createOrder)

OrderRouter.put("/:id/status", protect, authorize("admin"), updateOrderStatus)

OrderRouter.put("/admin/all", protect, authorize("admin"), getAllOrders)

export default OrderRouter;