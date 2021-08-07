export default class Metronome {
    constructor(period) {
        this.period = period;
        this.curTime = 0;
    }

    ticking(){
        this.curTime += 0.03;
        if (this.curTime > this.period){
            this.curTime = 0;
            return true;
        }
        else{
            return false;
        }        
    }
}