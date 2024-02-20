document.querySelectorAll('.marker').forEach(marker => {
    marker.addEventListener('mouseover', () => {
        const infoId = marker.id.replace('marker', 'info');
        document.getElementById(infoId).style.display = 'block';
    });

    marker.addEventListener('mouseout', () => {
        const infoId = marker.id.replace('marker', 'info');
        document.getElementById(infoId).style.display = 'none';
    });
});
