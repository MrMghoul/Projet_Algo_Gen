Projet IA Reactifs : 

Fichiers: 
    boudary.js : Les lignes du circuit
    ga.js : algo génétique avec calcul de la fitness et implementation des géneration 
    nn.js : fichier avec le réseaux de neuronnes (reseau de neuronne dans la fonction cretemodel) le model a en entrées les information prise par les rayons(la distance avec les mur autour de lui) et en sortie(la vitesse et ca position(l'angle a la qu'elle il se tourne))
    particles.js : represente le vehicules et son cerveau fait appel a la classes du reseau de neuronnes
    ray.js : Rayons(les yeux) de detection de la voiture 


Models : 

    Buffa30 : le model de base avec 30 génération
    Buffa100 : le model de base avec 100 génération
    Buffa30gen-SelectionTournament : Modification de la selection avec tournoi (Semble moins performent et la voiture est plus lente)
    