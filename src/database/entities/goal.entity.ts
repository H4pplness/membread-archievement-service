import { BaseEntity, Column, Entity } from "typeorm";

@Entity()
export class Goal extends BaseEntity{
    @Column({primary : true,name : 'user_id'})
    userId : string;

    @Column({default : 20000})
    goal : number;
}