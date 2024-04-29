import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

@Controller()
export class LessonResultController {
    @EventPattern('updated.score')
    updateLessonResult(updateInfo : {courseId : number,score : number})
    {
        console.log('COURSE ID : ',updateInfo.courseId);
        console.log('SCORE : ',updateInfo.score);
    }
}