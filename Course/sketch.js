const SIGHT = 70; // Définir la portée de vision des voitures
const LIFESPAN = 1000;
let walls = [];
let inside = [];
let outside = [];
let checkpoints = [];
let start, end;
let cars = [];
let gameStarted = false;
let xOffset = 20;

function buildTrack() {
    checkpoints = [];
    inside = [];
    outside = [];
    let noiseMax = 2;
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
    //const model1 = await tf.loadLayersModel('models/model16.json');
    const model2 = await tf.loadLayersModel('models/model-3.json');
    const model3 = await tf.loadLayersModel('models/model8_2.json');
    const model4 = await tf.loadLayersModel('models/model-1.json');
    const model5 = await tf.loadLayersModel('models/model9.json');
    const model6 = await tf.loadLayersModel('models/model-2.json');
    const model7 = await tf.loadLayersModel('models/model15.json');
    const model8 = await tf.loadLayersModel('models/model-1.json');
    const model9 = await tf.loadLayersModel('models/model-2 (4).json');
    const model10 = await tf.loadLayersModel('models/model-2 (3).json');
    const model11 = await tf.loadLayersModel('models/model17.json');
    const model12 = await tf.loadLayersModel('models/model17_2.json');
    const model13 = await tf.loadLayersModel('models/model17_3.json');
    const model14 = await tf.loadLayersModel('models/model17_4.json');
    const model15 = await tf.loadLayersModel('models/model19_1.json');
    const model16 = await tf.loadLayersModel('models/model20_1.json');
    const model17 = await tf.loadLayersModel('models/model20_2.json');


    //cars.push(new Particle(model1, 'red'));
    cars.push(new Particle(model2, 'blue'));
    cars.push(new Particle(model3, 'green'));
    cars.push(new Particle(model4, 'yellow'));
    cars.push(new Particle(model5, 'purple'));
    cars.push(new Particle(model6, 'orange'));
    cars.push(new Particle(model7, 'pink'));
    cars.push(new Particle(model8, 'brown'));
    cars.push(new Particle(model9, 'cyan'));
    cars.push(new Particle(model10, 'magenta'));
    cars.push(new Particle(model11, 'lime'));
    cars.push(new Particle(model12, 'teal'));
    cars.push(new Particle(model13, 'indigo'));
    cars.push(new Particle(model14, 'violet'));
    cars.push(new Particle(model15, 'white'));
    cars.push(new Particle(model16, 'red'));
    cars.push(new Particle(model17, 'blue'));



    document.getElementById('playButton').addEventListener('click', () => {
        gameStarted = true;
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('background').classList.add('transparent');
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
    displayCarInfoAndLeaderboard();  // Ajoutez cet appel pour afficher les infos

}

function displayCarInfoAndLeaderboard() {
  textSize(16);
  textAlign(LEFT, TOP);

  let infoBackground = color(30, 30, 30);  // Couleur de fond
  let titleColor = color(255, 255, 0);     // Couleur jaune pour le titre
  let textColor = color(200, 200, 200);    // Couleur du texte
  let padding = 10;

  let y = 20;

  // Fond de la zone d'information
  fill(infoBackground);
  noStroke();
  rect(xOffset, y - padding, 400, cars.length * 25 + 40); // Fond de la section info

  // Titre de la section (jaune et gras)
  fill(titleColor);
  textSize(18);
  textStyle(BOLD);  // Titre en gras
  text('🚗 Car Information:', xOffset + 10, y);
  textStyle(NORMAL); // Retour au texte normal pour les autres informations
  y += 30;

  // Liste des voitures
  fill(textColor);
  textSize(16);
  for (let i = 0; i < cars.length; i++) {
      let car = cars[i];
      text(
          `Car ${i + 1} - Color: ${car.color}, Fitness: ${car.fitness.toFixed(2)}, Status: ${car.dead ? 'Dead' : 'Alive'}`,
          xOffset + 10,
          y
      );
      y += 25;
  }

  y += 20; // Petit interligne avant d'afficher le leaderboard

  // Affichage du leaderboard
  let sortedCars = cars.slice().sort((a, b) => b.fitness - a.fitness);

  fill(titleColor);
  textSize(22);
  text('🏆 Leaderboard:', xOffset + 10, y); // Titre du classement
  y += 40;

  fill(textColor);
  textSize(20);
  for (let i = 0; i < sortedCars.length; i++) {
      let car = sortedCars[i];
      text(
          `${i + 1}. Car ${cars.indexOf(car) + 1} - Fitness: ${car.fitness.toFixed(2)}`,
          xOffset + 20,
          y // Affichage du classement
      );
      y += 35;
  }
}
