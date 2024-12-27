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
    strokeWeight(4); // Augmenter l'épaisseur de la ligne
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}