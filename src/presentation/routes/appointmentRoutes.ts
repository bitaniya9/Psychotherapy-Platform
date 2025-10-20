import express from "express";
import AppointmentsController from "../controllers/AppointmentsController";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/", authenticate, AppointmentsController.create);
router.get("/", authenticate, AppointmentsController.list);
router.get("/:id", authenticate, AppointmentsController.getById);
router.put("/:id", authenticate, AppointmentsController.update);
router.delete("/:id", authenticate, AppointmentsController.remove);

export default router;
