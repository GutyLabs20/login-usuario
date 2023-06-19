import { Request, Response } from "express";
import { Repository } from "typeorm";
import { validationResult, ValidationChain, body } from "express-validator";
import { Usuarios } from "../models";
import { MODE_NODE, appDataSource } from "../config";
import {
    errorResponse,
    errorServerResponse,
    successResponse
} from "../utils";
import { AuthService } from "../services";

class AuthController {
    usuariosRepository: Repository<Usuarios>;
    private authService: AuthService

    constructor() {
        this.usuariosRepository = appDataSource.getRepository(Usuarios);
        this.authService = new AuthService();
    }

    async Login(req: Request, res: Response): Promise<any> {
        const errores = validationResult(req);
        try {
            if (!errores.isEmpty()) return errorResponse(res, 400, {messages: errores.array(),error: true});
            const { correo, clave } = req.body;
            const credenciales = await this.authService.iniciarSesion(correo, clave);
            
            return successResponse(res, credenciales);
        } catch (error) {
            console.log(error);
            return errorServerResponse(res, error);
        }
    }

    async RefreshTokens(req: Request, res: Response): Promise<any> {
        const errores = validationResult(req);

        const refreshTokencookie = req.cookies['refreshToken'];

        if (!refreshTokencookie) { return errorResponse(res, 400, {messages: 'Es necesario actualizar el token',error: true}); }

        try {
            const decoded =  await this.authService.refreshTokens(refreshTokencookie);
            return successResponse(res, decoded);
        } catch (error) {
            console.error(error);
            return errorResponse(res, 401, {messages: errores.array(),error: true});
        }
    }

    //Como realizar el logout
    // async LogOut(req: Request, res: Response): Promise<any> {
    //     const decoded = 'Saliendo del sistema'
    //     return successResponse(res, decoded);
    //     // const { id } = req.body;
    //     // try {
    //     // // const usuario = await this.usuariosRepository.findOne({where: {uuid_usuario:req['id']}});
    //     // const salir = await this.authService.cerrarSesion(id)
    //     // return successResponse(res, salir);
    //     // } catch (error) {
    //     //     return errorServerResponse(res, error);
    //     // }
    // }

    public validation(): ValidationChain[] {
        return [
            body("correo", "Formato de correo incorrecto")
                .trim()
                .isEmail()
                .normalizeEmail()
                .custom((correo) => {
                return Usuarios.findOne({ where: { correo } }).then((correo) => {
                    if (!correo) {
                    return Promise.reject(
                        "¡Usuario ingresado, no existe!"
                    );
                    }
                });
                }),
            body("clave", "Mínimo 6 caracteres").trim().isLength({ min: 6 })
        ];
    }
}

export const authController = new AuthController();
