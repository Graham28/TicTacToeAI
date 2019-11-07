var board_values = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
var player = 0



document.getElementById('Board').addEventListener('click',
	function(evt){
		var board_index = Math.floor(evt.clientX/200) + 3*(Math.floor((evt.clientY-50)/200));
		board_values[board_index]=player;
		drawBoard();
},false);
document.getElementById('x_o').addEventListener('click',
	function(evt){
		alert(document.getElementById('x_o').value);
},false);

function newGame() {
	var new_player = document.getElementsByName('player');
	if (new_player[1].checked) {
		player = 1;
	} else {
		player = 0;
	}
	var i;
	board_values = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
	drawBoard();
}

function drawBoard() {
	var c = document.getElementById("Board");
	var ctx = c.getContext("2d");
	ctx.clearRect(0,0,600,600);
	ctx.lineWidth = 3;
	ctx.moveTo(200, 0);
	ctx.lineTo(200, 600);
	ctx.stroke();
	ctx.moveTo(400, 0);
	ctx.lineTo(400, 600);
	ctx.stroke();
	ctx.moveTo(0, 200);
	ctx.lineTo(600, 200);
	ctx.stroke();
	ctx.moveTo(0, 400);
	ctx.lineTo(600, 400);
	ctx.stroke();
	ctx.font = "200px Arial";
	
	var i;
	for (i = 0; i < board_values.length; i++) {
		if (board_values[i] == 0) {
		ctx.fillText("X", (25+((i%3)*200)), (175+(Math.floor(i/3))*200));
		} else if (board_values[i] == 1) {
			ctx.fillText("O", (25+((i%3)*200)), (175+(Math.floor(i/3))*200));
		} else {
			ctx.fillText(" ", (25+((i%3)*200)), (175+(Math.floor(i/3))*200));
		}
		}
	
	
}