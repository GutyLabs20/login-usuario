import { Request, Response } from "express";
import { IResponseList, errorResponse, errorServerResponse, successResponse } from "../utils";
import { validationResult, ValidationChain, body } from "express-validator";
import { Roles } from "../models";
import { RolesService } from "../services";
import { BadRequestError, NotFoundError } from "../helpers/helpers";

class RolesController {
    
    private rolesService: RolesService

    constructor(){
        this.rolesService = new RolesService();
    }

    async listarRoles(req: Request, res: Response): Promise<any> {
        try {
            const roles = await this.rolesService.listarRoles();
            const resultado: IResponseList<Roles[]> = {
                data: roles
            }
            return successResponse(res, resultado);
        } catch (e) {
            if (e instanceof Error) {
                return errorServerResponse(res, e);
            }
        }
    }

    async listarRolPorId(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const rol = await this.rolesService.listarRolPorId(String(id));
            return successResponse(res, { rol });
        } catch (e) {
            if (e instanceof NotFoundError) {
                return errorResponse(res, 404, { message: `No existe el rol con id ${id}`, error: true });
            } else {
                return errorServerResponse(res, e);
            }
        }
    }

    async crearNuevaRol(req: Request, res: Response): Promise<any> {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) { return errorResponse(res, 400, {messages: errores.array(), error: true}); }
            const { nombre, descripcion } = req.body;
            await this.rolesService.crearRol(nombre.toUpperCase(),descripcion.toUpperCase());
            return successResponse(res, { message: "Creado exitosamente!", error: false });
        } catch (error) {
            if (error instanceof BadRequestError) {
                return errorResponse(res, 404, { message: `El servidor no puede encontrar el recurso solicitado`, error: true });
            } else {
                return errorServerResponse(res, error);
            }
        }
    }

    async actualizarRol(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;
            await this.rolesService.actualizarRol(id, nombre.toUpperCase(), descripcion.toUpperCase());
            return successResponse(res, { message: 'Actualizacion exitosa!', error: false })
        } catch (error) {
            if (error instanceof NotFoundError) {
                return errorResponse(res, 404, { message: `Registro no encontrado`, error: true });
            } else {
                return errorServerResponse(res, error)
            }
        }
    }

    async eliminarRol(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            await this.rolesService.eliminarRol(id);
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
                .withMessage('El campo solo puede contener letras.'),
            body('nombre', 'Formato de rol incorrecto')
                .trim()
                .custom(
                    nombre => {
                        return Roles.findOne({where: { nombre }}).then(nombre => {
                            if (nombre) {
                                return Promise.reject('El rol ya existe')
                            }
                        })
                    }
                ),
            body('descripcion', 'Mínimo 4 caracteres').trim().isLength({min: 4}),
        ];
    }
}

export const rolesController = new RolesController();