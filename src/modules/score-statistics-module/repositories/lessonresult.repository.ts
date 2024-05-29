import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { Score } from "src/database/entities/score.entity";
import { LessonResultDTO } from "src/dtos/lessonresult.dto";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class LessonResultRepository extends Repository<Score> {
    constructor(
        @InjectRepository(Score) private readonly scoreRepository: Repository<Score>,
        @InjectDataSource() private readonly dataSource: DataSource
    ) {
        super(scoreRepository.target, scoreRepository.manager, scoreRepository.queryRunner)
    }

    async saveResult(result: LessonResultDTO) {
        const lessonResult = await this.scoreRepository.findOne({
            where: {
                courseId: result.courseId,
                userId: result.userId
            }
        })

        if (lessonResult) {
            const today = moment();

            const lastUpdated = moment(lessonResult.lastStudied);
            lessonResult.dailyScore += result.score;
            if (lastUpdated.isoWeek() == today.isoWeek()) {
                lessonResult.weekScore += result.score;
            } else {
                lessonResult.weekScore = result.score;
            }
            if (lastUpdated.month() == today.month()) {
                lessonResult.monthScore += result.score;
            } else {
                lessonResult.monthScore = result.score;
            }
            lessonResult.totalScore += result.score;

            if (lastUpdated.isSame(today.subtract(1, 'days'), 'day')) {
                lessonResult.streak++;
            } else if (lastUpdated.isSame(today)) { }
            else {
                lessonResult.streak = 1;
            }

            return await lessonResult.save();
        }

        const newLessonResult = new Score();
        newLessonResult.courseId = result.courseId;
        newLessonResult.userId = result.userId;
        newLessonResult.dailyScore = result.score;
        newLessonResult.weekScore = result.score;
        newLessonResult.monthScore = result.score;
        newLessonResult.totalScore = result.score;

        return await newLessonResult.save();
    }

    async getLeaderBoardInCourse(courseId: number) {
        return await this.scoreRepository.find({
            select: ["dailyScore", "userId"],
            where: { courseId: courseId },
            order: { dailyScore: 'DESC' }
        });
    }

    async getLeaderBoardInCourseByWeek(courseId: number) {
        return await this.scoreRepository.find({
            select: ["weekScore", "userId"],
            where: { courseId: courseId },
            order: { weekScore: 'DESC' }
        });
    }

    async getLeaderBoardInCourseByMonth(courseId: number) {
        return await this.scoreRepository.find({
            select: ["monthScore", "userId"],
            where: { courseId: courseId },
            order: { monthScore: 'DESC' }
        });
    }

    async getLeaderBoardInCourseAllTime(courseId: number) {
        return await this.scoreRepository.find({
            select: ["totalScore", "userId"],
            where: { courseId: courseId },
            order: { totalScore: 'DESC' }
        });
    }

    async getTotalScoreOfUser(userId: string): Promise<number> {
        const scoreTotal = await this.dataSource.createQueryBuilder(Score, 'score')
            .select('SUM(total)', 'sum')
            .where("user_id = '" + userId + "'")
            .getRawOne();
        if (!scoreTotal) {
            throw new NotFoundException();
        }
        return scoreTotal.sum as number;
    }

    async getStreak(userId: string, courseId: number) {
        const streak = await this.findOne({
            select: ['streak'],
            where: {
                userId: userId,
                courseId: courseId
            }
        })

        if (!streak) {
            throw new NotFoundException();
        }
        return streak;
    }

    async getDailyScore(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const score = await this.dataSource.createQueryBuilder(Score, 'score')
            .select('user_id as userId ,SUM(daily_score) as dailyScore')
            .where('user_id = :userId', { userId })
            .andWhere('DATE(last_studied) = CURRENT_DATE')
            .groupBy('user_id')
            .getRawOne();
        console.log("SCORE : ", score);
        return score??{
            userId,
            dailyScore : 0
        };
    }
}