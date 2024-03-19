document.addEventListener('DOMContentLoaded', function() {
    var currentImage = document.getElementById('currentImage');
    var currentIndex = 0;
    var images = ["school-of-athens.jpg","lady-jane-grey.jpg"]; 

    // for slideshow function (Just in case)
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

    // load a target csv from ./csv/
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

    // generate HTML elements from csv data
    function generateHTML(data) {
        var gallery = document.getElementById('gallery');
        var existingMarkers = gallery.querySelectorAll('.marker, .info');
        existingMarkers.forEach(function(el) {
            gallery.removeChild(el);
        });

        // A0 poster pixel
        var originalWidth = 9933;
        var originalHeight = 14043;


        data.forEach(function(row) {

            var markTopPercent = parseFloat(row.marker_top) / originalHeight * 100;
            var markLeftPercent = parseFloat(row.marker_left) / originalWidth * 100;

            var infoTopPercent = parseFloat(row.info_top) / originalHeight * 100;
            var infoLeftPercent = parseFloat(row.info_left) / originalWidth * 100;

            // marker
            var marker = document.createElement('div');
            marker.className = 'marker';
            marker.style = `position: absolute; top: ${markTopPercent}%; left: ${markLeftPercent}%; width: 20px; height: 20px; background-color: red; border-radius: 50%; cursor: pointer; z-index: 1;`;
            
            // info
            var info = document.createElement('div');
            info.className = 'info';
            info.innerHTML = row.info_content;
            info.style = `position: absolute; top: ${infoTopPercent}; left: ${infoLeftPercent}; background-color: white; border: 1px solid black; padding: 10px; display: none; z-index: 2;`;

            // audio
            var audio = document.createElement('audio');
            audio.src = './audio/' + row.audio;
            audio.preload = 'auto';

            // pointer
            marker.onmouseover = function() {
                info.style.display = 'block';
                audio.play();
            };

            marker.onmouseout = function() {
                info.style.display = 'none';
                // audio.pause();
            };

            gallery.appendChild(marker);
            gallery.appendChild(info);
            gallery.appendChild(audio); 
        });
    }

    // hide image by pressing space key
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            if (currentImage.style.display === 'none') {
                currentImage.style.display = 'block';
            } else {
                currentImage.style.display = 'none';
            }
        }
    });

    updateImage();
});
