import { NextFunction, Request, Response } from "express";
import { verifyRefreshToken, verifyToken } from "../utils";
import { errorResponse, errorServerResponse } from "../utils/error";
import { JsonWebTokenError } from "jsonwebtoken";

class AuthMiddleware {

    async authenticateToken(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            let authHeader = req.headers?.authorization;
            
            if (!authHeader) {
                return errorResponse(res, 401, { message: `Se requiere token de acceso.`, error: true });
            }
            const token = authHeader && authHeader.split(' ')[1];
            const payload = await verifyToken(token);
            const atributo = 'id'
            req['id'] = payload[atributo];
            next();
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                const TokenVerificationErrors = {
                    "invalid signature" : "La firma del JWT, no es válida.",
                    "jwt expired" : "JWT expirado",
                    "invalid token" : "Token no válido",
                    "No Bearer" : "Utiliza formato Bearer"
                }
                return errorResponse(res, 403, { message: `Token inválido.`, error: TokenVerificationErrors[err.message] });
            } else {
                return errorServerResponse(res, err);
            }
        }
    }

    async authenticateRefreshToken(req: Request, res: Response, next: NextFunction): Promise<any> {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return errorResponse(res, 401, { message: `Es necesario actualizar el token.`, error: true });
        }
        try {
            const decoded = await verifyRefreshToken(refreshToken);
            req.body = decoded;
            next();
        } catch (error) {
            return errorResponse(res, 401, { message: `RefreshToken inválido.`, error: true });
        }
    }

}

export const authMiddleware = new AuthMiddleware()