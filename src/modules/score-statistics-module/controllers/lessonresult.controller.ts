import { Controller, Get, Param, Query } from "@nestjs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";
import { LessonResultDTO } from "src/dtos/lessonresult.dto";
import { LessonResultService } from "../services/lessonresult.service";

@Controller()
export class LessonResultController {
    constructor(private readonly lessonResultService : LessonResultService){}

    @EventPattern('updated.score')
    updateLessonResult(updateInfo : LessonResultDTO)
    {
        return this.lessonResultService.saveResult(updateInfo);
    }

    @MessagePattern('get-leader-board')
    async getLearderBoardInCourse(data: {courseId : number,period : string})
    {
        return this.lessonResultService.getLeaderBoardByCourseId(data.courseId,data.period);
    }

    @MessagePattern('get-daily-score')
    async getDaitlyScore(data : {userId : string}){
        const response = await this.lessonResultService.getDailyScore(data.userId);
        console.log("RESPONSE : ",response);
        return response;
    }

    @MessagePattern('get-total-score')
    getTotalScore(data : {userId : string}){
        return this.lessonResultService.getTotalScore(data.userId);
    }
}