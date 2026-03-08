class NumberSpinner {
  constructor(x, y, w, min, max, step, valueRef) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 60;
    this.min = min;
    this.max = max;
    this.step = step;
    this.valueRef = valueRef; // reference object { value: number }
    this.editing = false;
    this.inputBuffer = "";
  }
  draw() {
    stroke(COLORS.border);
    fill(COLORS.panel);
    rect(this.x, this.y, this.w, this.h, 6);
    // ▲
    this.drawArrow(this.x + this.w - 30, this.y + 5, "up");
    // ▼
    this.drawArrow(this.x + this.w - 30, this.y + 35, "down");
    // Value box
    stroke(COLORS.border);
    fill('#2b1d0e');
    rect(this.x + 10, this.y + 15, this.w - 50, 30, 6);
    noStroke();
    fill(COLORS.text);
    textAlign(CENTER, CENTER);
    textSize(14);
    if (this.editing) {
      text(this.inputBuffer + "_", this.x + (this.w - 50) / 2 + 10, this.y + 30);
    } else {
      text(this.valueRef.value.toFixed(1), this.x + (this.w - 50) / 2 + 10, this.y + 30);
    }
  }
  drawArrow(x, y, dir) {
    stroke(COLORS.border);
    fill(COLORS.panel);
    rect(x, y, 20, 20, 4);
    noStroke();
    fill(COLORS.text);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(dir === "up" ? "▲" : "▼", x + 10, y + 10);
  }
  mousePressed(mx, my) {
  // ▲
  if (this.hit(this.x + this.w - 30, this.y + 5, 20, 20, mx, my)) {
    this.adjust(this.step);
    return;
  }
  // ▼
  if (this.hit(this.x + this.w - 30, this.y + 35, 20, 20, mx, my)) {
    this.adjust(-this.step);
    return;
  }
  // Value box
  if (this.hit(this.x + 10, this.y + 15, this.w - 50, 30, mx, my)) {
    this.editing = true;
    this.inputBuffer = this.valueRef.value.toString();
  } else {
    this.commit();
  }
}
hit(x, y, w, h, mx, my) {
  return mx > x && mx < x + w && my > y && my < y + h;
}
  keyPressed() {
    if (!this.editing) return;
    if (key === 'Enter') {
      this.commit();
    } else if (key === 'Escape') {
      this.editing = false;
    } else if (key === 'Backspace') {
      this.inputBuffer = this.inputBuffer.slice(0, -1);
    } else if (key.match(/[0-9.]/)) {
      this.inputBuffer += key;
    }
  }
  adjust(delta) {
    let v = this.valueRef.value + delta;
    this.setValue(v);
  }
  commit() {
    if (!this.editing) return;
    let v = parseFloat(this.inputBuffer);
    if (!isNaN(v)) {
      this.setValue(v);
    }
    this.editing = false;
  }
  setValue(v) {
    v = Math.round(v / this.step) * this.step;
    v = constrain(v, this.min, this.max);
    this.valueRef.value = Number(v.toFixed(1));
  }
}