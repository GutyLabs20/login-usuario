import { authMiddleware } from "../middlewares/authMiddleware";
import { rolesController } from "../controllers/roles";
import { Router } from "express";


const router = Router()

/**
 * http://localhost:3600/roles [GET]
 */

router.get('/', authMiddleware.authenticateToken.bind(authMiddleware), rolesController.listarRoles.bind(rolesController))
router.get('/:id', authMiddleware.authenticateToken.bind(authMiddleware), rolesController.listarRolPorId.bind(rolesController));
router.post('/', authMiddleware.authenticateToken.bind(authMiddleware), rolesController.validation(), rolesController.crearNuevaRol.bind(rolesController));
router.put('/:id', authMiddleware.authenticateToken.bind(authMiddleware), rolesController.actualizarRol.bind(rolesController));
router.delete('/:id', authMiddleware.authenticateToken.bind(authMiddleware), rolesController.eliminarRol.bind(rolesController));

export { router };