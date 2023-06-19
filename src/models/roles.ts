import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuarios } from './usuarios';

@Entity()
export class Roles extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid_rol: string;

    @Column({ type: "varchar", length:100})
    nombre: string;

    @Column({ type: "varchar", length:200})
    descripcion: string;

    @OneToMany( ()=> Usuarios, (usuario) => usuario.rol )
    usuarios: Usuarios[];

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}