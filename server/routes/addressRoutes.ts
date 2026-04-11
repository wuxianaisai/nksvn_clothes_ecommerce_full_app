import express from "express";
import { protect } from "../middleware/auth.js";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addressController.js";

const AddressRouter = express.Router()

AddressRouter.get("/", protect, getAddresses)
AddressRouter.get("/", protect, addAddress)
AddressRouter.get("/:id", protect, updateAddress)
AddressRouter.get("/:id", protect, deleteAddress)

export default AddressRouter;