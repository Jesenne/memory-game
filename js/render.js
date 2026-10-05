const SVG_NS = 'http://www.w3.org/2000/svg';

let paintings = [];

// cоздаёт элемент, ставит атрибуты и добавляет детей
function el(tag, attrs = {}, children = [], ns = null) {
    const node = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
        node.setAttribute(name, value);
    }
    for (const child of children) {
        node.append(child);
    }
    return node;
}

// Рекурсивно строит SVG-элемент из описания в JSON
function createSvgShape(shape) {
    const children = (shape.children || []).map(createSvgShape);
    return el(shape.tag, shape.attrs, children, SVG_NS);
}

function createCard(painting) {
    const svg = el('svg', {
        class: 'card__image',
        viewBox: '0 0 60 70',
        preserveAspectRatio: 'xMidYMid meet',
        style: `background:${painting.background}`
    }, painting.shapes.map(createSvgShape), SVG_NS);

    const caption = el('small', { class: 'card__caption' }, [
        painting.title,
        el('br'),
        painting.author
    ]);

    return el('button', {
        class: 'card',
        'data-title': painting.title,
        'aria-label': 'Карточка',
        onclick: 'flip(this)'
    }, [
        el('div', { class: 'card__inner' }, [
            el('div', { class: 'card__back' }),
            el('div', { class: 'card__front' }, [svg, caption])
        ])
    ]);
}

function createCardSet() {
    return [...paintings, ...paintings]
        .sort(() => Math.random() - 0.5)
        .map(createCard)
}

function createHeader() {
    const newGame = el('button', { class: 'button button--primary', id: 'new-game' }, ['Новая игра']);
    const highScore = el('button', { class: 'button', id: 'high-score' }, ['Таблица лидеров']);

    return el('header', { class: 'header' }, [
        el('h1', { class: 'header__title' }, ['Мемо картины']),
        el('div', { class: 'header__buttons' }, [newGame, highScore])
    ]);
}

function createStats() {
    return el('div', { class: 'stats' }, [
        el('span', { class: 'stats__item' }, [
            'Ходы: ',
            el('b', { class: 'stats__value', id: 'moves' }, ['0'])
        ]),
        el('span', { class: 'stats__item' }, [
            'Пары: ',
            el('b', { class: 'stats__value', id: 'pairs' }, ['0']),
            ' из 8'
        ])
    ]);
}

function createBoard() {
    return el('main', { class: 'board', id: 'board' });
}

async function renderBody() {
    const response = await fetch('js/data.json');
    paintings = await response.json();

    document.body.append(
        createHeader(),
        createStats(),
        createBoard(),
    );
    // игровой скрипт подключаем после отрисовки, чтобы он нашёл элементы
    document.body.append(el('script', { src: 'js/app.js' }));
}

function dealCards() {
    document.getElementById('board').replaceChildren(...createCardSet());
}

renderBody();