const SIGHT = 50; // Définir la portée de vision des voitures
const LIFESPAN = 500;
// géneration d'un seul circuit : 
let walls = [];
let inside = [];
let outside = [];
let checkpoints = [];
let start, end;
let cars = [];

// construit un nouveau circuit 

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

    //Charge les modèles de réseaux de neurones
    //const model1 = await tf.loadLayersModel('https://raw.githubusercontent.com/IDontKnowSoda/Neural-Network-Car/main/Model/model.json');
    const model1 = await tf.loadLayersModel('models/model-2-4-2.json');
    const model2 = await tf.loadLayersModel('models/model-test.json');
    const model3 = await tf.loadLayersModel('models/model-2-4-2-500gen.json');
    //const model2 = await tf.loadLayersModel('models/model-3-5-2-FirstFitness.json');

    // Crée une voiture
    cars.push(new Particle(model1));
    cars.push(new Particle(model2));
    cars.push(new Particle(model3));
  }
  
  function draw() {
    background(0);
  
    // on dessine les murs
    for (let wall of walls) {
      wall.show();
    }
  
    // on affiche le point de départ et le point d'arrivée
    fill(255);
    ellipse(start.x, start.y, 10);
    ellipse(end.x, end.y, 10);

    // on affiche les voitures 
    for (let car of cars) {
        car.look(walls);
        car.check(checkpoints);
        car.bounds();
        car.update();
        car.show();
      }
  }