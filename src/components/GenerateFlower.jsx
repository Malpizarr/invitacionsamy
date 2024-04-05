import * as THREE from "three";



function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}
export class Walker {

    constructor(config) {
        this.simplex = config.simplex;
        this.total = config.total;
        this.x = config.x;
        this.y = config.y;
        this.dir = config.dir;
        this.speed = config.speed;
        this.delta = config.delta;
        this.time = config.time;
        this.angleRange = config.angleRange;
        this.away = config.away;
        this.depth = config.depth;

        this.position = new THREE.Vector3(this.x, this.y, 0);
        this.path = [];

        this.build();
    }

    build() {
        for(let i = 0; i < this.total; i++) {
            this.step(i / this.total);
        }
    }


    step(p) {
        // progress the time for noise
        this.time += this.delta;


        this.angle = Math.random() * this.angleRange * 2 - this.angleRange; // Reemplaza Calc.rand con Math.random
        this.speed = Math.random() * 0.01; // Reemplaza Calc.rand con Math.random

        // apply noise values
        this.dir += this.angle;
        this.position.x += Math.cos(this.dir) * this.speed;
        this.position.y += Math.sin(this.dir) * this.speed;

        // grow away or toward the camera
        if(this.away) {
            this.position.z = map(p, 0, 1, this.depth / 2, -this.depth / 2);
        } else {
            this.position.z = map(p, 0, 1, -this.depth / 2, this.depth / 2);
        }

        // push new position into the path array
        this.path.push({
            x: this.position.x,
            y: this.position.y,
            z: this.position.z
        });
    }

}
