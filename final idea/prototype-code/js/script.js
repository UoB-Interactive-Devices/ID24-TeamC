document.addEventListener('DOMContentLoaded', function() {
    var currentImage = document.getElementById('currentImage');
    var currentIndex = 0;
    var images = ["lady-jane-grey.jpg", "1.jpg", "2.jpg"]; // TODO

    document.getElementById('prevButton').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    });

    document.getElementById('nextButton').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    });

    function updateImage() {
        var imageName = images[currentIndex];
        currentImage.src = './image/' + imageName;
        loadCSVData(imageName.split('.')[0]);
    }

    function loadCSVData(imageName) {
        Papa.parse(`csv/${imageName}.csv`, {
            download: true,
            header: true,
            complete: function(results) {
                var csvData = results.data;
                generateHTML(csvData);
            }
        });
    }

    function generateHTML(data) {
        var gallery = document.getElementById('gallery');
        var existingMarkers = gallery.querySelectorAll('.marker, .info');
        existingMarkers.forEach(function(el) {
            gallery.removeChild(el);
        });

        data.forEach(function(row) {
            var marker = document.createElement('div');
            marker.className = 'marker';
            marker.style = `position: absolute; top: ${row.marker_top}; left: ${row.marker_left}; width: 20px; height: 20px; background-color: red; border-radius: 50%; cursor: pointer;`;
            
            var info = document.createElement('div');
            info.className = 'info';
            info.innerHTML = row.info_content;
            info.style = `position: absolute; top: ${row.info_top}; left: ${row.info_left}; background-color: white; border: 1px solid black; padding: 10px; display: none;`;
    
            marker.onmouseover = function() {
                info.style.display = 'block';
            };
    
            marker.onmouseout = function() {
                info.style.display = 'none';
            };
    
            gallery.appendChild(marker);
            gallery.appendChild(info);
        });
    }

    updateImage();
});


// document.querySelectorAll('.marker').forEach(marker => {
//     marker.addEventListener('mouseover', () => {
//         const infoId = marker.id.replace('marker', 'info');
//         document.getElementById(infoId).style.display = 'block';
//     });

//     marker.addEventListener('mouseout', () => {
//         const infoId = marker.id.replace('marker', 'info');
//         document.getElementById(infoId).style.display = 'none';
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {
//     var toggleButton = document.getElementById('toggleButton');
//     toggleButton.addEventListener('click', function () {
//         if (toggleButton.textContent === 'fact') {
//             toggleButton.textContent = 'story';
//         } else {
//             toggleButton.textContent = 'fact';
//         }
//     });
// });
