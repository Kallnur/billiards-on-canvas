import { Ball, IBall, ballConfig } from "../models/ball";

interface IGetRandomBalls {
    (amount: number, field: {width: number, height: number}): IBall[]
}

export const getRandomNum = (max: number) => 
    Math.floor(Math.random() * ((max - ballConfig.maxRadius) - ballConfig.maxRadius) + ballConfig.maxRadius)

export const getRandomBalls: IGetRandomBalls = (amount, field) => {
    const newBalls = [];
    for(let i = 0; i < amount; i++) {
        let newPosition = {x: 0, y: 0};
        let isOverlap;

        do {
            newPosition = { x: getRandomNum(field.width), y: getRandomNum(field.height) };
            isOverlap = newBalls.some(ball => {
                const distance = 
                    Math.sqrt((newPosition.x - ball.position.x) ** 2 + (newPosition.y - ball.position.y) ** 2);
                return distance < (ball.radius * 2);
            });
        } while (isOverlap);

        newBalls.push(new Ball({
            position: newPosition,
        }));
    }

    return newBalls;
}

export const ballsCollision = (ball: IBall, secondBall: IBall) => {
    const dx = ball.position.x - secondBall.position.x;
    const dy = ball.position.y - secondBall.position.y;
    const dist = Math.sqrt(dx ** 2 + dy ** 2);
    const sumRadii = ball.radius + secondBall.radius;
    
    if (dist < sumRadii) {
        const [speedX1, speedY1, speedX2, speedY2] = [ball.speed.x, ball.speed.y, secondBall.speed.x, secondBall.speed.y];
    
        const newSpeedX1 = ((ball.radius - secondBall.radius) * speedX1 + (2 * secondBall.radius) * speedX2) / sumRadii;
        const newSpeedY1 = ((ball.radius - secondBall.radius) * speedY1 + (2 * secondBall.radius) * speedY2) / sumRadii;
        const newSpeedX2 = ((secondBall.radius - ball.radius) * speedX2 + (2 * ball.radius) * speedX1) / sumRadii;
        const newSpeedY2 = ((secondBall.radius - ball.radius) * speedY2 + (2 * ball.radius) * speedY1) / sumRadii;
    
        ball.speed = { x: newSpeedX1, y: newSpeedY1 };
        secondBall.speed = { x: newSpeedX2, y: newSpeedY2 };
    }
}