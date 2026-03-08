class IconButton {
  constructor(x, y, size, img, label) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;
    this.label = label;
  }
  draw() {
    let hovered = this.isHovered();
    // Frame
    stroke(COLORS.border);
    strokeWeight(2);
    fill(hovered ? COLORS.hover : COLORS.panel);
    rect(this.x, this.y, this.size, this.size, 6);
    // Icon
    if (this.img) {
      imageMode(CENTER);
      image(
        this.img,
        this.x + this.size / 2,
        this.y + this.size / 2,
        this.size * 0.75,
        this.size * 0.75
      );
      imageMode(CORNER);
    }
    // Optional debug label
    if (hovered) {
      noStroke();
      fill(COLORS.text);
      textAlign(CENTER, TOP);
      textSize(11);
      text(this.label, this.x + this.size / 2, this.y + this.size + 6);
    }
  }
  isHovered() {
    const { x: mx, y: my } = mouseToVirtual();
    return mx > this.x &&
           mx < this.x + this.size &&
           my > this.y &&
           my < this.y + this.size;
  }
  clicked() {
  if (!this.isHovered()) return;
  console.log(`[POPUP OPEN] ${this.label}`);
  // Create the popup once
  if (this.label === "Castellan") {
    activePopup = new Popup(500, 700, this.label, () => {});
  } else if (this.label === "Commander") {
    activePopup = new Popup(500, 930, this.label, () => {});
  } else if (this.label === "Left Flank Troops" || this.label === "Left Flank Tools" ||
             this.label === "Front Troops" || this.label === "Front Tools" ||
             this.label === "Right Flank Troops" || this.label === "Right Flank Tools") {
    activePopup = new Popup(500, 930, this.label, () => {});
  } else {
    activePopup = new Popup(240, 160, this.label, () => {});
  }
  let spinnerSpacing = 80; // space between multiple spinners
  switch (this.label) {
    case "Wall Level":
      activePopup.spinners.push(
        new NumberSpinner(20, 60, 200, 1, 9, 1, defenseValues.WallLevel)
      );
      break;
    case "Gate Level":
      activePopup.spinners.push(
        new NumberSpinner(20, 60, 200, 1, 9, 1, defenseValues.GateLevel)
      );
      break;
    case "Moat Level":
      activePopup.spinners.push(
        new NumberSpinner(20, 60, 200, 1, 8, 1, defenseValues.MoatLevel)
      );
      break;
    case "Wall Limit":
      activePopup.spinners.push(
        new NumberSpinner(20, 60, 200, 0, 100000, 1, defenseValues.WallLimit)
      );
      break;
    case "Support Tools":
      break;
    case "Left Flank Troops":
      activePopup.spinners.push(
        new NumberSpinner(260, 60, 200, 0, 10000000, 1, attackValues.CombinedMeleeLeft)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + spinnerSpacing, 200, 0, 10000000, 1, attackValues.CombinedRangeLeft)
      );
      break;
    case "Left Flank Tools":
      activePopup.spinners.push(
        new NumberSpinner(260, 60, 200, 0, 100000, 1, toolsValues.LeftWall)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + spinnerSpacing, 200, 0, 100000, 1, toolsValues.LeftMoat)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 2 * spinnerSpacing, 200, 0, 100000, 1, toolsValues.LeftShields)
      );
      break;
    case "Front Troops":
      activePopup.spinners.push(
        new NumberSpinner(260, 60, 200, 0, 10000000, 1, attackValues.CombinedMeleeFront)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + spinnerSpacing, 200, 0, 10000000, 1, attackValues.CombinedRangeFront)
      );
      break;
    case "Front Tools":
      activePopup.spinners.push(
        new NumberSpinner(260, 60, 200, 0, 100000, 1, toolsValues.FrontWall)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + spinnerSpacing, 200, 0, 100000, 1, toolsValues.FrontGate)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 2 * spinnerSpacing, 200, 0, 100000, 1, toolsValues.FrontMoat)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 3 * spinnerSpacing, 200, 0, 100000, 1, toolsValues.FrontShields)
      );
      break;
    case "Right Flank Tools":
      activePopup.spinners.push(
        new NumberSpinner(260, 60, 200, 0, 100000, 1, toolsValues.RightWall)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + spinnerSpacing, 200, 0, 100000, 1, toolsValues.RightMoat)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 2 * spinnerSpacing, 200, 0, 100000, 1, toolsValues.RightShields)
      );
      break;
    case "Right Flank Troops":
      activePopup.spinners.push(
        new NumberSpinner(260, 60, 200, 0, 10000000, 1, attackValues.CombinedMeleeRight)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + spinnerSpacing, 200, 0, 10000000, 1, attackValues.CombinedRangeRight)
      );
      break;
    case "Commander":
      activePopup.spinners.push(
        new NumberSpinner(260, 60, 200, 0, 2000, 0.1, commander.MeleeStr)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + spinnerSpacing, 200, 0, 2000, 0.1, commander.RangeStr)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 2 * spinnerSpacing, 200, 0, 2000, 0.1, commander.CourtStr)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 3 * spinnerSpacing, 200, 0, 2000, 0.1, commander.Wall)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 4 * spinnerSpacing, 200, 0, 2000, 0.1, commander.Gate)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 5 * spinnerSpacing, 200, 0, 2000, 0.1, commander.Moat)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 6 * spinnerSpacing, 200, 0, 500, 1, commander.FlankBonus)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 7 * spinnerSpacing, 200, 0, 500, 1, commander.FrontBonus)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 8 * spinnerSpacing, 200, 0, 2000, 1, commander.Support)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 9 * spinnerSpacing, 200, 0, 2000, 1, commander.Mead)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 10 * spinnerSpacing, 200, 0, 20, 1, commander.Waves)
      );
      break;
    case "Castellan":
      activePopup.spinners.push(
        new NumberSpinner(260, 60, 200, 0, 2000, 0.1, castellan.MeleeStr)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + spinnerSpacing, 200, 0, 2000, 0.1, castellan.RangeStr)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 2 * spinnerSpacing, 200, 0, 2000, 0.1, castellan.CourtStr)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 3 * spinnerSpacing, 200, 0, 2000, 0.1, castellan.Wall)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 4 * spinnerSpacing, 200, 0, 2000, 0.1, castellan.AllDef)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 5 * spinnerSpacing, 200, 0, 2000, 0.1, castellan.Gate)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 6 * spinnerSpacing, 200, 0, 2000, 0.1, castellan.Moat)
      );
      activePopup.spinners.push(
        new NumberSpinner(260, 60 + 7 * spinnerSpacing, 200, 0, 2000, 0.1, castellan.Support)
      );
      break;
    default:
      break;
  }
}
}
