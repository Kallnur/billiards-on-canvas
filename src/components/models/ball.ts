export const ballConfig = {
    minRadius: 20,
    maxRadius: 35,
}

export interface IBall {
    id: number,
    position: {x: number, y: number},
    color: string,
    radius: number,
    speed: {x: number, y: number},
    draw: (func: IFuncToCreateBall) => void
}

export interface IFuncToCreateBall {
    (obj: {
        x: number,
        y: number,
        raduis: number,
        fill: boolean,
        color: string
    }): void
}

export class Ball implements IBall {
    id;
    position;
    color;
    radius;
    speed;

    constructor (ballObj: Pick<IBall, "position">) {
        this.id       = Math.random();
        this.position = ballObj.position;
        this.color    = '#' + Math.floor(Math.random()*16777215).toString(16);
        this.radius   = (Math.random() * (ballConfig.maxRadius - ballConfig.minRadius) + ballConfig.minRadius);
        this.speed    = {x: 0, y: 0};
    }

    draw (funcToCreateBall: IFuncToCreateBall) {
        this.position.x = this.position.x + this.speed.x;
        this.position.y = this.position.y + this.speed.y;
        funcToCreateBall({
            x: this.position.x,
            y: this.position.y,
            raduis: this.radius,
            fill: true,
            color: this.color,
        })
    }
}