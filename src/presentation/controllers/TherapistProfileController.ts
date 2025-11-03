import { Request, Response } from "express";
import fs from "fs";
import { UploadTherapistProfileUseCase } from "../../application/use-cases/auth/TherapistProfileUseCases/UpdateProfileImgUseCase"
import { GetTherapistProfileByUserIdUseCase } from "../../application/use-cases/auth/TherapistProfileUseCases/GetTherapistProfileUseCase";

export class TherapistProfileController {
  constructor(
    private uploadTherapistProfileUseCase: UploadTherapistProfileUseCase,
    private getTherapistProfileByUserIdUseCase: GetTherapistProfileByUserIdUseCase,
  ) {}

  /**
   * @swagger
   * /therapistProfile/upload:
   *   post:
   *     summary: Upload a therapist profile image
   *     tags: [Therapist Profile]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *               folder:
   *                 type: string
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Profile uploaded successfully
   *       400:
   *         description: No image file uploaded
   *       500:
   *         description: Internal server error
   */
  async uploadProfileImage(req: Request, res: Response): Promise<Response> {
    try {
      const { id, folder } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const result = await this.uploadTherapistProfileUseCase.execute({
        id,
        filePath: file.path,
        folder: folder || "therapist_profiles",
      });

      // remove temp file
      fs.unlinkSync(file.path);

      return res.status(200).json({
        message: "Profile uploaded successfully",
        data: result,
      });
    } catch (error: any) {
      console.error(error);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /therapistProfile/{userId}:
   *   get:
   *     summary: Get a therapist profile by User ID
   *     tags: [Therapist Profile]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user
   *     responses:
   *       200:
   *         description: Therapist profile found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TherapistProfile'
   *       404:
   *         description: Therapist profile not found
   *       500:
   *         description: Internal server error
   */
  async getTherapistProfile(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;

    try {
      const therapistProfile = await this.getTherapistProfileByUserIdUseCase.execute(userId);

      if (!therapistProfile) {
        return res.status(404).json({ success: false, message: "Therapist profile not found" });
      }

      return res.status(200).json({ success: true, data: therapistProfile });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
