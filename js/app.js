console.log('canvas linked');

// window.onload = start();
const scorch = () => {

	//general properties
	const playerDisplay = document.getElementById('turn');
	const powerDisplay = document.getElementById('power');
	const angleDisplay = document.getElementById('angle');

	//buttons
	const twoButton = document.getElementById('2players');
	const threeButton = document.getElementById('3players');
	const fourButton = document.getElementById('4players');

	//canvas
	const canvas = document.getElementById('game-board');
	const ctx = canvas.getContext('2d');

	//canvas background separate from the other one for collision purposes
	const canvasBackground = document.getElementById('background');
	const context = canvasBackground.getContext('2d');


	//the almighty game object containing all the methods and properties that propel the game forward, into oblivion
	const game = {

		allPlayers: [],

		players: 0,

		tankColors: ['royalblue', 'red', 'lawngreen', 'gold'],

		grav: 9.8,

		initialTerrain: null,

		withTanks: null,

		//gotta have it ya know
		bindEvents() {
			twoButton.addEventListener('click', ()=> {
				game.players = 2;
				game.placeTank(2);
				game.hideButtons();
			});
			threeButton.addEventListener('click', ()=> {
				game.players = 3;
				game.placeTank(3);
				game.hideButtons();
			});
			fourButton.addEventListener('click', ()=> {
				game.players = 4;
				game.placeTank(4);
				game.hideButtons();
			});
		},

		//keeps players from drawing more and more and more tankss
		hideButtons() {
			let allButtons = document.getElementsByTagName('button');
			for (let i in allButtons) {
				allButtons[i].style.display = 'none';
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
				ctx.stroke();
				// ctx.strokeStyle = 'lightseagreen';
			}

			game.initialTerrain = ctx.getImageData(0, 0, canvas.width, canvas.height);
		},

		//updates the divs outside the canvas with information about current tank properties (angle, power, which player, etc)
		updateDisplay() {
			let whoseTurn;
			let playerNumber;
			for (let i = 0; i < game.allPlayers.length; i++) {
				if (game.allPlayers[i].isTurn) {
					whoseTurn = game.allPlayers[i];
					arrPos = whoseTurn.num;
				}
			}
			playerDisplay.innerHTML = 'It is player '+arrPos+'\'s turn.';
			powerDisplay.innerHTML = 'Current power: '+whoseTurn.power+'.';
			angleDisplay.innerHTML = 'Current angle: '+whoseTurn.angle+'.';
		},

		// gonna change this to requestAnimationFrame
		frameLoop() {
			game.updateDisplay();
			window.requestAnimationFrame(game.frameLoop);
		},

		placeTank(num) {
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
				ctx.lineTo(adjustX, adjustY);

				// console.log(adjustX, adjustY);
			}
			ctx.strokeStyle = color;
			ctx.stroke();
			// console.log(checkCollision);
		},

		playerHit(colordata) {
			let colorString = '';
			// let whichTank;
			if (colordata > 95 && colordata < 110) {
				colorString = 'royalblue';
			}
			else if (colordata > 210 && colordata < 220) {
				colorString = 'gold';
			}
			else if (colordata >= 245) {
				colorString = 'lawngreen';
			}
			else if (colordata <= 10) {
				colorString == 'red';
			}

			for (let i = 0; i < game.allPlayers.length; i++) {
				if (colorString == game.allPlayers[i].color) {
					game.allPlayers.splice(i, 1);
				}
			}
			setTimeout(()=>{
				game.drawTanks();

			}, 2000);

			console.log(colordata);
			console.log(colorString);
			console.log(game.allPlayers);
		},

		checkVictory() {
			if (game.allPlayers.length == 1) {
				alert('player '+game.allPlayers[0].num+' wins!');
			}
			else {
				return;
			}
		}
	}


	//tank class to build tanks for players to control 
	class Tank {
		constructor(xpos, ypos, color, num, power, angle, isTurn) {
			// this.number = number;
			this.xpos = xpos;
			this.ypos = ypos;
			this.color = color;
			this.num = num;
			this.power = 100; //arbitrary
			this.angle = 90; //degreess
			this.isTurn = false;
		}
		drawBody() {
			ctx.beginPath();
			ctx.arc(this.xpos, this.ypos, 10, Math.PI , 0, false);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
		drawCannon() {
			ctx.beginPath();
			ctx.fillRect(this.xpos - 1, this.ypos - 1, 3, -15);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();

			// ctx.moveTo(this.xpos, this.ypos);
			// ctx.lineTo(this.xpos, this.ypos - 20);
			// ctx.stroke();
		}
		angleCannon(direction) {
			if (direction == 'left' && this.angle > 10) {
				this.angle -= 1;
			}
			else if (direction == 'right' && this.angle < 170) {
				this.angle += 1;
			}

			//fix draw function to update this binch
			// console.log('angling...');
		}
		powerCannon(direction) {
			if (direction == 'down' && this.power > 25) {
				this.power -= 1;
			}
			else if (direction == 'up' && this.power < 200) {
				this.power += 1;
			}

			// console.log('powering...');
		}
		fireCannon() {
			ctx.putImageData(game.withTanks, 0, 0);
			let x = this.xpos;
			let y = this.ypos;
			let vi = this.power;
			let toRadians =  this.angle * Math.PI / 180;
			let color = this.color;

			game.checkHit(x, y, vi, toRadians, color);

			// console.log('kaboom');
		}
	}




	//WACKY LOOKIN keyboard input listener 
	
	document.addEventListener('keydown', function(event){
		let key = event.which;
		let whoseTurn;
		let currentTurn;
		for (let i = 0; i < game.allPlayers.length; i++) {
			if (game.allPlayers[i].isTurn) {
				whoseTurn = game.allPlayers[i];
				currentTurn = game.allPlayers[i].num;
			}
		}
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
			if (game.allPlayers[currentTurn] !== undefined) {
				game.allPlayers[currentTurn].isTurn = true;
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

}

scorch();











