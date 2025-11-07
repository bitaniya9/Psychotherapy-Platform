import express from "express";
import multer from "multer";
import { TherapistProfileController } from "../controllers/TherapistProfileController";
import { UploadTherapistProfileUseCase } from "../../application/use-cases/auth/TherapistProfileUseCases/UpdateProfileImgUseCase"
import { GetTherapistProfileByUserIdUseCase } from "../../application/use-cases/auth/TherapistProfileUseCases/GetTherapistProfileUseCase"
import { CloudinaryService } from "../../infrastructure/Cloudinary/cloudinary"
import { PrismaTherapistProfileRepository } from "../../infrastructure/database/TherapistProfileRepo"
import { DeleteTherapistProfileUseCase } from "../../application/use-cases/auth/TherapistProfileUseCases/DeleteTherapistProfileImgUseCase";
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // temporary upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// dependencies (use cases)
const cloudinaryService = new CloudinaryService();
const therapistProfileRepo = new PrismaTherapistProfileRepository();
const uploadTherapistProfile = new UploadTherapistProfileUseCase(cloudinaryService, therapistProfileRepo);
const getProfileUseCase = new GetTherapistProfileByUserIdUseCase(therapistProfileRepo);
const deleteTherapistProfile=new DeleteTherapistProfileUseCase(therapistProfileRepo,cloudinaryService);

//controller
const controller = new TherapistProfileController(getProfileUseCase,uploadTherapistProfile,deleteTherapistProfile);
// Routes
router.post("/upload", upload.single("file"), (req, res) => controller.uploadProfileImage(req, res));
router.get("/:userId", (req, res) => controller.getTherapistProfile(req, res));
router.delete("/therapistProfile/:id",(req,res)=>controller.deleteTherapistProfile(req,res))

export default router;
