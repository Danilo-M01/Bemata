/**
 * Bemata — nature particles + seed-to-plate journey
 * (bez ScrollTrigger / bez duplog reveal-a / bez FPS petlje)
 */
(function () {
    "use strict";

    class NatureParticles {
        constructor() {
            this.canvas = document.getElementById("particleCanvas");
            if (!this.canvas) return;
            const ctx = this.canvas.getContext("2d");
            if (!ctx) return;
            this.ctx = ctx;
            this.particles = [];
            this.particleCount = window.innerWidth > 768 ? 42 : 16;
            this.running = true;
            this._resize = () => this.resize();
            this._vis = () => {
                this.running = !document.hidden;
            };
            this.resize();
            window.addEventListener("resize", this._resize);
            document.addEventListener("visibilitychange", this._vis);
            this.createParticles();
            this.animate();
        }

        resize() {
            if (!this.canvas) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.canvas.width = Math.floor(w * dpr);
            this.canvas.height = Math.floor(h * dpr);
            this.canvas.style.width = w + "px";
            this.canvas.style.height = h + "px";
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.w = w;
            this.h = h;
        }

        createParticles() {
            const shapes = ["leaf", "circle", "seed"];
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.w,
                    y: Math.random() * this.h,
                    size: Math.random() * 3.5 + 2,
                    speedX: (Math.random() - 0.5) * 0.45,
                    speedY: Math.random() * 0.45 + 0.15,
                    shape: shapes[Math.floor(Math.random() * shapes.length)],
                    opacity: Math.random() * 0.45 + 0.18,
                    rotation: Math.random() * Math.PI * 2,
                });
            }
        }

        drawLeaf(x, y, size, rotation, opacity) {
            const { ctx } = this;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.quadraticCurveTo(size, -size / 2, size / 2, size / 2);
            ctx.quadraticCurveTo(0, size, -size / 2, size / 2);
            ctx.quadraticCurveTo(-size, -size / 2, 0, -size);
            ctx.fillStyle = `rgba(163, 177, 138, ${opacity})`;
            ctx.fill();
            ctx.restore();
        }

        drawSeed(x, y, size, rotation, opacity) {
            const { ctx } = this;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.beginPath();
            ctx.ellipse(0, 0, size, size * 1.45, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 90, 60, ${opacity})`;
            ctx.fill();
            ctx.restore();
        }

        animate() {
            if (!this.canvas) return;
            if (this.running) {
                const { ctx } = this;
                ctx.clearRect(0, 0, this.w, this.h);

                this.particles.forEach((p) => {
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.rotation += 0.008;

                    if (p.y > this.h + p.size) {
                        p.y = -p.size;
                        p.x = Math.random() * this.w;
                    }
                    if (p.x > this.w + p.size) p.x = -p.size;
                    if (p.x < -p.size) p.x = this.w + p.size;

                    if (p.shape === "leaf") {
                        this.drawLeaf(p.x, p.y, p.size, p.rotation, p.opacity);
                    } else if (p.shape === "seed") {
                        this.drawSeed(p.x, p.y, p.size, p.rotation, p.opacity);
                    } else {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(163, 177, 138, ${p.opacity})`;
                        ctx.fill();
                    }
                });
            }
            requestAnimationFrame(() => this.animate());
        }
    }

    class JourneyAnimation {
        constructor() {
            this.stages = document.querySelectorAll(".growth-stage");
            this.container = document.querySelector(".nature-transition");
            this.started = false;
            this.init();
        }

        init() {
            if (!this.container || !this.stages.length) return;
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !this.started) {
                            this.started = true;
                            this.run();
                            obs.disconnect();
                        }
                    });
                },
                { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
            );
            obs.observe(this.container);
        }

        run() {
            const step = 1050;
            this.stages.forEach((stage, index) => {
                setTimeout(() => {
                    this.stages.forEach((s) => s.classList.remove("active"));
                    stage.classList.add("active");
                }, index * step);
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!reduce) {
            if (document.getElementById("particleCanvas")) {
                new NatureParticles();
            }
            new JourneyAnimation();
        } else {
            document.querySelectorAll(".growth-stage").forEach((s) => {
                s.classList.add("active");
            });
        }

        document
            .querySelectorAll(".hero-content, .nature-transition, .seed-to-plate")
            .forEach((el) => el.classList.add("gpu-accelerate"));
        document.querySelectorAll(".menu-card").forEach((el) => el.classList.add("gpu-accelerate"));
    });
})();
