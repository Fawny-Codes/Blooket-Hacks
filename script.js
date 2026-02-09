document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const hackId = this.getAttribute('data-hack');
            const codeElement = document.getElementById(hackId);
            
            if (!codeElement) return;

            const code = codeElement.textContent;

            try {
                // Try using the modern Clipboard API first
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(code);
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = code;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }

                // Show success state
                const originalText = this.textContent;
                this.classList.add('copied');
                this.textContent = '✓ Copied!';
                this.disabled = true;

                // Reset button after 2 seconds
                setTimeout(() => {
                    this.classList.remove('copied');
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);

            } catch (err) {
                console.error('Failed to copy:', err);
                alert('Failed to copy code. Please try again.');
            }
        });
    });

    // Add keyboard shortcut info (optional)
    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(code => {
        code.addEventListener('click', function(e) {
            if (e.detail === 3) { // Triple click
                const range = document.createRange();
                range.selectNodeContents(this);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hack-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Detect if user is in Blooket game
function detectBlooketGame() {
    return window.location.hostname.includes('blooket.com');
}

// Add warning if trying to use on non-Blooket page
if (!detectBlooketGame() && window.location.protocol === 'https:' && !window.location.hostname.includes('localhost')) {
    console.warn('These scripts should be used on blooket.com');
}
