# Projet : IA Réactives avec Algorithme Génétique

Ce projet implémente un système d'évolution génétique utilisant des réseaux de neurones pour simuler le comportement de véhicules suivant un circuit. L'objectif principal est de créer une course entre ces véhicules, chacun disposant d'un modèle de réseau de neurones unique.

## Structure du Projet

### Dossier `course`
Ce dossier est dédié à la course entre les différents modèles de véhicules. Il contient les modèles de réseaux de neurones chargés pour chaque véhicule. Pour démarrer, il suffit de lancer le fichier `index.html`.

### Dossier `learning`
Ce dossier est consacré à l'apprentissage des véhicules. Il contient les fichiers nécessaires à l'algorithme génétique ainsi qu'à la construction et l'entraînement des réseaux de neurones.

---

## Stratégies pour Évaluer les Modèles (Fitness)

1. **Distance et Temps Parcourus :**
   Les véhicules sont récompensés en fonction de la distance parcourue et du temps qu'ils mettent à atteindre leur destination. Cela est calculé dans la fonction `calculateFitness`.

2. **Bonus pour le Leader :**
   Un bonus est accordé au véhicule arrivant en tête de la course, via la fonction `calculateFitnessFirst`.

3. **Pénalités pour les Collisions :**
   Une pénalité est appliquée aux véhicules qui entrent en collision avec les murs du circuit, calculée dans la fonction `calculateFitnessWithPenalties`.

---

## Stratégies pour la Sélection des Parents

Les stratégies de sélection des parents dans l'algorithme génétique comprennent :

- **Roulette** : Une sélection aléatoire, favorisant les véhicules ayant une meilleure performance.
- **Tournoi** : Sélectionner les meilleurs véhicules à partir d'un groupe aléatoire.
- **Rang** : Les véhicules sont sélectionnés en fonction de leur classement dans la population.

---

## Stratégies pour la Génération de la Descendance

Les stratégies suivantes sont utilisées pour la génération de la descendance :

- **Mutation sans Croisement** : Les individus sont modifiés de manière aléatoire sans croiser les gènes de deux parents.
- **Croisement avec Tournoi** : Des individus sont croisés entre eux en utilisant la stratégie de sélection par tournoi.

---

## Paramètres Modifiables pour Générer les Différents Modèles

- **Nombre de Générations** : Le nombre d'itérations pour entraîner les modèles.
- **Nombre de Voitures par Génération** : Le nombre de véhicules qui participent à chaque génération.
- **Taux de Mutation** : La probabilité qu'une mutation se produise sur un véhicule.
- **Taux de Croisement** : La probabilité que deux véhicules échangent des gènes lors du croisement.
- **SIGHT** : La longueur des rayons utilisés par les véhicules pour détecter leur environnement.
- **Nombre de Neurones par Couche** : Le nombre de neurones dans chaque couche du réseau de neurones.
- **Nombre de Couches Cachées** : Le nombre de couches cachées dans le réseau.
- **Fonctions d'Activation** : Les fonctions utilisées pour les couches du réseau, telles que ReLU, sigmoid, et tanh.
- **Complexité du Circuit** : La complexité géométrique du circuit sur lequel les véhicules évoluent.

---

## Observations

Lors des tests, plusieurs tendances intéressantes ont été observées :

- **SIGHT** : Une valeur élevée pour le rayon de détection (`SIGHT`) permet aux véhicules de mieux percevoir et interagir avec leur environnement, améliorant ainsi leur performance.
- **Simplicité du Réseau** : Un réseau neuronal relativement simple avec un maximum de 2 couches cachées tend à offrir de meilleurs résultats, tout en évitant une complexité excessive.
- **Sélection par Roulette et Mutation** : La combinaison de la sélection par roulette et de la mutation sans croisement semble offrir une diversité génétique suffisante sans surcharger le modèle.
- **Limitation du Nombre de Générations** : Restreindre le nombre de générations à environ 30 empêche le sur-apprentissage tout en garantissant un entraînement efficace.
- **Simplicité du Circuit** : Un circuit plus simple permet aux véhicules de compléter le parcours de manière plus fluide et efficace, réduisant les comportements non désirés.

---

## Remarques

Malgré les bons résultats obtenus, certains aspects négatifs demeurent :

- **Conduite en Sens Inverse** : Certains véhicules, bien qu'efficaces en termes de fitness, adoptent des comportements non souhaités, comme rouler en sens inverse.
- **Réseaux Complexes** : Les modèles avec de nombreuses couches ou neurones nécessitent un temps d'entraînement considérable et une grande capacité de calcul, rendant leur utilisation plus contraignante.
- **Sur-apprentissage** : Un nombre trop élevé de générations peut entraîner un sur-apprentissage, où les véhicules adoptent des comportements inadaptés, comme tourner en rond ou suivre une trajectoire unique, peu importe la complexité du circuit.

---

## Liste des Modèles Disponibles

Voici les modèles de réseaux de neurones utilisés dans ce projet :

- **Model 2** : `models/model-3.json`
  - Couche 1 : 18 neurones
  - Couche 2 : 2 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les couches 1 et 2, Sigmoid pour la couche de sortie

- **Model 3** : `models/model8_2.json`
  - Couche 1 : 12 neurones
  - Couche 2 : 6 neurones
  - Couche 3 : 2 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les 3 premières couches, Sigmoid pour la couche de sortie

- **Model 4** : `models/model-1.json`
  - Couche 1 : 18 neurones
  - Couche 2 : 2 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les couches 1 et 2, Sigmoid pour la couche de sortie

- **Model 5** : `models/model9.json`
  - Couche 1 : 12 neurones
  - Couche 2 : 6 neurones
  - Couche 3 : 4 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les 3 premières couches, Sigmoid pour la couche de sortie

- **Model 6** : `models/model-2.json`
  - Couche 1 : 18 neurones
  - Couche 2 : 18 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les couches 1 et 2, Sigmoid pour la couche de sortie

- **Model 7** : `models/model15.json`
  - Couche 1 : 12 neurones
  - Couche 2 : 7 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les 2 premières couches, Sigmoid pour la couche de sortie

- **Model 9** : `models/model-2-4.json`
  - Couche 1 : 18 neurones
  - Couche 2 : 18 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les couches 1 et 2, Sigmoid pour la couche de sortie

- **Model 10** : `models/model-2-3.json`
  - Couche 1 : 18 neurones
  - Couche 2 : 18 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les couches 1 et 2, Sigmoid pour la couche de sortie

- **Model 11** : `models/model17.json`
  - Nombre de couches cachées : 3
  - Couche 1 : 12 neurones
  - Couche 2 : 6 neurones
  - Couche 3 : 3 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les couches 1, 2 et 3, Sigmoid pour la couche de sortie

- **Model 12** : `models/model17_2.json`
- **Model 13** : `models/model17_3.json`
- **Model 14** : `models/model17_4.json`

- **Model 15** : `models/model19_1.json`
  - Couche 1 : 12 neurones
  - Couche 2 : 6 neurones
  - Couche 3 : 3 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les couches 1, 2 et 3, Sigmoid pour la couche de sortie
  - Taux de dropout : 0.5

- **Model 16** : `models/model20_1.json`
  - Couche 1 : 12 neurones
  - Couche 2 : 3 neurones
  - Couche 3 : 3 neurones
  - Couche de sortie : 2 neurones
  - Fonctions d'activation : ReLU pour les couches 1, 2 et 3, Sigmoid pour la couche de sortie
  - Taux de dropout : 0.5
