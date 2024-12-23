Projet IA Reactifs : 

Fichiers : 
    boudary.js : Les lignes du circuit
    ga.js : algo génétique avec calcul de la fitness et implementation des géneration 
    nn.js : fichier avec le réseaux de neuronnes (reseau de neuronne dans la fonction cretemodel) le model a en entrées les information prise par les rayons(la distance avec les mur autour de lui) et en sortie(la vitesse et ca position(l'angle a la qu'elle il se tourne))
    particles.js : represente le vehicules et son cerveau fait appel a la classes du reseau de neuronnes
    ray.js : Rayons(les yeux) de detection de la voiture 


Models : 

    Buffa : le model de base 
## model-relu
    Modifier la fonction d'activation en 'relu'
    taux de mutation 0.2
    3 fois plus de neurones cachés (this.brain = new NeuralNetwork(this.rays.length, this.rays.length * 3, 2);)
    ajout bonus dans la fonction "calculate fitness"

## model-relu(1)
    TOTAL: 150,
    MUTATION_RATE: 0.08,
    LIFESPAN: 50,
    SIGHT: 100,
    MAX_GENERATIONS: 200,
    maxFitness: 300,
    maxspeed: 6,
    maxforce: 0.15,
    activation: "relu"
    Buffa30 : le model de base avec 30 génération
    Buffa100 : le model de base avec 100 génération
    Buffa30gen-SelectionTournament : Modification de la selection avec tournoi et 0.4 en mutation (Semble moins performent et la voiture est plus lente)
    Buffa100gen-SelectionTournament : Modification de la selection avec tournoi et 0.4 (plus performent mais toujour lent)
    Buffa30gen-SelectionTournament-Cross : La meme que precedement en rajoutant du crossover 
    Buffa30gen-SelectionTournament-Cross : Crossover a 0.6 (identique au precedent)
    
