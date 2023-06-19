import { Repository } from 'typeorm';
import { Usuarios } from '../models';
import { appDataSource } from '../config';
import { NotFoundError } from '../helpers/helpers';
import { generateRefreshToken, generateAccessToken, verifyToken, verifyRefreshToken, veryfied, errorResponse } from "../utils";

export class AuthService {
  private usuariosRepository: Repository<Usuarios>;

  constructor() {
    this.usuariosRepository = appDataSource.getRepository(Usuarios);
  }

  async iniciarSesion(correo: string,clave: string): Promise<any> {
    const usuario = await this.usuariosRepository.findOne({where: { correo }, relations: { rol: true}, select: {rol: {nombre: true}} });
    if (!usuario || usuario.activo == false) { throw new NotFoundError("Registro no existe"); }
    const verificarClave = await veryfied(clave, usuario.clave);
    if (!verificarClave) { throw new NotFoundError("Contraseña incorrecta"); }

    const accessToken = generateAccessToken(usuario.uuid_usuario);
    const refreshToken = generateRefreshToken(usuario.uuid_usuario);

    usuario.refreshToken = refreshToken;
    const usuarioLogueado = await this.usuariosRepository.save(usuario);
    const verData = {
      idusuario: usuario.uuid_usuario,
      usuario: usuarioLogueado.usuario,
      rol: usuarioLogueado.rol,
      accessToken: accessToken,
      refreshToken: usuarioLogueado.refreshToken,
      admin: usuarioLogueado.is_admin ? 'ADMIN': '',
      staff: usuarioLogueado.is_staff ? 'COLABORADOR': '',
      cliente: usuarioLogueado.is_client ? 'CLIENTE': '',
      message: {
        vista: 'Logueado exitosamente'
      }
    }
    
    return verData;
  }

  async cerrarSesion(uuid: string): Promise<Usuarios | null> {
    const usuario = await this.usuariosRepository.findOne({ where: {uuid_usuario:uuid}});
    
    if (usuario) {
      usuario.refreshToken = '';
      await this.usuariosRepository.save(usuario);
    }
    
    return usuario;
  }

  async refreshTokens(refreshToken: string): Promise<any> {
    const decoded = verifyRefreshToken(refreshToken);
    const usuario = await this.usuariosRepository.findOne({ where: { uuid_usuario: decoded['id']} });
    if (!usuario || usuario.refreshToken !== refreshToken) { throw new NotFoundError("Usuario no existe o Token de actualización no válido"); }
    
    const accessToken = generateAccessToken(usuario.uuid_usuario);
    const newRefreshToken = generateRefreshToken(usuario.uuid_usuario);
    usuario.refreshToken = newRefreshToken;
    await this.usuariosRepository.save(usuario);
    const refreshData = {
      idusuario: usuario.uuid_usuario,
      usuario: usuario.usuario,
      rol: usuario.rol,
      accessToken: accessToken,
      refreshToken: usuario.refreshToken,
      message: {
        vista: 'RefreshToken'
      }
    }

    return refreshData;
  }

}