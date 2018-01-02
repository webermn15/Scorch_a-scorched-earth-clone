console.log('canvas linked');

// window.onload = drawTerrain();


let canvas = document.getElementById('game-board');
let ctx = canvas.getContext('2d');



function drawTerrain() {
	//aligns the drawn lines so they're nice and crisp
	let iStrokeWidth = 1;
	let iTranslate = (iStrokeWidth % 2) / 2;
	ctx.translate(iTranslate, iTranslate);

	//set attributes for drawing the terrain
	let slopeChange = 1;
	let maxSlope = 3;
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



//these 2 functions create constraints for the generated tank based on player number, then generate a random x coordinate to place it at withint it's territory

function placeTank(numOfPlayers,playerNumber) {
	let rightBorder = divideTerrain(numOfPlayers, playerNumber);
	// console.log(rightBorder);
	let leftBorder = rightBorder - rightBorder;
	// console.log(leftBorder);
	return Math.floor(Math.random()*(rightBorder - leftBorder + 1) + leftBorder);
}


function divideTerrain(numOfPlayers, playerNumber) {
	let width = canvas.width;
	let territory = width / numOfPlayers;
	return playerNumber * territory;
}






//new tank class for building tanks, will refine
class Tank {
	constructor(xpos, ypos) {
		this.xpos = xpos;
		this.ypos = ypos;
	}
	drawBody() {
		ctx.beginPath();
		ctx.arc(this.xpos, this.ypos, 10, Math.PI , 0, false);
		ctx.fill();
		ctx.fillStyle = 'peachpuff';
	}
	drawCannon() {
		ctx.beginPath();
		ctx.moveTo(this.xpos, this.ypos);
		ctx.lineTo(this.xpos, this.ypos - 20);
		ctx.stroke();
	}
}

drawTerrain();

let tank1 = new Tank(placeTank(2,1),40);

tank1.drawBody();
tank1.drawCannon();















