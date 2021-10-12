import { addTicker } from "../game/ticker";

type Coordinate = { x: number; y: number };

class Particle {
  pos: Coordinate;
  speed: number;
  life: number;
  size: number;
  lived: number;
  vel: Coordinate;
  colour: number[];
  colour_step: number[];
  dead: boolean = false;

  constructor(
    x: number,
    y: number,
    angle: number,
    speed: number,
    life: number,
    size: number,
    start_colour: number[],
    colour_step: number[]
  ) {
    /* the particle's position */
    this.pos = {
      x: x || 0,
      y: y || 0,
    };

    /* set specified or default values */
    this.speed = speed || 5;

    this.life = life || 1;

    this.size = size || 2;

    this.lived = 0;

    /* the particle's velocity */
    const radians = (angle * Math.PI) / 180;

    this.vel = {
      x: Math.cos(radians) * speed,
      y: -Math.sin(radians) * speed,
    };

    /* the particle's colour values */
    this.colour = start_colour;
    this.colour_step = colour_step;
  }
}

class Emitter {
  pos: Coordinate;
  settings: any;
  emission_delay: number;
  last_update: number;
  last_emission: number;
  particles: Particle[];
  ctx: CanvasRenderingContext2D;
  startTime = Date.now();

  constructor(ctx: any, x: number, y: number, settings: any) {
    this.ctx = ctx;

    /* the emitter's position */
    this.pos = {
      x: x,
      y: y,
    };

    /* set specified values */

    this.settings = settings;

    /* How often the emitter needs to create a particle in milliseconds */

    this.emission_delay = 1000 / settings.emission_rate;

    /* we'll get to these later */

    this.last_update = 0;

    this.last_emission = 0;

    /* the emitter's particle objects */

    this.particles = [];
  }

  update() {
    /* set the last_update variable to now if it's the first update */
    if (!this.last_update) {
      this.last_update = Date.now();
      return;
    }

    /* get the current time */
    let time = Date.now();

    /* work out the milliseconds since the last update */
    let dt = time - this.last_update;

    /* add them to the milliseconds since the last particle emission */
    this.last_emission += dt;

    /* set last_update to now */
    this.last_update = time;

    /* check if we need to emit a new particle */
    if (
      this.last_emission > this.emission_delay &&
      Date.now() - this.startTime < this.settings.duration
    ) {
      /* find out how many particles we need to emit */
      let i = Math.floor(this.last_emission / this.emission_delay);
      // let i = 500;

      /* subtract the appropriate amount of milliseconds from last_emission */
      this.last_emission -= i * this.emission_delay;

      while (i--) {
        /* calculate the particle's properties based on the emitter's settings */
        let start_colour = this.settings.start_colours[
          Math.floor(this.settings.start_colours.length * Math.random())
        ];

        let end_colour = this.settings.end_colours[
          Math.floor(this.settings.end_colours.length * Math.random())
        ];

        let life =
          this.settings.min_life + Math.random() * this.settings.life_range;

        let colour_step = [
          (end_colour[0] - start_colour[0]) / life,
          /* red */ (end_colour[1] - start_colour[1]) / life,
          /* green */ (end_colour[2] - start_colour[2]) / life,
          /* blue */ (end_colour[3] - start_colour[3]) / life /* alpha */,
        ];

        this.particles.push(
          new Particle(
            0,
            0,
            this.settings.min_angle + Math.random() * this.settings.angle_range,
            this.settings.min_speed + Math.random() * this.settings.speed_range,
            life,
            this.settings.min_size + Math.random() * this.settings.size_range,
            start_colour.slice(),
            colour_step
          )
        );
      }
    }

    /* convert dt to seconds */
    dt /= 1000;

    /* loop through the existing particles */
    let i = this.particles.length;

    while (i--) {
      let particle = this.particles[i];

      /* skip if the particle is dead */
      if (particle.dead) {
        /* remove the particle from the array */
        this.particles.splice(i, 1);
        continue;
      }

      /* add the seconds passed to the particle's life */
      particle.lived += dt;

      /* check if the particle should be dead */

      if (particle.lived >= particle.life) {
        particle.dead = true;
        continue;
      }

      /* calculate the particle's new position based on the forces multiplied by seconds passed */

      particle.vel.x += this.settings.gravity.x * dt;
      particle.vel.y += this.settings.gravity.y * dt;

      particle.pos.x += particle.vel.x * dt;
      particle.pos.y += particle.vel.y * dt;

      /* draw the particle */

      particle.colour[0] += particle.colour_step[0] * dt;
      particle.colour[1] += particle.colour_step[1] * dt;
      particle.colour[2] += particle.colour_step[2] * dt;
      particle.colour[3] += particle.colour_step[3] * dt;

      this.ctx.fillStyle =
        "rgba(" +
        Math.round(particle.colour[0]) +
        "," +
        Math.round(particle.colour[1]) +
        "," +
        Math.round(particle.colour[2]) +
        "," +
        particle.colour[3] +
        ")";

      let x = this.pos.x + particle.pos.x;
      let y = this.pos.y + particle.pos.y;

      this.ctx.beginPath();
      this.ctx.moveTo(x + particle.size / 2, y);
      this.ctx.lineTo(x + particle.size / 3, y + particle.size);
      this.ctx.lineTo(x + (particle.size / 3) * 2, y + particle.size);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
}

export function playEffect(
  x: number,
  y: number,
  width: number,
  height: number,
  remBase: number,
  rival = false
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.position = "absolute";
  canvas.style.left = x + "px";
  canvas.style.top = y + "px";
  document.body.append(canvas);

  const ctx = canvas.getContext("2d");
  debugger;
  const settings = {
    basic: {
      emission_rate: 300,
      min_life: 2,
      life_range: 2,
      min_angle: 0,
      angle_range: 180,
      min_speed: 80,
      speed_range: 50,
      min_size: 0.04 * remBase,
      size_range: 0.04 * remBase,
      start_colours: [
        [246, 208, 92, 1],
        [214, 97, 44, 1],
      ],
      end_colours: [
        [246, 208, 92, 0],
        [214, 97, 44, 0],
      ],
      gravity: {
        x: 0,
        y: 0.8 * remBase,
      },
      duration: 200,
    },
  };

  let emitter = new Emitter(
    ctx,
    canvas.width / 2,
    canvas.height / 2,
    rival
      ? Object.assign({}, settings.basic, {
          start_colours: [
            [84, 189, 244, 1],
            [66, 145, 217, 1],
          ],
          end_colours: [
            [84, 189, 244, 0],
            [66, 145, 217, 0],
          ],
        })
      : settings.basic
  );

  const ticker = () => {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    emitter.update();
  };
  const removeTicker = addTicker(ticker);
  setTimeout(() => {
    removeTicker();
    canvas.remove();
  }, 1500);
}
