console.log('canvas linked');

// window.onload = start();


const scorch = () => {


	let canvas = document.getElementById('game-board');
	let ctx = canvas.getContext('2d');



	function bgGradient() {
		let gradientHeight = canvas.height / 10;
		for (let i = 10; i > 0; i--) {
			ctx.fillStyle = 'rgba(84, 34, 133,'+(i/10)+')';
			ctx.fillRect(0, (i * gradientHeight), canvas.width, gradientHeight);
		}
	}



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
				if (checkCollision[j] > 0) {
					return i;
				}
			}
		}
	}





	//new tank class for building tanks, will refine
	class Tank {
		constructor(xpos, ypos, power, angle) {
			// this.number = number;
			this.xpos = xpos;
			this.ypos = ypos;
			this.power = 100; //arbitrary
			this.angle = 90; //degress
		}
		drawBody() {
			ctx.beginPath();
			ctx.arc(this.xpos, this.ypos, 10, Math.PI , 0, false);
			ctx.fill();
			ctx.fillStyle = 'peachpuff';
			ctx.closePath();
		}
		drawCannon() {
			ctx.beginPath();
			ctx.fillRect(this.xpos - 1, this.ypos, 3, -20);
			ctx.fill();
			ctx.fillStyle = 'peachpuff';
			ctx.closePath();

			// ctx.moveTo(this.xpos, this.ypos);
			// ctx.lineTo(this.xpos, this.ypos - 20);
			// ctx.stroke();
		}
		angleCannon() {
			console.log('angling...');
		}
		powerCannon() {
			console.log('powering...');
		}
		fireCannon() {
			console.log('kaboom');
		}
	}

	bgGradient();
	drawTerrain();

	let xTank = placeTankX(2,1);

	let yTank = placeTankY(xTank);

	let tank1 = new Tank(xTank,yTank);

	tank1.drawBody();
	tank1.drawCannon();

	let xxTank = placeTankX(2,2);

	let yyTank = placeTankY(xxTank);

	let tank2 = new Tank(xxTank,yyTank);

	tank2.drawBody();
	tank2.drawCannon();

	// let test = ctx.getImageData(20, 20, 1, 1).data;



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



	}

scorch();











