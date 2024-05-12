document.addEventListener('DOMContentLoaded', function() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        document.getElementById('desktop-content').style.display = 'none';
        document.getElementById('mobile-warning').style.display = 'block';
    }
});
