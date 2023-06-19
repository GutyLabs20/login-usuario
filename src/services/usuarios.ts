import { BadRequestError, NotFoundError, claveCliente } from "../helpers/helpers";
import { appDataSource } from "../config";
import { Roles, Usuarios } from "../models";
import { Repository } from "typeorm";
import { encrypt, generateAccessToken, generateRefreshToken } from "../utils";

export class UsuariosService {

    private usuariosRepository: Repository<Usuarios>;
    private rolesRespository: Repository<Roles>;

    constructor() {
        this.usuariosRepository = appDataSource.getRepository(Usuarios);
        this.rolesRespository = appDataSource.getRepository(Roles);
    }

    async listarUsuarios(): Promise<Usuarios[]> {
        return this.usuariosRepository.find(
            { 
                relations: {rol: true},
                select: {rol: { nombre: true }},
                order: { createdAt: 'DESC' } }
        );
    }

    async listarUsuarioPorId(uuid: string): Promise<Usuarios> {
        const usuario = await this.usuariosRepository.findOne({ 
            where: {uuid_usuario: uuid}, 
            relations:{rol:true}, 
            select: {rol: {nombre: true}}
        });
        if (!usuario) { throw new NotFoundError("Registro no existe"); }
        return usuario;
    }

    async crearUsuarioStaff(
        nombre: string, apellido: string, usuario: string, correo: string,
        clave: string, rol
    ): Promise<Usuarios> {
        const existeUsuario = await this.usuariosRepository.findOne({where: { correo }});
        if (existeUsuario) {
            throw new BadRequestError('El usuario con este email ya esta registrado');
        }
        const agregarUsuario = this.usuariosRepository.create({
            nombre, apellido, usuario, correo, clave, rol
        });
        const accessToken  = await generateAccessToken(agregarUsuario.uuid_usuario);
        // const refreshToken = await generateRefreshToken(agregarUsuario.uuid_usuario, res);
        // agregarUsuario.refreshToken = refreshToken;
        return this.usuariosRepository.save(agregarUsuario);
    }

    async crearUsuarioCliente(
        nombre: string, apellido: string, usuario: string, correo: string, 
        empresa_ruc, rol, is_client: boolean
    ): Promise<Usuarios> {
        const existeCliente = await this.usuariosRepository.findOne({where: { correo }});
        if (existeCliente) {
            throw new BadRequestError('El cliente con este email ya esta registrado');
        }
        let clave = await encrypt(claveCliente());
        
        const agregarCliente = this.usuariosRepository.create({
            nombre, apellido, usuario, correo, empresa_ruc, clave, rol, is_client
        });
        const accessToken  = await generateAccessToken(agregarCliente.uuid_usuario);
        // const refreshToken = await generateRefreshToken(agregarCliente.uuid_usuario, res);
        // agregarCliente.refreshToken = refreshToken;
        return this.usuariosRepository.save(agregarCliente);
    }

    async actualizarUsuario(
        id: string, nombre: string, apellido: string, usuario: string,
        correo: string, rol, is_admin: boolean, is_staff: boolean
    ): Promise<Usuarios> {
        const modificarUsuario = await this.listarUsuarioPorId(id);
        modificarUsuario.nombre = nombre;
        modificarUsuario.apellido = apellido;
        modificarUsuario.usuario = usuario;
        modificarUsuario.correo = correo || modificarUsuario.correo;
        modificarUsuario.rol = rol;
        modificarUsuario.is_admin = is_admin;
        modificarUsuario.is_staff = is_staff;
        return this.usuariosRepository.save(modificarUsuario);
    }

    async eliminarUsuario(id: string) {
        const usuario = await this.listarUsuarioPorId(id);
        usuario.activo = false;
        return this.usuariosRepository.save(usuario);
    }

}