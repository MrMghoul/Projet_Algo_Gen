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
let lapsToComplete = 0;
let showRays = false;
let speedMultiplier = 1;

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
  end = start; // Le point de départ est le même que le point d'arrivée
}

function drawStartingLine() {
  const lineLength = 120; // Longueur de la ligne de départ
  const numSquares = 9; // Nombre de carrés sur la ligne
  const squareSize = lineLength / numSquares; // Taille de chaque carré

  // Calculer les points de la ligne de départ
  const startLine = checkpoints[0];
  const startMid = startLine.midpoint();
  const angle = atan2(startLine.b.y - startLine.a.y, startLine.b.x - startLine.a.x);

  push();
  translate(startMid.x, startMid.y);
  rotate(angle);

  for (let i = 0; i < numSquares; i++) {
    fill(i % 2 === 0 ? 255 : 0); // Alterner entre blanc et noir
    rect(i * squareSize - lineLength / 2, -5, squareSize, 10); // Dessiner le carré
  }

  pop();
}

async function setup() {
  createCanvas(1200, 800);
  buildTrack();
  //const model1 = await tf.loadLayersModel('models/model16.json');
  const model2 = await tf.loadLayersModel('models/model-3.json');
  const model3 = await tf.loadLayersModel('models/model8_2.json');
  const model5 = await tf.loadLayersModel('models/model9.json');
  const model6 = await tf.loadLayersModel('models/model-2.json');
  const model7 = await tf.loadLayersModel('models/model15.json');
  const model8 = await tf.loadLayersModel('models/model-1.json');
  const model9 = await tf.loadLayersModel('models/model-2-4.json');
  const model10 = await tf.loadLayersModel('models/model-2-3.json');
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
      document.getElementById('mainMenuButton').style.display = 'block'; // Afficher le bouton lorsque le jeu commence
  });

  // Ajouter un écouteur d'événements pour la touche 'd'
  document.addEventListener('keydown', (event) => {
    if (event.key === 'd' || event.key === 'D') {
      showRays = !showRays;
    }
  });

  // Ajouter un bouton pour revenir au menu principal
  let mainMenuButton = document.createElement('button');
  mainMenuButton.id = 'mainMenuButton';
  mainMenuButton.innerHTML = 'Revenir au menu principal';
  mainMenuButton.style.position = 'absolute';
  mainMenuButton.style.left = '20px';
  mainMenuButton.style.top = '50%';
  mainMenuButton.style.transform = 'translateY(-50%)';
  mainMenuButton.style.padding = '10px 20px';
  mainMenuButton.style.fontSize = '20px';
  mainMenuButton.style.cursor = 'pointer';
  mainMenuButton.style.backgroundColor = '#ff4757';
  mainMenuButton.style.color = '#fff';
  mainMenuButton.style.border = 'none';
  mainMenuButton.style.borderRadius = '5px';
  mainMenuButton.style.zIndex = '1001'; // Assurez-vous que le bouton est au-dessus de tout
  mainMenuButton.style.transition = 'background-color 0.3s ease, transform 0.3s ease';
  mainMenuButton.style.display = 'none'; // Masquer le bouton initialement
  mainMenuButton.addEventListener('mouseover', () => {
    mainMenuButton.style.backgroundColor = '#ff6b81';
    mainMenuButton.style.transform = 'scale(1.1)';
  });
  mainMenuButton.addEventListener('mouseout', () => {
    mainMenuButton.style.backgroundColor = '#ff4757';
    mainMenuButton.style.transform = 'scale(1)';
  });
  mainMenuButton.addEventListener('click', () => {
    location.reload(); // Recharger la page pour revenir au menu principal
  });
  document.body.appendChild(mainMenuButton);
}

document.getElementById('lapsDropdown').addEventListener('change', function() {
  lapsToComplete = parseInt(this.value);
  document.getElementById('playButton').disabled = false; // Activer le bouton "Play"
  document.getElementById('chooseLapsMessage').style.display = 'none'; // Masquer le message de description
});

document.getElementById('playButton').addEventListener('click', () => {
  if (lapsToComplete > 0) {
    gameStarted = true;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('background').classList.add('transparent');
    document.getElementById('mainMenuButton').style.display = 'block'; // Afficher le bouton lorsque le jeu commence
  }
});


function displayLeaderboard() {
  let leaderboardContainer = document.getElementById('leaderboardContainer');
  if (!leaderboardContainer) {
    leaderboardContainer = document.createElement('div');
    leaderboardContainer.id = 'leaderboardContainer';
    document.body.appendChild(leaderboardContainer);
  }

  let leaderboardHtml = '<h2>🏆 Leaderboard:</h2>';
  let sortedCars = cars.slice().sort((a, b) => {
    if (a.dead === b.dead) {
      return b.fitness - a.fitness;
    }
    return a.dead ? 1 : -1;
  });
  for (let i = 0; i < sortedCars.length; i++) {
    let car = sortedCars[i];
    let statusIcon = car.dead ? '❌' : '✅';
    leaderboardHtml += `<p style="color: ${car.color};">${i + 1}. Car ${cars.indexOf(car) + 1} ${statusIcon} - Tours: ${car.laps}</p>`;
  }
  leaderboardContainer.innerHTML = leaderboardHtml;
}

function draw() {
  if (!gameStarted) return;

  background(0);

  for (let wall of walls) {
      wall.show();
  }

  // Dessiner la ligne de départ
  drawStartingLine();

  fill(255);
  ellipse(end.x, end.y, 10);

  // Afficher uniquement les voitures vivantes
  for (let car of cars) {
      if (!car.dead) {
          car.look(walls);
          car.check(checkpoints);
          car.bounds();
          car.update();
          car.show();
          if (car.laps >= lapsToComplete) { // Vérifier le nombre de tours
              gameStarted = false;
              showWinner(car);
              return;
          }
      }
  }  
  displayLeaderboard();  // Ajoutez cet appel pour afficher le leaderboard
}

function showWinner(car) {
  let winnerContainer = document.createElement('div');
  winnerContainer.id = 'winnerContainer';
  winnerContainer.style.position = 'absolute';
  winnerContainer.style.top = '50%';
  winnerContainer.style.left = '50%';
  winnerContainer.style.transform = 'translate(-50%, -50%)';
  winnerContainer.style.color = car.color;
  winnerContainer.style.fontSize = '48px';
  winnerContainer.style.fontWeight = 'bold';
  winnerContainer.style.zIndex = '1000';
  winnerContainer.innerHTML = `Car ${cars.indexOf(car) + 1} Wins! 🏆`;
  document.body.appendChild(winnerContainer);

  // Animation de victoire
  setTimeout(() => {
    winnerContainer.style.transition = 'opacity 1s';
    winnerContainer.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(winnerContainer);
    }, 1000);
  }, 3000);

  // Animation pour faire disparaître les murs et les checkpoints
  for (let wall of walls) {
    wall.show = function() {
      stroke(255, 0, 0, 100); // Changer la couleur pour l'animation
      strokeWeight(4);
      line(this.a.x, this.a.y, this.b.x, this.b.y);
    };
  }

  // Animation pour faire disparaître les voitures
  for (let car of cars) {
    car.show = function() {
      fill(255, 0, 0, 100); // Changer la couleur pour l'animation
      ellipse(this.pos.x, this.pos.y, 20, 20);
    };
  }
}