function rainbow(text) {
    let colors = [
        '#FF0000',
        '#FF7F00',
        '#FFFF00',
        '#00FF00',
        '#0000FF',
        '#4B0082',
        '#8B00FF',
    ];
    let result = '';
    for (var i = 0; i < text.length; i++) {
        let color = colors[i % colors.length];
        result += `<span style="color: ${color}">${text[i]}</span>`;
    }
    return result;
}

document.getElementById('container').innerHTML = rainbow(
    'This is an (amazing) JS demo'
);
