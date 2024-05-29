import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { HONOR } from "../const/honor.const";

@Entity()
export class Honor extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({name : 'user_id',nullable : false})
    userId : string;

    @Column({name : 'honor',type:'enum',enum : HONOR,default : HONOR.NONE})
    honor : HONOR;
}