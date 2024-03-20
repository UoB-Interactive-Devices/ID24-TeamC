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
            // the number (around 2) at the end is the magic number
            var markTopPercent = parseInt(row.marker_top) / originalHeight * imageHeight*2 + imageOffsetTop;
            var markLeftPercent = parseInt(row.marker_left) / originalWidth * imageWidth*2 + imageOffsetLeft;
            var markWidthPercent = parseInt(row.marker_width) / originalWidth * imageWidth*2;
            var markHeightPercent = parseInt(row.marker_height) / originalHeight * imageHeight*2;

            var infoTopPercent = parseInt(parseInt(row.info_top) / originalHeight * imageHeight)*2;
            var infoLeftPercent = parseInt(parseInt(row.info_left) / originalWidth * imageWidth)*2;

            console.log(markTopPercent, markLeftPercent);

            if (row.type === 'text') {

                // marker
                var marker = document.createElement('div');
                marker.className = 'marker';
                marker.style.position = 'absolute';
                marker.style.top = markTopPercent + 'px';
                marker.style.left = markLeftPercent + 'px';
                marker.style.width = markWidthPercent + 'px';
                marker.style.height = markHeightPercent + 'px';
                marker.style.backgroundColor = 'transparent';
                marker.style.border = '2px solid red';
                marker.style.zIndex = '1';
                gallery.appendChild(marker);

                // info
                var info = document.createElement('div');
                info.className = 'info';
                info.style.position = 'absolute';
                info.style.top = infoTopPercent + 'px';
                info.style.left = infoLeftPercent + 'px'; 
                info.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; 
                info.style.border = '1px solid black';
                info.style.padding = '10px';
                info.style.display = 'none';
                info.style.zIndex = '2';
                info.style.fontSize = '25px'; 
                info.innerHTML = row.info_content;
                gallery.appendChild(info);

                // audio
                var audio = document.createElement('audio');
                audio.src = './audio/' + row.audio;
                audio.preload = 'auto';
                gallery.appendChild(audio);


                // pointer
                marker.onmouseover = function() {
                    info.style.display = 'block';
                    audio.play();
                };

                marker.onmouseout = function() {
                    info.style.display = 'none';
                    // audio.pause();
                };
            
                // for audio only
            }else if(row.type == 'audio'){
                var audioMarker = document.createElement('div');
                audioMarker.className = 'audio-marker';
                audioMarker.style.position = 'absolute';
                audioMarker.style.top = markTopPercent/2 + 'px';
                audioMarker.style.left = markLeftPercent/2 + 'px';
                audioMarker.style.width = '20px'; 
                audioMarker.style.height = '20px'; 
                audioMarker.style.borderRadius = '50%'; 
                audioMarker.style.backgroundColor = 'blue'; 
                audioMarker.style.cursor = 'pointer'; 
                audioMarker.style.zIndex = '1';
                gallery.appendChild(audioMarker);

                console.log(markTopPercent, markLeftPercent);


                audioMarker.addEventListener('mouseover', function() {
                    var audio = document.createElement('audio');
                    audio.src = './audio/' + row.audio;
                    audio.preload = 'auto';
                    audio.play();
                });
            }

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
