
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