const stupify = (element) => {
    let originalText = element.innerHTML;
    let stupidString = originalText.toLowerCase().split('');

    for (let i = 0; i < originalText.length; i++) {
        const rando = Math.random();
        if (rando < 0.5) {
            stupidString[i] = stupidString[i].toUpperCase();
        }
    }

    element.innerHTML = stupidString.join('');
};

const textBlocks = document.querySelectorAll('p');

textBlocks.forEach(element => stupify(element));
