class NeuralNetwork {
  constructor(a, b, c, d) {
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

  mutate(rate) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          if (random(1) < rate) {
            let w = values[j];
            values[j] = w + randomGaussian();
          }
        }
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
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
      model.add(tf.layers.dense({
        units: this.hidden_nodes, // Première couche cachée
        inputShape: [this.input_nodes],
        activation: 'relu'
     }));
     model.add(tf.layers.dense({
        units: 6, // Deuxième couche cachée
        activation: 'relu'
     }));


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
      
      await this.model.save('downloads://model-5');
    }
  }
