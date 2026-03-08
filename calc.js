let attackIcons = [];
let defenseIcons = [];
let icons = {};
let activePopup = null;
let wallSpinner = null;
const VIRTUAL_WIDTH = 1920;
const VIRTUAL_HEIGHT = 995;
let view = {
  scale: 1,
  offsetX: 0,
  offsetY: 0
};
let display = 0;
let leftResult = null;
let frontResult = null;
let rightResult = null;

const COLORS = {
  bg: '#2b1d0e',          // dark brown
  panel: '#3a2a18',       // wood/stone
  border: '#c9a24d',      // gold
  text: '#f5e6c8',        // parchment
  hover: '#e0b45c'        // light gold
};

function preload() {
  icons.commander = loadImage('icons/commander.png');
  icons.troops = loadImage('icons/troops.png');
  icons.tools = loadImage('icons/tools.png');
  icons.support = loadImage('icons/support.png');
  icons.castellan = loadImage('icons/castellan.png');
  icons.wall = loadImage('icons/wall.png');
  icons.gate = loadImage('icons/gate.png');
  icons.moat = loadImage('icons/moat.png');
  icons.wallLimit = loadImage('icons/wall_limit.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('sans-serif');
  // ATTACK ICONS
    let ax = 40;
    let ay = 80;
    let s = 100;
    let gap = 120;
    attackIcons.push(new IconButton(ax, ay, s, icons.commander, "Commander"));
    ay += gap;
    attackIcons.push(new IconButton(ax, ay, s, icons.troops, "Left Flank Troops"));
    attackIcons.push(new IconButton(ax + gap, ay, s, icons.tools, "Left Flank Tools"));
    ay += gap;
    attackIcons.push(new IconButton(ax, ay, s, icons.troops, "Front Troops"));
    attackIcons.push(new IconButton(ax + gap, ay, s, icons.tools, "Front Tools"));
    ay += gap;
    attackIcons.push(new IconButton(ax, ay, s, icons.troops, "Right Flank Troops"));
    attackIcons.push(new IconButton(ax + gap, ay, s, icons.tools, "Right Flank Tools"));
    ay += gap;
    attackIcons.push(new IconButton(ax, ay, s, icons.support, "Support Tools"));
    // DEFENSE ICONS
    let dx = 700;
    let dy = 80;
    defenseIcons.push(new IconButton(dx, dy, s, icons.castellan, "Castellan"));
    dy += gap;
    defenseIcons.push(new IconButton(dx, dy, s, icons.wall, "Wall Level"));
    dy += gap;
    defenseIcons.push(new IconButton(dx, dy, s, icons.gate, "Gate Level"));
    dy += gap;
    defenseIcons.push(new IconButton(dx, dy, s, icons.moat, "Moat Level"));
    dy += gap;
    defenseIcons.push(new IconButton(dx, dy, s, icons.wallLimit, "Wall Limit"));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  let scaleX = windowWidth / VIRTUAL_WIDTH;
  let scaleY = windowHeight / VIRTUAL_HEIGHT;
  view.scale = min(scaleX, scaleY);
  view.offsetX = (windowWidth - VIRTUAL_WIDTH * view.scale) / 2;
  view.offsetY = (windowHeight - VIRTUAL_HEIGHT * view.scale) / 2;
  textAlign(LEFT);
  push();
  translate(view.offsetX, view.offsetY);
  scale(view.scale);
  if (keyIsDown(27) && activePopup) {
    activePopup = null;
  }
  background(COLORS.bg);
  drawPanel(20, 40, 910, 800, "INPUT");
  drawPanel(970, 40, 930, 800, "OUTPUT");
  attackIcons.forEach(i => i.draw());
  defenseIcons.forEach(i => i.draw());
  if (activePopup)activePopup.draw();
  // Calculate Button
  stroke(COLORS.border);
  strokeWeight(3);
  fill(COLORS.panel);
  rect(860, 870, 180, 60, 12);
  fill(COLORS.text);
  noStroke();
  textSize(32);
  fill(COLORS.text);
  noStroke();
  textAlign(CENTER, CENTER);
  text("Calculate", 950, 900);
  textAlign(LEFT);
  if (display) {
    displayResults();
  }
  pop();
}

function mousePressed() {
  const v = mouseToVirtual();
  if (activePopup) {
    // Close button
    if (activePopup.closeClicked()) {
      activePopup = null;
      return;
    }
    // Spinner clicks
    activePopup.spinners.forEach(s => s.mousePressed(v.x - activePopup.x, v.y - activePopup.y));
    return;
  }
  // Normal UI clicks
  attackIcons.forEach(i => i.clicked());
  defenseIcons.forEach(i => i.clicked());
  if (mouseX >= view.offsetX + 860 * view.scale && mouseX <= view.offsetX + (860 + 180) * view.scale &&
      mouseY >= view.offsetY + 870 * view.scale && mouseY <= view.offsetY + (870 + 60) * view.scale) {
    // Calculate button clicked
    calculate();
    console.log("Calculate button clicked");
  }
}

function mouseToVirtual() {
  return {
    x: (mouseX - view.offsetX) / view.scale,
    y: (mouseY - view.offsetY) / view.scale
  };
}

function keyPressed() {
  if (activePopup) {
    activePopup.spinners.forEach(s => s.keyPressed());
  }
}

function drawPanel(x, y, w, h, title) {
  stroke(COLORS.border);
  strokeWeight(3);
  fill(COLORS.panel);
  rect(x, y, w, h, 12);
  fill(COLORS.text);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(32);
  text(title, x + w / 2, y + 10);
}






//// CALCULATION LOGIC






let commander = {
    MeleeStr: { value: 0 },
    RangeStr: { value: 0 },
    CourtStr: { value: 0 },
    Wall: { value: 0 },
    Gate: { value: 0 },
    Moat: { value: 0 },
    FlankBonus: { value: 0 },
    FrontBonus: { value: 0 },
    Support: { value: 0 },
    Mead: { value: 0 },
    Waves: { value: 0 }
};
let castellan = {
    MeleeStr: { value: 0 },
    RangeStr: { value: 0 },
    CourtStr: { value: 0 },
    AllDef: { value: 0 },
    Wall: { value: 0 },
    Gate: { value: 0 },
    Moat: { value: 0 },
    Support: { value: 0 }
};
let attackValues = {
    CombinedMeleeLeft: { value: 0 },
    CombinedMeleeFront: { value: 0 },
    CombinedMeleeRight: { value: 0 },
    CombinedRangeLeft: { value: 0 },
    CombinedRangeFront: { value: 0 },
    CombinedRangeRight: { value: 0 }
};
let toolsValues = {
    LeftWall: { value: 0 },
    LeftMoat: { value: 0 },
    LeftShields: { value: 0 },
    FrontWall: { value: 0 },
    FrontGate: { value: 0 },
    FrontMoat: { value: 0 },
    FrontShields: { value: 0 },
    RightWall: { value: 0 },
    RightMoat: { value: 0 },
    RightShields: { value: 0 }
};
let defenseValues = {
    WallLevel: { value: 0 },
    GateLevel: { value: 0 },
    MoatLevel: { value: 0 },
    Wall: { value: 0 },
    Gate: { value: 0 },
    Moat: { value: 0 },
    WallLimit: { value: 0 }
};

function evaluateSide(side, AM, AR, W) {
    let best = null;
    // Try troop ratios 0 → 1 in steps
    for (let i = 0; i <= 100; i++) {
        let x = i / 100; // melee ratio
        let M = x * W;
        let R = (1 - x) * W;
        // Base defense values (lvl 10 mead)
        let Dm = M * 320 + R * 120;
        let Dr = M * 128 + R * 310;
        // Apply bonuses
        if (side === "l") {
            
        } else if (side === "f") {
        } else if (side === "r") {
        }

        Dm *= (1 + 2);
        Dr *= (1 + 2);
        let pressure = (AM / (Dm || 1)) + (AR / (Dr || 1));
        let breached = (AM > Dm) || (AR > Dr);
        if (!best || 
            breached < best.breached || 
            (breached === best.breached && pressure < best.pressure)) {    
            best = {
                breached,
                pressure,
                ratio: x
            };
        }
    }
    return best;
}

function calculate() {
    switch (defenseValues.WallLevel.value) {
        case 0:
            defenseValues.Wall.value = 0;
            break;
        case 1:
            defenseValues.Wall.value = 30;
            break;
        case 2:
            defenseValues.Wall.value = 50;
            break;
        case 3:
            defenseValues.Wall.value = 70;
            break;
        case 4:
            defenseValues.Wall.value = 90;
            break;
        case 5:
            defenseValues.Wall.value = 120;
            break;
        case 6:
            defenseValues.Wall.value = 140;
            break;
        case 7:
            defenseValues.Wall.value = 160;
            break;
        case 8:
            defenseValues.Wall.value = 200;
            break;
        case 9:
            defenseValues.Wall.value = 215;
            break;
    }
    switch (defenseValues.GateLevel.value) {
        case 0:
            defenseValues.Gate.value = 0;
            break;
        case 1:
            defenseValues.Gate.value = 30;
            break;
        case 2:
            defenseValues.Gate.value = 50;
            break;
        case 3:
            defenseValues.Gate.value = 70;
            break;
        case 4:
            defenseValues.Gate.value = 90;
            break;
        case 5:
            defenseValues.Gate.value = 120;
            break;
        case 6:
            defenseValues.Gate.value = 140;
            break;
        case 7:
            defenseValues.Gate.value = 160;
            break;
        case 8:
            defenseValues.Gate.value = 200;
            break;
        case 9:
            defenseValues.Gate.value = 215;
            break;
    }
    switch (defenseValues.MoatLevel.value) {
        case 0:
            defenseValues.Moat.value = 0;
            break;
        case 1:
            defenseValues.Moat.value = 20;
            break;
        case 2:
            defenseValues.Moat.value = 40;
            break;
        case 3:
            defenseValues.Moat.value = 60;
            break;
        case 4:
            defenseValues.Moat.value = 80;
            break;
        case 5:
            defenseValues.Moat.value = 45;
            break;
        case 6:
            defenseValues.Moat.value = 65;
            break;
        case 7:
            defenseValues.Moat.value = 75;
            break;
        case 8:
            defenseValues.Moat.value = 85;
            break;
    }
    defenseValues.Wall.value += castellan.Wall.value;
    defenseValues.Gate.value += castellan.Gate.value;
    defenseValues.Moat.value += castellan.Moat.value;
    // Calculate attack values
    let MeleeLeftBonus = 1 + commander.MeleeStr.value / 100 + commander.FlankBonus.value / 100;
    let MeleeFrontBonus = 1 + commander.MeleeStr.value / 100 + commander.FrontBonus.value / 100;
    let MeleeRightBonus = 1 + commander.MeleeStr.value / 100 + commander.FlankBonus.value / 100;
    let RangeLeftBonus = 1 + commander.RangeStr.value / 100 + commander.FlankBonus.value / 100;
    let RangeFrontBonus = 1 + commander.RangeStr.value / 100 + commander.FrontBonus.value / 100;
    let RangeRightBonus = 1 + commander.RangeStr.value / 100 + commander.FlankBonus.value / 100;
    let AttMeleeLeft = attackValues.CombinedMeleeLeft.value * MeleeLeftBonus;
    let AttMeleeFront = attackValues.CombinedMeleeFront.value * MeleeFrontBonus;
    let AttMeleeRight = attackValues.CombinedMeleeRight.value * MeleeRightBonus;
    let AttRangeLeft = attackValues.CombinedRangeLeft.value * RangeLeftBonus;
    let AttRangeFront = attackValues.CombinedRangeFront.value * RangeFrontBonus;
    let AttRangeRight = attackValues.CombinedRangeRight.value * RangeRightBonus;
    leftResult = evaluateSide(
        "l",
        AttMeleeLeft,
        AttRangeLeft,
        defenseValues.WallLimit.value,
    );
    frontResult = evaluateSide(
        "f",
        AttMeleeFront,
        AttRangeFront,
        defenseValues.WallLimit.value
    );
    rightResult = evaluateSide(
        "r",
        AttMeleeRight,
        AttRangeRight,
        defenseValues.WallLimit.value
    );
    console.log("Left:", leftResult);
    console.log("Front:", frontResult);
    console.log("Right:", rightResult);
    display = 1;
}

function displayResults() {
    fill(COLORS.text);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(24);
    text("Optimal Left Side Ratio:", 1000, 100);
    text(leftResult.ratio + " / " + (100 - leftResult.ratio), 1280, 100);
    text("Optimal Front Ratio:", 1000, 140);
    text(frontResult.ratio + " / " + (100 - frontResult.ratio), 1240, 140);
    text("Optimal Right Side Ratio:", 1000, 180);
    text(rightResult.ratio + " / " + (100 - rightResult.ratio), 1300, 180);
}
/*
Made by Fenoris
Project Athreid
⠀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠈⠚⢷⡀⢠⣿⡞⠁⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⠀⠀⠀⠞
⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠈⢻⡟⠁⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠻⢿⣿⣿⣷⣤⠞⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠇⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⢏⣉⣷⡞⢹⢀⣿⣿⣿⣿⣦⡀
⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣇⢈⠉⠛⠇⠾⠟⠀⠘⣿⣿⡿⣇
⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⡿⠋⣀⠶⣶⡞⢹⣿⢋⡴⠃
⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣞⠧⣴⡿⣄⣸⢻⣟⣥⣾⣷⣥
⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣧⣾⠿⠿⠃⠈⢻⣿⣯
⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣴⠀⠀⠀⠘⠛⢿
⠀⣼⣿⣿⣿⣿⣿⣿⣿⡿⠟⣛⣿⡿⠛⠋⠉⣹⡏⠀⠀⠀⠀⠀⠀⠀⣀⡇⠀⠉⠉⠉⠛⠻⠶⣿⣿⡟⠛⠿⣿⣿⣿⡇⠀⠀⠀⢀⣠⣿
⣸⣿⣿⣿⣿⣿⣿⣻⡵⠀⣸⡿⠋⠀⠀⠀⠀⣿⠋⠀⠀⠀⠀⠀⠀⠀⠹⡇⠀⠀⠀⠀⠀⠀⠀⠈⠹⣿⡦⣤⡈⠻⣿⣷⣶⣦⣄⠀⣿⡿
⣿⣿⣿⣿⡏⣼⡟⠁⠀⠀⡿⠀⠀⠀⠀⠀⣼⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⣿⣆⠀⠀⠀⠀⠀⢀⠀⠀⠘⣇⠀⠉⠳⣿⣿⣿⣿⣿⣿⣿⣷
⣿⣿⣿⣿⡇⡿⠀⠀⠀⠀⡇⠀⠀⠀⢀⡼⠋⠘⣧⠀⠀⠀⠀⠀⠀⠀⠀⢹⠹⣦⡀⠀⠀⠀⠘⣧⡀⠀⢸⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⡿
⠙⢿⣿⠏⠀⠁⠀⠀⠀⠀⣧⠀⠀⣰⣟⣀⠀⠀⢹⡄⠀⠀⠀⠀⣀⠀⠀⠘⣷⡈⠻⣦⡀⠀⠀⠀⠹⢦⣼⠀⠀⠀⠀⢸⡿⣿⣿⣿⣿⣇
⣴⡿⠏⠀⠀⠀⠀⠀⠀⠀⣿⣠⡾⠋⠀⠀⠉⠙⠛⠻⣆⠀⠀⠀⠙⣷⣤⣀⡈⠳⣄⡀⠙⠳⣤⣀⡀⠀⠙⠷⣤⡀⠀⢸⡇⣿⡁⢸⣿⣿
⠟⠀⠀⠀⠀⢠⡄⠀⠀⠰⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣀⠀⠀⠘⢦⡈⠛⢛⣻⣷⣿⣿⣶⣍⡛⠻⢶⠾⠛⠋⠀⢸⠁⣿⣿⣾⣿⣿
⠀⣀⡤⠀⠀⠸⡇⠀⠀⠀⢿⡄⢀⡤⠤⣄⡀⠀⠀⠀⠀⠀⠘⠷⢤⣄⣀⣽⣶⣿⠟⠫⠙⢿⡿⠿⣿⣦⡏⠀⢰⡿⠀⠈⠀⢸⣿⣿⣿⣿
⠟⠋⠀⠀⠀⢀⣿⡄⠀⠀⠈⢧⡛⠛⠻⣶⣿⣶⣤⡀⠀⠀⠀⠀⠀⠈⠉⠉⣿⡇⠀⠀⣆⢸⡇⠀⢹⡿⣧⣴⠏⠀⠀⠀⠀⠀⠻⣿⣿⣿
⣀⣀⣀⣤⣴⠿⡋⠻⣦⡀⠀⠈⠻⣾⣿⠿⠟⠛⠛⠛⠂⠀⠀⠀⠀⠀⠀⠀⢻⡏⠀⠈⢛⡿⠁⠀⢘⣻⠏⠀⢀⣠⣆⠀⠀⠀⠀⠙⢿⣟
⣿⣩⣿⣿⡟⠟⠰⠀⣿⣿⣶⡖⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠉⠙⠚⠉⠀⠀⠀⠻⣷⣶⣶⠟⠉⠙⣷⣄⠀⠀⠀⠀⠉
⠉⣫⡟⠉⢻⣄⠀⠀⣿⣿⡈⠻⣦⡄⠀⢠⡴⢦⡀⠀⠀⠀⢲⡀⣾⣫⠇⠀⠀⠀⢀⡴⢶⡀⢀⣤⠞⠋⣽⣿⠀⠀⠰⣿⠋⠛⠶⣶⡶⠶
⡾⠋⠀⠀⠀⠻⣧⣄⣿⣿⣷⡴⠾⠟⠛⠏⠀⣼⣇⡀⠀⠀⠀⠈⠉⠁⠀⠀⢀⣠⣼⣇⠀⠛⠛⠛⠳⣾⣷⣿⠀⢀⠞⠁⠀⠀⠀⠈⠻⢶
⠁⠀⣰⠟⠁⠀⠈⢻⣿⣿⣿⠁⠀⠀⠀⠀⡴⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⡦⠀⠀⠀⠀⠈⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀
⣶⡿⠋⠀⠀⢀⣠⣾⣿⣿⣿⣦⣀⡀⠀⢀⣠⡴⠞⠻⢿⣿⣿⣿⣿⢿⣿⡿⠋⠙⠿⠦⣤⣀⣀⣀⣠⣾⣿⣿⣿⣷⣄⠀⠀⠀⠹⣷⠶⣤
⣿⠀⠀⠀⠀⣾⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣁⣀⠀⣀⣠⣽⣿⠟⠃⠒⠻⣦⣄⣀⣀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣿⡇⠀⠀⠀⠘⣧⠈
⣿⠀⠀⡀⠀⣿⣇⠈⣿⣿⣿⣿⣿⣿⣿⣿⣟⣟⣛⡛⣛⣿⣿⣿⣷⣴⣿⣿⣿⣿⡟⣋⣉⣿⣿⣿⣿⣿⣿⣿⠏⢀⣿⠇⠀⡀⠀⢀⣿⠀
*/