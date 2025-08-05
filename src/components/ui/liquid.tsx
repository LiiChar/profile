// 'use client';

// import { useRef, useEffect } from 'react';
// import reglConstructor from 'regl';

// type Particle = {
// 	x: number;
// 	y: number;
// 	vx: number;
// 	vy: number;
// 	radius: number;
// 	mass: number;
// 	baseX: number;
// 	baseY: number;
// };

// type AnimationProviderProps = {
// 	children?: React.ReactNode;
// };

// const NUM_PARTICLES = 200;
// const PARTICLE_RADIUS = 0.025;
// const MAX_SPEED = 0.02;
// const MOUSE_INFLUENCE_RADIUS = 1.9;
// const MOUSE_FORCE = 0.05;
// const MASS_FACTOR = 0.002;
// const SMOOTH = 0.99;
// const RETURN_FORCE = 0.01;
// const CONNECTION_DISTANCE = 0.3;

// const NUM_SEGMENTS = 24;
// const vertices = [[0, 0]];
// for (let i = 0; i <= NUM_SEGMENTS; i++) {
// 	const angle = (i / NUM_SEGMENTS) * Math.PI * 2;
// 	vertices.push([Math.cos(angle), Math.sin(angle)]);
// }

// export const Liquid = ({ children }: AnimationProviderProps) => {
// 	const canvasRef = useRef<HTMLCanvasElement>(null);
// 	const wrapperRef = useRef<HTMLDivElement>(null);

// 	const mousePos = useRef({ x: 0, y: 0 });
// 	const aspect = useRef(1);
// 	const particles = useRef<Particle[]>([]);

// 	const clamp = (v: number, min: number, max: number) =>
// 		Math.max(min, Math.min(max, v));

// 	const initParticles = () => {
// 		const arr: Particle[] = [];
// 		const gap = PARTICLE_RADIUS * 4;
// 		const cols = Math.floor(2 / gap);
// 		const rows = Math.floor(2 / gap);
// 		for (let i = 0; i < cols; i++) {
// 			for (let j = 0; j < rows; j++) {
// 				if (arr.length >= NUM_PARTICLES) break;
// 				const x = -1 + gap / 2 + i * gap;
// 				const y = -1 + gap / 2 + j * gap;
// 				arr.push({
// 					x,
// 					y,
// 					vx: 0,
// 					vy: 0,
// 					radius: PARTICLE_RADIUS,
// 					mass: PARTICLE_RADIUS * MASS_FACTOR,
// 					baseX: x,
// 					baseY: y,
// 				});
// 			}
// 		}
// 		particles.current = arr;
// 	};

// 	useEffect(() => {
// 		if (!canvasRef.current || !wrapperRef.current) return;

// 		initParticles();

// 		const canvas = canvasRef.current;
// 		const regl = reglConstructor({
// 			canvas,
// 			attributes: { alpha: true, antialias: true },
// 		});

// 		const resizeCanvas = () => {
// 			const dpr = window.devicePixelRatio || 1;
// 			canvas.width = wrapperRef.current!.clientWidth * dpr;
// 			canvas.height = wrapperRef.current!.clientHeight * dpr;
// 			canvas.style.width = `${wrapperRef.current!.clientWidth}px`;
// 			canvas.style.height = `${wrapperRef.current!.clientHeight}px`;
// 			aspect.current =
// 				wrapperRef.current!.clientWidth / wrapperRef.current!.clientHeight;
// 			regl.poll();
// 		};
// 		resizeCanvas();
// 		window.addEventListener('resize', resizeCanvas);

// 		const onMouseMove = (e: MouseEvent) => {
// 			const rect = canvas.getBoundingClientRect();
// 			const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
// 			const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
// 			mousePos.current.x = x;
// 			mousePos.current.y = -y / aspect.current;
// 		};
// 		window.addEventListener('mousemove', onMouseMove);

// 		function updateParticles(time = 1, tick = 1) {
// 			const p = particles.current;
// 			const mouse = mousePos.current;
// 			const connections: [number, number][] = [];

// 			for (let i = 0; i < p.length; i++) {
// 				const particle = p[i];
// 				let acc = { x: 0, y: 0 };

// 				const dxMouse = mouse.x - particle.x;
// 				const dyMouse = mouse.y - particle.y;
// 				const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
// 				if (distMouse < MOUSE_INFLUENCE_RADIUS) {
// 					const force = (1 - distMouse / MOUSE_INFLUENCE_RADIUS) * MOUSE_FORCE;
// 					particle.baseX = particle.x;
// 					particle.baseY = particle.y;
// 					acc.x += dxMouse * force;
// 					acc.y += dyMouse * force;
// 				} else {
// 					const dxBase = particle.baseX - particle.x;
// 					const dyBase = particle.baseY - particle.y;
// 					const distBase = Math.sqrt(dxBase * dxBase + dyBase * dyBase);
// 					if (distBase > 0.001) {
// 						const force = Math.min((1 - distBase / 0.3) * RETURN_FORCE, 0.01);
// 						acc.x += (dxBase / distBase) * force;
// 						acc.y += (dyBase / distBase) * force;
// 					}
// 				}

// 				for (let j = 0; j < p.length; j++) {
// 					if (i === j) continue;
// 					const other = p[j];
// 					const dx = particle.x - other.x;
// 					const dy = particle.y - other.y;
// 					const dist = Math.sqrt(dx * dx + dy * dy);
// 					const minDist = particle.radius + other.radius;
// 					if (dist < minDist && dist > 0.01) {
// 						const force = (1 - dist / minDist) * 0.01;
// 						acc.x += (dx / dist) * force;
// 						acc.y += (dy / dist) * force;
// 					}
// 					if (dist < CONNECTION_DISTANCE && i < j) {
// 						connections.push([i, j]);
// 					}
// 				}

// 				const dt = time / tick;
// 				particle.vx = particle.vx * SMOOTH + acc.x * dt;
// 				particle.vy = particle.vy * SMOOTH + acc.y * dt;

// 				particle.vx = clamp(particle.vx, -MAX_SPEED, MAX_SPEED);
// 				particle.vy = clamp(particle.vy, -MAX_SPEED, MAX_SPEED);
// 			}

// 			for (const particle of particles.current) {
// 				particle.x += particle.vx;
// 				particle.y += particle.vy;
// 			}

// 			return connections;
// 		}

// 		const drawParticles = regl({
// 			vert: `
// precision mediump float;
// attribute vec2 position;
// uniform vec2 center;
// uniform float aspect;
// void main() {
//   vec2 pos = center + position * ${PARTICLE_RADIUS.toFixed(5)};
//   gl_Position = vec4(pos.x, pos.y * aspect, 0, 1);
// }`,
// 			frag: `
// precision mediump float;
// void main() {
//   vec2 coord = gl_PointCoord - 0.5;
//   float dist = length(coord);
//   float alpha = smoothstep(0.5, 0.499, dist);
//   gl_FragColor = vec4(0.1, 0.7, 0.9, alpha);
// }`,
// 			attributes: {
// 				position: vertices,
// 			},
// 			uniforms: {
// 				center: regl.prop('center'),
// 				aspect: () => aspect.current,
// 			},
// 			count: vertices.length,
// 			primitive: 'triangle fan',
// 			blend: {
// 				enable: true,
// 				func: {
// 					srcRGB: 'src alpha',
// 					srcAlpha: 1,
// 					dstRGB: 'one minus src alpha',
// 					dstAlpha: 1,
// 				},
// 			},
// 		});

// 		const connectionBuffer = regl.buffer({
// 			usage: 'dynamic',
// 			type: 'float',
// 			length: 4 * 2 * Float32Array.BYTES_PER_ELEMENT,
// 		});

// 		const vertexIdBuffer = regl.buffer([0, 1, 2, 3]);

// 		const drawConnections = regl({
// 			vert: `
// precision mediump float;
// attribute vec2 source, target;
// attribute float vertexId;
// uniform float aspect;

// void main() {
//   vec2 dir = normalize(target - source);
//   vec2 normal = vec2(-dir.y, dir.x) * 0.01;

//   vec2 pos;
//   if (vertexId < 0.5) pos = source + normal;
//   else if (vertexId < 1.5) pos = source - normal;
//   else if (vertexId < 2.5) pos = target + normal * 0.3;
//   else pos = target - normal * 0.3;

//   gl_Position = vec4(pos.x, pos.y * aspect, 0, 1);
// }
// `,
// 			frag: `
// precision mediump float;
// void main() {
//   gl_FragColor = vec4(0.1, 0.7, 0.9, 0.4);
// }
// `,
// 			attributes: {
// 				source: {
// 					buffer: connectionBuffer,
// 					stride: 16,
// 					offset: 0,
// 				},
// 				target: {
// 					buffer: connectionBuffer,
// 					stride: 16,
// 					offset: 8,
// 				},
// 				vertexId: {
// 					buffer: vertexIdBuffer,
// 				},
// 			},
// 			uniforms: {
// 				aspect: () => aspect.current,
// 			},
// 			count: 4,
// 			primitive: 'triangle strip',
// 			blend: {
// 				enable: true,
// 				func: {
// 					srcRGB: 'src alpha',
// 					srcAlpha: 1,
// 					dstRGB: 'one minus src alpha',
// 					dstAlpha: 1,
// 				},
// 			},
// 		});

// 		regl.frame(({ time, tick }) => {
// 			regl.clear({ color: [0, 0, 0, 0] });
// 			const connections = updateParticles(time, tick);

// 			for (const [i, j] of connections) {
// 				const p1 = particles.current[i];
// 				const p2 = particles.current[j];
// 				connectionBuffer.subdata(
// 					new Float32Array([p1.x, p1.y, p2.x, p2.y, p1.x, p1.y, p2.x, p2.y])
// 				);
// 				drawConnections();
// 			}

// 			for (const p of particles.current) {
// 				drawParticles({ center: [p.x, p.y] });
// 			}
// 		});

// 		return () => {
// 			window.removeEventListener('mousemove', onMouseMove);
// 			window.removeEventListener('resize', resizeCanvas);
// 			regl.destroy();
// 		};
// 	}, []);

// 	return (
// 		<div ref={wrapperRef} className='relative w-full h-full overflow-hidden'>
// 			<canvas
// 				ref={canvasRef}
// 				className='absolute left-0 top-0 w-full h-full z-0'
// 				style={{ touchAction: 'none' }}
// 			/>
// 			{children}
// 		</div>
// 	);
// };
