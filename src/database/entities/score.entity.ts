import { BaseEntity, Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Score extends BaseEntity
{
    @PrimaryColumn({name : 'user_id'})
    userId : string;

    @PrimaryColumn({name : 'course_id'})
    courseId : number;

    @Column({name : 'daily_score',default : 0})
    dailyScore : number;
    
    @Column({name : 'week_score',default : 0})
    weekScore : number;

    @Column({name : 'month_score',default : 0})
    monthScore : number;

    @Column({name : 'total',default : 0})
    totalScore : number;

    @UpdateDateColumn({
        name : 'last_studied',
        default : 'now()',
        nullable : true
    })
    lastStudied : Date;

    @Column({name : 'streak',nullable : true})
    streak : number;
}