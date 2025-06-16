// Initialise
$game = $("#game-container");
$dimensionInput = $("#dimension");

$dimensionInput.on("change", function () {
    init();
});

function init () {
    $game.html("");
    dimension = $dimensionInput.val();
    totalCells = dimension * dimension;
    $game.css({"grid-template-rows":`repeat(${dimension}, 1fr)`,"grid-template-columns":`repeat(${dimension}, 1fr)`});
    for (let i = 0; i < totalCells; i++) {
        y = Math.floor(i/dimension);
        x = i % dimension;
        $cell = $(`<div class="cell cell-${i}" position="${x}, ${y}" alive="false"></div>`);
        $game.append($cell);
    }

    // Click to active/deactivate cells
    $(".cell").on("click", function (e) {
        $cell = $(e.target);
        if ($cell.attr("alive") == "false") {
            $cell.attr("alive","true");
        } else {
            $cell.attr("alive","false");
        }

        updateColours();
    })
}


init();




function step () {
    // Array for values for next generation (so all cells update instantaneously instead of in order)
    newCells = [];

    // Iterate through cells
    for (let i = 0; i < totalCells; i++) {
        // Select cell
        $cell = $(`.cell-${i}`);
        position = $cell.attr("position");
        position = position.split(", ");
        x = parseInt(position[0]);
        y = parseInt(position[1]);

        
        // Find neighbours
        neighboursAlive = 0;
        neighbours = [
            `${x-1}, ${y-1}`, // Top-left
            `${x}, ${y-1}`, // Top
            `${x+1}, ${y-1}`, // Top-right
            `${x-1}, ${y}`, // Left
            `${x+1}, ${y}`, // Right
            `${x-1}, ${y+1}`, // Bottom-left
            `${x}, ${y+1}`, // Bottom
            `${x+1}, ${y+1}`, // Bottom-right
        ]
        neighbours.forEach(function (neighbour) {
            cellStatus = $(`[position="${neighbour}"]`).attr("alive");
            if (cellStatus == "true") {
                neighboursAlive += 1;
            }
        });

        // Find cells statuses for next generation

        if ($cell.attr("alive") == "true") {
            // If the cell is already alive
            if (neighboursAlive < 2 || neighboursAlive > 3) {
                // Kill if over or under populated
                newCells[i] = "false";
            } else {
                newCells[i] = "true";
            }

        } else {
            // If the cell is currently dead
            if (neighboursAlive == 3) {
                // Cell comes alive
                newCells[i] = "true";
            } else {
                newCells[i] = "false";
            }
        }
    }


    // Update cells to new statuses
    for (let i = 0; i < totalCells; i++) {
        $cell = $(`.cell-${i}`);
        $cell.attr("alive",newCells[i]);
    }
    // Update Cell Colours
    updateColours();
}

function updateColours () {
    for (let i = 0; i < totalCells; i++) {
        $cell = $(`.cell-${i}`);
        if ($cell.attr("alive") == "true") {
            $cell.addClass("cell-active");
        } else {
            $cell.removeClass("cell-active");
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