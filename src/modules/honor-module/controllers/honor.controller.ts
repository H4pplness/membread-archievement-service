import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { HonorService } from "../services/honor.service";
import { AchieveHonorDTO } from "src/dtos/achievehonor.dto";
import { MessagePattern, RpcException } from "@nestjs/microservices";

@Controller()
export class HonorController {
    constructor(
        private readonly honorService : HonorService
    ){}
    
    @MessagePattern('get-user-honor')
    async getUserHonor(data :{userId:string})
    {
        return await this.honorService.getUserHonor(data.userId);
    }

    @MessagePattern('achieve-honor')
    async achieveHonor(data: { honor : AchieveHonorDTO})
    {
        try {
            const response = await this.honorService.achieveHonor(data.honor);
            return response;
          } catch (error) {
            throw new RpcException(error.message);
          }
    }

    @MessagePattern('streak')
    async getStreak(data : {userId : string,courseId : number}){
        return await this.honorService.getStreak(data.userId,data.courseId);
    }
}