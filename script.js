function flip(card) {
    if (card.classList.contains('card--open'))
        card.classList.remove('card--open');
    else
        card.classList.add('card--open');
}