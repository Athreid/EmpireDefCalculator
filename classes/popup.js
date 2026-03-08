class Popup {
  constructor(w, h, title, contentCallback) {
    this.spinners = [];
    this.title = title;
    this.contentCallback = contentCallback;
    this.w = w;
    this.h = h;
    this.x = VIRTUAL_WIDTH / 2 - this.w / 2;
    this.y = VIRTUAL_HEIGHT / 2 - this.h / 2;
  }
  draw() {
    // Overlay
    fill(0, 160);
    noStroke();
    rect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    // Panel
    stroke(COLORS.border);
    strokeWeight(3);
    fill('#4b3a22'); // parchment/wood
    console.log(this.w, this.h);
    rect(this.x, this.y, this.w, this.h, 14);
    // Title
    noStroke();
    fill(COLORS.text);
    textAlign(CENTER, TOP);
    textSize(20);
    text(this.title, this.x + this.w / 2, this.y + 14);
    // Divider
    stroke(COLORS.border);
    line(this.x + 20, this.y + 46, this.x + this.w - 20, this.y + 46);
    if (this.title === "Commander") {
      noStroke();
      textAlign(LEFT);
      text("Melee strength bonus:", this.x + 20, this.y + 80);
      text("Range strength bonus:", this.x + 20, this.y + 160);
      text("Court strength bonus:", this.x + 20, this.y + 240);
      text("Wall bonus:", this.x + 20, this.y + 320);
      text("Gate bonus:", this.x + 20, this.y + 400);
      text("Moat bonus:", this.x + 20, this.y + 480);
      text("Flank strength bonus:", this.x + 20, this.y + 560);
      text("Front strength bonus:", this.x + 20, this.y + 640);
      text("Support units on courtyard:", this.x + 20, this.y + 720);
      text("Mead strength bonus:", this.x + 20, this.y + 800);
      text("Waves:", this.x + 20, this.y + 880);
    } else if (this.title === "Castellan") {
      noStroke();
      textAlign(LEFT);
      text("Melee strength bonus:", this.x + 20, this.y + 80);
      text("Range strength bonus:", this.x + 20, this.y + 160);
      text("Courtyard strength bonus:", this.x + 20, this.y + 240);
      text("All defense bonus:", this.x + 20, this.y + 320);
      text("Wall bonus:", this.x + 20, this.y + 400);
      text("Gate bonus:", this.x + 20, this.y + 480);
      text("Moat bonus:", this.x + 20, this.y + 560);
      text("Support units on courtyard:", this.x + 20, this.y + 640);
    } else if (this.title === "Left Flank Troops" || this.title === "Front Troops" || this.title === "Right Flank Troops") { 
      noStroke();
      textAlign(LEFT);
      text("Combined melee attack:", this.x + 20, this.y + 80);
      text("Combined range attack:", this.x + 20, this.y + 160);
    } else if (this.title === "Left Flank Tools" || this.title === "Right Flank Tools") {
      noStroke();
      textAlign(LEFT);
      text("Wall tools:", this.x + 20, this.y + 80);
      text("Moat tools:", this.x + 20, this.y + 160);
      text("Shields:", this.x + 20, this.y + 240);
    } else if (this.title === "Front Tools") {
      noStroke();
      textAlign(LEFT);
      text("Wall tools:", this.x + 20, this.y + 80);
      text("Gate tools:", this.x + 20, this.y + 160);
      text("Moat tools:", this.x + 20, this.y + 240);
      text("Shields:", this.x + 20, this.y + 320);
    }
    // Close button
    this.drawCloseButton();
    push();
    translate(this.x, this.y);
    this.contentCallback?.();
    // Draw spinners
    this.spinners.forEach(s => s.draw());
    pop();
  }
  drawCloseButton() {
    let cx = this.x + this.w - 32;
    let cy = this.y + 14;
    stroke(COLORS.border);
    fill('#6b2a1a');
    rect(cx, cy, 18, 18, 4);
    noStroke();
    fill('#fff');
    textAlign(CENTER, CENTER);
    textSize(12);
    text('X', cx + 9, cy + 9);
  }
  closeClicked() {
    const { x: mx, y: my } = mouseToVirtual();
    let cx = this.x + this.w - 32;
    let cy = this.y + 14;
    return mx > cx && mx < cx + 18 &&
           my > cy && my < cy + 18;
  }
}
