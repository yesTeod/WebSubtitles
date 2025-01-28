function createSubtitleLoader() {
    // Create main container
    const loaderContainer = document.createElement('div');
    loaderContainer.style.position = 'fixed';
    loaderContainer.style.top = '50%';
    loaderContainer.style.left = '50%';
    loaderContainer.style.transform = 'translate(-50%, -50%)';
    loaderContainer.style.width = '300px';
    loaderContainer.style.height = '200px';
    loaderContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    loaderContainer.style.color = 'white';
    loaderContainer.style.border = '2px dashed #ccc';
    loaderContainer.style.borderRadius = '10px';
    loaderContainer.style.display = 'flex';
    loaderContainer.style.flexDirection = 'column';
    loaderContainer.style.justifyContent = 'center';
    loaderContainer.style.alignItems = 'center';
    loaderContainer.style.zIndex = '9999';
    loaderContainer.style.padding = '20px';
    loaderContainer.style.textAlign = 'center';

    // Drag and drop text
    const dropText = document.createElement('div');
    dropText.textContent = 'Drag and Drop SRT File Here';
    dropText.style.marginBottom = '10px';

    // Or select file button
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.srt';
    fileInput.style.display = 'none';

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Or Select SRT File';
    selectButton.style.backgroundColor = '#4CAF50';
    selectButton.style.color = 'white';
    selectButton.style.border = 'none';
    selectButton.style.padding = '10px 20px';
    selectButton.style.borderRadius = '5px';
    selectButton.style.cursor = 'pointer';

    selectButton.addEventListener('click', () => fileInput.click());

    // Make container draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    loaderContainer.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === loaderContainer) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, loaderContainer);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    // Drag and drop event listeners
    loaderContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        loaderContainer.style.backgroundColor = 'rgba(0,0,0,0.9)';
    });

    loaderContainer.addEventListener('dragleave', (e) => {
        loaderContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    });

    loaderContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        loaderContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
        
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    });

    // File input change event
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    });

    function handleFileUpload(file) {
        if (file && file.name.endsWith('.srt')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const srtText = event.target.result;
                // Remove the loader container
                document.body.removeChild(loaderContainer);
                // Call your main subtitle display function with the SRT text
                displaySubtitles(srtText);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid .srt file');
        }
    }

    // Append elements
    loaderContainer.appendChild(dropText);
    loaderContainer.appendChild(selectButton);
    loaderContainer.appendChild(fileInput);

    // Add to document
    document.body.appendChild(loaderContainer);
}

function displaySubtitles(srtText) {
    console.log('SRT file loaded:', srtText);
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px';
    container.style.right = '50px';
    container.style.width = '300px';
    container.style.backgroundColor = 'rgba(0,0,0,0.3)';
    container.style.color = 'white';
    container.style.borderRadius = '5px';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.style.transition = 'height 0.3s ease';

    // Subtitle display area
    const subtitleContainer = document.createElement('div');
    subtitleContainer.style.minHeight = '30px';
    subtitleContainer.style.marginBottom = '10px';
    subtitleContainer.style.fontSize = '16px';
    subtitleContainer.textContent = 'Subtitles will appear here';

    // Control container
    const controlContainer = document.createElement('div');
    controlContainer.style.display = 'flex';
    controlContainer.style.alignItems = 'center';
    controlContainer.style.gap = '10px';
    controlContainer.style.display = 'none'; // Initially hidden

    // Play/Pause button
    const playPauseBtn = document.createElement('button');
    playPauseBtn.textContent = 'Play';
    playPauseBtn.style.backgroundColor = '#4CAF50';
    playPauseBtn.style.color = 'white';
    playPauseBtn.style.border = 'none';
    playPauseBtn.style.padding = '5px 10px';
    playPauseBtn.style.borderRadius = '3px';

    // Progress bar
    const progressBar = document.createElement('input');
    progressBar.type = 'range';
    progressBar.min = '0';
    progressBar.max = '100';
    progressBar.value = '0';
    progressBar.style.flexGrow = '1';
    progressBar.style.cursor = 'pointer';

    // Toggle button
    const toggleBtn = document.createElement('div');
    toggleBtn.innerHTML = '▼';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.bottom = '0';
    toggleBtn.style.right = '0';
    toggleBtn.style.padding = '5px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.userSelect = 'none';

    let isControlsVisible = false;
    toggleBtn.addEventListener('click', () => {
        if (isControlsVisible) {
            controlContainer.style.display = 'none';
            toggleBtn.innerHTML = '▼';
            container.style.height = 'auto';
        } else {
            controlContainer.style.display = 'flex';
            toggleBtn.innerHTML = '▲';
            container.style.height = 'auto';
        }
        isControlsVisible = !isControlsVisible;
    });

    // Append elements
    controlContainer.appendChild(playPauseBtn);
    controlContainer.appendChild(progressBar);
    container.appendChild(subtitleContainer);
    container.appendChild(controlContainer);
    container.appendChild(toggleBtn);

    // Make the container draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    container.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === container) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, container);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    document.body.appendChild(container);

    // Subtitle parsing logic
    const subtitles = parseSRT(srtText);
    let currentSubtitle = null;
    let startTime = null;
    let isPaused = true;
    let pauseTime = 0;
    let totalDuration = subtitles[subtitles.length - 1].end;

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', () => {
        if (isPaused) {
            // If it's the first play or was paused
            if (!startTime) {
                startTime = performance.now();
            } else {
                // Adjust start time when resuming
                startTime += (performance.now() - pauseTime);
            }
            
            isPaused = false;
            playPauseBtn.textContent = 'Pause';
            playPauseBtn.style.backgroundColor = '#FF6347';
        } else {
            // Pause
            pauseTime = performance.now();
            isPaused = true;
            playPauseBtn.textContent = 'Play';
            playPauseBtn.style.backgroundColor = '#4CAF50';
        }
    });

    // Progress bar interaction
    progressBar.addEventListener('input', () => {
        const percentage = progressBar.value;
        const currentTime = (percentage / 100) * totalDuration;
        
        // Reset start time to reflect the new position
        startTime = performance.now() - (currentTime * 1000);
        
        // Find and display the subtitle at this time
        currentSubtitle = subtitles.find(sub => 
            currentTime >= sub.start && currentTime <= sub.end
        );
        
        if (currentSubtitle) {
            subtitleContainer.textContent = currentSubtitle.text;
        }
    });

    function updateSubtitles() {
        if (isPaused || !startTime) {
            requestAnimationFrame(updateSubtitles);
            return;
        }

        const currentTime = (performance.now() - startTime) / 1000;
        
        // Update progress bar
        const progressPercentage = (currentTime / totalDuration) * 100;
        progressBar.value = progressPercentage;

        const subtitle = subtitles.find(sub => 
            currentTime >= sub.start && currentTime <= sub.end
        );

        if (subtitle && subtitle !== currentSubtitle) {
            subtitleContainer.textContent = subtitle.text;
            currentSubtitle = subtitle;
        }

        requestAnimationFrame(updateSubtitles);
    }

    // Start the subtitle update loop
    updateSubtitles();
}

// SRT Parsing Function
function parseSRT(srtText) {
    const subtitles = [];
    const blocks = srtText.split(/\n\s*\n/);
    
    blocks.forEach(block => {
        const lines = block.split('\n');
        if (lines.length >= 3) {
            const timeMatch = lines[1].match(/(\d+:\d+:\d+,\d+)\s*-->\s*(\d+:\d+:\d+,\d+)/);
            if (timeMatch) {
                const start = timeToSeconds(timeMatch[1]);
                const end = timeToSeconds(timeMatch[2]);
                const text = lines.slice(2).join(' ');
                
                subtitles.push({
                    start,
                    end,
                    text
                });
            }
        }
    });
    
    return subtitles;
}

// Convert time string to seconds
function timeToSeconds(timeStr) {
    const [hours, minutes, secondsAndMs] = timeStr.split(':');
    const [seconds, milliseconds] = secondsAndMs.replace(',', '.').split('.');
    return (
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(seconds) +
        (parseInt(milliseconds) || 0) / 1000
    );
}

// Call the function to create the subtitle loader
createSubtitleLoader();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSubtitleLoader") {
    createSubtitleLoader();
  }
});