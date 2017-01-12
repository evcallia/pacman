// 1 = coin
// 2 = wall
// 3 = pacman
// 4 = ghost
// 5 = cherry
var board = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,3,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,1,1,2],
    [2,1,2,2,2,2,1,2,2,2,2,1,1,2,2,2,2,2,1,2],
    [2,1,2,1,1,1,1,1,1,1,1,1,2,2,2,1,2,2,1,2],
    [2,1,2,1,2,2,2,2,2,2,1,1,1,1,2,1,2,2,1,2],
    [2,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,2],
    [2,1,1,1,1,1,2,2,2,2,2,2,2,1,1,1,2,1,2,2],
    [2,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2,1,2,2],
    [2,1,1,1,1,1,2,1,2,0,2,1,2,2,2,2,2,1,2,2],
    [2,1,2,2,2,1,2,1,2,0,2,1,1,1,1,1,2,1,1,2],
    [2,1,2,1,1,1,2,1,2,2,2,2,2,1,1,1,2,1,1,2],
    [2,1,2,2,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2],
    [2,1,2,1,2,1,2,1,2,2,2,2,2,1,2,1,2,2,1,2],
    [2,1,2,1,2,1,2,1,1,1,2,2,1,1,2,1,2,2,1,2],
    [2,1,1,1,2,1,2,1,1,1,2,1,1,2,2,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,2],
    [2,1,2,2,2,1,2,2,2,1,1,1,2,2,2,2,1,1,1,2],
    [2,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,1,1,1,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
]

var game_board = $('#game_board');
var pacman = {
    x: 1,
    y: 1,
    direction: 'right'
};
var score = 0;
var lives = 3;
var ghosts = [];

function renderBoard() {
    game_board.html('');
    for(var i = 0; i < board.length; i++){
        var row = $('<div></div>', {class: 'row'});
        for(var j = 0; j < board[i].length; j++){
            if(board[i][j] == 2){
                row.append($('<div></div>', {class: 'brick'}));
            }else if(board[i][j] == 1){
                row.append($('<div></div>', {class: 'coin'}));
            }else if(board[i][j] == 3){
                row.append($('<div></div>', {class: 'pacman ' + pacman.direction}));
            }else if(board[i][j] == 4){
                for(var k = 0; k < ghosts.length; k++){
                    if(ghosts[k].x == i && ghosts[k].y == j){
                        row.append($('<div></div>', {class: 'ghost ' + ghosts[k].type}));
                        break;
                    }
                }
            }else if(board[i][j] == 5){
                row.append($('<div></div>', {class: 'cherry'}));
            }else{
                row.append($('<div></div>', {class: 'empty'}));
            }
        }
        game_board.append(row);
    }
}
renderBoard();

$(document).keydown(function(e) {
    if(e.keyCode == 39){ //right arrow
        pacman.direction = 'right';
    }else if(e.keyCode == 37){ //left arrow
        pacman.direction = 'left';
    }else if(e.keyCode == 38){ //up arrow
        pacman.direction = 'up';
    }else if(e.keyCode == 40){ //down arrow
        pacman.direction = 'down';
    }else{ //some other character we don't care about
        return;
    }
    renderBoard();
});

function movePacman() {
    var newLocation = {
        x: pacman.x,
        y: pacman.y
    }
    var shouldCheck = false;

    //update where new location would be
    if(pacman.direction == 'right'){
        newLocation.y += 1;
    }else if(pacman.direction == 'left'){
        newLocation.y -= 1;
    }else if(pacman.direction == 'up'){
        newLocation.x -= 1;
    }else{ //it's 'down'
        newLocation.x += 1;
    }

    // check for wall
    if(board[newLocation.x][newLocation.y] != 2){
        // check for coin
        if(board[newLocation.x][newLocation.y] == 1){
            score += 10;
            shouldCheck = true;
        // check for cherry
        }else if(board[newLocation.x][newLocation.y] == 5){
            score += 50;
        // check for ghost
        }else if(board[newLocation.x][newLocation.y] == 4){
            score -= 150;
            board[pacman.x][pacman.y] = 0;
            newLocation.x = 1;
            newLocation.y = 1;
            board[1][1] = 3;
            lives -= 1;
            updateLives();
            shouldCheck = true;
        }else{ // it's an empty space
            //we do nothing
        }
        // update location
        board[pacman.x][pacman.y] = 0;
        board[newLocation.x][newLocation.y] = 3
        pacman.x = newLocation.x;
        pacman.y = newLocation.y;
        renderBoard();
        updateScore();
        if(shouldCheck){
            checkWinner();
        }
    }
}

function updateScore(){
    $('#score').html('Score: ' + score)
}

function updateLives(){
    $('#lives').html('Lives: ' + lives)
}

function addCherry(){
    var ranX = 0;
    var ranY = 0;
    while(board[ranX][ranY] != 0){
        ranX = Math.floor(Math.random()*board[0].length);
        ranY = Math.floor(Math.random()*board.length);
    }
    board[ranX][ranY] = 5;
    setTimeout(function(){
        board[ranX][ranY] = 0;
    }, 6000)
}

function addGhost(){
    if(ghosts.length < 6){
        var ghost = {
            x: 9,
            y: 9,
            prevSquare: 0 //corresponds to coin or empty int
        }
        var ran = Math.floor(Math.random()*3)
        if(ran == 0){
            ghost.type = 'blue_ghost';
        }else if(ran == 1){
            ghost.type = 'red_ghost';
        }else{
            ghost.type = 'pink_ghost';
        }
        ghosts.push(ghost)
        board[9][9] = 4;
    }
}

function moveGhosts() {
    for(var i = 0; i < ghosts.length; i++){
        var flag = true;
        while (flag) {
            if((board[ghosts[i].x + 1][ghosts[i].y] == 2 || board[ghosts[i].x + 1][ghosts[i].y] == 4)
            && (board[ghosts[i].x - 1][ghosts[i].y] == 2 || board[ghosts[i].x - 1][ghosts[i].y] == 4)
            && (board[ghosts[i].x][ghosts[i].y + 1] == 2 || board[ghosts[i].x][ghosts[i].y + 1] == 4)
            && (board[ghosts[i].x][ghosts[i].y - 1] == 2 || board[ghosts[i].x][ghosts[i].y - 1] == 4)){
                break;
            }
            var ran = Math.floor(Math.random()*4)
            var newLocation = {
                x: ghosts[i].x,
                y: ghosts[i].y
            }
            if(ran == 0){
                newLocation.y += 1; //right
            }else if(ran == 1){
                newLocation.y -= 1; // left
            }else if(ran == 2){
                newLocation.x -= 1; // up
            }else{
                newLocation.x += 1; // down
            }

            // check for wall or other ghost
            if(board[newLocation.x][newLocation.y] != 2 && board[newLocation.x][newLocation.y] != 4){
                flag = false;

                // check for pacman
                if(board[newLocation.x][newLocation.y] == 3){
                    score -= 100;
                    updateScore();
                    board[pacman.x][pacman.y] = 0;
                    pacman.x = 1;
                    pacman.y = 1;
                    board[1][1] = 3;
                    lives -= 1;
                    updateLives();
                    checkWinner();
                }

                // update location
                board[ghosts[i].x][ghosts[i].y] = ghosts[i].prevSquare;
                ghosts[i].prevSquare = board[newLocation.x][newLocation.y];
                board[newLocation.x][newLocation.y] = 4;
                ghosts[i].x = newLocation.x;
                ghosts[i].y = newLocation.y;
                renderBoard();
            }
        }
    }
}

function checkWinner(){
    if(lives == 0){
        alert("Sorry... You ran out of lives");
        return;
    }
    for(var i = 1; i < board.length - 1; i++){
        for(var j = 1; j < board[i].length - 1; j++){
            if(board[i][j] == 1){
                return;
            }
        }
    }
    alert("You won! Way to go!")
}


//initialize gameloops
// move characters
setInterval(function() {
    movePacman();
    moveGhosts();
    renderBoard();
}, 200);
// addcherry
setInterval(function(){
    addCherry();
}, 13000);
// add ghost
setInterval(function(){
    addGhost();
}, 5000);







//
