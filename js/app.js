console.log('canvas linked');

window.onload = draw();



function draw() {
	let canvas = document.getElementById('game-board');
	console.log(canvas);
	if (canvas.getContext) {
		let ctx = canvas.getContext('2d');

		let iStrokeWidth = 1;
		let iTranslate = (iStrokeWidth % 2) / 2;
		ctx.translate(iTranslate, iTranslate);

		let slopeChange = 2;
		let maxSlope = 10;
		let slope = Math.random() * slopeChange;
		let maxHeight = canvas.height;
		let height = 300;
		let valley = 450;
		let peak = 200;


		for (let i = 0; i < canvas.width; i++) {
			slope += Math.random() * slopeChange;
			console.log(slope);
			if (slope > maxSlope) {
				slope = 1;
			}
			if (height < valley) {
				height += slope;
				slopeChange *= -1;
			}
			else if (height > peak) {
				height -= slope;
				slopeChange *= -1;
			}


			ctx.beginPath();
			ctx.moveTo(i, maxHeight);
			ctx.lineTo(i, height);
			ctx.stroke();
		}

	}
		

}







