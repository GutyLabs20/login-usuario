import { EntityRepository, Repository } from 'typeorm';
import { Usuarios } from "../models";

@EntityRepository(Usuarios)
export class UserRepository extends Repository<Usuarios> {

  findByEmail(correo: string): Promise<Usuarios | null> {
    return this.findOne({where: { correo }});
  }
  
  updateUsuarios(usuario: Usuarios): Promise<Usuarios> {
    return this.save(usuario);
  }
}
