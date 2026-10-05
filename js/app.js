
const board = document.getElementById('board');
const movesElem = document.getElementById('moves');
const pairsElem = document.getElementById('pairs');
let first, lock, moves, pairs;

function startGame() {
    moves = 0; pairs = 0; first = null; lock = false;
    movesElem.textContent = 0;
    pairsElem.textContent = 0;

    dealCards();
}

function flip(card) {
    if (lock || card.classList.contains('card--open') || card.classList.contains('card--done')) return;
    card.classList.add('card--open');
    if (!first) { first = card; return }
    moves++; movesElem.textContent = moves;
    if (first.dataset.title === card.dataset.title) {
        first.classList.replace('card--open', 'card--done');
        card.classList.replace('card--open', 'card--done');
        first = null;
        pairsElem.textContent = ++pairs;
        if (pairs === 8) setTimeout(alert, 600, "win");
    } else {
        lock = true;
        setTimeout(() => {
            first?.classList.remove('card--open');
            card.classList.remove('card--open');
            first = null;
            lock = false;
        }, 900);
    }
}


//document.getElementById('high-score').onclick = ;
document.getElementById('new-game').onclick = startGame;

startGame();
