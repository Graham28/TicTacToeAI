var board_values = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
var player = 0;
var comp = 1;
var level = "5";

function convertBoard(board) {
	arr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var i;
	for (i = 0; i < board.length; i++) {
		if (board[i] == 0) {
			arr[i*3] = 1;
			arr[(i*3)+2] = 1;
		} else if (board[i] == 1) {
			arr[(i*3)+1] = 1;
			arr[(i*3)+2] = 1;
		}
		}
	return arr;
}

function compMoveX() {
	(async function() {
		var possible_moves = [];
		var i = 0;
		for (i = 0; i < board_values.length; i++) {
			if (board_values[i] == -1) {
				possible_moves.push(i);
			}
		}
		var boards = [];
		var copy_board = board_values.slice();
		i = 0;
		for (i = 0; i < possible_moves.length; i++) {
			copy_board[possible_moves[i]] = comp;
			boards.push(convertBoard(copy_board));
			copy_board = board_values.slice();
	
		}
		var boards_length = boards.length;
		let model_zero;
		
		model_zero = await tf.loadLayersModel('http://localhost:81/models/model_'+ level +'/model.json');
		let predictions = await model_zero.predict(tf.tensor4d(boards.flat(),[boards.length,3,3,3])).data();
		
		i = 0;
		var eval = 1;
		var best_move = -1;

		for (i = 0; i < boards_length; i++) {
			if ((predictions[i*3] - predictions[(i*3) + 1]) < eval) {
				best_move = i;
				eval = (predictions[i*3] - predictions[(i*3) + 1]);
			}
		}

		board_values[possible_moves[best_move]]=comp;
		drawBoard();
		checkWin();
		drawBoard();

		
	})();

}

function compMoveO() {
	(async function() {
		var possible_moves = [];
		var i = 0;
		for (i = 0; i < board_values.length; i++) {
			if (board_values[i] == -1) {
				possible_moves.push(i);
			}
		}
		var boards = [];
		var copy_board = board_values.slice();
		i = 0;
		for (i = 0; i < possible_moves.length; i++) {
			copy_board[possible_moves[i]] = comp;
			boards.push(convertBoard(copy_board));
			copy_board = board_values.slice();
	
		}
		var boards_length = boards.length;
		let model_zero;
		
		model_zero = await tf.loadLayersModel('http://localhost:81/models/model_'+ level +'/model.json');
		var predictions = await model_zero.predict(tf.tensor4d(boards.flat(),[boards.length,3,3,3])).data();
		
		i = 0;
		var eval = -1;
		var best_move = -1;

		for (i = 0; i < boards_length; i++) {
			if ((predictions[i*3] - predictions[(i*3) + 1]) > eval) {
				best_move = i;
				eval = (predictions[i*3] - predictions[(i*3) + 1]);
			}
		}
		board_values[possible_moves[best_move]]=comp;
		drawBoard();
		checkWin();
		drawBoard();

		
	})();

}




	

document.getElementById('Board').addEventListener('click',
	function(evt){
		var player_moved = false;
		if (!checkWin()) {
			var board_index = Math.floor(evt.clientX/200) + 3*(Math.floor((evt.clientY-85)/200));
			if (board_values[board_index] == -1) { 
				board_values[board_index]=player;
				drawBoard();
				player_moved = true;
			}
		}
		if(!checkWin() && player_moved) {
			setTimeout(function() {
				if (comp == 1) {
					compMoveO();
					}
					else {
						compMoveX();
					}
			}, 110);

		}
},false);

document.getElementById('o').addEventListener('click',
	function(evt){
		document.getElementById('o_check').checked = true;
		document.getElementById('o').style.backgroundColor = "#383d38";
		document.getElementById('x').style.backgroundColor = "#525952";
},false);

document.getElementById('x').addEventListener('click',
	function(evt){
		document.getElementById('x_check').checked = true;
		document.getElementById('x').style.backgroundColor = "#383d38";
		document.getElementById('o').style.backgroundColor = "#525952";
},false);

function newGame() {
	var new_player = document.getElementsByName('player');
	level = document.getElementById('trained_games').value;
	
	if (new_player[1].checked) {
		player = 1;
		comp = 0;
	} else {
		player = 0;
		comp = 1;
	}
	board_values = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
	drawBoard();
	if (comp ==0) {
		compMoveX();
		}
}

function checkWin() {
	var delay = 100;
	if ((board_values[0] == board_values[1]) && (board_values[1] == board_values[2]) && (board_values[0] != -1)) {
		setTimeout(function() {
			var c = document.getElementById("Board");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(100, 100);
			ctx.lineTo(500, 100);
			ctx.stroke();
			return true;
		}, delay);

	}
	else if ((board_values[3] == board_values[4]) && (board_values[4] == board_values[5]) && (board_values[3] != -1)){
		setTimeout(function() {
			var c = document.getElementById("Board");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(100, 300);
			ctx.lineTo(500, 300);
			ctx.stroke();
			return true;
		}, delay);
		return true;
	}
	else if ((board_values[6] == board_values[7]) && (board_values[7] == board_values[8]) && (board_values[6] != -1)){
		setTimeout(function() {
			var c = document.getElementById("Board");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(100, 500);
			ctx.lineTo(500, 500);
			ctx.stroke();
			return true;
		}, delay);
		return true;
	}
	else if ((board_values[0] == board_values[3]) && (board_values[3] == board_values[6]) && (board_values[0] != -1)){
		setTimeout(function() {
			var c = document.getElementById("Board");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(100, 100);
			ctx.lineTo(100, 500);
			ctx.stroke();
			return true;
		}, delay);
		return true;
	}
	else if ((board_values[1] == board_values[4]) && (board_values[4] == board_values[7]) && (board_values[1] != -1)){
		setTimeout(function() {
			var c = document.getElementById("Board");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(300, 100);
			ctx.lineTo(300, 500);
			ctx.stroke();
			return true;
		}, delay);
		return true;
	}
	else if ((board_values[2] == board_values[5]) && (board_values[5] == board_values[8]) && (board_values[2] != -1)){
		setTimeout(function() {
			var c = document.getElementById("Board");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(500, 100);
			ctx.lineTo(500, 500);
			ctx.stroke();
			return true;
		}, delay);
		return true;
	}
	else if ((board_values[0] == board_values[4]) && (board_values[4] == board_values[8]) && (board_values[0] != -1)){
		setTimeout(function() {
			var c = document.getElementById("Board");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(100, 100);
			ctx.lineTo(500, 500);
			ctx.stroke();
			return true;
		}, delay);
		return true;
	}
	else if ((board_values[2] == board_values[4]) && (board_values[4] == board_values[6]) && (board_values[2] != -1)){
		setTimeout(function() {
			var c = document.getElementById("Board");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "#FF0000";
			ctx.moveTo(500, 100);
			ctx.lineTo(100, 500);
			ctx.stroke();
			return true;
		}, delay);
		return true;
	}
	else {
		return false;
	}
}

var slider = document.getElementById("trained_games");
var output = document.getElementById("num_games");

output.innerHTML = (parseInt(slider.value*10000)).toString(); 

slider.oninput = function() {
	output.innerHTML = (parseInt(this.value*10000)).toString();;
}

function drawBoard() {
	var c = document.getElementById("Board");
	var ctx = c.getContext("2d");
	ctx.clearRect(0,0,600,600);
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#000000";
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
	ctx.closePath();
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