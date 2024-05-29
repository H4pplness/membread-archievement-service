import { Module } from "@nestjs/common";
import { LessonResultController } from "./controllers/lessonresult.controller";
import { LessonResultRepository } from "./repositories/lessonresult.repository";
import { LessonResultService } from "./services/lessonresult.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Score } from "src/database/entities/score.entity";
import { Honor } from "src/database/entities/honor.entity";

@Module({
    imports : [TypeOrmModule.forFeature([Score,Honor])],
    controllers : [LessonResultController],
    providers : [LessonResultRepository,LessonResultService],
    exports : [LessonResultRepository]
})
export class ScoreStatisticsModule {}