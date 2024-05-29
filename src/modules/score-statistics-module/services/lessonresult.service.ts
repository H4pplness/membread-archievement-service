import { BadRequestException, Injectable } from "@nestjs/common";
import { LessonResultRepository } from "../repositories/lessonresult.repository";
import { LessonResultDTO } from "src/dtos/lessonresult.dto";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";

@Injectable()
export class LessonResultService {
    constructor(private readonly lessonResultRepository : LessonResultRepository){}

    public async saveResult(result : LessonResultDTO)
    {
        return await this.lessonResultRepository.saveResult(result);
    }

    public async getLeaderBoardByCourseId(courseId : number , period : string)
    {
        switch(period)
        {
            case 'daily' : 
                return await this.lessonResultRepository.getLeaderBoardInCourse(courseId);
            case 'week' : 
                return await this.lessonResultRepository.getLeaderBoardInCourseByWeek(courseId);
            case 'month' : 
                return await this.lessonResultRepository.getLeaderBoardInCourseByMonth(courseId);
            case 'alltime' : 
                return await this.lessonResultRepository.getLeaderBoardInCourseAllTime(courseId);
            default : 
                throw new BadRequestException();
        }
    }

    async getDailyScore(userId: string) {
        return await this.lessonResultRepository.getDailyScore(userId);
    }

    async getTotalScore(userId: string){
        return await this.lessonResultRepository.getTotalScoreOfUser(userId);
    }
}