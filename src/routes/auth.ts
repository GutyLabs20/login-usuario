import { authMiddleware } from "../middlewares/authMiddleware";
import { authController } from "../controllers/auth";
import { Router } from "express";


const router = Router()

/**
 * localhost:3600/api/v1/auth/login [POST]
 */

router.post('/login', authController.validation(), authController.Login.bind(authController));
// router.post('/logout', authMiddleware.authenticateToken.bind(authController), authController.validation(), authController.LogOut.bind(authController));
// router.post('/logout', authController.validation(), authController.LogOut.bind(authController));
// router.get('/refresh-tokens', authController.RefreshTokens.bind(authController));
router.post('/refresh-tokens', authController.RefreshTokens.bind(authController));

export { router };