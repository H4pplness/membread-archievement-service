import { Injectable } from "@nestjs/common";
import { LessonResultRepository } from "../repositories/lessonresult.repository";

@Injectable()
export class LessonResultService {
    constructor(private readonly lessonResultRepository : LessonResultRepository){}

    public saveResult(courseId : number, score : number)
    {

    }
}