import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, Entity, BaseEntity, OneToMany } from 'typeorm';
import { Roles } from './roles';

@Entity()
export class Usuarios extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid_usuario: string

    @Column({ type: "varchar", length: 100 })
    nombre: string

    @Column({ type: "varchar", length: 200 })
    apellido: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    usuario: string;

    @Column({ type: "varchar", length: 200 })
    correo: string;

    @Column({ type: "varchar", length: 250 })
    clave: string;

    @ManyToOne( () => Roles, (rol) => rol.usuarios.toString(), { nullable: true })
    @JoinColumn({ name: 'uuid_rol' })
    rol: Roles;

    @Column({ type: "char", length: 11, nullable: true })
    empresa_ruc: string;

    @Column({ default: true })
    activo: boolean;

    @Column({ default: false })
    is_admin: boolean;

    @Column({ default: false })
    is_staff: boolean;

    @Column({ default: false })
    is_client: boolean;

    @Column({ nullable: true })
    refreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}