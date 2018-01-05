console.log('canvas linked');

// const database = firebase.database();

// window.onload = start();
const scorch = (() => {

	//general properties
	const playerDisplay = document.getElementById('turn');
	const powerDisplay = document.getElementById('power');
	const angleDisplay = document.getElementById('angle');
	const infoContainer = document.getElementsByClassName('info-container')[0];
	const modalPop = document.getElementsByClassName('modal')[0];
	const winnerDisp = document.getElementById('modal-inner');
	let requestId = undefined;

	//buttons
	const buttonContainer = document.getElementById('button-container');
	const twoButton = document.getElementById('2players');
	const threeButton = document.getElementById('3players');
	const fourButton = document.getElementById('4players');
	buttonContainer.style.display = 'block';

	//canvas
	const canvas = document.getElementById('game-board');
	const ctx = canvas.getContext('2d');
	const logo = new Image();

	//canvas background separate from the other one for collision purposes
	const canvasBackground = document.getElementById('background');
	const context = canvasBackground.getContext('2d');


	//the almighty game object containing all the methods and properties that propel the game forward
	const game = {

		allPlayers: [],

		players: 0,

		tankColors: ['royalblue', 'crimson', 'lawngreen', 'gold'],

		grav: 9.8,

		initialTerrain: null,

		withTanks: null,

		titleLoopFrame: 0,

		//gotta have it ya know
		bindEvents() {
			twoButton.addEventListener('click', ()=> {
				game.players = 2;
				game.placeTank(2);
				game.toggleButtons();
			});
			threeButton.addEventListener('click', ()=> {
				game.players = 3;
				game.placeTank(3);
				game.toggleButtons();
			});
			fourButton.addEventListener('click', ()=> {
				game.players = 4;
				game.placeTank(4);
				game.toggleButtons();
			});
		},

		//runs only on page load, makes a cool animation to introduce players to the game
		titleAnimation(step) {
			ctx.putImageData(game.initialTerrain, 0, 0);
			let grow = step / 100;
			ctx.drawImage(logo, 200, 180, logo.width * grow, logo.height * grow);
			logo.src = 'img/scorchlogo.png';
		},

		//responsible for looping to create the title animation and adding the additional text at the end
		titleLoop() {
			let step = game.titleLoopFrame;
			game.titleAnimation(step);
			game.titleLoopFrame++;
			if (step < 76) {
				window.requestAnimationFrame(game.titleLoop);
			}
			else {
				ctx.font = '32px Courier New';
				ctx.fillStyle = 'white';
				ctx.fillText('A Scorched Earth clone', 210, 420);
				ctx.font = '24px Courier New';
				ctx.fillText('Select the number of players below to begin', 210, 450);
			}
		},

		//keeps players from drawing more and more and more tankss
		toggleButtons() {
			if (buttonContainer.style.display == 'block') {
				buttonContainer.style.display = 'none';
			}
			else {
				buttonContainer.style.display = 'block';
			}
			
		},

		//coole background generation gradient thing to create a neato bg on a secondary canvas without interfering with the game canvas
		bgGradient() {
			let gradientHeight = canvasBackground.height / 10;
			for (let i = 0; i < 11; i++) {
				context.fillStyle = 'rgba(85, 15, 155,'+(i/10)+')';
				context.fillRect(0, canvasBackground.height - (gradientHeight * i), canvasBackground.width, gradientHeight);
			}
		},

		//randomly generates a foreground upon which the tanks shall be laid
		drawTerrain() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			//aligns the drawn lines so they're nice and crisp
			let iStrokeWidth = 1;
			let iTranslate = (iStrokeWidth % 2) / 2;
			ctx.translate(iTranslate, iTranslate);

			//set attributes for drawing the terrain
			let slopeChange = 1;
			let maxSlope = 3.5;
			let slope = (Math.random() * slopeChange) - slopeChange;
			let maxHeight = canvas.height;
			let height = 300;
			let valley = 400;
			let peak = 250;


			//loops across the width of the canvas, changing the height values to draw lines of different height from the base to create theterrain one line at a time
			for (let i = 0; i < canvas.width; i++) {
				height += slope;
				slopeToAdd = (Math.random() * slopeChange) * 2 - slopeChange;
				slope += slopeToAdd;
				// console.log('slopetoadd: '+ slopeToAdd);
				if (slope > maxSlope  || slope < -maxSlope) {
					slope = (Math.random() * slopeChange) * 2 - slopeChange;
				}
				if (height > valley) {
					slope *= -1;
					height -= 2;
					// console.log('first');
				}
				else if (height < peak) {
					slope *= -1;
					slope += 2;
					// console.log('second');
				}
				// console.log(slope);


				ctx.beginPath();
				ctx.moveTo(i, maxHeight);
				ctx.lineTo(i, height);
				ctx.strokeStyle = 'black';
				ctx.stroke();
			}

			game.initialTerrain = ctx.getImageData(0, 0, canvas.width, canvas.height);
		},

		//updates the divs outside the canvas with information about current tank properties (angle, power, which player, etc)
		updateDisplay() {
			if (game.allPlayers.length <= 0) {
				return;
			}
			let whoseTurn;
			let playerNumber;
			for (let i = 0; i < game.allPlayers.length; i++) {
				if (game.allPlayers[i].isTurn) {
					whoseTurn = game.allPlayers[i];
					playerNumber = whoseTurn.num;
				}
			}
			playerDisplay.innerHTML = 'It is player '+playerNumber+'\'s turn.';
			infoContainer.style['background-color'] = whoseTurn.color;
			powerDisplay.innerHTML = 'Current power: '+whoseTurn.power+'.';
			angleDisplay.innerHTML = 'Current angle: '+whoseTurn.angle+'.';
		},

		//changed to requestanimationframe, from setinterval, and it runs wayyy smoother
		frameLoop() {
			game.updateDisplay();
			requestId = window.requestAnimationFrame(game.frameLoop);
		},

		//ends the loop that continuously checks and updates the informational display and clears all those html values
		endLoop() {
			window.cancelAnimationFrame(requestId);
			requestId = undefined;
			playerDisplay.innerHTML = '';
			powerDisplay.innerHTML = '';
			angleDisplay.innerHTML = '';
			infoContainer.style['background-color'] = 'white';
		},

		//sets a clean version of the generated terrain and produces the necessary properties to create a functional tank object, then calls the draw tank and frameloop functions to place the tank and start checking their properties to update the info display
		placeTank(num) {
			ctx.putImageData(game.initialTerrain, 0, 0);
			for (let i = 0; i < num; i++) {
				let randColor = Math.floor(Math.random() * game.tankColors.length);
				let color = game.tankColors[randColor]
				game.tankColors.splice(randColor, 1);
				let x = game.placeTankX(i+1);
				let y = game.placeTankY(x);
				let playerNumber = i + 1;
				// console.log(game.tankColors[color])
				game.allPlayers[i] = new Tank(x, y, color, playerNumber);
				if (i == 0) {
					game.allPlayers[0].isTurn = true;
				}
			}
			game.frameLoop();
			game.drawTanks();
			console.log(game.allPlayers);
		},

		placeTankX(playerNumber) {

			let terrWidth = canvas.width / game.players;
			let rightBorder = playerNumber * terrWidth;

			let leftBorder = rightBorder - (rightBorder / game.players);

			return Math.floor(Math.random()*(rightBorder - leftBorder + 1) + leftBorder);
		},

		placeTankY(xpos) {
			for (let i = 0; i < canvas.height; i++) {
				let checkCollision = ctx.getImageData(xpos, i, 1, 1).data;
				for (let j = 0; j < checkCollision.length; j++) {
					if (checkCollision[j] > 0) {
						return i;
					}
				}
			}
		},

		//calls the methods of the tank object that draw it, then saves that canvas for clearing projectile lines later
		drawTanks() {
			ctx.putImageData(game.initialTerrain, 0, 0);
			for (let i = 0; i < game.allPlayers.length; i++) {
				game.allPlayers[i].drawBody();
				game.allPlayers[i].drawCannon();
			}
			game.withTanks = ctx.getImageData(0, 0, canvas.width, canvas.height);
			setTimeout(()=>{
				game.checkVictory();

			}, 1000);
		},

		//draws the projectile trajectory and checks whether or not it hits anything
		checkHit(x, y, power, angle, color) {

			//get the initial vertical and horizontal velocity
			let vx = power * Math.cos(angle);
			let vy = power * Math.sin(angle);

			//establish time constant
			let time = 0;
			let stepSize = 0.02;

			//begin drawing the line
			ctx.beginPath();
			ctx.moveTo(x,y);

			//declare a variable to store the bitmap data that we will use to determine which tank we hit
			let whichTank;

			//declare boolean to escape loop
			let noHit = true;
			// let checkCollision;

			//a loop that progresses the time constant and checks the x & y coordinates each time, drawing the line progressively and checking for collision each step of the way
			while (noHit) {
				time += stepSize;
				let deltaX = vx	* time / 2;
				let deltaY = vy * time - (game.grav * time * time) / 2;

				let adjustX = x - deltaX;
				let adjustY = y - deltaY;
				let checkCollision = ctx.getImageData(adjustX, adjustY, 1, 1).data;
				for (let j = 0 ; j < checkCollision.length; j++) {
					if (time > 0.6 && checkCollision[j] > 0) {
						noHit = false;
					}
				}
				if (time > 0.6 && checkCollision[0] > 0) {
					whichTank = checkCollision[1];
					game.playerHit(whichTank);
				}
				if (time > 50 && noHit) {
					noHit = false;
				}
				ctx.lineTo(adjustX, adjustY);

				// console.log(adjustX, adjustY);
			}
			ctx.strokeStyle = color;
			ctx.stroke();
			// console.log(checkCollision);
		},

		//checks the rgba bitarray values and selects the correct color name by which to identify which tank object has been hit
		playerHit(colordata) {
			let colorString = '';
			if (colordata > 95 && colordata < 110) {
				colorString = 'royalblue';
			}
			else if (colordata > 210 && colordata < 220) {
				colorString = 'gold';
			}
			else if (colordata >= 245 && colordata <= 255) {
				colorString = 'lawngreen';
			}
			else if (colordata < 30 && colordata > 0) {
				colorString = 'crimson';
			}

			for (let i = 0; i < game.allPlayers.length; i++) {
				if (colorString == game.allPlayers[i].color) {
					game.allPlayers.splice(i, 1);
				}
			}
			setTimeout(()=>{
				game.drawTanks();

			}, 2000);

		},

		//checks the length of the allplayers array in the game object, if there is only 1 left then we have our victor
		checkVictory() {
			if (game.allPlayers.length == 1) {
				game.toggleModal();
			}
			else {
				return;
			}
		},

		//displays or removes the victory screen modal
		toggleModal() {
			// console.log(modalPop.style.display);
			if (modalPop.style.display == 'block') {
				winnerDisp.innerText = '';
				winnerDisp.style['background-color'] = 'transparent';
				modalPop.style.display = 'none';
			}
			else {
				winnerDisp.innerHTML = 'Player '+game.allPlayers[0].num+' wins!</br>click anywhere to start again.';
				winnerDisp.style['background-color'] = game.allPlayers[0].color;
				modalPop.style.display = 'block';
			}
		},

		//sets all the properties back to where they need to be to run a new round
		reset() {
			ctx.putImageData(game.initialTerrain, 0, 0);
			game.endLoop();
			game.allPlayers = [];
			game.players = 0;
			game.tankColors = ['royalblue', 'crimson', 'lawngreen', 'gold'];
			game.withTanks = null;

			game.toggleButtons();
			game.toggleModal();
			game.drawTerrain();
		}
	}


	//tank class to build tanks for players to control 
	class Tank {
		constructor(xpos, ypos, color, num, power, angle, isTurn, bodyData, cannonData) {
			this.xpos = xpos;
			this.ypos = ypos;
			this.color = color;
			this.num = num;
			this.power = 100; //midpoint of constraints
			this.angle = 89; //degreess
			this.isTurn = false;
			this.bodyData = null;
			this.cannonData = null;
		}
		drawBody() {
			ctx.beginPath();
			ctx.arc(this.xpos, this.ypos, 10, Math.PI , 0, false);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
			this.bodyData = ctx.getImageData(this.xpos - 15, this.ypos - 15, 30, 30);
			// console.log(this.bodyData);
		}
		drawCannon() {
			ctx.putImageData(this.bodyData, this.xpos - 15, this.ypos - 15);

			let toRadians = (this.angle - 90) * (Math.PI / 180);
			ctx.beginPath();
			ctx.translate(this.xpos, this.ypos);
			ctx.moveTo(-2, -2);
			ctx.rotate(toRadians);
			ctx.lineTo(-1, -14);
			ctx.rotate(-toRadians);
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.translate(-this.xpos, -this.ypos);
			ctx.closePath();

			this.cannonData = ctx.getImageData(this.xpos - 15, this.ypos - 15, 30, 30);


		}
		angleCannon(direction) {
			if (direction == 'left' && this.angle > 10) {
				this.angle -= 1;
				if (this.angle == 90) {
					this.angle = 89;
				}
			}
			else if (direction == 'right' && this.angle < 170) {
				this.angle += 1;
				if (this.angle == 90) {
					this.angle = 91;
				}
			}
			if (this.angle % 3 == 0) {
				this.drawCannon();	
				// console.log(this.angle);
			}
			
			//fix draw function to update this binch
			// console.log('angling...');
		}
		powerCannon(direction) {
			if (direction == 'down' && this.power > 50) {
				this.power -= 1;
			}
			else if (direction == 'up' && this.power < 150) {
				this.power += 1;
			}

			// console.log('powering...');
		}
		fireCannon() {
			ctx.putImageData(game.withTanks, 0, 0);
			for (let i = 0; i < game.allPlayers.length; i++) {
				ctx.putImageData(game.allPlayers[i].cannonData, game.allPlayers[i].xpos - 15, game.allPlayers[i].ypos - 15);
			}
			// ctx.putImageData(this.cannonData, this.xpos - 20, this.ypos - 20);
			let x = this.xpos;
			let y = this.ypos;
			let vi = this.power;
			let toRadians =  this.angle * Math.PI / 180;
			let color = this.color;

			game.checkHit(x, y, vi, toRadians, color);

			// console.log('kaboom');
		}
	}

	//big ol event listener that listens for a click anywhere, but will only run the reset method of the game object if the modal is visibletermi
	document.addEventListener('click', function(event){
		if (modalPop.style.display == 'block') {
			game.reset();
		}
	});

	//keyboard input listener for tank controls
	document.addEventListener('keydown', function(event){
		let key = event.which;
		let whoseTurn;
		let nextTurn;
		for (let i = 0; i < game.allPlayers.length; i++) {
			if (game.allPlayers[i].isTurn) {
				whoseTurn = game.allPlayers[i];
				nextTurn = i+1;
			}
		}
		// console.log(whoseTurn);
		// console.log(nextTurn);

		if (key === 39) {
			whoseTurn.angleCannon('right');
		}
		else if (key === 37) {
			whoseTurn.angleCannon('left');
		}
		else if (key === 38) {
			whoseTurn.powerCannon('up');
		}
		else if (key === 40) {
			whoseTurn.powerCannon('down');
		}
		else if (key === 32) {
			whoseTurn.fireCannon();
			whoseTurn.isTurn = false;
			if (game.allPlayers[nextTurn] !== undefined) {
				game.allPlayers[nextTurn].isTurn = true;
			}
			else {
				game.allPlayers[0].isTurn = true;
			}
			console.log(game.allPlayers);
		}
	});

	game.bgGradient();
	game.drawTerrain();
	game.bindEvents();
	// game.titleLoop();

});

scorch();









