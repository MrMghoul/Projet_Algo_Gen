

const TOTAL = 100;
const MUTATION_RATE = 0.4;
const CROSSOVER_RATE = 0.6;
const LIFESPAN = 25;
const SIGHT = 50;
const MAX_GENERATIONS = 10;

let generationCount = 0;

// Murs du circuit
let walls = [];
// rayon courant qui part de la voiture
let ray;

// Les voitures
let population = [];
let savedParticles = [];

let start, end;

let speedSlider;

let inside = [];
let outside = [];
let checkpoints = [];
const maxFitness = 500;
let changeMap = false;

/* construit un nouveau circuit */
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

function setup() {
  createCanvas(1200, 800);

  // tensor flow will worj on the cpu
  tf.setBackend('cpu');

  buildTrack();
  // let a = inside[inside.length - 1];
  // let b = outside[outside.length - 1];
  // walls.push(new Boundary(a.x, a.y, b.x, b.y));

  // On crée les véhicules....
  for (let i = 0; i < TOTAL; i++) {
    population[i] = new Particle();
  }

  speedSlider = createSlider(1, 10, 1);
}

function draw() {
  const cycles = speedSlider.value();
  background(0);

  // Par défaut le meilleur candidat est le premier de la population
  let bestP = population[0];

  // Nombre de cyles par frame ("époques par frame")
  for (let n = 0; n < cycles; n++) {
    // Pour chaque voiture
    for (let particle of population) {
      // On applique le comportement
      particle.look(walls);
      // on regarde si on a passé un checkpoint
      particle.check(checkpoints);
      // on vérifie qu'on est pas sorti du circuit
      particle.bounds();

      // classique.... on met à jour accelerations, vitesses et positions
      particle.update();
      // et on dessine
      particle.show();

      // Une fois les voitures déplacées
      // On récupère la meilleure, celle qui a passé le plus de checkpoints
      if (particle.fitness > bestP.fitness) {
        bestP = particle;
      }
    }

    // On syupprime les voitures mortes ou celles qui ont fini le circuit
    for (let i = population.length - 1; i >= 0; i--) {
      const particle = population[i];
      if (particle.dead || particle.finished) {
        savedParticles.push(population.splice(i, 1)[0]);
      }

      // On regarde si on a atteint la fin du circuit, si oui
      // on regenere le circuit
      if (!changeMap && particle.fitness > maxFitness) {
        changeMap = true;
      }
    }

    // Si on a fini le circuit, avec au moins un véhicule
    // on passe à la génération suivante, et on garde la génération actuelle comme point de départ
    if (population.length !== 0 && changeMap) {
      for (let i = population.length - 1; i >= 0; i--) {
        savedParticles.push(population.splice(i, 1)[0]);
      }

      // On reconstruit le circuit
      buildTrack();
      // On complète la génération avec des voitures issues de la génération précédente
      // en appliquant des mutations
      nextGeneration();
      generationCount++;
      changeMap = false;
    }

    // Si jamais on a plus de voitures, on passe à la génération suivante
    // MB: ça me semble inutile, car on a déjà un test pour passer à la génération suivante
    if (population.length == 0) {
      buildTrack();
      nextGeneration();
      generationCount++;
    }
    // Sauvegarder le modèle du meilleur véhicule à la fin de l'algorithme génétique
    if (generationCount >= MAX_GENERATIONS) {
      bestP.brain.saveModel().then(() => {
        noLoop(); // Arrête la boucle de dessin
        console.log('Modèle sauvegardé');
      });
      return;
    }
  }



  for (let cp of checkpoints) {
    //strokeWeight(2);
    //cp.show();
  }
  // on dessine les murs
  for (let wall of walls) {
    wall.show();
  }

  // On dessine les voitures
  for (let particle of population) {
    particle.show();
  }

  // On met la voiture la meilleure en surbrillance
  bestP.highlight();

  // on affiche le numéro de la génération
  fill(255);
  textSize(24);
  noStroke();
  text('generation ' + generationCount, 10, 50);

  

  // ellipse(start.x, start.y, 10);
  // ellipse(end.x, end.y, 10);
}
function pldistance(p1, p2, x, y) {
  const num = abs((p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x);
  const den = p5.Vector.dist(p1, p2);
  return num / den;
}

class Particle {
  constructor(brain) {
    // nombre de checkpoints passés
    this.fitness = 0;
    this.dead = false;
    this.finished = false;
    this.pos = createVector(start.x, start.y);
    this.vel = createVector();
    this.acc = createVector();
    this.maxspeed = 5;
    this.maxforce = 0.2;
    this.sight = SIGHT;
    this.rays = [];
    this.index = 0;
    this.counter = 0;

    // On créer des rayns tous les 15°, entre -45° et 45°
    // on a un angle de vision de 90°
    for (let a = -45; a < 45; a += 15) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }

    let length = this.rays.length;

    // On crée le "cerveau" de la voiture
    // C'est un réseau de neurones
    // qui va prendre des décisions en fonction
    // de ce que la voiture voit
    if (brain) {
      this.brain = brain.copy();
    } else {
      // On créer un réseau de neurones, le nombre de neurones
      // en entrée est égal au nombre de rayons
      // le nombre de neurones en sortie est égal à 2
      // car on a 2 sorties, la direction et la vitesse
      // On a un seul layer caché
      // On a donc 2 layers
      // Le nombre de neurones dans le layer caché est égal
      // au nombre de neurones en entrée * 2
      // On a donc 2 layers de length neurones
      // si length vaut 9 par exemple, on a 9 neurones en entrée
      // On a donc 18 neurones en tout
      // On a donc 18 * 18 + 18 = 342 poids
      // On a donc 342 + 18 = 360 biais
      // On a donc 360 + 342 = 702 paramètres
      //this.brain = new NeuralNetwork(this.rays.length, this.rays.length * 2, 2);
      this.brain = new NeuralNetwork(this.rays.length, this.rays.length * 3, 2); // 3 fois plus de neurones cachés
    }
  }

  dispose() {
    this.brain.dispose();
  }

  // Applique une mutation à l'ADN (réseau de neurones) de la voiture courante
  mutate() {
    this.brain.mutate(MUTATION_RATE);
  }


  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.dead && !this.finished) {
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.acc.set(0, 0);

      // On incrémente le compteur
      // si on dépasse le temps de vie
      // on meurt, on tue la voiture
      this.counter++;
      if (this.counter > LIFESPAN) {
        this.dead = true;
      }

      // on a fait déplacer et tourner la voiture, on va
      // aussi faire tourner les rayons
      for (let i = 0; i < this.rays.length; i++) {
        this.rays[i].rotate(this.vel.heading());
      }
    }
  }

  // On vérifie si on a atteint le checkpoint, ou si on a atteint
  // la fin du circuit
  check(checkpoints) {
    if (!this.finished) {
      // On a pas fait un tout complet, on regarde quel est le checkpoint courant
      this.goal = checkpoints[this.index];

      // Est-ce qu'on a atteint le checkpoint ?
      const d = pldistance(this.goal.a, this.goal.b, this.pos.x, this.pos.y);
      if (d < 5) {
        // Si on l'a atteint, on passe au checkpoint suivant
        this.index = (this.index + 1) % checkpoints.length;
        // et on augmente la fitness, c'est le nombre de checkpoint parcourus
        this.fitness++;
        this.counter = 0;
      }
    }
  }

  // Ajustage de la fonction de fitness
  calculateFitness() {
    // on met la fitness au carré, pour voir si ça marche mieux
    this.fitness = pow(2, this.fitness);
    this.fitness += this.counter / LIFESPAN; // Bonus basé sur le temps de vie

    // On pourrait booster la fitness si on a fini le circuit....
    // if (this.finished) {
    // } else {
    //   const d = p5.Vector.dist(this.pos, target);
    //   this.fitness = constrain(1 / d, 0, 1);
    // }
  }

  // C'est LE comportement de la voiture,
  // elle va regarder autour d'elle et prendre des décisions
  // en fonction de ce qu'elle voit
  // Elle va ensuite appliquer une force pour se diriger
  // vers le checkpoint suivant
  // Elle va aussi éviter les murs
  look(walls) {

    // Lancement des rayons
    // On va regarder autour de nous
    // pour voir si on a des murs
    // On va ensuite prendre des décisions
    // en fonction de ce qu'on voit
    const inputs = [];

    // Pour chaque rayon
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = this.sight;

      // Pour chaque mur
      for (let wall of walls) {
        // On regarde si le rayon intersecte le mur en question
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record && d < this.sight) {
            record = d;
            closest = pt;
          }
        }
      }

      // Si on est à moins de 5 pixels d'un mur, on meurt
      if (record < 5) {
        this.dead = true;
      }

      // On met la couche de neurone en entrée avec des valeurs entre 0 et 1
      // Rappel, on a i rayons (on est dans une boucle for sur les rayons
      // et on a une couche d'entrée avec autant de neuronnes que de rayons
      inputs[i] = map(record, 0, 50, 1, 0);

      // Si on a touché au moins un mur
      if (closest) {
        // colorMode(HSB);
        // stroke((i + frameCount * 2) % 360, 255, 255, 50);
        // stroke(255);
        // line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
    // const vel = this.vel.copy();
    // vel.normalize();
    // inputs.push(vel.x);
    // inputs.push(vel.y);

    // On demande au réseau de neurones de prédire la prochaine action
    // output est un tableau à deux dimensions, deux neurones en sortie
    // output[0] est la direction
    // output[1] est la vitesse
    
    const output = this.brain.predict(inputs);
    let angle = map(output[0], 0, 1, -PI, PI);
    let speed = map(output[1], 0, 1, 0, this.maxspeed);
    // angle = this.vel.heading() + angle;
    angle += this.vel.heading();

    // Calcul de la force à appliquer
    // On calcule un vecteur à partir de l'angle et de la vitesse
    // c'est la vitesse souhaitée
    const steering = p5.Vector.fromAngle(angle);
    steering.setMag(speed);

    // force = vitesse souhaitée - vitesse actuelle
    steering.sub(this.vel);

    // On limite la force
    steering.limit(this.maxforce);
    // On applique la force
    this.applyForce(steering);
    // console.log(output);
  }

  // Si la voiture sort du canvas, on la tue
  bounds() {
    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      this.dead = true;
    }
  }

  // Dessin de la voiture
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    const heading = this.vel.heading();
    rotate(heading);
    fill(255, 100);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
    pop();
    // for (let ray of this.rays) {
    //   // ray.show();
    // }
    // if (this.goal) {
    //   this.goal.show();
    // }
  }

  // Met en surbrillance la voiture
  highlight() {
    push();
    translate(this.pos.x, this.pos.y);
    const heading = this.vel.heading();
    rotate(heading);
    stroke(0, 255, 0);
    fill(0, 255, 0);
    rectMode(CENTER);
    rect(0, 0, 20, 10);
    pop();
    for (let ray of this.rays) {
      ray.show();
    }
    if (this.goal) {
      this.goal.show();
    }
  }
}

class NeuralNetwork {
  constructor(a, b, c, d) {
    // Si on passe un réseau de neurones en paramètre
    // on l'utilise
    // sinon on crée un réseau de neurones
    // avec les paramètres passés: nombre de neurones en entrée, cachés et sortie
    if (a instanceof tf.Sequential) {
      this.model = a;
      this.input_nodes = b;
      this.hidden_nodes = c;
      this.output_nodes = d;
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;
      this.model = this.createModel();
    }
  }

  // On crée une copie du réseau de neurones, utilise peut être pour 
  // implémenter la mutation...
  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      return new NeuralNetwork(modelCopy, this.input_nodes, this.hidden_nodes, this.output_nodes);
    });
  }

  // Applique une mutation au "cerveau" de la voiture
  // rate est le taux de mutation
  // On applique la mutation sur les poids du réseau de neurones
  mutate(rate) {
    tf.tidy(() => {
      // On récupère le réseau de neurones
      // Ici les poids
      const weights = this.model.getWeights();
      // On crée un tableau pour les poids mutés
      const mutatedWeights = [];

      // Pour chaque poids
      for (let i = 0; i < weights.length; i++) {
        // On récupère le tenseur
        // qui contient les poids
        // et sa forme
        // et les valeurs
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();

        // Pour chaque valeur
        for (let j = 0; j < values.length; j++) {
          // On tire un nombre au hasard
          // si ce nombre est inférieur au taux de mutation
          // on ajoute un nombre aléatoire
          if (random(1) < rate) {
            let w = values[j];
            values[j] = w + randomGaussian();
          }
        }

        // On crée un nouveau tenseur avec les valeurs mutées
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      // On applique les poids mutés au réseau de neurones
      this.model.setWeights(mutatedWeights);
    });
  }

  // crossover
  crossover(partner) {
    return tf.tidy(() => {
      // On récupère les poids des deux parents
      const weightsA = this.model.getWeights();
      const weightsB = partner.model.getWeights();
      const newWeights = [];

      // Pour chaque poids des parents on crée un nouveau tenseur
      for (let i = 0; i < weightsA.length; i++) {
        let tensorA = weightsA[i];
        let tensorB = weightsB[i];
        let shape = tensorA.shape;
        let valuesA = tensorA.dataSync().slice();
        let valuesB = tensorB.dataSync().slice();
        let newValues = [];

        for (let j = 0; j < valuesA.length; j++) {
          // Choisir aléatoirement les poids de l'un ou l'autre parent
          newValues[j] = Math.random() > 0.5 ? valuesA[j] : valuesB[j];
        }

        // On crée un nouveau tenseur avec les valeurs choisies
        let newTensor = tf.tensor(newValues, shape);
      newWeights[i] = newTensor;
    }

    // On crée un nouveau réseau de neurones avec les poids choisis
    const childModel = this.createModel();
    childModel.setWeights(newWeights);
    return new NeuralNetwork(childModel, this.input_nodes, this.hidden_nodes, this.output_nodes);
    });
  }

  dispose() {
    this.model.dispose();
  }

  // On prédit la sortie en fonction de l'entrée
  predict(inputs) {
    return tf.tidy(() => {
      // On convertit l'entrée en tenseur
      // et on prédit la sortie
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);

      // On récupère les valeurs de la sortie
      const outputs = ys.dataSync();
      console.log(outputs);
      return outputs;
    });
  }

  createModel() {
    // On crée un réseau de neurones
    // avec une couche d'entrée, une couche cachée et une couche de sortie
    const model = tf.sequential();

    // couche d'activation classique de type sigmoide
    const hidden = tf.layers.dense({
      units: this.hidden_nodes,
      inputShape: [this.input_nodes],
      activation: 'relu' // Changer à ReLU
  });
    model.add(hidden);
    const output = tf.layers.dense({
      units: this.output_nodes,
      activation: 'sigmoid'
    });
    model.add(output);

    return model;
  } 
  async saveModel() {
    // On sauvegarde le modèle dans le dossier 9-VoitureSuitCircuit genetic algo
    // sous le nom best-model-Buffa100gen
    
    await this.model.save('downloads://best-model-Buffa-100gen-Tournament-Crossover');
  }
}


// Pour le raycasting, voir vidéo de Daniel Shiffman
// sur le sujet : https://www.youtube.com/watch?v=TOEi6T2mtHo
class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.angle = angle;
    this.dir = p5.Vector.fromAngle(angle);
  }

  // On regarde dans une direction donnée
  lookAt(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  rotate(offset) {
    this.dir = p5.Vector.fromAngle(this.angle + offset);
  }

  // On dessine le rayon
  show() {
    stroke(0, 255, 0, 100);
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * SIGHT, this.dir.y * SIGHT);
    pop();
  }

  // On regarde si le rayon intersecte un mur
  // si oui on renvoie le point d'intersection
  cast(wall) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    } else {
      return;
    }
  }
}

// Fonctions pour le calcul génétique
// On va créer une nouvelle génération de voitures
function nextGeneration() {
  console.log('next generation');
  
  calculateFitness(end);

  for (let i = 0; i < TOTAL; i++) {

    let parentA = pickOneTournament(); // Pour le crossover
    let parentB = pickOneTournament(); //Pour le crossover
    

    // Pour la mutation, on choisit un parent au hasard
    //population[i] = pickOne();
    //population[i] = pickOneTournament();
    let child; // Pour le crossover
    if (Math.random() < CROSSOVER_RATE) {
      // Appliquer le crossover
      child = crossover(parentA, parentB);
    } else {
      // Pas de crossover, on copie simplement un des parents
      child = new Particle(parentA.brain.copy());
    }

    
    child.mutate();
    population[i] = child; // Pour le crossover

  }

  // On vide le tableau des voitures
  for (let i = 0; i < TOTAL; i++) {
    savedParticles[i].dispose();
  }
  savedParticles = [];
}

// On choisit un parent au hasard
function pickOne() {
  let index = 0;

  // Algorithme de la roulette
  // On tire un nombre r au hasard, par exemple
  // 0.5
  // On parcourt le tableau des voitures en enlevant
  // la fitness à r et on s'arrête dès que r <= 0;
  // la valeur de index est le véhicule choisi
  let r = random(1);
  while (r > 0) {
    r = r - savedParticles[index].fitness;
    index++;
  }
  index--;

  // l'heureux élu !
  let particle = savedParticles[index];
  // TODO implement copy Particle
  // on en fait une copie et on la mute
  let child = new Particle(particle.brain);
  child.mutate();
  return child;
}

const tournament_size = 10;

function pickOneTournament() {
  let tournament = [];
  // Sélectionner des individus au hasard pour le tournoi
  for (let i = 0; i < tournament_size; i++) {
    let index = floor(random(savedParticles.length));
    tournament.push(savedParticles[index]);
  }

  // Trouver le meilleur individu du tournoi
  let best = tournament[0];
  for (let i = 1; i < tournament_size; i++) {
    if (tournament[i].fitness > best.fitness) {
      best = tournament[i];
    }
  }

  // l'heureux élu !
  let child = new Particle(best.brain);
  child.mutate();
  return child;
}

function crossover(parentA, parentB) {
  let childBrain = parentA.brain.crossover(parentB.brain);
  return new Particle(childBrain);
}


// On calcule la fitness de chaque voiture 
// tester en ajouter un fitness si la voiture est première
function calculateFitness(target) {
  for (let particle of savedParticles) {
    particle.calculateFitness();
  }
  // Normalize all values
  let sum = 0;
  for (let particle of savedParticles) {
    sum += particle.fitness;
  }
  for (let particle of savedParticles) {
    particle.fitness = particle.fitness / sum;
  }
}

class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  midpoint() {
    return createVector((this.a.x + this.b.x) * 0.5, (this.a.y + this.b.y) * 0.5);
  }

  show() {
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}