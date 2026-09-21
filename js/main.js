document.addEventListener('DOMContentLoaded', () => {
    // Toolbox Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const techPills = document.querySelectorAll('.tech-pill');
    const searchInput = document.getElementById('techSearch');

    function filterTech() {
        const activeBtn = document.querySelector('.filter-btn.active');
        if(!activeBtn) return;
        const activeFilter = activeBtn.dataset.filter;
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        techPills.forEach(pill => {
            const categories = (pill.dataset.category || '').split(' ');
            const techNameSpan = pill.querySelector('span:not(.custom-icon)');
            const techName = techNameSpan ? techNameSpan.textContent.toLowerCase() : '';
            
            const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
            const matchesSearch = techName.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                pill.style.display = 'flex';
            } else {
                pill.style.display = 'none';
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterTech();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterTech);
    }

    // The 3D Server Rack now uses pure CSS for its sliding animations!

    // Express Train & Auto-Billboard Logic
    const subwayScene = document.getElementById('subwayScene');
    const scrollTrain = document.getElementById('scrollTrain');
    const subwayNodes = document.querySelectorAll('.subway-node');
    const eduPath = document.getElementById('eduPath');
    const workPath = document.getElementById('workPath');
    
    if (subwayScene && scrollTrain && eduPath && workPath) {
        const eduLength = eduPath.getTotalLength();
        const workLength = workPath.getTotalLength();
        
        // Initialize dash array for drawing
        eduPath.style.strokeDasharray = eduLength;
        eduPath.style.strokeDashoffset = eduLength;
        workPath.style.strokeDasharray = workLength;
        workPath.style.strokeDashoffset = workLength;

        window.addEventListener('scroll', () => {
            const rect = subwayScene.getBoundingClientRect();
            // Calculate how far down the scene the center of the viewport is
            // We use a slight offset so the train starts moving earlier
            const scrollPercent = Math.max(0, Math.min(1, (window.innerHeight / 1.5 - rect.top) / rect.height));
            
            // Draw the track just slightly ahead of the train
            const drawPercent = Math.min(1, scrollPercent + 0.05);
            eduPath.style.strokeDashoffset = eduLength - (drawPercent * eduLength);
            workPath.style.strokeDashoffset = workLength - (drawPercent * workLength);
            
            // Get exact coordinates along the SVG path based on scroll percentage
            const point = eduPath.getPointAtLength(scrollPercent * eduLength);
            
            // Map SVG coordinates (viewBox 0 0 800 800) to percentage of container
            const percentX = (point.x / 800) * 100;
            const percentY = (point.y / 800) * 100;
            
            scrollTrain.style.left = `${percentX}%`;
            scrollTrain.style.top = `${percentY}%`;

            // Calculate Train Rotation based on path tangent
            // Look slightly ahead on the path to find the direction
            const lookAhead = Math.min(eduLength, (scrollPercent * eduLength) + 5);
            const nextPoint = eduPath.getPointAtLength(lookAhead);
            let angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
            
            // Apply rotation to the wrapper (maintaining the centering translate)
            scrollTrain.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            
            // Activate nodes when the train docks at them
            subwayNodes.forEach(node => {
                const nodeTop = parseFloat(node.style.top);
                // Tight activation window for exact docking
                if (Math.abs(percentY - nodeTop) < 8) {
                    node.classList.add('active');
                } else {
                    node.classList.remove('active');
                }
            });
        });
    }
});
