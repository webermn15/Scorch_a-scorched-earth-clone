console.log('canvas linked');

// window.onload = start();
let tank1;
let tank2;
let tank3;
let allPlayers = [];
const scorch = () => {

	//canvas
	let canvas = document.getElementById('game-board');
	let ctx = canvas.getContext('2d');


	//coole background gradient thing
	function bgGradient() {
		let gradientHeight = canvas.height / 10;
		for (let i = 0; i < 11; i++) {
			ctx.fillStyle = 'rgba(85, 15, 155,'+(i/10)+')';
			ctx.fillRect(0, canvas.height - (gradientHeight * i), canvas.width, gradientHeight);
		}
	}


	//draws the foreground upon which the tanks will be laid 
	function drawTerrain() {
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
	}



	//this creates constraints for the generated tank based on player number, then generate a random x coordinate to place it at withint it's territory

	function placeTankX(numOfPlayers,playerNumber) {

		let terrWidth = canvas.width / numOfPlayers;
		let rightBorder = playerNumber * terrWidth;

		let leftBorder = rightBorder - (rightBorder / numOfPlayers);

		return Math.floor(Math.random()*(rightBorder - leftBorder + 1) + leftBorder);
	}

	function placeTankY(xpos) {
		for (let i = 0; i < canvas.height; i++) {
			let checkCollision = ctx.getImageData(xpos, i, 1, 1).data;
			for (let j = 0; j < checkCollision.length; j++) {
				if (checkCollision[j] == 0) {
					return i;
				}
			}
		}
	}





	//new tank class for building tanks, will refine
	class Tank {
		constructor(xpos, ypos, power, angle, isTurn) {
			// this.number = number;
			this.xpos = xpos;
			this.ypos = ypos;
			this.power = 100; //arbitrary
			this.angle = 90; //degress
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
				this.angle -= 5;
			}
			else if (direction == 'right') {
				this.angle += 5;
			}

			//fix draw function to update this binch

		}
		powerCannon(direction) {
			if (direction == 'down') {
				this.power -= 5;
			}
			else if (direction == 'up') {
				this.power += 5;
			}

			console.log('powering...');
		}
		fireCannon() {
			console.log('kaboom');
		}
	}

	bgGradient();
	drawTerrain();


	//this huge block of ugly let declarations is temporary, for testing purposes 

	let xTank = placeTankX(3,1);

	let yTank = placeTankY(xTank);

	tank1 = new Tank(xTank,yTank);


	let xxTank = placeTankX(3,2);

	let yyTank = placeTankY(xxTank);

	tank2 = new Tank(xxTank,yyTank);


	let xxxTank = placeTankX(3,3);

	let yyyTank = placeTankY(xxxTank);

	tank3 = new Tank(xxxTank, yyyTank);


	tank1.drawBody();
	tank1.drawCannon();
	allPlayers.push(tank1);
	tank1.isTurn = true;


	tank2.drawBody();
	tank2.drawCannon();
	allPlayers.push(tank2);


	tank3.drawBody();
	tank3.drawCannon();
	allPlayers.push(tank3);


	let test = ctx.getImageData(20, 20, 1, 1).data;
	console.log(test);
	console.log(allPlayers);


	// //testing bitmap stuff for canvas using getImageData etc
	// let stop = 0;

	// for (let i = 0; i < canvas.width; i++) {
	// 	for (let j = 0; j < canvas.height; j ++) {
	// 		let bitmapArr = ctx.getImageData(i,j,1,1).data;
	// 		for (let k = 0; k < bitmapArr.length; k++) {
	// 			if (bitmapArr[k] > 0) {
	// 				console.log('it worked somehow', bitmapArr, i, j);
	// 				stop++;
	// 				if (stop > 50) {
	// 					return;
	// 				}
	// 			}
	// 		}
	// 	}
	// }


	//WACKY LOOKIN keyboard input listener 
	
	document.addEventListener('keydown', function(event){
		let key = event.which;
		let whoseTurn;
		let currentTurn;
		for (let i = 0; i < allPlayers.length; i++) {
			if (allPlayers[i].isTurn) {
				whoseTurn = allPlayers[i];
				currentTurn = i;
			}
		};
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
			if (allPlayers[currentTurn+1] !== null) {
				allPlayers[currentTurn+1].isTurn = true;
			}
			else {
				allPlayers[0].isTurn = true;
			}
		}
	});

}

scorch();











