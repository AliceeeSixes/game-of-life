// Initialise
$game = $("#game-container");
$dimensionInput = $("#dimension");
generation = 0;
gameState = [];
prevState = [];


function init () {
    $game.html("");
    dimension = $dimensionInput.val();
    totalCells = dimension * dimension;
    gameState = new Uint8Array(totalCells);
    prevState = new Uint8Array(totalCells);
    $game.css({"grid-template-rows":`repeat(${dimension}, 1fr)`,"grid-template-columns":`repeat(${dimension}, 1fr)`});
    for (let i = 0; i < totalCells; i++) {
        y = Math.floor(i/dimension);
        x = i % dimension;
        $cell = $(`<div class="cell" cell-id="${i}"></div>`);
        $game.append($cell);
        gameState[i] = 0;
    }

    // Click to active/deactivate cells
    $(".cell").on("click", function (e) {
        $cell = $(e.target);
        i = parseInt($cell.attr("cell-id"));
        if (gameState[i] == 0) {
            gameState[i] = 1;
        } else {
            gameState[i] = 0;
        }

        // Update Colour
        $cell = $(`[cell-id="${i}"]`);
        if (gameState[i]) {
            $cell.addClass("cell-active");
        } else {
            $cell.removeClass("cell-active");
        }
    })
    pause();
    generation = 0;
    $("#generation").html(generation);
}


init();


function randomise() {
    for (let i = 0; i < totalCells; i++) {
        $cell = $(`[cell-id="${i}"]`);
        random = Math.floor(Math.random() * 2);
        if (random) {
            gameState[i] = 1;;
        } else {
            gameState[i] = 0;
        }
    }
    updateColours();
    pause();
    generation = 0;
    $("#generation").html(generation);
}


function step () {
    // Update Geneneration Text
    generation++;
    $("#generation").html(generation);
    // Array for values for next generation (so all cells update instantaneously instead of in order)
    newState = prevState;

    // Iterate through cells
    for (let i = 0; i < totalCells; i++) {
        // Select cell
        $cell = $(`[cell-id="${i}"]`);
        position = indexToPosition(i);
        x = position[0];
        y = position[1];

        
        // Find neighbours
        neighboursAlive = 0;
        neighbours = [
            [x-1, y-1], // Top-left
            [x+0, y-1], // Top
            [x+1, y-1], // Top-right
            [x-1, y+0], // Left
            [x+1, y+0], // Right
            [x-1, y+1], // Bottom-left
            [x+0, y+1], // Bottom
            [x+1, y+1], // Bottom-right
        ]
        neighbours.forEach(function (neighbour) {
            let j = positionToIndex(neighbour[0], neighbour[1]);
            if (j !== null) {
                cellStatus = gameState[j];
                if (cellStatus == 1) {
                    neighboursAlive += 1;
                }
            }
        });

        // Find cells statuses for next generation

        if (gameState[i]) {
            // If the cell is already alive
            if (neighboursAlive < 2 || neighboursAlive > 3) {
                // Kill if over or under populated
                newState[i] = 0;
            } else {
                newState[i] = 1;
            }

        } else {
            // If the cell is currently dead
            if (neighboursAlive == 3) {
                // Cell comes alive
                newState[i] = 1;
            } else {
                newState[i] = 0;
            }
        }
    }

    // Store old state
    prevState = gameState;

    // Update cells to new statuses
    gameState = newState;

    // Update Cell Colours
    updateColours();
}

function updateColours () {
    for (let i = 0; i < totalCells; i++) {
        if (gameState[i] != prevState[i]) {
            $cell = $(`[cell-id="${i}"]`);
            if (gameState[i]) {
                $cell.addClass("cell-active");
            } else {
                $cell.removeClass("cell-active");
            }
        }
    }
}

// Pause/play button

function play () {
    playTimer = setInterval(step, 300);
    $("#pause-play").text("Pause").attr("onclick","pause();");
}

function pause () {
    clearInterval(playTimer);
    $("#pause-play").text("Play").attr("onclick","play();");
}


// Position/index converter functions 

function indexToPosition (i) {
    y = Math.floor(i/dimension);
    x = i % dimension;
    return [x,y];
}

function positionToIndex (x, y) {
    position = (y * dimension) + x;
    if (x < 0 || y < 0) {
        return null;
    }
    return position;
}