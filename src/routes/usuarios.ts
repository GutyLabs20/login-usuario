import { authMiddleware } from "../middlewares/authMiddleware";
import { usuariosController } from "../controllers/usuarios";
import { Router } from "express";


const router = Router()

/**
 * http://localhost:3600/roles [GET]
 */

router.get('/', authMiddleware.authenticateToken.bind(authMiddleware), usuariosController.listarUsuarios.bind(usuariosController))
router.get('/:id', authMiddleware.authenticateToken.bind(authMiddleware), usuariosController.listarUsuarioPorId.bind(usuariosController));
router.post('/', authMiddleware.authenticateToken.bind(authMiddleware), usuariosController.validation(), usuariosController.crearNuevoUsuario.bind(usuariosController));
router.put('/:id', authMiddleware.authenticateToken.bind(authMiddleware), usuariosController.validation(), usuariosController.actualizarUsuario.bind(usuariosController));
router.delete('/:id', authMiddleware.authenticateToken.bind(authMiddleware), usuariosController.eliminarUsuario.bind(usuariosController));

export { router };