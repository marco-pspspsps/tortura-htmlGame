//Score Global
//Aviso do Muro Assassino
//Rework Red Bull
//Rework Código
//Criar lista TODO
//Revisar código

var c = document.getElementById("minhaObra");
var ctx = c.getContext("2d");

var raioVisao = document.getElementById("playerVision");
var visionDrawer = raioVisao.getContext("2d");

//10 frames/sec

const TILESIZE = 40;
const HALFTILESIZE = 20;
const PLAYERXSTART = 7;
const PLAYERYSTART = 7;
const LIFESTART = 3000;
const GASDURATION = 1000;
const GASLATENCY = 300;
const INITIALLIVES = 5;
const DEATHWALLDURATION = 2000;
const DEATHWALLLATENCY = 400;
const GHOST1XSTART = 12;
const GHOST1YSTART = 12;
const GHOST2XSTART = 12;
const GHOST2YSTART = 3;
const GHOST3XSTART = 2;
const GHOST3YSTART = 12;
const GHOSTDELAY = 105;
const GHOSTFULLSPEED = 70;
const NEARGRADIENTSETTLER = 40;
const FARGRADIENTSETTLER = 250;
const MAPSIZE = 600;
const LASTDITCHSETTLER = 80;
const PAUSEBUTTONLATENCY = 20;
const VISIONTIMEREDUCER = 500;
const GHOSTVELOCITYREDUCER = 100;
const ANIMATIONSIZE = 8;
const ANIMATIONVELOCITY = 4;

var gameTime = 0;

var gameThemeMusic = new Audio("Audio/HorrorPianoTheme.wav");
gameThemeMusic.loop = true;
var gameOverLaugh = new Audio("Audio/LaughEndgameSound.wav");

var gameRunning = true;
var gamePaused = false;

var pauseReception = PAUSEBUTTONLATENCY;

var map = new Image();
map.src = "Images/MAP.png";

var demon = new Image();
demon.src = "Images/Demon.png";

var visionGradient = visionDrawer.createRadialGradient(0, 0, 0, 0, 0, 0);

//RedBull
var gas = new Image();
gas.src = "Images/Gas.png";
var gasSound = new Audio("Audio/RedBullSound.wav");
var gasTileX = 0;
var gasTileY = 0;
var gasTime = 0;
var gasInBoard = false;
var spawnGas = 0;

//Player
var player = new SpriteSheet('Images/NewPlayerBlinking.png', TILESIZE, TILESIZE, ANIMATIONVELOCITY, ANIMATIONSIZE);

var playerMoving = false;
var playerTileX = PLAYERXSTART;
var playerTileY = PLAYERYSTART;
var playerX = PLAYERXSTART * TILESIZE;
var playerY = PLAYERYSTART * TILESIZE;
var playerObjectiveX = playerX;
var playerObjectiveY = playerY;

//VidaJogador
var catLives = INITIALLIVES;
var vidasOutput = document.getElementById("vidas");
var playerLife = LIFESTART;
var lifeOutput = document.getElementById("vida");
var deadScream = new Audio("Audio/DeathScreamSound.wav");
var deadExaust = new Audio("Audio/DeathExaustSound.wav");

//Moedas
var coin = new Image();
coin.src = "Images/Coin.png";
var coinSound = new Audio("Audio/CoinPointSound.wav");
var moedas = 0;
var moedasOutput = document.getElementById("moedas");
var moedaTileX = 0;
var moedaTileY = 0;

//DeathWall
var deathWall = new Image();
deathWall.src = "Images/DeathWall.png";
var deathWallTime = 0;
var dwTileX = 0;
var dwTileY = 0;
var dwInBoard = false;
var spawnDw = 0;
var chewing = new Audio("Audio/ChewSound.wav");

//Ghosts
var ghostsIdle = new SpriteSheet('Images/IdleGhost.png', TILESIZE, TILESIZE, ANIMATIONVELOCITY, ANIMATIONSIZE);

var ghostDead = new Audio("Audio/DeathGhostSound.wav");
var ghostTime = 0;
var ghostMoving = false;
var ghostWalk = 0;

var ghostFocusX = 0;
var ghostFocusY = 0;

var ghost1X = GHOST1XSTART * TILESIZE;
var ghost1Y = GHOST1YSTART * TILESIZE;

var ghost2X = GHOST2XSTART * TILESIZE;
var ghost2Y = GHOST2YSTART * TILESIZE;

var ghost3X = GHOST3XSTART * TILESIZE;
var ghost3Y = GHOST3YSTART * TILESIZE;

var mapCollider = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//Game

window.onload = function(){

	gameThemeMusic.play();
	putMoeda();
	requestAnimationFrame(mainLoop);

}

//GameLoop

function update() {
	
	pauseHandler();
	getInput();
	
	if(gameRunning && !gamePaused){
		
		if(playerMoving) movePlayer();
		handlers();
		gameTime++;
	}

}

function draw() {

	ctx.drawImage(map, 0, 0);
	if(gasInBoard) ctx.drawImage(gas,gasTileX*TILESIZE, gasTileY*TILESIZE);
	ctx.drawImage(coin,moedaTileX*TILESIZE,moedaTileY*TILESIZE);
	
	if(!gamePaused)player.update();
	player.draw(playerX,playerY);
  
	if(dwInBoard) ctx.drawImage(deathWall, dwTileX*TILESIZE,dwTileY*TILESIZE);
  
	if(!gamePaused)ghostsIdle.update();
	ghostsIdle.draw(ghost1X, ghost1Y);
	ghostsIdle.draw(ghost2X, ghost2Y);
	ghostsIdle.draw(ghost3X, ghost3Y);

	if(!gamePaused)setVisionGradient();
	if(gameRunning)ctx.fillRect(0,0,MAPSIZE,MAPSIZE);
  
}

function mainLoop() {

	draw();
	update();
	requestAnimationFrame(mainLoop);
	
}

function handlers(){
	
	gasHandler();
	dwHandler();
	ghostHandler();
	drainerHandler();
		
}

function togglePause(){
	
	if(gamePaused) {
		gameThemeMusic.play();
		gamePaused = false;
	}
	else {
		gamePaused = true;
		gameThemeMusic.pause();
	}
	
}

function pauseHandler(){
	
	pauseReception++;
	
}

//PlayerMovement

function setVisionGradient(){
	
	var calcEscuridao = FARGRADIENTSETTLER - (gameTime/VISIONTIMEREDUCER);
	if(calcEscuridao < LASTDITCHSETTLER) calcEscuridao = LASTDITCHSETTLER;
	visionGradient = visionDrawer.createRadialGradient(playerX+HALFTILESIZE, playerY+HALFTILESIZE, NEARGRADIENTSETTLER, playerX+HALFTILESIZE, playerY+HALFTILESIZE, calcEscuridao);
	visionGradient.addColorStop(0, 'rgba(0,0,0,0)');
	visionGradient.addColorStop(1, 'rgba(0,0,0,1)');
	ctx.fillStyle = visionGradient;
	
}

function setCurrentTile() {

  playerTileX = playerX / TILESIZE;
  playerTileY = playerY / TILESIZE;

}

function fixTile() {

  playerX = playerTileX * TILESIZE;
  playerY = playerTileY * TILESIZE;

}

function setMPlayerLeft(){
	
	playerMoving = true;
	playerObjectiveX = (playerTileX * TILESIZE) - TILESIZE;
	playerObjectiveY = (playerTileY * TILESIZE);
	
}

function setMPlayerUp(){
	
	playerMoving = true;
	playerObjectiveX = (playerTileX * TILESIZE);
	playerObjectiveY = (playerTileY * TILESIZE) - TILESIZE;

}

function setMPlayerRight(){
	
	playerMoving = true;
	playerObjectiveX = (playerTileX * TILESIZE) + TILESIZE;
	playerObjectiveY = (playerTileY * TILESIZE);
	
}

function setMPlayerDown(){
	
	playerMoving = true;
	playerObjectiveX = (playerTileX * TILESIZE);
	playerObjectiveY = (playerTileY * TILESIZE) + TILESIZE;

}

function stopMoving(){
	
	setCurrentTile();
    fixTile();
	playerMoving = false;
	checkGasCatch();
	checkMoeda();
	checkDW();
}

function movePlayer(){
	
	if(playerX < playerObjectiveX) playerX++;
	if(playerX > playerObjectiveX) playerX--;
	if(playerY < playerObjectiveY) playerY++;
	if(playerY > playerObjectiveY) playerY--;
	
	if((playerX == playerObjectiveX) && (playerY == playerObjectiveY)) stopMoving();
	
}

//PlayerLife

function checkDead(){
	
	catLives--;
	vidasOutput.innerText = catLives;
	

	if(catLives >= 1) respawn();
	else gameOver();
	
}

function respawn(){
	
	gameTime = 0;
	
	playerTileX = PLAYERXSTART;
	playerTileY = PLAYERYSTART;
	
	playerObjectiveX = (playerTileX * TILESIZE);
	playerObjectiveY = (playerTileY * TILESIZE);
	
	playerLife = LIFESTART;
	
	fixTile();
	
}

function drainerHandler() {
	
	playerLife--;
    lifeOutput.value = playerLife;
	
	if(playerLife <= 0) {
		
		deadExaust.play();
		checkDead();
	}
	
}

function gameOver(){
	
	player.src = "Images/NewPlayerDead.png";
	map.src = "Images/MAPEnd.png";
	gameThemeMusic.pause();
	gameOverLaugh.play();
	gameRunning = false;
	
}

//Gas

function putGas(){
	
	gasTileX = 0;
	gasTileY = 0;
	
	var naoPodePor = false;
	
	do{
		
		naoPodePor = false;
		
		gasTileX = getRandomIntInclusive(0, MAPSIZE/TILESIZE - 1);
		gasTileY = getRandomIntInclusive(0, MAPSIZE/TILESIZE - 1);
		
		if (mapCollider[gasTileY][gasTileX] == 1 ) naoPodePor = true; //vê se é caminhavel
		else if (((gasTileY == moedaTileY )&&(gasTileX == moedaTileX))) naoPodePor  = true; //vê se não tem moeda
		else if (((gasTileY == dwTileY )&&(gasTileX == dwTileX))) naoPodePor  = true; //vê se não tem deathWall
		else if (((gasTileY == playerTileY )&&(gasTileX == playerTileX)))naoPodePor  = true; //vê se não tem player
		else if (((gasTileY == PLAYERYSTART )&&(gasTileX == PLAYERXSTART)))naoPodePor  = true; //vê se não é spawn
		else if ((gasTileX >= playerTileX+7) || (gasTileX <= playerTileX-7)) naoPodePor  = true; //vê raio player x
		else if ((gasTileY >= playerTileY+7) || (gasTileY <= playerTileY-7)) naoPodePor  = true; //vê raio player y
		
	}while(naoPodePor);

}

function checkGasCatch(){
	
	if(playerTileX == gasTileX && playerTileY == gasTileY){
		
		gasSound.play();
		gasTime = 0;
		gasInBoard = false;
			
		gasTileX = 0;
		gasTileY = 0;
			
		playerLife = LIFESTART;
	}
	
}

function gasHandler(){
	
	if(gasInBoard){
		
		if(gasTime >= GASDURATION) {
			
			gasTime = 0;
			gasInBoard = false;
			
			gasTileX = 0;
			gasTileY = 0;
			
		}
		else gasTime++;
		
	}
	else{
		
		if(spawnGas >= GASLATENCY){
			
			putGas();
			gasInBoard = true;
			spawnGas = 0;
			
		}
		else spawnGas++;
		
	}
}

//Moeda

function putMoeda(){
	
	moedaTileX = 0;
	moedaTileY = 0;
	
	var naoPodePor = false;
	
	do{
		
		naoPodePor = false;
		
		moedaTileX = getRandomIntInclusive(0, MAPSIZE/TILESIZE - 1);
		moedaTileY = getRandomIntInclusive(0, MAPSIZE/TILESIZE - 1);
		
		if (mapCollider[moedaTileY][moedaTileX] == 1 ) naoPodePor = true; //vê se é caminhavel
		else if (((dwTileY == moedaTileY )&&(dwTileX == moedaTileX))) naoPodePor  = true; //vê se não tem deathwall
		else if (((moedaTileY == playerTileY )&&(moedaTileX == playerTileX)))naoPodePor  = true; //vê se não tem player
		else if (((moedaTileY == PLAYERYSTART )&&(moedaTileX == PLAYERXSTART)))naoPodePor  = true; //vê se não é spawn
		
	}while(naoPodePor);
	
}

function checkMoeda(){
	
	if(playerTileX == moedaTileX && playerTileY == moedaTileY){
		
		moedaTileX = 0;
		moedaTileY = 0;
		addCoins();
		putMoeda();
		
	}
}

function addCoins(){

  moedas++;
  moedasOutput.innerText = moedas;
  coinSound.play();

}

//DeathWall

function putDeathWall(){
	
	dwTileX = 0;
	dwTileY = 0;
	
	var naoPodePor = false;
	
	do{
		
		naoPodePor = false;
		
		dwTileX = getRandomIntInclusive(0, MAPSIZE/TILESIZE - 1);
		dwTileY = getRandomIntInclusive(0, MAPSIZE/TILESIZE - 1);
		
		if (mapCollider[dwTileY][dwTileX] == 1 ) naoPodePor = true; //vê se é caminhavel
		else if (((dwTileY == moedaTileY )&&(dwTileX == moedaTileX))) naoPodePor  = true; //vê se não tem moeda
		else if (((dwTileY == playerTileY )&&(dwTileX == playerTileX)))naoPodePor  = true; //vê se não tem player
		else if (((dwTileY == PLAYERYSTART )&&(dwTileX == PLAYERXSTART)))naoPodePor  = true; //vê se não é spawn
		else if ((dwTileX >= playerTileX+2) || (dwTileX <= playerTileX-2)) naoPodePor  = true; //vê raio player x
		else if ((dwTileY >= playerTileY+2) || (dwTileY <= playerTileY-2)) naoPodePor  = true; //vê raio player y
		
	}while(naoPodePor);
	
	
}

function checkDW(){
	
	if(playerTileX == dwTileX && playerTileY == dwTileY){
		
		checkDead();
		deadScream.play();
		chewing.play();
		
	}
	
}

function dwHandler(){
	
	if(dwInBoard){
		
		if(deathWallTime >= DEATHWALLDURATION) {
			
			deathWallTime = 0;
			dwInBoard = false;
			
			dwTileX = 0;
			dwTileY = 0;
			
		}
		else deathWallTime++;
		
	}
	else{
		
		if(spawnDw >= DEATHWALLLATENCY){
			
			putDeathWall();
			dwInBoard = true;
			spawnDw = 0;
			
		}
		else spawnDw++;
		
	}
}

//Ghosts

function ghostHandler(){
	
	var ghostReducer = GHOSTDELAY - (gameTime/GHOSTVELOCITYREDUCER);
	if(ghostReducer < GHOSTFULLSPEED) ghostReducer = GHOSTFULLSPEED;
	
	if(ghostMoving){
		
		moveGhosts();
		
	}
	else{
		
		if(ghostTime > ghostReducer) startChaseGhosts();
		
		ghostTime++;
	}
	
	checkGhostsCollision();
	
}

function startChaseGhosts(){
	
	ghostFocusX = playerObjectiveX;
	ghostFocusY = playerObjectiveY;
	
	ghostWalk = 0;
	ghostMoving = true;
	ghostTime = 0;
	
}

function moveGhosts(){
	
	//Ghost1
	
	if(ghost1X < ghostFocusX) ghost1X++;
	else if(ghost1X > ghostFocusX) ghost1X--;
	else if(ghost1Y < ghostFocusY) ghost1Y++;
	else if(ghost1Y > ghostFocusY) ghost1Y--;
	
	//Ghost2
	
	if(ghost2Y < ghostFocusY) ghost2Y++;
	else if(ghost2Y > ghostFocusY) ghost2Y--;
	else if(ghost2X < ghostFocusX) ghost2X++;
	else if(ghost2X > ghostFocusX) ghost2X--;
	
	//Ghost3
	
	if(ghost3Y < ghostFocusY) ghost3Y++;
	else if(ghost3Y > ghostFocusY) ghost3Y--;
	
	if(ghost3X < ghostFocusX) ghost3X++;
	else if(ghost3X > ghostFocusX) ghost3X--;
	
	ghostWalk++;
	
	if(ghostWalk == TILESIZE){
		
		ghostWalk = 0;
		ghostMoving = false;
		
		correctGhostsPosition();
		
	}
	
}

function correctGhostsPosition(){
	
	ghost1X = ghost1X - (ghost1X%TILESIZE);
	ghost1Y = ghost1Y - (ghost1Y%TILESIZE);
	ghost2X = ghost2X - (ghost2X%TILESIZE);
	ghost2Y = ghost2Y - (ghost2Y%TILESIZE);
	ghost3X = ghost3X - (ghost3X%TILESIZE);
	ghost3Y = ghost3Y - (ghost3Y%TILESIZE);
	
}

function deadByGhosts(){
	
	ghostDead.play();
	deadScream.play();
	
	checkDead();
	
}

function checkGhostsCollision(){
	
	if(playerX < ghost1X+TILESIZE && playerX+TILESIZE > ghost1X && playerY < ghost1Y+TILESIZE && playerY+TILESIZE > ghost1Y){ 
		deadByGhosts();
		ghost1ReturnToOrigin();
		securePlayerSpawn();
	}
	if(playerX < ghost2X+TILESIZE && playerX+TILESIZE > ghost2X && playerY < ghost2Y+TILESIZE && playerY+TILESIZE > ghost2Y){
		deadByGhosts();
		ghost2ReturnToOrigin();
		securePlayerSpawn();
	}
	if(playerX < ghost3X+TILESIZE && playerX+TILESIZE > ghost3X && playerY < ghost3Y+TILESIZE && playerY+TILESIZE > ghost3Y){
		deadByGhosts();
		ghost3ReturnToOrigin();
		securePlayerSpawn();
	}
}

function ghost1ReturnToOrigin(){
	
	ghost1X = GHOST1XSTART*TILESIZE;
	ghost1Y = GHOST1YSTART*TILESIZE;
	
}

function ghost2ReturnToOrigin(){
	
	ghost2X = GHOST2XSTART*TILESIZE;
	ghost2Y = GHOST2YSTART*TILESIZE;
	
}

function ghost3ReturnToOrigin(){
	
	ghost3X = GHOST3XSTART*TILESIZE;
	ghost3Y = GHOST3YSTART*TILESIZE;
	
}

function securePlayerSpawn(){
	
	if(ghost1X == PLAYERXSTART*TILESIZE && ghost1Y == PLAYERYSTART*TILESIZE) ghost1ReturnToOrigin();
	if(ghost2X == PLAYERXSTART*TILESIZE && ghost2Y == PLAYERYSTART*TILESIZE) ghost2ReturnToOrigin();
	if(ghost3X == PLAYERXSTART*TILESIZE && ghost3Y == PLAYERYSTART*TILESIZE) ghost3ReturnToOrigin();
	
}

//Internals

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function module(number){
	
	if(number >= 0) return number;
	else return number*-1;
	
}

function SpriteSheet(path, frameWidth, frameHeight, frameSpeed, endFrame) {
 
   var image = new Image();
   var framesPerRow;
 
   // calculate the number of frames in a row after the image loads
   var self = this;
   image.onload = function() {
      framesPerRow = Math.floor(image.width / frameWidth);
   };
 
   image.src = path;
   
   var currentFrame = 0;  // the current frame to draw
   var counter = 0;       // keep track of frame rate
 
   // Update the animation
   this.update = function() {
 
     // update to the next frame if it is time
     if (counter == (frameSpeed - 1))
        currentFrame = (currentFrame + 1) % endFrame;
 
     // update the counter
     counter = (counter + 1) % frameSpeed;
     };
	 
   this.draw = function(x, y) {
       // get the row and col of the frame
       var row = Math.floor(currentFrame / framesPerRow);
       var col = Math.floor(currentFrame % framesPerRow);
 
       ctx.drawImage(image,col * frameWidth, row * frameHeight,frameWidth, frameHeight, x, y,frameWidth, frameHeight);
  };
   
}

function getInput() {

	window.onkeydown = function() {
		
	event.preventDefault();

    var key = event.keyCode;

	switch (key) {
      case 37: // Left
		if(!playerMoving){if(mapCollider[playerTileY][playerTileX - 1] == 0) setMPlayerLeft();}
        break;

      case 38: // Up
		if(!playerMoving){if(mapCollider[playerTileY - 1][playerTileX] == 0) setMPlayerUp();}
        break;

      case 39: // Right
		if(!playerMoving){if(mapCollider[playerTileY][playerTileX + 1] == 0) setMPlayerRight();}
        break;

      case 40: // Down
        if(!playerMoving){if(mapCollider[playerTileY + 1][playerTileX] == 0) setMPlayerDown();}
        break;
		
	  case 80: // P for Pause
		if(pauseReception >= PAUSEBUTTONLATENCY){ 
			pauseReception = 0;
			togglePause(); 
		}
		break;
    }

  }
 
  //Same as touchEvent
  window.onmousedown  = function() {
		
	event.preventDefault();

    var x = event.clientX;
	var y = event.clientY;
	
	var xRelativeToPlayer = x - (playerX + HALFTILESIZE);
	var yRelativeToPlayer = y - (playerY + HALFTILESIZE);
	
	if(xRelativeToPlayer >= 0){
		
		if(yRelativeToPlayer >= 0){
			
			if(module(yRelativeToPlayer) >= module(xRelativeToPlayer)){
				
				if(!playerMoving){if(mapCollider[playerTileY + 1][playerTileX] == 0) setMPlayerDown();}
				
			}
			else{
				
				if(!playerMoving){if(mapCollider[playerTileY][playerTileX + 1] == 0) setMPlayerRight();}
				
			}
			
		}
		else{
			
			if(module(yRelativeToPlayer) >= module(xRelativeToPlayer)){
				
				if(!playerMoving){if(mapCollider[playerTileY - 1][playerTileX] == 0) setMPlayerUp();}
				
			}
			else{
				
				if(!playerMoving){if(mapCollider[playerTileY][playerTileX + 1] == 0) setMPlayerRight();}
				
			}
			
		}
		
	}
		
	else{
		
		if(yRelativeToPlayer >= 0){
			
			if(module(yRelativeToPlayer) >= module(xRelativeToPlayer)){
				
				if(!playerMoving){if(mapCollider[playerTileY + 1][playerTileX] == 0) setMPlayerDown();}
				
			}
			else{
				
				if(!playerMoving){if(mapCollider[playerTileY][playerTileX - 1] == 0) setMPlayerLeft();}
				
			}
			
		}
		else{
			
			if(module(yRelativeToPlayer) >= module(xRelativeToPlayer)){
				
				if(!playerMoving){if(mapCollider[playerTileY - 1][playerTileX] == 0) setMPlayerUp();}
				
			}
			else{
				
				if(!playerMoving){if(mapCollider[playerTileY][playerTileX - 1] == 0) setMPlayerLeft();}
				
			}
			
		}
		
	}


  }

  //Same as mouseEvent
  window.ontouchstart  = function() {
		
	event.preventDefault();

    var x = event.clientX;
	var y = event.clientY;
	
	var xRelativeToPlayer = x - (playerX + HALFTILESIZE);
	var yRelativeToPlayer = y - (playerY + HALFTILESIZE);
	
	if(xRelativeToPlayer >= 0){
		
		if(yRelativeToPlayer >= 0){
			
			if(module(yRelativeToPlayer) >= module(xRelativeToPlayer)){
				
				if(!playerMoving){if(mapCollider[playerTileY + 1][playerTileX] == 0) setMPlayerDown();}
				
			}
			else{
				
				if(!playerMoving){if(mapCollider[playerTileY][playerTileX + 1] == 0) setMPlayerRight();}
				
			}
			
		}
		else{
			
			if(module(yRelativeToPlayer) >= module(xRelativeToPlayer)){
				
				if(!playerMoving){if(mapCollider[playerTileY - 1][playerTileX] == 0) setMPlayerUp();}
				
			}
			else{
				
				if(!playerMoving){if(mapCollider[playerTileY][playerTileX + 1] == 0) setMPlayerRight();}
				
			}
			
		}
		
	}
		
	else{
		
		if(yRelativeToPlayer >= 0){
			
			if(module(yRelativeToPlayer) >= module(xRelativeToPlayer)){
				
				if(!playerMoving){if(mapCollider[playerTileY + 1][playerTileX] == 0) setMPlayerDown();}
				
			}
			else{
				
				if(!playerMoving){if(mapCollider[playerTileY][playerTileX - 1] == 0) setMPlayerLeft();}
				
			}
			
		}
		else{
			
			if(module(yRelativeToPlayer) >= module(xRelativeToPlayer)){
				
				if(!playerMoving){if(mapCollider[playerTileY - 1][playerTileX] == 0) setMPlayerUp();}
				
			}
			else{
				
				if(!playerMoving){if(mapCollider[playerTileY][playerTileX - 1] == 0) setMPlayerLeft();}
				
			}
			
		}
		
	}


  }
  
}