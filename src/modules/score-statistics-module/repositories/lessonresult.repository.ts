import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Score } from "src/database/entities/score.entity";
import { Repository } from "typeorm";

@Injectable()
export class LessonResultRepository {
    constructor(
        @InjectRepository(Score) private readonly scoreRepository : Repository<Score>
    ){}

    saveResult()
    {
        
    }
}