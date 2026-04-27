document.addEventListener('DOMContentLoaded', function() {
    initializeLinkEffects();
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
});

window.addEventListener('pageshow', clearPressedLinkState);

function initializeLinkEffects() {
    document.querySelectorAll('.link-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            clearPressedLinkState();
        });
    });
}

function clearPressedLinkState() {
    const isTouchPointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (isTouchPointer && document.activeElement && document.activeElement.classList.contains('link-button')) {
        document.activeElement.blur();
    }
}
