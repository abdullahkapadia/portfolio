document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar & Navigation Logic ---
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    openSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Allow external links (like github/linkedin if they ever use nav-link class)
            if (targetId.startsWith('http')) return;
            
            e.preventDefault();
            
            // Close sidebar
            sidebar.classList.remove('active');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section, hide others
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                sections.forEach(sec => sec.classList.remove('active'));
                targetSection.classList.add('active');
            }
        });
    });

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-moon';
        } else {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }

    // --- Accordion Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Close other items in the same accordion group (optional, keeping it simple here: toggle current)
            const isActive = item.classList.contains('active');
            
            // Close all
            item.parentElement.querySelectorAll('.accordion-item').forEach(sibling => {
                sibling.classList.remove('active');
            });

            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Greeting Cycler ---
    const greetingElement = document.getElementById('greetingText');
    if (greetingElement) {
        const greetings = [
            "Hello.",
            "Annyeonghaseyo.",
            "Asalaam alaikum.",
            "Bonjour.",
            "Xin chào.",
            "Kamusta."
        ];
        let greetingIndex = 0;

        setInterval(() => {
            // Fade out
            greetingElement.style.opacity = '0';
            setTimeout(() => {
                greetingIndex = (greetingIndex + 1) % greetings.length;
                greetingElement.textContent = greetings[greetingIndex];
                // Fade in
                greetingElement.style.opacity = '1';
            }, 500); // Wait half a second before changing text
        }, 3000); // Change every 3 seconds

        // Add CSS transition via JS or ensure CSS handles it
        greetingElement.style.transition = 'opacity 0.5s ease-in-out';
    }

    // --- Terminal Logic ---
    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');

    if (terminalInput && terminalBody) {
        const commands = {
            'help': 'Available commands:\n- help: Show this message\n- whoami: Display user info\n- clear: Clear the terminal\n- neofetch: Display system info',
            'whoami': 'guest user visiting Abdullah Kapadia\'s portfolio.',
            'neofetch': 'OS: WebOS\nKernel: Browser Engine\nUptime: Just started\nPackages: 0\nShell: JS-Bash\nResolution: 1920x1080\nDE: HTML5\nWM: CSS3\nTheme: Minimal (geettrivedi clone)\nIcons: FontAwesome\nTerminal: Custom div'
        };

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                terminalInput.value = '';

                // Echo command
                const echoLine = document.createElement('div');
                echoLine.className = 'terminal-line';
                echoLine.innerHTML = `<span class="prompt-text">guest@portfolio:~$</span> ${cmd}`;
                
                // Insert before the prompt wrapper
                const promptWrapper = document.querySelector('.terminal-prompt-wrapper');
                terminalBody.insertBefore(echoLine, promptWrapper);

                if (cmd === 'clear') {
                    // Remove all terminal lines except prompt wrapper
                    const lines = terminalBody.querySelectorAll('.terminal-line');
                    lines.forEach(line => line.remove());
                } else if (cmd !== '') {
                    // Execute command
                    const outputLine = document.createElement('div');
                    outputLine.className = 'terminal-line';
                    
                    if (commands[cmd]) {
                        // Handle newlines in output
                        outputLine.innerHTML = commands[cmd].replace(/\n/g, '<br>');
                    } else {
                        outputLine.textContent = `Command not found: ${cmd}`;
                    }
                    terminalBody.insertBefore(outputLine, promptWrapper);
                }

                // Scroll to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }
});
