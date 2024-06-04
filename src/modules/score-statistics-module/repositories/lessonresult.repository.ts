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
        const today = new Date();

        const leaderBoard = await this.scoreRepository.find({
            select: ["dailyScore", "userId", "lastStudied"],
            where: { courseId: courseId },
            order: { dailyScore: 'DESC' }
        });

        return leaderBoard.map(userScore => {
            if (
                userScore.lastStudied.getDate() === today.getDate() &&
                userScore.lastStudied.getMonth() === today.getMonth() &&
                userScore.lastStudied.getFullYear() === today.getFullYear()
            ) {
                const { dailyScore, ...info } = userScore;
                return { ...info, score: dailyScore };
            } else {
                const { dailyScore, ...info } = userScore;
                return { ...info, score: 0 };
            }
        });
    }


    private getWeek(date: Date): { year: number, week: number } {
        const tempDate = new Date(date.getTime());
        tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((+tempDate - +yearStart) / 86400000) + 1) / 7);
        return { year: tempDate.getUTCFullYear(), week: weekNo };
    }

    async getLeaderBoardInCourseByWeek(courseId: number) {
        const leaderBoard = await this.scoreRepository.find({
            select: ["weekScore", "userId", "lastStudied"],
            where: { courseId: courseId },
            order: { weekScore: 'DESC' }
        });

        const today = new Date();
        const todayWeek = this.getWeek(today);

        return leaderBoard.map(userScore => {
            const lastStudiedWeek = this.getWeek(userScore.lastStudied);
            if (
                todayWeek.week == lastStudiedWeek.week &&
                userScore.lastStudied.getFullYear() === today.getFullYear()
            ) {
                const { weekScore, ...info } = userScore;
                return { ...info, score: weekScore };
            } else {
                const { weekScore, ...info } = userScore;
                return { ...info, score: 0 };
            }
        });
    }

    async getLeaderBoardInCourseByMonth(courseId: number) {
        const leaderBoard = await this.scoreRepository.find({
            select: ["monthScore", "userId", "lastStudied"],
            where: { courseId: courseId },
            order: { monthScore: 'DESC' }
        });

        const today = new Date();

        return leaderBoard.map(userScore => {
            if (
                userScore.lastStudied.getMonth() === today.getMonth() &&
                userScore.lastStudied.getFullYear() === today.getFullYear()
            ) {
                const { monthScore, ...info } = userScore;
                return { ...info, score: monthScore };
            } else {
                const { monthScore, ...info } = userScore;
                return { ...info, score: 0 };
            }
        });
    }

    async getLeaderBoardInCourseAllTime(courseId: number) {
        const leaderBoard = await this.scoreRepository.find({
            select: ["totalScore", "userId"],
            where: { courseId: courseId },
            order: { totalScore: 'DESC' }
        });

        return leaderBoard.map((userScore) => {
            const { totalScore, ...info } = userScore;
            return { ...info, score: totalScore };
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
            .select('user_id as userId ,SUM(daily_score) as dailyscore')
            .where('user_id = :userId', { userId })
            .andWhere('DATE(last_studied) = CURRENT_DATE')
            .groupBy('user_id')
            .getRawOne();
        console.log("SCORE : ", score);
        return score != null ? {
            userId,
            dailyScore: parseInt(score.dailyscore)
        } : {
            userId,
            dailyScore: 0
        };
    }
}