import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresModule } from './database/module/postgres.module';
import { ScoreStatisticsModule } from './modules/score-statistics-module/scorestatistics.module';

@Module({
  imports: [PostgresModule,ScoreStatisticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
