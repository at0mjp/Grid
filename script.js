const gridItems = document.querySelectorAll('.grid-item');

gridItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        item.style.backgroundColor = '#45a049';
    });
    item.addEventListener('mouseout', () => {
        item.style.backgroundColor = '#4CAF50';
    });
});
