import { Request, Response } from "express";
// Reuse same DI as AuthController for simplicity
import { PrismaUserRepository } from "../../infrastructure/database/UserRepository";

const userRepo = new PrismaUserRepository();

export class UsersController {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: List users with pagination (requires auth)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: A paginated list of users
   */
  static async listUsers(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const size = Number(req.query.size || 10);
    const repo = userRepo as any;
    const result = await repo.list(page, size);
    res.json({ success: true, data: result, message: "Users fetched" });
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by id (requires auth)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User found
   */
  static async getUserById(req: Request, res: Response) {
    const id = req.params.id;
    const repo = userRepo as any;
    const user = await repo.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user.toJSON(), message: "User fetched" });
  }

  /**
   * @swagger
   * /users/me:
   *   get:
   *     summary: Get current authenticated user (requires auth)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user info
   */
  static async me(req: Request, res: Response) {
    // typed request may carry user set by authenticate middleware
    const anyReq = req as any;
    if (!anyReq.user || !anyReq.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }
    const repo = userRepo as any;
    const user = await repo.findById(anyReq.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user.toJSON(), message: "Current user" });
  }

  /**
   * @swagger
   * /users/{id}:
   *   patch:
   *     summary: Partially update a user (requires auth)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: User updated
   */
  static async patchUser(req: Request, res: Response) {
    const id = req.params.id;
    // validation is handled by route/controller caller
    const dto = req.body;
    const repo = userRepo as any;
    const updated = await repo.updateFields(id, dto);
    res.json({
      success: true,
      data: updated.toJSON(),
      message: "User updated",
    });
  }

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Replace a user (requires auth)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: User replaced
   */
  static async replaceUser(req: Request, res: Response) {
    const id = req.params.id;
    const dto = req.body;
    const repo = userRepo as any;
    const existing = await repo.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    existing.updatePassword(dto.password);
    // clear verification state when replacing
    existing.setEmailVerificationToken(null as any, new Date());
    existing["props"].firstName = dto.firstName;
    existing["props"].lastName = dto.lastName;
    existing["props"].role = dto.role;
    const saved = await repo.update(existing);
    res.json({ success: true, data: saved.toJSON(), message: "User replaced" });
  }

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete a user (requires auth)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted
   */
  static async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    const repo = userRepo as any;
    await repo.delete(id);
    res.json({ success: true, data: null, message: "User deleted" });
  }
}

export default UsersController;
