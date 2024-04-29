import { Module } from "@nestjs/common";
import { LessonResultController } from "./controllers/lessonresult.controller";

@Module({
    controllers : [LessonResultController]
})
export class ScoreStatisticsModule {}