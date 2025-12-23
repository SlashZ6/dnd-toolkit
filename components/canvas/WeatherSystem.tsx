
import React, { useRef, useEffect } from 'react';

interface WeatherSystemProps {
    width: number;
    height: number;
    type: 'none' | 'rain' | 'snow' | 'embers' | 'fog';
    scale: number;
}

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;

    constructor(w: number, h: number, type: string) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.life = Math.random() * 100;
        this.maxLife = 100;

        if (type === 'rain') {
            this.vx = 2;
            this.vy = Math.random() * 10 + 10;
            this.size = Math.random() * 20 + 10; // Length
        } else if (type === 'snow') {
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 + 1;
            this.size = Math.random() * 3 + 2;
        } else if (type === 'embers') {
            this.vx = Math.random() * 2 - 1;
            this.vy = -(Math.random() * 2 + 1);
            this.size = Math.random() * 3 + 1;
            this.maxLife = Math.random() * 50 + 50;
        } else if (type === 'fog') {
             this.vx = Math.random() * 0.5 - 0.25;
             this.vy = Math.random() * 0.5 - 0.25;
             this.size = Math.random() * 100 + 50;
        } else {
             this.vx = 0; this.vy = 0;
        }
    }

    update(w: number, h: number, type: string) {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (type === 'rain') {
            if (this.y > h) {
                this.y = -this.size;
                this.x = Math.random() * w;
            }
        } else if (type === 'snow') {
            this.x += Math.sin(this.y * 0.01); // Wiggle
            if (this.y > h) {
                this.y = -10;
                this.x = Math.random() * w;
            }
        } else if (type === 'embers') {
             if (this.life <= 0 || this.y < 0) {
                 this.y = h;
                 this.x = Math.random() * w;
                 this.life = this.maxLife;
             }
        } else if (type === 'fog') {
             if (this.x > w + this.size) this.x = -this.size;
             if (this.x < -this.size) this.x = w + this.size;
             if (this.y > h + this.size) this.y = -this.size;
             if (this.y < -this.size) this.y = h + this.size;
        }
    }

    draw(ctx: CanvasRenderingContext2D, type: string) {
        ctx.beginPath();
        if (type === 'rain') {
            ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
            ctx.lineWidth = 1;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.vx, this.y + this.size);
            ctx.stroke();
        } else if (type === 'snow') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'embers') {
            const opacity = this.life / this.maxLife;
            ctx.fillStyle = `rgba(255, 100, 0, ${opacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'fog') {
             ctx.fillStyle = `rgba(200, 200, 200, 0.05)`; // Very subtle
             ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
             ctx.fill();
        }
    }
}

export const WeatherSystem: React.FC<WeatherSystemProps> = ({ width, height, type, scale }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const reqRef = useRef<number>(0);

    useEffect(() => {
        particlesRef.current = [];
        const count = type === 'rain' ? 500 : type === 'snow' ? 200 : type === 'embers' ? 100 : type === 'fog' ? 50 : 0;
        for (let i = 0; i < count; i++) {
            particlesRef.current.push(new Particle(width, height, type));
        }
    }, [type, width, height]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const loop = () => {
            if (type === 'none') {
                ctx.clearRect(0, 0, width, height);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Optimization: Only draw if within reasonable bounds (not strictly necessary with this approach but good practice)
            // But here we simulate full canvas because we are transforming it via CSS mostly or just drawing over whole area.
            
            // Actually, we need to handle scale if we want particles to look same size regardless of zoom,
            // or zoom with the map. Usually weather zooms with map. 
            // The canvas size is passed as props (likely matching the large virtual canvas).
            
            particlesRef.current.forEach(p => {
                p.update(width, height, type);
                p.draw(ctx, type);
            });

            reqRef.current = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [type, width, height]);

    return (
        <canvas 
            ref={canvasRef} 
            width={width} 
            height={height} 
            className="absolute top-0 left-0 pointer-events-none z-20"
            style={{ width, height }}
        />
    );
};
