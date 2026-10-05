
const board = document.getElementById('board');
const movesElem = document.getElementById('moves');
const pairsElem = document.getElementById('pairs');
const modalScore = document.getElementById('modalScore');
const modalWin = document.getElementById('modalWin');
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
        if (pairs === 8) setTimeout(win, 600);
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

function win() {
    document.getElementById('result').textContent = `Все пары найдены за ${moves} ходов`;
    modalWin.returnValue = '';
    setTimeout(() => modalWin.showModal(), 600);
}

function highScore() {
    modalScore.showModal();
}

modalWin.addEventListener('close', () => { if (modalWin.returnValue === 'new') startGame() });
document.getElementById('high-score').addEventListener('click', highScore);
document.getElementById('new-game').addEventListener('click', startGame);

startGame();
