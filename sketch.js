let img1;

function preload() {
  img1 = loadImage("casino7.png");//casino background
}
let symbols = [ //potential symbols in each slot (more symbols=higher likleyhood)
  "🪾","🪾","🪾","🪾","🪾",
  "🪨","🪨","🪨","🪨","🪨",
  "🪹","🪹","🪹","🪹","🪹",
  "🪵","🪵","🪵","🪵","🪵",
  "🍂","🍂","🍂","🍂","🍂",
 "🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄","🍄",
  "🌷","🌷","🌷","🌷","🌷","🌷","🌷","🌷","🌷","🌷","🌷","🌷",
  "🌞","🌞","🌞","🌞","🌞","🌞","🌞","🌞","🌞","🌞",
  "🦋","🦋","🦋","🦋","🦋","🦋","🦋",
  "💐","💐","💐","💐","💐",
  "🍁","🍁","🍁",
  "🌹", "🌹"
];

let reels = [ //Starting state of reels
  ["?", "?", "?"],
  ["?", "?", "?"],
  ["?", "?", "?"]
];

let reelStopTime = [0, 50, 100]; //Stopping order of reels
let reelDone = [false, false, false];

//reset jackpots
let jackpotTriggered = false;
let fullGridJackpot = false;

//reset spin
let spinning = false;
let spinTime = 0;
let resultText = "";

//starting credits and suggested bet amount
let credits = 500;
let bet = 10;

//maximum return multiplier
const MAX_MULTIPLIER = 1000;

let winningLines = [];

// Lifetime stats (saved)
let biggestWin = 0;
let totalSpins = 0;
let totalWinnings = 0;
let totalBetAmount = 0;
let winCount = 0;

// Session stats (not saved)
let sessionWinnings = 0;
let sessionBetAmount = 0;

// LONG PRESS RESET
let pressStartTime = 0;
let isPressing = false;
const LONG_PRESS_DURATION = 3000;

//select random symbols from list above
function getRandomSymbol() {
  return random(symbols);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() { //basic overall setup
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER)
  colorMode(HSL)
  
  credits = int(localStorage.getItem("slotCredits")) || 500; //saved credits
  //below used in stats
  biggestWin = int(localStorage.getItem("slotBiggestWin")) || 0;
  totalSpins = int(localStorage.getItem("slotTotalSpins")) || 0;
  totalWinnings = int(localStorage.getItem("slotTotalWinnings")) || 0;
  totalBetAmount = int(localStorage.getItem("slotTotalBetAmount")) || 0;
  winCount = int(localStorage.getItem("slotWinCount")) || 0;
}

function draw() {
  background(30);
  textAlign(CENTER, TOP);
  imageMode(CENTER)
  image(img1, width/2, height/2,width,height); //place image as background
  let boardSize = min(width, height) * 0.45;
  let boardX = width / 2;
  let boardY = height / 2;
  //readjust boxes with local variables (allows for window resizing)
  let boxW = width * 0.2; //width
  let boxH = height * 0.6;  //height
  let keyX = width * 0.19; //X position (Key)
  let statsX = width * 0.81; //X position (Stats)
  let boxY = height * 0.5; //Y position (Stats)

  fill(255); //Text Settings
  textSize(60);
  textFont("Times New Roman");
  textStyle(BOLD);

  //text and bet placement and setup
  textSize(25);
  stroke(0);
  text("Credits: " + credits, 120, 200);
  text("Bet: " + bet, 300, 200);
  
  //draw Key box
  fill(79, 40.5, 68.2);
  noStroke();
  strokeWeight(10);
  rect(keyX, boxY, boxW, boxH);
  stroke(0);
  strokeWeight(2);
  fill(255);
  textSize(boxH * 0.04);
  
  //Key text
  let keyLines = [
  "3 of a 🍄 = 1:5",
  "3 of a 🌷 = 1:10",
  "3 of a 🌞 = 1:15",
  "3 of a 🦋 = 1:20",
  "3 of a 💐 = 1:50",
  "3 of a 🍁 = 1:100",
  "3 of a 🌹 = 1:300",
  "JACKPOTS",
  "1 of a 🌸 = 50,000",
  "Full Grid = 1:500"
];

//placement of key in the box
let padding = boxH * 0.08;
// top edge of box
let topY = boxY - boxH / 2 + padding;
// title
textSize(boxH * 0.04);
text("WINS", keyX, topY);
// spacing for list
textSize(boxH * 0.02);
let contentTop = topY + padding;
let spacing = (boxH - padding * 3) / keyLines.length;
for (let i = 0; i < keyLines.length; i++) {
  text(keyLines[i], keyX, contentTop + i * spacing);
}
  
  // Stats box
  fill(79, 40.5, 68.2);
  noStroke();
  rect(statsX, boxY, boxW, boxH);
  stroke(0);
  strokeWeight(2);
  fill(255);
  textSize(min(boxW, boxH) * 0.3);

  
  // Statistics cakculations
  let lifetimeProfit = totalWinnings - totalBetAmount;
  let sessionProfit = sessionWinnings - sessionBetAmount;
  let winRate = totalSpins > 0 ? floor((winCount / totalSpins) * 100) : 0;
 
  //stats box text
let statsLines = [
  "Spins: " + totalSpins,
  "Wins: " + winCount,
  "Biggest Win:", 
  String(biggestWin),
  "Win Rate: ",
  winRate + "%",
  "Total Won:",
  String(totalWinnings),
  "Profit: " + lifetimeProfit,
];
  
  //Stats box text placement
let topY2 = boxY - boxH / 2 + padding;
textSize(min(boxW, boxH) * 0.2);
text("STATS", statsX, topY2);
textSize(boxH * 0.03);
let contentTop2 = topY2 + padding;
let spacing2 = (boxH - padding * 3) / statsLines.length;
for (let i = 0; i < statsLines.length; i++) {
  let y = contentTop2 + i * spacing2;
  if (statsLines[i].includes("Profit: ")) {
    fill(lifetimeProfit >= 0 ? "lime" : "red"); //colour depending on winnings
  } else {
    fill(255);
  }

  text(statsLines[i], statsX, y);
}
  
  //Fun info
  fill(0);
textSize(boxH * 0.03);
  noStroke();
  text("PAYS ALL LINES", width/2, height/1.33);
  
  //NAME
  text(
  "A Jack McGreal Project",
  width / 2,
  height * 0.97
);

  // ✅ LONG PRESS RESET CHECK
  if (isPressing) {
    let heldTime = millis() - pressStartTime;

    if (heldTime >= LONG_PRESS_DURATION) {
      doReset();
      isPressing = false;
    }
  }

  // reel placement (RESPONSIVE)
// reel placement (RESPONSIVE SAFE)
let gridSize = min(width, height) * 0.28;

// prevent zero / NaN issues
gridSize = max(gridSize, 100);

let cellW = gridSize / 2;
let cellH = gridSize / 2.5;

let startX = width / 2.33 - gridSize / 2;
let startY = height / 2.33 - gridSize / 2;

textSize(min(cellW, cellH) * 0.6);
  
// clamp text size so it never breaks rendering
let reelTextSize = min(cellW, cellH) * 0.6;
textSize(reelTextSize);

for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    let x = startX + c * cellW + cellW / 2;
    let y = startY + r * cellH + cellH / 2;
    text(reels[r][c], x, y);
  }
}

  textSize(30);
  stroke(0);
  fill(255);
  text(resultText, width / 2, height / 2 + height * 0.18);

  // spinning
  if (spinning) {
    spinTime++;

    for (let col = 0; col < 3; col++) {
      if (!reelDone[col]) {

        if (spinTime % 5 === 0) { //spin speed
          for (let row = 0; row < 3; row++) {
            reels[row][col] = getRandomSymbol();
          }
        }

        if (spinTime > 60 + reelStopTime[col]) {
          reelDone[col] = true;
        }
      }
    }

    if (reelDone.every(r => r)) {
      spinning = false;
      reelDone = [false, false, false];
//jackpots
      if (jackpotTriggered) { 
        reels[floor(random(3))][floor(random(3))] = "🌸"; //chance of placing flower
      }

      if (fullGridJackpot) {
        let sym = random(symbols);
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            reels[r][c] = sym;
          }
        }
      }

      checkWin();
    }
  }

  drawButtons();
}

//buttons
function drawButtons() {
  //local variables for button position (resising)
  let btnY = height * 0.9;

  let spinW = width * 0.18;
  let spinH = height * 0.08;

  let smallW = width * 0.08;
  let smallH = height * 0.08;

  let spinX = width * 0.5;
  let plusX = width * 0.68;
  let minusX = width * 0.33;

  textAlign(CENTER, CENTER);

  // Spin
  fill(100, 200, 100, 0);
  noStroke();
  rect(spinX, btnY, spinW, spinH, 20);
  fill(0);
  textSize(spinH * 0.4);
  text("SPIN", spinX, btnY);

  // +
  fill(100, 150, 255, 0);
  noStroke();
  rect(plusX, btnY, smallW, smallH, 20);
  fill(0);
  textSize(smallH * 1);
  text("+", plusX, btnY);

  // -
  fill(255, 100, 100, 0);
  rect(minusX, btnY, smallW, smallH, 20);
  fill(0);
  text("-", minusX, btnY);
}

//pushing buttons
function mousePressed() {
  //local variable for where mouse is pressed
  let btnY = height * 0.9;

  let spinW = width * 0.18;
  let spinH = height * 0.08;

  let smallW = width * 0.08;
  let smallH = height * 0.08;

  let spinX = width * 0.5;
  let plusX = width * 0.68;
  let minusX = width * 0.33;

  // spin
  if (
    mouseX > spinX - spinW / 2 &&
    mouseX < spinX + spinW / 2 &&
    mouseY > btnY - spinH / 2 &&
    mouseY < btnY + spinH / 2
  ) {
    if (!spinning && credits >= bet) {
      spinning = true;
      spinTime = 0;
      resultText = "";

      credits -= bet;
      totalBetAmount += bet;
      sessionBetAmount += bet;

      //chance of jackpot triggering
      jackpotTriggered = random(1) < 0.0000002; // 1 in 5,000,000
      fullGridJackpot = random(1) < 0.00025;     // 1 in 4,000
      
      
      totalSpins++;
    }
  }

  // +
  if (
    mouseX > plusX - smallW / 2 &&
    mouseX < plusX + smallW / 2 &&
    mouseY > btnY - smallH / 2 &&
    mouseY < btnY + smallH / 2
  ) {
    bet += 5;
  }

  // -
  if (
    mouseX > minusX - smallW / 2 &&
    mouseX < minusX + smallW / 2 &&
    mouseY > btnY - smallH / 2 &&
    mouseY < btnY + smallH / 2
  ) {
    bet = max(5, bet - 5);
  }
}

//wins
function checkWin() {
   strokeWeight(2);
    fill(255);
  // 🌸 JACKPOT
  if (jackpotTriggered) {
    let winnings = 50000; //add 50000 credits to toals

    credits += winnings;
    totalWinnings += winnings;
    winCount++; //add wins

    resultText = "🌸 JACKPOT +50,000 🌸"; //result

    //if not triggered do nothing
    jackpotTriggered = false;
    saveStats(winnings);
    return;
  }

  // Full Grid
  if (fullGridJackpot) {
    let winnings = bet * 500; //if won multiply bet by 500
    resultText = "FULL GRID JACKPOT x500";

  credits += winnings;
  totalWinnings += winnings;
  sessionWinnings += winnings;
  winCount++;

  fullGridJackpot = false; //if not won do nothing
  }
  
  let lines = [];

  //look in all directions in all rows coluks and diagonals for same symbols
  for (let r = 0; r < 3; r++) //rows
    lines.push([reels[r][0], reels[r][1], reels[r][2]]);

  for (let c = 0; c < 3; c++) //columns
    lines.push([reels[0][c], reels[1][c], reels[2][c]]);
 
  //diagonals
  lines.push([reels[0][0], reels[1][1], reels[2][2]]);
  lines.push([reels[0][2], reels[1][1], reels[2][0]]);

  let totalMultiplier = 0;
  let winLines = 0;

  for (let [a, b, c] of lines) {
    if (a === b && b === c) { //if same get multiplier and increase total wins
      totalMultiplier += getMultiplier(a);
      winLines++;
    }
  }
//total multipler is the lesser of multiplier and Max multiplier
  totalMultiplier = min(totalMultiplier, MAX_MULTIPLIER);

  let winnings = floor(bet * totalMultiplier); //floor used to round

  //result tedxt tells you amount of lines won
  if (winnings >= 2) {
    resultText = "WIN x" + totalMultiplier;
    if (winLines > 1) resultText += " (" + winLines + " lines)";
    winCount++;
}else {
    resultText = "Try again!"; //if no win display try again
  }

  //add winnings to credits and stats
  credits += winnings;
  totalWinnings += winnings;
  sessionWinnings += winnings;

  saveStats(winnings);

}

//reward based off icon
 function getMultiplier(s) {
  if (s === "🌹") return 300;
  if (s === "🍁") return 100;
  if (s === "💐") return 50;
  if (s === "🦋") return 20;
  if (s === "🌞") return 15;
  if (s === "🌷") return 10;
  if (s === "🍄") return 5;

  // no pay symbols
  if (s === "🍂") return 0;
  if (s === "🪵") return 0;
  if (s === "🪹") return 0;
  if (s === "🪨") return 0;
  if (s === "🪾") return 0;
  return 0;
}
//I acknowledge the use of ChatGPT (https://chat.openai.com/), using GPT-4o, to help with exact maths. I asked ChatGPT to help get my code as close to 90%RTP as well as getting it to repeatedly check the approximate RTP of my code.

//save stats in local storage
function saveStats(winnings) {
  if (winnings > biggestWin) {
    biggestWin = winnings;
    localStorage.setItem("slotBiggestWin", biggestWin);
  }

  localStorage.setItem("slotCredits", credits);
  localStorage.setItem("slotTotalSpins", totalSpins);
  localStorage.setItem("slotTotalWinnings", totalWinnings);
  localStorage.setItem("slotTotalBetAmount", totalBetAmount);
  localStorage.setItem("slotWinCount", winCount);
}

function keyPressed() {

  // full game reset
  if (key === '`') { //if key is pressed reset all stats as well as creidts and bets to deafult
    localStorage.clear();

    credits = 500;
    biggestWin = 0;
    totalSpins = 0;
    totalWinnings = 0;
    totalBetAmount = 0;
    winCount = 0;

    sessionWinnings = 0;
    sessionBetAmount = 0;

    bet = 10;
    resultText = "FULL RESET";
  }
}

function doReset() {
 localStorage.clear();

    credits = 500;
    biggestWin = 0;
    totalSpins = 0;
    totalWinnings = 0;
    totalBetAmount = 0;
    winCount = 0;

    sessionWinnings = 0;
    sessionBetAmount = 0;

    bet = 10;
    resultText = "FULL RESET"
}

//I acknowledge the use of ChatGPT (https://chat.openai.com/), using GPT-4o, to refine my code. I asked ChatGPT to help with the necessary code required to allow boxes to automatically resize with the window size.

