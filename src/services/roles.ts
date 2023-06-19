import { BadRequestError, NotFoundError } from "../helpers/helpers";
import { appDataSource } from "../config";
import { Roles } from "../models";
import { Repository } from "typeorm";

export class RolesService {

    private rolesRepository: Repository<Roles>;

    constructor() {
        this.rolesRepository = appDataSource.getRepository(Roles);
    }

    async listarRoles(): Promise<Roles[]> {
        return this.rolesRepository.find({ order: { createdAt: 'DESC' } });
    }

    async listarRolPorId(uuid: string): Promise<Roles> {
        const rol = await this.rolesRepository.findOneBy({ uuid_rol: uuid });
        if (!rol) { throw new NotFoundError("Registro no existe"); }
        return rol;
    }

    async mostrarRolIdPorNombre(nombre: string): Promise<String | null> {
        const rol = await this.rolesRepository.findOne({ where: { nombre: nombre} });
        if (!rol) { throw new NotFoundError("Registro no existe"); }
        return rol.uuid_rol;
    }

    async crearRol(nombre: string, descripcion: string): Promise<Roles> {
        const existeRol = await this.rolesRepository.findOne({where: { nombre }});
        if (existeRol) {
            throw new BadRequestError('El rol ya esta registrado');
        }
        const rol = this.rolesRepository.create({nombre, descripcion});
        return this.rolesRepository.save(rol);
    }

    async actualizarRol(id: string, nombre: string, descripcion: string): Promise<Roles> {
        const rol = await this.listarRolPorId(id);
        rol.nombre = nombre;
        rol.descripcion = descripcion;
        return this.rolesRepository.save(rol);
    }

    async eliminarRol(id: string) {
        const rol = await this.listarRolPorId(id);
        rol.activo = false;
        return this.rolesRepository.save(rol);
    }

}