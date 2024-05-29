import { IsEnum, IsNotEmpty } from "class-validator";
import { HONOR } from "src/database/const/honor.const";

export class AchieveHonorDTO {
    @IsNotEmpty({message : 'let enter userId'})
    userId: string;

    @IsEnum(HONOR,{message : 'enum not found!'})
    honor : HONOR;
}