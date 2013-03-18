(function () {
	var isBoardInit = false;
	var COLOR_UNICODE = ["&#160;", "&#x2659;", "&#x265F;"];
	var TIMER_AUTO = 500;
	var tblData = [];

	var tblBoard;
	var btnPrevious;
	var btnNext;
	var btnPlayPause;
	
	var seq = [];
	var seqIndex = 0;
	var isPlaying = false;
	var timer;
	
	window.onload = function () {
		initBoard();
	};

	window.onkeydown = function(e){
	
    		switch(e.which) {
			
				case 13: // enter
				case 32: // space
				playPause();
				break;
				
				
				case 37: // left
				pause();
				doPreviousMove();
				break;

				case 39: // right
				pause();
				doNextMove();
				break;
				
				default: return; // exit this handler for other keys
    	}
	};	
	
	function setColor(x, y, color) {
		tblData[x][y] = color;
		tblBoard.rows[y].cells[x].innerHTML = COLOR_UNICODE[color];
	}
	
	function getColor(x, y) {
		return tblData[x][y];
	}
	
	function doMove(xs, ys, xe, ye) {
		setColor(xe, ye, getColor(xs, ys));
		setColor(xs, ys, 0);
	}
	
	function doRevertMove(xs, ys, xe, ye) {
		setColor(xs, ys, getColor(xe, ye));
		setColor(xe, ye, 0);
	}
	
	function showHideNextPrevious() {
		if (seqIndex == 0) {
			btnPrevious.setAttribute("disabled", "disabled");
		} else {
			btnPrevious.removeAttribute("disabled");
		}
		
		if (seqIndex == seq.length) {
			btnNext.setAttribute("disabled", "disabled");
		} else {
			btnNext.removeAttribute("disabled");
		}
	}
	
	function doNextMove() {
		var move = seq[seqIndex];
		
		doMove(move.charCodeAt(0) - 65, +move[1]  - 1, move.charCodeAt(2) - 65, +move[3]  - 1);
		seqIndex++;
		
		if (isPlaying) {
			if (seqIndex != seq.length) {
				clearTimeout(timer);
				timer = setTimeout(doNextMove, TIMER_AUTO);
			} else {
				if (isPlaying) {
					playPause();
				}
			}
		}
		
		showHideNextPrevious();
	}
	
	function doPreviousMove() {
		var targetIndex = --seqIndex;
		
		seqIndex = 0;
		startBoard();
		for (var i=0; i<targetIndex; i++) {
			doNextMove();
		}
	}
	
	function pause(){
		if(!isPlaying)
			return;
			
		playPause();
	}
	
	function playPause() {
		if (!isPlaying) {
			timer = setTimeout(doNextMove, TIMER_AUTO);
			btnPlayPause.innerHTML = "&#x2225;";
		} else {
			clearTimeout(timer);
			btnPlayPause.innerHTML = "&#x22B2;";
		}
		
		isPlaying = !isPlaying;
	}
	
	function initBoard() {
		if (isBoardInit)
			return;
			
		tblBoard = document.getElementById("tblBoard");
		btnPrevious = document.getElementById("previous");
		btnPlayPause = document.getElementById("playPause");
		btnNext = document.getElementById("next");
		
		btnPlayPause.onclick = playPause;
		btnNext.onclick = doNextMove;
		btnPrevious.onclick = doPreviousMove;
		
		for (var row=0; row<8; row++) {
			var tr = tblBoard.insertRow(row);
			
			for (var col=0; col<8; col++) {
				tr.insertCell(col);
			}
		}
		
		tblData = [];
		for (var i=0; i<8; i++) {
			tblData[i] = [];
		}
		
		startBoard();
		isBoardInit = true;
	}
	
	function startBoard() {
		for (var i=0; i<8; i++) {
			setColor(i, 0, 1);
			setColor(i, 1, 1);
			setColor(i, 2, 0);
			setColor(i, 3, 0);
			setColor(i, 4, 0);
			setColor(i, 5, 0);
			setColor(i, 6, 2);
			setColor(i, 7, 2);
		}
	}
	
	function loadData(data) {
		seq = data.split(";");
		seqIndex = 0;
		initBoard();
		showHideNextPrevious();
		playPause();
	}
	
	window.Replay = {};
	window.Replay.loadData = loadData;

}());