console.log('canvas linked');

window.onload = draw();



function draw() {
	let canvas = document.getElementById('game-board');
	console.log(canvas);
	if (canvas.getContext) {
		let ctx = canvas.getContext('2d');

		let slopeChange = 2;
		let maxHeight = canvas.height;
		let height = 300;

		for (let i = 0; i < canvas.width; i++) {
			let randomChange = Math.random();
			if (randomChange > 0.5) {
				height += slopeChange;
			}
			else {
				height -= slopeChange;
			}

			console.log(i, height);

			ctx.beginPath();
			ctx.moveTo(i, maxHeight);
			ctx.lineTo(i, height);
			ctx.stroke();
		}


	}
		

}







