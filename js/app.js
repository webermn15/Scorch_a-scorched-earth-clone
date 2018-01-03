console.log('canvas linked');

// window.onload = start();
let tank1;
let tank2;
let tank3;
let allPlayers = [];
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

		//gotta have it ya know
		bindEvents() {
			twoButton.addEventListener('click', ()=> {
				game.players = 2;
				game.placeTank(2);
			});
			threeButton.addEventListener('click', ()=> {
				game.players = 3;
				game.placeTank(3);
			});
			fourButton.addEventListener('click', ()=> {
				game.players = 4;
				game.placeTank(4);
			});
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
		},

		//updates the divs outside the canvas with information about current tank properties (angle, power, which player, etc)
		updateDisplay() {
			let whoseTurn;
			let arrPos;
			for (let i = 0; i < game.allPlayers.length; i++) {
				if (game.allPlayers[i].isTurn) {
					whoseTurn = game.allPlayers[i];
					arrPos = i + 1;
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
				let x = game.placeTankX(i+1);
				let y = game.placeTankY(x);
				game.allPlayers[i] = new Tank(x,y);
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
			for (let i = 0; i < game.allPlayers.length; i++) {
				game.allPlayers[i].drawBody();
				game.allPlayers[i].drawCannon();
			}
		}
	}


	//new tank class for building tanks, refined some, still needs additional refining
	class Tank {
		constructor(xpos, ypos, power, angle, isTurn) {
			// this.number = number;
			this.xpos = xpos;
			this.ypos = ypos;
			this.power = 100; //arbitrary
			this.angle = 90; //degreess
			this.isTurn = false;
		}
		drawBody() {
			ctx.beginPath();
			ctx.arc(this.xpos, this.ypos, 10, Math.PI , 0, false);
			ctx.fill();
			ctx.fillStyle = 'white';
			ctx.closePath();
		}
		drawCannon() {
			ctx.beginPath();
			ctx.fillRect(this.xpos - 1, this.ypos - 1, 3, -15);
			ctx.fill();
			ctx.fillStyle = 'white';
			ctx.closePath();

			// ctx.moveTo(this.xpos, this.ypos);
			// ctx.lineTo(this.xpos, this.ypos - 20);
			// ctx.stroke();
		}
		angleCannon(direction) {
			if (direction == 'left') {
				this.angle -= 1;
			}
			else if (direction == 'right') {
				this.angle += 1;
			}

			//fix draw function to update this binch

		}
		powerCannon(direction) {
			if (direction == 'down') {
				this.power -= 1;
			}
			else if (direction == 'up') {
				this.power += 1;
			}

			console.log('powering...');
		}
		fireCannon() {

			//BIG STRUGGLIN

			//strugglin real hard on math related stuff it's been too long since sohcahtoa
			let x = this.xpos;
			let y = this.ypos;
			let grav = 9.8;
			let vi = this.power;
			let toRadians =  this.angle * Math.PI / 180;
			let vx = vi * Math.cos(toRadians);
			let vy = vi * Math.sin(toRadians);

			let stepSize = 0.1;

			let deltaX;
			let deltaY;

			for (let i = 0; i < 20; i++) {
				let time = i * stepSize;
				deltaX = vx	* time / 2;
				deltaY = vy * time - (grav * time * time) / 2;
				console.log(deltaX, deltaY);
			}

			

			console.log('kaboom');
		}
	}


	game.bgGradient();
	game.drawTerrain();


	//WACKY LOOKIN keyboard input listener 
	
	document.addEventListener('keydown', function(event){
		let key = event.which;
		let whoseTurn;
		let currentTurn;
		for (let i = 0; i < game.allPlayers.length; i++) {
			if (game.allPlayers[i].isTurn) {
				whoseTurn = game.allPlayers[i];
				currentTurn = i;
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
			if (game.allPlayers[currentTurn+1] !== undefined) {
				game.allPlayers[currentTurn+1].isTurn = true;
			}
			else {
				game.allPlayers[0].isTurn = true;
			}
			console.log(game.allPlayers);
		}
	});

	game.bindEvents();
	// game.placeTank(game.players);
	// game.frameLoop();

}

scorch();











