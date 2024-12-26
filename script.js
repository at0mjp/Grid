// Get the grid container element
const gridContainer = document.getElementById('grid-container');

// Track the green (start) and red (end) cells
let greenCell = null;  // To store the green cell reference
let redCell = null;    // To store the red cell reference

// Timer display element
const timerDisplay = document.getElementById('timer');
let timerInterval = null;  // Timer interval handle
let startTime = 0;  // Start time for the algorithm

// Create a 2D array to represent the grid's state
const grid = [];

// Create the 20x20 grid (400 cells)
for (let y = 0; y < 20; y++) {
    const row = [];
    for (let x = 0; x < 20; x++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.dataset.x = x; // X-coordinate for each cell
        gridItem.dataset.y = y; // Y-coordinate for each cell
        
        // Initialize the state counter for each cell
        gridItem.state = 0;  // 0 = original (light grey), 1 = green, 2 = black, 3 = red
        row.push(gridItem); // Add this cell to the row

        // Add event listener for clicks on the grid item
        gridItem.addEventListener('click', () => {
            if (gridItem.state === 0) {  // Only allow clicks on original light grey cells
                // If no green cell is set, set this cell to green
                if (!greenCell) {
                    gridItem.style.backgroundColor = 'green';
                    gridItem.state = 1;  // Set state to green
                    greenCell = gridItem;  // Store the reference to this green cell
                } 
                // If no red cell is set, set this cell to red
                else if (!redCell) {
                    gridItem.style.backgroundColor = 'red';
                    gridItem.state = 3;  // Set state to red
                    redCell = gridItem;  // Store the reference to this red cell
                }
                // If both green and red cells are set, allow setting black cells (barriers)
                else if (greenCell && redCell) {
                    gridItem.style.backgroundColor = 'black';
                    gridItem.state = 2;  // Set state to black (barrier)
                }
            } else if (gridItem.state === 1) {  // If it's green (start), reset it to light grey
                gridItem.style.backgroundColor = 'lightgrey';
                gridItem.state = 0;  // Set state back to original (light grey)
                greenCell = null;  // Clear the reference to the green cell
            } else if (gridItem.state === 3) {  // If it's red (end), reset it to light grey
                gridItem.style.backgroundColor = 'lightgrey';
                gridItem.state = 0;  // Set state back to original (light grey)
                redCell = null;  // Clear the reference to the red cell
            } else if (gridItem.state === 2) {  // If it's black (barrier), toggle it back to light grey
                gridItem.style.backgroundColor = 'lightgrey';
                gridItem.state = 0;  // Reset state back to original (light grey)
            }
        });

        gridContainer.appendChild(gridItem);
    }
    grid.push(row); // Add the row to the grid array
}

// Handle the Start Button click event
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
    // Ensure both start and end points are set
    if (!greenCell || !redCell) {
        alert('Please set both a start and end point!');
        return;
    }

    // Reset the timer before starting the algorithm
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);  // Clear any existing intervals
    timerInterval = setInterval(updateTimer, 10);  // Update the timer every 10 ms

    const selectedAlgorithm = document.getElementById('algorithm-dropdown').value;
    if (selectedAlgorithm === 'dijkstra') {
        runDijkstra();
    } else if (selectedAlgorithm === 'a-star') {
        runAStar();
    }
});

// Handle the dropdown menu change event
const algorithmDropdown = document.getElementById('algorithm-dropdown');
algorithmDropdown.addEventListener('change', (event) => {
    const selectedAlgorithm = event.target.value;
    console.log(`Selected algorithm: ${selectedAlgorithm}`);
});

// Timer update function
function updateTimer() {
    const elapsed = Date.now() - startTime;  // Time in milliseconds
    timerDisplay.textContent = `Time: ${elapsed} ms`;  // Display time in ms
}

// Dijkstra's Algorithm
function runDijkstra() {
    console.log("Running Dijkstra's Algorithm");

    // Create a grid representation for pathfinding (2D array)
    const visited = new Set();
    const queue = [{ x: greenCell.dataset.x, y: greenCell.dataset.y, distance: 0, path: [] }];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
    const end = { x: redCell.dataset.x, y: redCell.dataset.y };

    while (queue.length > 0) {
        // Sort by distance
        queue.sort((a, b) => a.distance - b.distance);
        const current = queue.shift();

        const { x, y, distance, path } = current;

        // If we've reached the end
        if (x == end.x && y == end.y) {
            // Highlight the path
            drawPath(path);
            return;
        }

        if (visited.has(`${x},${y}`)) continue;
        visited.add(`${x},${y}`);

        // Explore neighbors
        for (let [dx, dy] of directions) {
            const newX = parseInt(x) + dx;
            const newY = parseInt(y) + dy;

            // Ensure the new position is within bounds and not a barrier
            if (newX >= 0 && newY >= 0 && newX < 20 && newY < 20 && grid[newY][newX].state !== 2) {
                // If it's not a wall (black cell)
                queue.push({
                    x: newX,
                    y: newY,
                    distance: distance + 1,
                    path: [...path, [newX, newY]],
                });
            }
        }
    }
}

// A* Algorithm
function runAStar() {
    console.log("Running A* Algorithm");

    const visited = new Set();
    const queue = [{ x: greenCell.dataset.x, y: greenCell.dataset.y, g: 0, h: heuristic(greenCell, redCell), f: 0, path: [] }];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
    const end = { x: redCell.dataset.x, y: redCell.dataset.y };

    while (queue.length > 0) {
        // Sort by f (g + h)
        queue.sort((a, b) => a.f - b.f);
        const current = queue.shift();

        const { x, y, g, f, path } = current;

        // If we've reached the end
        if (x == end.x && y == end.y) {
            // Highlight the path
            drawPath(path);
            return;
        }

        if (visited.has(`${x},${y}`)) continue;
        visited.add(`${x},${y}`);

        // Explore neighbors
        for (let [dx, dy] of directions) {
            const newX = parseInt(x) + dx;
            const newY = parseInt(y) + dy;

            // Ensure the new position is within bounds and not a barrier
            if (newX >= 0 && newY >= 0 && newX < 20 && newY < 20 && grid[newY][newX].state !== 2) {
                const newG = g + 1;
                const newH = heuristic({ x: newX, y: newY }, redCell);
                const newF = newG + newH;

                queue.push({
                    x: newX,
                    y: newY,
                    g: newG,
                    h: newH,
                    f: newF,
                    path: [...path, [newX, newY]],
                });
            }
        }
    }
}

// Helper function to calculate Manhattan distance (for A*)
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Helper function to highlight the found path in yellow
function drawPath(path) {
    for (const [x, y] of path) {
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.style.backgroundColor = 'yellow';  // Highlight path in yellow
        }
    }

    // Stop the timer once the pathfinding is complete
    if (timerInterval) {
        clearInterval(timerInterval);
        const elapsed = Date.now() - startTime;  // Time in milliseconds
        timerDisplay.textContent = `Completed in ${elapsed} ms`;
    }
}

// Handle the Reset Button click event
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    // Reset the grid and clear any colored cells
    grid.forEach(row => {
        row.forEach(cell => {
            cell.style.backgroundColor = 'lightgrey';
            cell.state = 0;  // Reset state to original
        });
    });
    
    // Clear green and red cell references
    greenCell = null;
    redCell = null;
    timerDisplay.textContent = 'Time: 0 ms';  // Reset the timer display
});
