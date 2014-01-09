var d = document, c = d.getElementById('view'),
	q = c.getContext('2d'),
	CELL_SIZE = 20,
	BOARD_WIDTH = c.width / CELL_SIZE,
	BOARD_HEIGHT = c.height / CELL_SIZE,
	boardA, boardB,
	timer, paused = true;

function init() {
	boardA = [];boardB = [];
	for (var i=0;i<BOARD_HEIGHT;i++) {
		boardA.push([]);
		boardB.push([]);
		for (var j=0;j<BOARD_WIDTH;j++) {
			boardA[i].push(0);
			boardB[i].push(0);
		}
	}
}

function countNeighborHeads(x,y) {
	var up = (y==0) ? BOARD_HEIGHT-1 : y-1,
		dn = (y==BOARD_HEIGHT-1) ? 0 : y+1,
		lf = (x==0) ? BOARD_WIDTH-1 : x-1,
		rt = (x==BOARD_WIDTH-1) ? 0 : x+1;
	
	return (boardA[up][lf]==2?1:0) + (boardA[up][x]==2?1:0) + (boardA[up][rt]==2?1:0) + (boardA[y][lf]==2?1:0)
			+ (boardA[dn][lf]==2?1:0) + (boardA[dn][x]==2?1:0) + (boardA[dn][rt]==2?1:0) + (boardA[y][rt]==2?1:0);
}

function update() {
	var nb;
	for (var i=0;i<BOARD_HEIGHT;i++) {
		for (var j=0;j<BOARD_WIDTH;j++) {
			if (boardA[i][j]==0) {		// Empty
				boardB[i][j] = 0;
			}
			else if (boardA[i][j]==1) {	// Conductor
				nb = countNeighborHeads(j,i);
				if (nb==1 || nb==2) {
					boardB[i][j] = 2
				}
				else {
					boardB[i][j] = 1;
				}
			}
			else if (boardA[i][j]==2) {	// Electron head
				boardB[i][j] = 3;
			}
			else if (boardA[i][j]==3) {	// Electron tail
				boardB[i][j] = 1;
			}
		}
	}
	tmp = boardB;
	boardB = boardA;
	boardA = tmp;
}

function draw() {
	q.strokeStyle = '#fff';
	q.lineWidth = 0.2;
	q.clearRect(0,0,c.width,c.height);
	for (var i=0;i<BOARD_HEIGHT;i++) {
		for (var j=0;j<BOARD_WIDTH;j++) {
			if (boardA[i][j] > 0) {
				if (boardA[i][j] == 1){q.fillStyle = '#ff0';}		// Conductor
				else if (boardA[i][j] == 2){q.fillStyle = '#00f';}	// Electron head
				else if (boardA[i][j] == 3){q.fillStyle = '#f00';}	// Electron tail
				q.fillRect(CELL_SIZE*j,CELL_SIZE*i,CELL_SIZE,CELL_SIZE);
			}
			q.strokeRect(CELL_SIZE*j,CELL_SIZE*i,CELL_SIZE,CELL_SIZE);
		}
	}
}

function loop() {
	draw();
	update();
	timer = setTimeout(loop, 100);
}

d.getElementById('pause').onmouseup = function() {
	if (paused) {
		d.getElementById('pause').innerHTML = 'Pause';
		timer = loop();
	}
	else {
		d.getElementById('pause').innerHTML = 'Play';
		clearTimeout(timer);
	}
	paused = !paused;
};

d.getElementById('clear').onmouseup = function() {
	clearTimeout(timer);
	paused = true;
	d.getElementById('pause').innerHTML = 'Play';
	init();
	draw();
};

c.onmouseup = function(e) {
	var x = Math.floor((e.pageX-c.offsetLeft)/CELL_SIZE),
		y = Math.floor((e.pageY-c.offsetTop)/CELL_SIZE);
	
	boardA[y][x] = (boardA[y][x] + 1) % 4;
	draw();
};

init();
draw();
