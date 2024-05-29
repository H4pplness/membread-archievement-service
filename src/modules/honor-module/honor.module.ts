import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Honor } from "src/database/entities/honor.entity";
import { Score } from "src/database/entities/score.entity";
import { HonorRepository } from "./repositories/honor.repository";
import { HonorService } from "./services/honor.service";
import { HonorController } from "./controllers/honor.controller";
import { ScoreStatisticsModule } from "../score-statistics-module/scorestatistics.module";

@Module({
    imports : [TypeOrmModule.forFeature([Honor,Score]),ScoreStatisticsModule],
    providers : [HonorRepository,HonorService],
    controllers : [HonorController],
    exports : [HonorService]
})
export class HonorModule {}