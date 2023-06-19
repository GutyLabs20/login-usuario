import { Request, Response } from "express";
import { IResponseList, encrypt, errorResponse, errorServerResponse, successResponse } from "../utils";
import { validationResult, ValidationChain, body } from "express-validator";
import { Usuarios } from "../models";
import { UsuariosService } from "../services";
import { BadRequestError, NotFoundError, nombreUsuario } from "../helpers/helpers";

class UsuariosController {
    
    private usuariosService: UsuariosService;

    constructor(){
        this.usuariosService = new UsuariosService();
    }

    async listarUsuarios(req: Request, res: Response): Promise<any> {
        try {
            const usuarios = await this.usuariosService.listarUsuarios();
            const resultado: IResponseList<Usuarios[]> = {
                data: usuarios
            }
            return successResponse(res, resultado);
        } catch (e) {
            if (e instanceof Error) {
                return errorServerResponse(res, e);
            }
        }
    }

    async listarUsuarioPorId(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const usuario = await this.usuariosService.listarUsuarioPorId(String(id));
            return successResponse(res, { usuario });
        } catch (e) {
            if (e instanceof NotFoundError) {
                return errorResponse(res, 404, { message: `No existe el usuario con id ${id}`, error: true });
            } else {
                return errorServerResponse(res, e);
            }
        }
    }

    async crearNuevoUsuario(req: Request, res: Response): Promise<any> {
        const errores = validationResult(req);
        try {
            if (!errores.isEmpty()) return errorResponse(res, 400, {messages: errores.array(), error: true});
            const { nombre, apellido, correo, clave, rol } = req.body;
            let usuario = nombreUsuario(nombre, apellido);
            let claveEncriptada = await encrypt(clave);
            await this.usuariosService.crearUsuarioStaff(
                nombre.toUpperCase(), apellido.toUpperCase(), usuario, 
                correo, claveEncriptada, rol
            );
            return successResponse(res, { message: "Creado exitosamente!", error: false });
        } catch (error) {
            if (error instanceof BadRequestError) {
                return errorResponse(res, 404, { message: `El servidor no puede encontrar el recurso solicitado`, error: true });
            } else {
                return errorServerResponse(res, error);
            }
        }
    }

    async actualizarUsuario(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const { 
                nombre, apellido, correo, rol, is_admin, is_staff 
            } = req.body;
            let usuario = nombreUsuario(nombre, apellido);
            await this.usuariosService.actualizarUsuario(
                id, nombre.toUpperCase(), apellido.toUpperCase(), usuario,
                correo, rol, is_admin, is_staff
            );
            return successResponse(res, { message: 'Actualizacion exitosa!', error: false })
        } catch (error) {
            if (error instanceof NotFoundError) {
                return errorResponse(res, 404, { message: `Registro no encontrado`, error: true });
            } else {
                return errorServerResponse(res, error)
            }
        }
    }

    async eliminarUsuario(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            await this.usuariosService.eliminarUsuario(id);
            return successResponse(res, { message: 'Se eliminó exitosamente!', error: false })
        } catch (error) {
            if (error instanceof NotFoundError) {
                return errorResponse(res, 404, { message: `Registro no encontrado`, error: true });
            } else {
                return errorServerResponse(res, error)
            }
        }
    }

    public validation(): ValidationChain[] {
        return [
            body("nombre", "Mínimo 2 carácteres").trim().isLength({ min: 2 })
                .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
                .withMessage('El campo solo puede contener letras, Ñ, vocales con tilde y espacios en blanco.'),
            body("apellido", "Mínimo 2 carácteres").trim().isLength({ min: 2 })
                .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
                .withMessage('El campo solo puede contener letras, Ñ, vocales con tilde y espacios en blanco.'),
            body('correo', 'Formato de correo incorrecto')
                .trim()
                .isEmail()
                .normalizeEmail()
                .custom(
                    correo => {
                        return Usuarios.findOne({where: { correo }}).then(correo => {
                            if (correo) {
                                return Promise.reject('¡El correo ya existe o esta en uso!')
                            }
                        })
                    }
                ),
            body('clave', 'Mínimo 6 caracteres').trim().isLength({min: 6}),
            body("clave", "Formato de clave incorrecta"),
            body('rol', 'Mínimo 2 caracteres').trim().isLength({min: 2}),
        ];
    }
}

export const usuariosController = new UsuariosController();