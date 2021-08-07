import Metronome from "../game/metronome.js";
import Vector2 from "../game/vector2.js";
import Collider from "../game/collider.js";

export class GO {
    constructor(position, collider, frameValues) {
        this.position = position;
        this.collider = collider;
        this.frameValues = frameValues;
        this.frame = 0;  
        this.isAlive = true;  
    }
    
    update() {

    }

    draw(ctx, image) {
        ctx.drawImage(
            image,
            this.frameValues.left + this.frame * this.frameValues.width,
            this.frameValues.top,
            this.frameValues.width,
            this.frameValues.height,
            this.position.x,
            this.position.y,
            this.frameValues.width,
            this.frameValues.height
            );
    }
}

export class Laser extends GO {
    timer = new Metronome(0.05);
    
    update() {
        if (this.timer.ticking()) {
            this.position.x += 10;
            this.collider.left += 10;
            this.collider.right += 10;
            if(this.position.x > 360) {
                this.position.x = -500;
                this.isAlive = false;
            }
        }
    }

    kill() {
        this.isAlive = false;
        this.position.x = 30
        this.collider.left = 30;
    }
}

export class Roof extends GO {
    timer = new Metronome(0.1);
    
    update() {
        if (this.timer.ticking()) {
            this.position.x -= 0.5;
            if(this.position.x < -60)
                this.position.x = 360;
        }
    }
}

export class Wall extends GO {
    timer = new Metronome(0.03);
    timerAnim = new Metronome(0.2);
    type = 0;
    gotIt = true;
    drawIt = true;
    speed = 2;
    target = 540

    update() {
        if (this.timer.ticking()) {
            this.position.x -= this.speed;
            this.collider.left -= this.speed;
            this.collider.right -= this.speed;
            if(this.position.x < -60) {
                this.gotIt = false;
                this.position.x = this.target;
                this.collider.left = this.target;
                this.collider.right = this.target + this.collider.width;
            }
        }

        if (this.isAnimRun) {
            if (this.timerAnim.ticking()) {
                this.frameValues.left += 60;
                if (this.type == 1) {
                    if (this.frameValues.left > 61) {
                        this.isAnimRun = false;
                        this.frameValues.left = 0;
                    }
                }
                if (this.type == 2) {
                    if (this.frameValues.left > 121) {
                        this.isAnimRun = false;
                        this.frameValues.left = 0;
                        this.drawIt = false;
                    }
                }
            }
        }
    }

    kill() {
        this.isAnimRun = true;
        if(this.type == 2) {
            this.isAlive = false;
        }
    }

    static empty(xFirstPosition, yPosition, x, y) {
        let p = new Vector2(xFirstPosition + x * 180, yPosition - y * 60);
        let s = new Vector2(60, 60);
        let w = (new Wall(p, new Collider(p,s), new Collider(new Vector2(-60, -60),s)));
        return w;
    }

    static hard(xFirstPosition, yPosition, x, y) {
        let p = new Vector2(xFirstPosition + x * 180, yPosition - y * 60);
        let s = new Vector2(60, 60);
        let w = (new Wall(p, new Collider(p,s), new Collider(new Vector2(0, 60),s)));
        w.type = 1;
        return w;
    }

    static soft(xFirstPosition, yPosition, x, y) {
        let p = new Vector2(xFirstPosition + x * 180, yPosition - y * 60);
        let s = new Vector2(60, 60);
        let w = (new Wall(p, new Collider(p,s), new Collider(new Vector2(0, 180),s)));
        w.type = 2;
        return w;
    }

    static bullet(xFirstPosition, yPosition, x, y) {
        let p = new Vector2(xFirstPosition + x * 180, yPosition - y * 60);
        let s = new Vector2(60, 60);
        let w = (new Wall(p, new Collider(p,s), new Collider(new Vector2(0, 180),s)));
        w.type = 2;
        w.speed = 8;
        w.target = 400;
        return w;
    }
}

export class Robot extends GO {
    timer = new Metronome(0.1);
    timerAnim = new Metronome(0.2);
    curY = 0;
    gotIt = false;
    curSpeed = 0.5;
    lowSpeed = 0.5;
    heightSpeed = 8;
    isAnimRun = false;
    
    update() {
        if (this.timer.ticking()) {
            if (!this.gotIt) {
                if (this.position.y > this.curY - 4) {
                    this.position.y -= this.curSpeed;
                    this.collider.top -= this.curSpeed;
                    this.collider.bottom -= this.curSpeed;
                }
                if (this.position.y <= this.curY - 3) {
                    this.curSpeed = this.lowSpeed;
                    this.gotIt = true;
                }
            }
            else {
                if (this.position.y < this.curY + 4) {
                    this.position.y += this.curSpeed;
                    this.collider.top += this.curSpeed;
                    this.collider.bottom += this.curSpeed;
                }
                if (this.position.y >= this.curY + 3) {
                    this.curSpeed = this.lowSpeed;
                    this.gotIt = false;
                }
            }
        }
        if (this.isAnimRun) {
            if (this.timerAnim.ticking()) {
                this.frameValues.left += 60;
                if (this.frameValues.left > 61) {
                    this.isAnimRun = false;
                    this.frameValues.left = 0;
                }
            }
        }
    }

    down() {
        if (this.curY < 239) {
            this.curY += 60;
            this.curSpeed = this.heightSpeed;
            this.gotIt = true;
        }
    }

    up() {
        if (this.curY > 61) {
            this.curY -= 60;
            this.curSpeed = this.heightSpeed;
            this.gotIt = false;
        }
    }

    kill() {
        this.frameValues.left += 60;
    }

    fire() {
        this.isAnimRun = true;
    }

    static create(position, collider, frameValues) {
        let r = new Robot(position, collider, frameValues);
        r.curY = r.position.y;
        return r;
    }
}