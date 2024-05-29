import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresModule } from './database/module/postgres.module';
import { ScoreStatisticsModule } from './modules/score-statistics-module/scorestatistics.module';
import { HonorModule } from './modules/honor-module/honor.module';

@Module({
  imports: [PostgresModule,ScoreStatisticsModule,HonorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
