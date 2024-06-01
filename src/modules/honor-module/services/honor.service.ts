import { BadRequestException, Injectable } from "@nestjs/common";
import { HonorRepository } from "../repositories/honor.repository";
import { AchieveHonorDTO } from "src/dtos/achievehonor.dto";
import { HONOR } from "src/database/const/honor.const";
import { LessonResultRepository } from "src/modules/score-statistics-module/repositories/lessonresult.repository";
import { GoalRepository } from "../repositories/goal.repository";
import { Goal } from "src/database/entities/goal.entity";

@Injectable()
export class HonorService {
    constructor(
        private readonly honorRepository: HonorRepository,
        private readonly lessonResultRepository: LessonResultRepository,
        private readonly goalRepository: GoalRepository
    ) { }

    async getUserHonor(userId: string) {
        return await this.honorRepository.getUserHonor(userId);
    }

    async achieveHonor(honor: AchieveHonorDTO) {
        const score = await this.lessonResultRepository.getTotalScoreOfUser(honor.userId);

        switch (honor.honor) {
            case HONOR.NEWBIE:
                if (score >= 10000) {
                    return await this.honorRepository.achieveHonor(honor);
                } else {
                    throw new BadRequestException('Score is not enough for NEWBIE');
                }
            case HONOR.BAGUETTE:
                if (score >= 50000) {
                    return await this.honorRepository.achieveHonor(honor);
                } else {
                    throw new BadRequestException('Score is not enough for BAGUETTE');
                }
            case HONOR.SANDWICH:
                if (score >= 100000) {
                    return await this.honorRepository.achieveHonor(honor);
                } else {
                    throw new BadRequestException('Score is not enough for SANDWICH');
                }
            case HONOR.JAMBONBEURRE:
                if (score >= 500000) {
                    return await this.honorRepository.achieveHonor(honor);
                } else {
                    throw new BadRequestException('Score is not enough for JAMBONBEURRE');
                }
            default:
                throw new BadRequestException('Invalid honor type');
        }
    }

    async getStreak(userId: string, courseId: number) {
        return await this.lessonResultRepository.getStreak(userId, courseId);
    }

    async getGoal(userId: string) {
        const goal = await this.goalRepository.findOne({
            where: {
                userId: userId
            }
        });

        return { goal: goal.goal } ?? { goal: 20000 };
    }

    async setGoal(userId: string, goal: number) {
        var goalInstance = await this.goalRepository.findOne({
            where: {
                userId: userId
            }
        });

        if (goalInstance == null) {
            var newGoal = new Goal();
            newGoal.userId = userId;
            newGoal.goal = goal;

            await newGoal.save();
        } else {
            goalInstance.goal = goal;

            await goalInstance.save();
        }

        return "Update success !";
    }
}