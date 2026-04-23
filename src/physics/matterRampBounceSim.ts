import Matter from "matter-js";
import {
  BALL_R,
  L_RAMP,
  LAND_Y,
  RAMP,
  SPRING,
  SPRING_ANCHOR_Y,
  SPRING_TOP_Y,
  ballCenterOnRampClamped,
  tHatX,
} from "./rampBounceConfig";

const DX = RAMP.x1 - RAMP.x0;
const DY = RAMP.y1 - RAMP.y0;
const RAMP_ANGLE = Math.atan2(DY, DX);
const RAMP_CX = (RAMP.x0 + RAMP.x1) / 2;
const RAMP_CY = (RAMP.y0 + RAMP.y1) / 2;

const CAM_SMOOTH = 0.16;
const MAX_TIMESTEP_MS = 16.64;
/** Split each output frame so each Matter step stays under ~16.7 ms. */
function subStepPlan(fps: number): { n: number; dt: number; ms: number } {
  const ms = 1000 / fps;
  const n = Math.max(1, Math.ceil(ms / MAX_TIMESTEP_MS));
  return { n, dt: ms / n, ms };
}
/** 竖直 1D 悬挂簧：原长 = 锚点与平衡球心距 */
const SPRING_REST_LEN = Math.abs(SPRING_ANCHOR_Y - LAND_Y);
const SPRING_STIFF = 0.16;
const SPRING_DAMP = 0.1;
const GRAVITY_Y = 0.52;
/** 球心高于此且向上飞 → 解约束（离簧、抛物） */
const TAKE_OFF_CENTER_Y = LAND_Y - 12;
const LAND_W = 92;
const TAKE_OFF_VY = -0.25;

const takeoffParabolaVx = 72;

function collided(a: Matter.Body, b: Matter.Body): boolean {
  const c = Matter.Collision.collides(a, b);
  return c !== null && c.collided;
}

/**
 * [matter.js](https://brm.io/matter-js/) 定步长积分 + 可开关的质点-锚点 `Constraint` 模拟轻弹簧支承。
 * 自 frame0 重算，保证 Remotion 可复现。
 */
export function simulateMatterToFrame(frames: number, fps: number): {
  x: number;
  y: number;
  mode: "ramp" | "contact" | "air";
  camX: number;
  camY: number;
  springTopY: number;
} {
  if (frames <= 0) {
    const p = ballCenterOnRampClamped(0);
    return {
      x: p.x,
      y: p.y,
      mode: "ramp",
      camX: 0,
      camY: 0,
      springTopY: SPRING_TOP_Y,
    };
  }

  const engine = Matter.Engine.create();
  engine.enableSleeping = false;
  engine.gravity.y = GRAVITY_Y;
  engine.gravity.x = 0;
  const { world } = engine;

  const start = ballCenterOnRampClamped(0);
  const ball = Matter.Bodies.circle(start.x, start.y, BALL_R, {
    friction: 0,
    frictionStatic: 0,
    restitution: 0.04,
    density: 0.0022,
  });

  const ramp = Matter.Bodies.rectangle(RAMP_CX, RAMP_CY, L_RAMP, 40, {
    isStatic: true,
    angle: RAMP_ANGLE,
    friction: 0,
    frictionStatic: 0,
    restitution: 0.02,
  });

  const ground = Matter.Bodies.rectangle(960, 1120, 4000, 60, { isStatic: true });
  const wallL = Matter.Bodies.rectangle(900, 640, 16, 360, { isStatic: true });
  const wallR = Matter.Bodies.rectangle(1020, 640, 16, 360, { isStatic: true });
  Matter.World.add(world, [ramp, ground, wallL, wallR, ball]);

  let springConstraint: Matter.Constraint | null = null;
  let camX = 0;
  let camY = 0;
  const { n: nSub, dt: dtSub } = subStepPlan(fps);
  const outerSteps = frames;
  for (let f = 0; f < outerSteps; f++) {
    for (let s = 0; s < nSub; s++) {
      const bottom = ball.position.y + BALL_R;
      const hitRamp = collided(ball, ramp);

      if (springConstraint) {
        const takeOffU = ball.position.y < TAKE_OFF_CENTER_Y;
        const takeOffV = ball.velocity.y < TAKE_OFF_VY;
        if (takeOffU && takeOffV) {
          Matter.Composite.remove(world, springConstraint);
          springConstraint = null;
          Matter.Body.setVelocity(ball, {
            x: (tHatX >= 0 ? 1 : -1) * takeoffParabolaVx,
            y: ball.velocity.y,
          });
        }
      } else {
        const inX = Math.abs(ball.position.x - SPRING.cx) < LAND_W;
        const falling = ball.velocity.y > 0.15;
        const crossBand =
          bottom >= SPRING_TOP_Y - 1 &&
          bottom <= SPRING_TOP_Y + 22;
        if (
          inX &&
          falling &&
          crossBand &&
          !hitRamp &&
          ball.position.y > RAMP.y1 - 20
        ) {
          springConstraint = Matter.Constraint.create({
            pointA: { x: SPRING.cx, y: SPRING_ANCHOR_Y },
            bodyB: ball,
            pointB: { x: 0, y: 0 },
            length: SPRING_REST_LEN,
            stiffness: SPRING_STIFF,
            damping: SPRING_DAMP,
          });
          Matter.Composite.add(world, springConstraint);
        }
      }

      Matter.Engine.update(engine, dtSub, 1);
    }

    camX += CAM_SMOOTH * (960 - ball.position.x - camX);
    camY += CAM_SMOOTH * (520 - ball.position.y - camY);
  }

  const hitRampF = collided(ball, ramp);
  const mode: "ramp" | "contact" | "air" = springConstraint
    ? "contact"
    : hitRampF
      ? "ramp"
      : "air";

  const uCompress = Math.max(0, ball.position.y - LAND_Y);
  const springTopY = SPRING.baseY - Math.max(12, SPRING.restHeight - uCompress);

  return {
    x: ball.position.x,
    y: ball.position.y,
    mode,
    camX,
    camY,
    springTopY,
  };
}

