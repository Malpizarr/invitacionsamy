import { h, Component } from 'preact';
import {Walker} from './GenerateFlower';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createNoise2D } from 'simplex-noise';
import { MeshLine } from 'three.meshline';
import {MeshLineMaterial} from 'three.meshline';
import * as gsap from 'gsap';

function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

class FlowerGenerator extends Component {


    constructor() {
        super();
        this.setupCamera();
        this.setupScene();
        this.setupRenderer();
        this.setupLines();
        this.setupOrbit();
        this.setupControls();

        this.listen();
        this.onResize();
        this.reset();
    }

    setupCamera() {
        this.fov = 75;
        this.camera = new THREE.PerspectiveCamera(this.fov, 0, 0.01, 1000);
        this.camera.position.z = 10;
    }

    setupScene() {
        this.scene = new THREE.Scene();

        // Establecer un color de fondo pastel, por ejemplo, un lavanda suave
        this.scene.background = new THREE.Color('#c7b3e5'); // Color pastel hexadecimal

        // O usando rgb()
        // this.scene.background = new THREE.Color('rgb(199, 179, 229)'); // Color pastel RGB

        // O usando hsl()
        // this.scene.background = new THREE.Color('hsl(270, 50%, 80%)'); // Color pastel HSL
    }


    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        document.body.appendChild(this.renderer.domElement);
    }

    setupOrbit() {
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enableDamping = true;
        this.orbit.dampingFactor = 0.2;
        this.orbit.enableKeys = false;
        this.orbit.enableZoom = false;
    }


    setupControls() {
        this.vb = {
            get: (id) => {
                switch (id) {
                    case 'lines':
                        const lines = Math.floor(Math.random() * 6) + 1;
                        console.log(lines);
                        return lines;
                    case 'stems':
                        const stems = Math.floor(Math.random() * 10) + 1;
                        console.log(stems);
                        return stems;
                    case 'angle-range':
                        const angleRange = Math.random() * 0.018 + 0.002;
                        console.log(angleRange);
                        return angleRange;
                    case 'depth':
                        const depth = Math.random() * 10;
                        console.log(depth);
                        return depth;
                    case 'noise-speed':
                        const noiseSpeed = Math.random() * 0.0005 + 0.000001;
                        console.log(noiseSpeed);
                        return noiseSpeed;
                    case 'iterations':
                        const iterations = Math.floor(Math.random() * 10000) + 100;
                        console.log(iterations);
                        return iterations;
                    case 'hue':
                        // Ajusta el tono para que esté en el rango de los rojos y rosas
                        return Math.floor(Math.random() * 20) + 340;
                    case 'hue-range':
                        // Ajusta el rango de tono para variaciones de rojo y rosa
                        return Math.floor(Math.random() * 20);
                    case 'lightness':
                        // Ajusta la luminosidad para obtener un color más vibrante
                        return Math.floor(Math.random() * 50) + 50;
                    case 'invert':
                        return Math.random() > 0.5;
                    default:
                        return null;
                }
            }
        };
    }

    setupLines() {
        this.meshes = [];
        this.meshGroup = new THREE.Object3D();
        this.meshGroupScale = 1;
        this.meshGroupScaleTarget = 1;
        this.scene.add(this.meshGroup);
    }

    generate() {
        this.simplex = createNoise2D();
        this.count = this.vb.get('lines');
        this.stems = this.vb.get('stems');
        this.edge = 0;

        this.scene.background = this.vb.get('invert') ? new THREE.Color('#c7b3e5') : new THREE.Color('#c7b3e5');


        for (let i = 0; i < this.count; i++) {
            // setup a new walker/wanderer
            let centered = Math.random() > 0.5;
            let walker = new Walker({
                simplex: this.simplex,
                total: this.vb.get('iterations'),
                x: centered ? 0 : Math.random() * 2 - 1,
                y: centered ? 0 : Math.random() * 2 - 1,
                dir: (i / (this.count)) * ((Math.PI * 2) / this.stems),
                speed: 0,
                delta: this.vb.get('noise-speed'),
                angleRange: this.vb.get('angle-range'),
                away: 0,
                depth: this.vb.get('depth'),
                time: i * 1000
            });
            let geometry = new THREE.BufferGeometry();
            let vertices = [];

            // grab each path point and push it to the geometry
            for (let j = 0, len = walker.path.length; j < len; j++) {
                let p = walker.path[j];
                let x = p.x;
                let y = p.y;
                let z = p.z;
                this.edge = Math.max(this.edge, Math.abs(x), Math.abs(y));
                vertices.push(x, y, z);
            }

            // set the vertices to the geometry
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            // create a new meshline

            let line = new MeshLine();

            // set the thickness of the line and assign the geometry
            line.setGeometry(geometry, (p) => {
                let size = 1;
                let n = size - Math.abs(map(p, 0, 1, -size, size)) + 0.1;
                return n;
            });

            // create new material based on the controls
            let material = new MeshLineMaterial({
                blending: this.vb.get('invert') ? THREE.NormalBlending : THREE.AdditiveBlending,
                color: new THREE.Color(`hsl(${360 + this.vb.get('hue') + map(i, 0, this.count, -this.vb.get('hue-range'), this.vb.get('hue-range'))}, 100%, ${this.vb.get('lightness')}%)`),
                depthTest: false,
                opacity: 1,
                transparent: true,
                lineWidth: 0.04,
                resolution: this.resolution
            });

            for (let k = 0; k < this.stems; k++) {
                let mesh = new THREE.Mesh(line.geometry, material);
                mesh.rotation.z = map(k, 0, this.stems, 0, Math.PI * 2);
                this.meshes.push(mesh);
                this.meshGroup.add(mesh);
            }
        }
    }

    worldToScreen(vector, camera) {
        vector.project(camera);
        let cx = window.innerWidth / 2;
        let cy = window.innerHeight / 2;
        vector.x = (vector.x * cx) + cx;
        vector.y = -(vector.y * cy) + cy;
        return vector;
    }

    reset() {
        // empty out meshes array
        if (this.meshes) {
            this.meshes.length = 0;
        }

        // remove all children from mesh group
        if (this.meshGroup) {
            while (this.meshGroup.children.length) {
                this.meshGroup.remove(this.meshGroup.children[0]);
            }
        }

        // reset the camera
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 10;
        this.camera.lookAt(new THREE.Vector3());

        // initialize progres values
        this.progress = 0; // overall progress ticker
        this.progressed = false; // has run once
        this.progressModulo = 0; // resets progress on modulus
        this.progressEffective = 0; // progress amount to use
        this.progressEased = this.progressed ? gsap.Expo.easeOut(this.progressEffective) : gsap.Expo.easeOut(this.progressEffective);

        this.generate();

        requestAnimationFrame(() => {
            // scale until the flower roughly fits within the viewport
            let tick = 0;
            let exit = 50;
            let scale = 1;
            this.meshGroup.scale.set(scale, scale, scale);
            let scr = this.worldToScreen(new THREE.Vector3(0, this.edge, 0), this.camera);
            while (scr.y < window.innerHeight * 0.2 && tick <= exit) {
                scale -= 0.05;
                scr = this.worldToScreen(new THREE.Vector3(0, this.edge * scale, 0), this.camera);
                tick++;
            }
            this.meshGroupScaleTarget = scale;
        });
    }

    listen() {
        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
        this.dpr = window.devicePixelRatio > 1 ? 2 : 1;

        this.camera.aspect = this.resolution.x / this.resolution.y;
        this.camera.updateProjectionMatrix();

        this.renderer.setPixelRatio(this.dpr);
        this.renderer.setSize(this.resolution.x, this.resolution.y);
    }

    loop() {
        // subtly rotate the mesh
        this.meshGroup.rotation.x = Math.cos(Date.now() * 0.001) * 0.1;
        this.meshGroup.rotation.y = Math.sin(Date.now() * 0.001) * -0.1;

        // handle all the funky progress math
        // there is a cleaner way of doing this, I'll find it
        this.progress += 0.005;
        if (this.progress > 1) {
            this.progressed = true;
        }
        this.progressModulo = this.progress % 2;
        this.progressEffective = this.progressModulo < 1 ? this.progressModulo : 1 - (this.progressModulo - 1);
        this.progressEased = this.progressed ? gsap.Expo.easeOut(this.progressEffective) : gsap.Expo.easeOut(this.progressEffective);

        // loop over all meshes and update their opacity and visibility
        let i = this.meshes.length;
        while (i--) {
            let mesh = this.meshes[i];
            mesh.material.uniforms.opacity.value = 1; // Opacidad máxima
            mesh.material.uniforms.visibility.value = 1; // Visibilidad máxima
        }

        // ease the scale of the mesh
        this.meshGroupScale += (this.meshGroupScaleTarget - this.meshGroupScale) * 0.3;
        this.meshGroup.scale.set(this.meshGroupScale, this.meshGroupScale, this.meshGroupScale);

        // update orbit controls
        this.orbit.update();

        // render the scene
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.loop());
    }


    componentDidMount() {
        this.initGenerator();
    }

    initGenerator = () => {
        // Configuración del renderizador para usar el contenedor del componente
        this.renderer.setSize(this.base.offsetWidth, this.base.offsetHeight);
        this.base.appendChild(this.renderer.domElement);

        // Generar una nueva flor aleatoria
        this.reset(); // Asegúrate de que reset establezca parámetros aleatorios

        // Iniciar la animación
        this.loop();
    }

    componentWillUnmount() {
        if (this.renderer) {
            this.clean(); // Implementa este método en tu clase Generator si es necesario
            this.renderer = null;
        }
    }

    render() {
        const styles = {
            container: {
                position: 'relative',
                height: '100vh', // Altura de pantalla completa
                width: '100vw', // Ancho de pantalla completa
                background: 'transparent',
                overflow: 'hidden',
                top: 0,
                left: 0
            },
            canvas: {
                position: 'absolute',
                top: 0,
                left: 0,
            },
            overlayText: {
                position: 'absolute',
                top: '50%',
                left: '50%', // Centra el texto horizontalmente
                transform: 'translate(-50%, -50%)',
                color: 'white', // Color del texto
                textAlign: 'center',
                zIndex: 10, // Asegúrate de que el texto esté sobre el canvas
            },
        };

        return (
            <div ref={el => this.base = el} style={styles.container}>
                <div style={styles.overlayText}>
                    <h1>Confirmas?</h1>
                    <form>
                        <div style={{margin: '10px 0'}}>
                            <label htmlFor="name" style={{marginRight: '10px'}}>Nombre:</label>
                            <input type="text" id="name" name="name" placeholder="Tu nombre"/>
                        </div>
                        <div style={{margin: '10px 0'}}>
                            <label htmlFor="people" style={{marginRight: '10px'}}>Cantidad de personas:</label>
                            <input type="number" id="people" name="people" min="1" placeholder="1"/>
                        </div>
                        <button type="submit" style={{marginTop: '20px'}}>Enviar</button>
                    </form>
                </div>
            </div>
        );

    }
}

export default FlowerGenerator;