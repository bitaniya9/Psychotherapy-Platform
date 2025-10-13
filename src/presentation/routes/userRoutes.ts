import express from "express";
import UsersController from "../controllers/UsersController";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.get("/", authenticate, UsersController.listUsers);
// must declare /me before /:id to avoid path param shadowing
router.get("/me", authenticate, UsersController.me);
router.get("/:id", authenticate, UsersController.getUserById);
router.patch("/:id", authenticate, UsersController.patchUser);
router.put("/:id", authenticate, UsersController.replaceUser);
router.delete("/:id", authenticate, UsersController.deleteUser);

export default router;
