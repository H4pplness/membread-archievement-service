import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Honor } from "src/database/entities/honor.entity";
import { Score } from "src/database/entities/score.entity";
import { HonorRepository } from "./repositories/honor.repository";
import { HonorService } from "./services/honor.service";
import { HonorController } from "./controllers/honor.controller";
import { ScoreStatisticsModule } from "../score-statistics-module/scorestatistics.module";
import { GoalRepository } from "./repositories/goal.repository";
import { Goal } from "src/database/entities/goal.entity";

@Module({
    imports : [TypeOrmModule.forFeature([Honor,Score,Goal]),ScoreStatisticsModule],
    providers : [HonorRepository,HonorService,GoalRepository],
    controllers : [HonorController],
    exports : [HonorService]
})
export class HonorModule {}