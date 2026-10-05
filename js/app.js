
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
    saveScore();
    document.getElementById('result').textContent = `Все пары найдены за ${moves} ходов`;
    modalWin.returnValue = '';
    modalWin.showModal();
    document.body.style.overflow = 'hidden';
}

function highScore() {
    renderScore();
    modalScore.showModal();
    document.body.style.overflow = 'hidden';
}

function saveScore() {
    const score = loadScore();
    score.push({
        moves: moves,
        date: new Date().toLocaleDateString('ru-RU')
    });
    // сортировка по количеству ходов (меньше — лучше), затем по дате (раньше — лучше)
    score.sort((a, b) => a.moves - b.moves || new Date(a.date) - new Date(b.date))
    const top = score.slice(0, 10);
    localStorage.setItem('MEMO_HIGH_SCORE', JSON.stringify(top));
}

function loadScore() {
    try {
        return JSON.parse(localStorage.getItem('MEMO_HIGH_SCORE')) || [];
    } catch {
        return [];
    }
}

function renderScore() {
    const score = loadScore();
    const list = document.getElementById('list');
    if (!list) return;
    document.getElementById('score-message').textContent = '';
    list.replaceChildren();
    if (score.length === 0) {
        document.getElementById('score-message').textContent = 'Пока нет результатов';
        return;
    }
    for (let i = 0; i < score.length; i++) {
        list.append(
            el('li', {}, [`${score[i].moves} ходов — ${score[i].date}`])
        );
    }
}

modalWin.addEventListener('close', () => { if (modalWin.returnValue === 'new') startGame() });
modalWin.addEventListener('close', () => { document.body.style.overflow = ''; });
modalScore.addEventListener('close', () => { document.body.style.overflow = ''; });
document.getElementById('high-score').addEventListener('click', highScore);
document.getElementById('new-game').addEventListener('click', startGame);

startGame();
