import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Honor } from "src/database/entities/honor.entity";
import { AchieveHonorDTO } from "src/dtos/achievehonor.dto";
import { Repository } from "typeorm";

export class HonorRepository extends Repository<Honor> {
    constructor(
        @InjectRepository(Honor) honorRepository : Repository<Honor>
    ){
        super(honorRepository.target, honorRepository.manager, honorRepository.queryRunner)
    }

    async getUserHonor(userId : string)
    {
        const userHonors =  await this.find({
            where : {
                userId : userId
            }
        });

        if(userHonors){
            return userHonors;
        }else{
            throw new NotFoundException();
        }
    }

    async achieveHonor(honor : AchieveHonorDTO)
    {
        const achieveHonor = new Honor();
        achieveHonor.userId = honor.userId;
        achieveHonor.honor = honor.honor;

        console.log("HONOR : ",JSON.stringify(achieveHonor));

        await achieveHonor.save();

        return "SUCCESS";
    }
}