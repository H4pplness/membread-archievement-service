import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Honor extends BaseEntity {
    @PrimaryColumn({name : 'user_id'})
    userId : number;

    @PrimaryColumn({name : 'honor_id'})
    honorId : number;

    @Column({name : 'honor'})
    honor : string;
}