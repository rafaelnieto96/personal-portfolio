let neurons = [];
let NUM_NEURONS = 40;
let ACTIVATION_DISTANCE = 150;
let MAX_CONNECTIONS = 5;

function calculateDensity() {
    const screenArea = window.innerWidth * window.innerHeight;
    const baseDensity = 0.00004;

    // Optimizes the number of neurons based on the device
    NUM_NEURONS = Math.max(10, Math.floor(screenArea * baseDensity));
    ACTIVATION_DISTANCE = Math.min(150, Math.max(80, window.innerWidth / 10));
    MAX_CONNECTIONS = window.innerWidth < 768 ? 3 : 5;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();
    colorMode(HSB, 360, 100, 100, 100);
    angleMode(DEGREES);

    calculateDensity();
    initializeNeurons();
}

function initializeNeurons() {
    neurons = [];
    for (let i = 0; i < NUM_NEURONS; i++) {
        neurons.push(new Neuron());
    }
}

function drawGradientBackground(c1, c2) {
    noFill();
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }
    noStroke();
}

function draw() {
    let color1 = color(220, 30, 15);
    let color2 = color(240, 30, 25);
    drawGradientBackground(color1, color2);

    // Update and display neurons
    neurons.forEach(neuron => {
        neuron.update();
        neuron.show();
    });

    // Draw connections between neurons
    drawNeuralConnections();

    // Global pulse effect - only on large devices
    if (window.innerWidth > 768) {
        globalPulseEffect();
    }
}

class Neuron {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.connections = [];
        this.pulse = 0;
        this.lastPulse = 0;

        // Adaptive visual configuration
        const baseSize = window.innerWidth < 768 ? 3 : 4;
        this.targetSize = random(baseSize, baseSize * 1.3);

        // Original orange/gold tones
        this.hue = random(30, 50);
        this.saturation = random(60, 80);
        this.brightness = random(60, 80);
        this.baseAlpha = random(30, 50);
    }

    update() {
        // Random movement with optimization for mobile devices
        const moveSpeed = window.innerWidth < 768 ? 0.1 : 0.2;
        this.pos.add(createVector(random(-moveSpeed, moveSpeed), random(-moveSpeed, moveSpeed)));
        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);

        // Mouse interaction
        let mouseDist = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        if (mouseDist < ACTIVATION_DISTANCE) {
            this.activate(mouseDist);
        }

        // Smooth pulse decay
        this.lastPulse = this.pulse;
        this.pulse = lerp(this.pulse, 0, 0.05);
    }

    activate(mouseDist) {
        // Gradual activation based on distance to mouse
        let activationStrength = map(mouseDist, 0, ACTIVATION_DISTANCE, 0.8, 0.2);
        this.pulse = max(this.pulse, activationStrength);

        // Subtle color change to intense orange
        this.hue = lerp(this.hue, 40, 0.1);
    }

    show() {
        // Neuron visualization with glow effect
        let glowSize = this.targetSize * (1 + this.pulse * 1.5);
        let alpha = this.baseAlpha + this.pulse * 50;

        // Internal glow effect
        fill(this.hue, this.saturation, this.brightness + this.pulse * 20, alpha * 0.7);
        noStroke();
        ellipse(this.pos.x, this.pos.y, glowSize);

        // Main body of the neuron
        stroke(this.hue, this.saturation, this.brightness + this.pulse * 40, alpha + this.pulse * 30);
        strokeWeight(window.innerWidth < 768 ? 0.7 : 1.0);
        fill(this.hue, this.saturation * 0.3, this.brightness * 0.3, alpha);
        ellipse(this.pos.x, this.pos.y, this.targetSize);
    }
}

function drawNeuralConnections() {
    neurons.forEach((a, i) => {
        // Select the closest neurons to optimize performance
        let others = neurons.slice(i + 1)
            .map(b => ({ neuron: b, dist: dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y) }))
            .sort((x, y) => x.dist - y.dist)
            .slice(0, MAX_CONNECTIONS);

        others.forEach(({ neuron: b, dist }) => {
            if (dist < ACTIVATION_DISTANCE * 1.8) {
                // Combined effect of both neurons
                let combinedPulse = (a.pulse + b.pulse) / 2;

                // Calculate transparency and thickness based on distance
                let alpha = map(dist, 0, ACTIVATION_DISTANCE * 1.8, 60, 0);
                let lineWidth = map(dist, 0, ACTIVATION_DISTANCE * 1.8,
                    window.innerWidth < 768 ? 0.8 : 1.2,
                    window.innerWidth < 768 ? 0.1 : 0.2);

                // Subtle pulse effect on connections
                let pulseSpeed = 0.02;
                let wavePulse = (sin(frameCount * pulseSpeed + dist * 0.01) + 1) * 0.15;
                alpha *= (0.8 + wavePulse + combinedPulse * 0.5);

                // Average color between connected neurons
                let avgHue = (a.hue + b.hue) / 2;

                stroke(avgHue, 70, 90, alpha);
                strokeWeight(lineWidth * (1 + combinedPulse));
                line(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
            }
        });
    });
}

function globalPulseEffect() {
    noFill();
    stroke(45, 80, 90, 25);
    strokeWeight(0.6);
    let maxRadius = min(width, height) * 0.25;
    let pulseSize = ((frameCount * 2) % maxRadius);

    // Only show the effect when the mouse moves
    let mouseMoving = mouseX !== pmouseX || mouseY !== pmouseY;
    if (mouseMoving) {
        ellipse(mouseX, mouseY, pulseSize, pulseSize);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calculateDensity();
    initializeNeurons();
}