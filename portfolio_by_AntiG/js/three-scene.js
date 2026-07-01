// Three.js Scene Setup for Hero Background
const canvas = document.getElementById('hero-canvas');

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500; // Number of particles

const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const colorPrimary = new THREE.Color(0x00FFFF); // Cyan
const colorSecondary = new THREE.Color(0x8B5CF6); // Purple
const colorAccent = new THREE.Color(0xEC4899); // Pink

for (let i = 0; i < particlesCount * 3; i+=3) {
    // Position (spread out in a sphere-like distribution)
    posArray[i] = (Math.random() - 0.5) * 10;
    posArray[i+1] = (Math.random() - 0.5) * 10;
    posArray[i+2] = (Math.random() - 0.5) * 10;

    // Mixed colors
    const randColor = Math.random();
    let selectedColor;
    
    if (randColor < 0.33) {
        selectedColor = colorPrimary;
    } else if (randColor < 0.66) {
        selectedColor = colorSecondary;
    } else {
        selectedColor = colorAccent;
    }

    colorsArray[i] = selectedColor.r;
    colorsArray[i+1] = selectedColor.g;
    colorsArray[i+2] = selectedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Particle Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
});

// Create Points Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Add Hyper-Futuristic Cyber Grid Floor
const gridHelper = new THREE.GridHelper(30, 40, 0x00FFFF, 0x00FFFF);
gridHelper.position.y = -2;
gridHelper.material.opacity = 0.15;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Optional: Add a second grid for complexity
const gridHelper2 = new THREE.GridHelper(30, 10, 0x8B5CF6, 0x8B5CF6);
gridHelper2.position.y = -2.01;
gridHelper2.material.opacity = 0.1;
gridHelper2.material.transparent = true;
scene.add(gridHelper2);

camera.position.z = 4;
camera.position.y = 0.5;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Slow rotation
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Mouse interaction - smooth following
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    // Dynamic wave effect based on time
    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        // positions[i3 + 1] = positions[i3 + 1] + Math.sin(elapsedTime + x) * 0.01; // Can be performance heavy, skipping for now
    }
    // particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
