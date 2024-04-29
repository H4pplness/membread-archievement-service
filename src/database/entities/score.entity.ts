import { BaseEntity, Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Score extends BaseEntity
{
    @PrimaryColumn({name : 'user_id'})
    userId : number;

    @PrimaryColumn({name : 'course_id'})
    courseId : number;

    @Column({name : 'daily_score'})
    dailyScore : number;
    
    @Column({name : 'week_score'})
    weekScore : number;

    @Column({name : 'month_score'})
    monthScore : number;

    @Column({name : 'total'})
    totalScore : number;

    @UpdateDateColumn({
        name : 'last_studied',
        default : 'now()'
    })
    lastStudied : Date;

    @Column({name : 'streak'})
    streak : number;
}