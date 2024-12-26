// Get the grid container element
const gridContainer = document.getElementById('grid-container');

// Track the green (start) and red (end) cells
let greenCell = null;  // To store the green cell reference
let redCell = null;    // To store the red cell reference

// Create the 10x10 grid (100 cells)
for (let i = 0; i < 100; i++) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    
    // Initialize the state counter for each cell
    gridItem.state = 0;  // 0 = original (light grey), 1 = green, 2 = black, 3 = red
    
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
