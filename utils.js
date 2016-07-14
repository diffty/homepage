// FONCTIONS UTILITAIRES
function getMousePos (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
        y: Math.floor((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
    }
} 

function easeInOutQuad (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

function posAdd (posA, posB) {
    return {x: posA.x + posB.x, y: posA.y + posB.y}
}

function posSub (posA, posB) {
    return {x: posA.x - posB.x, y: posA.y - posB.y}
}  