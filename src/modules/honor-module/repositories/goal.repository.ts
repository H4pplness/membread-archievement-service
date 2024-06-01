import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Goal } from "src/database/entities/goal.entity";
import { Repository } from "typeorm";

@Injectable()
export class GoalRepository extends Repository<Goal> {
    constructor(@InjectRepository(Goal) private readonly goalRepository : Repository<Goal>)
    {super(goalRepository.target,goalRepository.manager,goalRepository.queryRunner)}
}