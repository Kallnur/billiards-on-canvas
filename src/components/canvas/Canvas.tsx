import { RefObject, useEffect, useRef, useState } from "react"
import { IBall, IFuncToCreateBall } from "../models/ball";
import { ballsCollision, getRandomBalls } from "./utils";
import Modal from "./modal/Modal";

interface Props {}

const Canvas = ({}: Props) => {
    const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
    const canvasSize = {width: 1200, height: 600}

    const [balls, setBalls] = useState<IBall[]>(
        getRandomBalls(15, {width: canvasSize.width, height: canvasSize.height})
    );
    const [selectedBall, setSelectedBall] = useState<IBall | null>(null);

    const closeModal = () => setSelectedBall(null);
    const changeBallColor = (id: number, newColor: string) => {
        setBalls(prev => prev.map(ball => {
            if(ball.id === id) ball.color = newColor;
            return ball;
        }));
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if(!ctx || !canvas) return;

        const createBall: IFuncToCreateBall = (ball) => {
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.raduis, 0, (2 * Math.PI));
            ctx.closePath();
            ctx.fill()
        }

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(ball => {
                ball.position.x += ball.speed.x;
                ball.position.y += ball.speed.y;

                if (ball.position.x - ball.radius < 0 || ball.position.x + ball.radius > canvas.width) 
                    ball.speed.x *= -.85;
                if (ball.position.y - ball.radius < 0 || ball.position.y + ball.radius > canvas.height) 
                    ball.speed.y *= -.85;

                balls.forEach(otherBall => {
                    if(otherBall !== ball) {
                        ballsCollision(ball, otherBall);
                    }
                })
                ball.draw(createBall)
            })
            requestAnimationFrame(loop)
        }
        loop()

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            for (let i = 0; i < balls.length; i++) {
                const ball = balls[i];
                const distanceX = mouseX - ball.position.x;
                const distanceY = mouseY - ball.position.y;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
            
                if (distance <= ball.radius) {
                    const pushStrength = 0.03;
                    const normalizedDistanceX = distanceX / ball.radius;
                    const normalizedDistanceY = distanceY / ball.radius;
            
                    ball.speed.x += normalizedDistanceX * pushStrength;
                    ball.speed.y += normalizedDistanceY * pushStrength;
                    
                    break; 
                }
            }
        }

        const handleClick = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            for (let i = 0; i < balls.length; i++) {
                const ball = balls[i];
                const distance = Math.sqrt((mouseX - ball.position.x) ** 2 + (mouseY - ball.position.y) ** 2);
                if (distance <= ball.radius) {
                    setSelectedBall(ball);
                    break;
                }
            }
        }

        canvas.addEventListener("mousemove", handleMouseMove)
        canvas.addEventListener("click", handleClick)

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove)
            canvas.removeEventListener("click", handleClick)
        }
    }, [balls])
    
  return (<>
    <canvas width={canvasSize.width} height={canvasSize.height} ref={canvasRef}></canvas>
    <Modal selectedBall={selectedBall} closeModal={closeModal} changeBallColor={changeBallColor}/>
    </>)
}

export default Canvas