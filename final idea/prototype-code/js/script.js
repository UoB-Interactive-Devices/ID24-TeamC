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

    // show image using CSV data
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
        var originalWidth = 14043;
        var originalHeight = 9933;

        // current image pixel
        var imageWidth = currentImage.width;
        var imageHeight = currentImage.height;

        var imageOffsetLeft = currentImage.offsetLeft;
        var imageOffsetTop = currentImage.offsetTop;

        console.log(imageWidth, imageHeight);

        data.forEach(function(row) {

            // TODO: figure out why this ratio calculation is wrong here
            // the float at the end is the magic number
            var markTopPercent = parseInt(row.marker_top) / originalHeight * imageHeight*2 + imageOffsetTop;
            var markLeftPercent = parseInt(row.marker_left) / originalWidth * imageWidth*2 + imageOffsetLeft;
            var markWidthPercent = parseInt(row.marker_width) / originalWidth * imageWidth*2;
            var markHeightPercent = parseInt(row.marker_height) / originalHeight * imageHeight*2;

            var infoTopPercent = parseInt(parseInt(row.info_top) / originalHeight * imageHeight)*2;
            var infoLeftPercent = parseInt(parseInt(row.info_left) / originalWidth * imageWidth)*2;

            console.log(markTopPercent, markLeftPercent);
            // marker
            var marker = document.createElement('div');
            marker.className = 'marker';
            marker.style = `position: absolute; top: ${markTopPercent}px; left: ${markLeftPercent}px; width: ${markWidthPercent}px; height: ${markHeightPercent}px; background-color: transparent; border: 2px solid red; z-index: 1;`;

            // info
            var info = document.createElement('div');
            info.className = 'info';
            info.innerHTML = row.info_content;
            info.style = `position: absolute; top: ${infoTopPercent}px; left: ${infoLeftPercent}px; background-color: white; border: 1px solid black; padding: 10px; display: none; z-index: 2; font-size:25px`;

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

    // hide the image by pressing space key
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            if (currentImage.style.display === 'none') {
                currentImage.style.display = 'block';
                document.getElementById('prevButton').style.display = 'block';
                document.getElementById('nextButton').style.display = 'block';
            } else {
                currentImage.style.display = 'none';
                document.getElementById('prevButton').style.display = 'none';
                document.getElementById('nextButton').style.display = 'none';
            }
        }
    });

    updateImage();
});
