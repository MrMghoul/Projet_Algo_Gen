const SIGHT = 50; // Définir la portée de vision des voitures
const LIFESPAN = 500;
let walls = [];
let inside = [];
let outside = [];
let checkpoints = [];
let start, end;
let cars = [];
let gameStarted = false;
let laps = 0; // Nombre de tours choisi
let lapsCompleted = [0, 0, 0, 0]; // Nombre de tours complétés par chaque voiture

function buildTrack() {
    checkpoints = [];
    inside = [];
    outside = [];
    let noiseMax = 4;
    const total = 60;
    const pathWidth = 60;
    let startX = random(1000);
    let startY = random(1000);
    for (let i = 0; i < total; i++) {
        let a = map(i, 0, total, 0, TWO_PI);
        let xoff = map(cos(a), -1, 1, 0, noiseMax) + startX;
        let yoff = map(sin(a), -1, 1, 0, noiseMax) + startY;
        let xr = map(noise(xoff, yoff), 0, 1, 100, width * 0.5);
        let yr = map(noise(xoff, yoff), 0, 1, 100, height * 0.5);
        let x1 = width / 2 + (xr - pathWidth) * cos(a);
        let y1 = height / 2 + (yr - pathWidth) * sin(a);
        let x2 = width / 2 + (xr + pathWidth) * cos(a);
        let y2 = height / 2 + (yr + pathWidth) * sin(a);
        checkpoints.push(new Boundary(x1, y1, x2, y2));
        inside.push(createVector(x1, y1));
        outside.push(createVector(x2, y2));
    }
    walls = [];
    for (let i = 0; i < checkpoints.length; i++) {
        let a1 = inside[i];
        let b1 = inside[(i + 1) % checkpoints.length];
        walls.push(new Boundary(a1.x, a1.y, b1.x, b1.y));
        let a2 = outside[i];
        let b2 = outside[(i + 1) % checkpoints.length];
        walls.push(new Boundary(a2.x, a2.y, b2.x, b2.y));
    }
    start = checkpoints[0].midpoint();
    end = checkpoints[checkpoints.length - 1].midpoint();
}

async function setup() {
    createCanvas(1200, 800);
    buildTrack();
    const model1 = await tf.loadLayersModel('models/model-2-4-2.json');
    const model2 = await tf.loadLayersModel('models/model-test.json');
    const model3 = await tf.loadLayersModel('models/model-2-4-2-500gen.json');
    const model4 = await tf.loadLayersModel('models/model-1.json');

    cars.push(new Particle(model1, 'red'));
    cars.push(new Particle(model2, 'blue'));
    cars.push(new Particle(model3, 'green'));
    cars.push(new Particle(model4, 'yellow'));

    document.getElementById('playButton').addEventListener('click', () => {
        const lapsDropdown = document.getElementById('lapsDropdown');
        laps = parseInt(lapsDropdown.value);
        if (isNaN(laps)) {
            alert('Veuillez choisir le nombre de tours.');
        } else {
            gameStarted = true;
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('background').classList.add('transparent');
        }
    });
}

function draw() {
    if (!gameStarted) return;

    background(0);

    for (let wall of walls) {
        wall.show();
    }

    fill(255);
    ellipse(start.x, start.y, 10);
    ellipse(end.x, end.y, 10);

    for (let car of cars) {
        car.look(walls);
        car.check(checkpoints);
        car.bounds();
        car.update();
        car.show();
    }  
    displayCarInfoAndLeaderboard();
    checkRaceEnd();
}

function checkLaps(car) {
    if (car.pos.dist(end) < 10 && !car.finished) {
        lapsCompleted[cars.indexOf(car)]++;
        car.finished = true;
        setTimeout(() => car.finished = false, 1000); // Empêche de compter plusieurs tours en même temps
    }
}

function checkRaceEnd() {
    for (let i = 0; i < cars.length; i++) {
        if (lapsCompleted[i] >= laps) {
            gameStarted = false;
            alert(`Car ${i + 1} wins!`);
            noLoop();
            break;
        }
    }
}

function displayCarInfoAndLeaderboard() {
    let carInfoContainer = document.getElementById('carInfoContainer');
    if (!carInfoContainer) {
      carInfoContainer = document.createElement('div');
      carInfoContainer.id = 'carInfoContainer';
      document.body.appendChild(carInfoContainer);
    }
  
    let leaderboardContainer = document.getElementById('leaderboardContainer');
    if (!leaderboardContainer) {
      leaderboardContainer = document.createElement('div');
      leaderboardContainer.id = 'leaderboardContainer';
      document.body.appendChild(leaderboardContainer);
    }
  
    let carInfoHtml = '<h2>🚗 Car Information:</h2>';
    for (let i = 0; i < cars.length; i++) {
      let car = cars[i];
      carInfoHtml += `<p>Car ${i + 1} - Color: ${car.color}, Fitness: ${car.fitness.toFixed(2)}, Status: ${car.dead ? 'Dead' : 'Alive'}</p>`;
    }
    carInfoContainer.innerHTML = carInfoHtml;
  
    let leaderboardHtml = '<h2>🏆 Leaderboard:</h2>';
    let sortedCars = cars.slice().sort((a, b) => b.fitness - a.fitness);
    for (let i = 0; i < sortedCars.length; i++) {
      let car = sortedCars[i];
      leaderboardHtml += `<p style="color: ${car.color};">${i + 1}. Car ${cars.indexOf(car) + 1}</p>`;
    }
    leaderboardContainer.innerHTML = leaderboardHtml;
}