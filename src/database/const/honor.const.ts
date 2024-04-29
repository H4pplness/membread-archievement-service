
export enum HONOR {
    NONE,
    NEWBIE, //10k điểm 
    GLUTTON, // 50k điểm 
    FOOD_CRITIC, // 100k điểm
    OMNIVORE // 500k điểm 
}

export function getHonor(score: number): HONOR {
    if (score <= 10000) return HONOR.NONE;

    if (score > 10000 && score <= 50000) {
        return HONOR.NEWBIE;
    } 
    if (score > 50000 && score <= 100000) {
        return HONOR.GLUTTON;
    } 
    if (score > 100000 && score <= 500000) {
        return HONOR.FOOD_CRITIC;
    } 
    if (score > 500000){
        return HONOR.OMNIVORE;
    }
}