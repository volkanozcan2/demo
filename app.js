/* eslint-disable */
let cameraVector = {
        a: 0,
        l: 0
    },
    sound = PIXI.sound.Sound.from('key.mp3'),
    bgSound = PIXI.sound.Sound.from('audio.mp3'),
    center = {},
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
        resizeTo: window
    }),
    play = false,
    container = new PIXI.Container(50000),

    text = new PIXI.Text(`${(navigator.language=="tr")?"Arka plan müziğini çalmak/durdurmak için boşluk tuşuna bas.\nBaşlangıç noktasına dönmek için r tuşuna bas.":"Press space to play/pause background music\nPress r to reset location to beginning"}`, { fontFamily: 'monospace', fontSize: 24, fill: 0xdddddd, align: 'left' }),
    sayaç = 0,
    texture = PIXI.Texture.from('star.png'),
    img = PIXI.Texture.from('img.png'),
    rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min)),
    AdvancedBloom = new PIXI.filters.AdvancedBloomFilter({
        bloomScale: 2,
        brightness: 2
    }),
    lerp = (start, end, t) => start * (1 - t) + end * t;



text.x = text.y = 10;

document.body.appendChild(app.view);
document.addEventListener("touchmove", (e) => {
    let { clientX, clientY } = e.touches[0];

    center.x = app.screen.width / 2;
    center.y = app.screen.height / 2;
    a = clientX - center.x;
    b = clientY - center.y;
    cameraVector.a = Math.atan2(center.y - clientY, center.x - clientX);
    cameraVector.l = Math.sqrt(a * a + b * b);
})
document.addEventListener("keydown", function(e) {
    if (e.code == "Space") {
        text.text = ""
        play = !play;
        (play) ? bgSound.play(): bgSound.pause();
    }
    if (e.code == "KeyR") {
        text.text = ""
        for (const star of container.children) {
            star.goBack = true;
        }

    }
});
document.addEventListener("mousemove", function(e) {
    center.x = app.screen.width / 2;
    center.y = app.screen.height / 2;
    a = center.x - e.x;
    b = center.y - e.y;
    cameraVector.a = Math.atan2(center.y - e.y, center.x - e.x);
    cameraVector.l = Math.sqrt(a * a + b * b);
})
app.stage.addChild(container);
app.stage.addChild(text);
container.filters = [AdvancedBloom];
setTimeout(() => {
    text.visible = false;
}, 5000)
for (let i = 0; i < 10000; i++) {
    let luck = ~~(Math.random() * 1000) == 500;
    sayaç += (luck) ? 1 : 0;
    const star = (luck) ? new PIXI.Sprite(img) : new PIXI.Sprite(texture);
    star.id = i;
    let scale = (Math.random()) / 4
    star.anchor.set(0.5);
    star.interactive = luck;
    star.buttonMode = luck;
    star.on("pointerdown", function() {
        sound.filters = [new PIXI.sound.filters.ReverbFilter()];
        sound.play();
        sayaç--;
        this.texture = texture;
        this.scale.set(Math.random() / 4);
        this.interactive = false;
        this.buttonMode = false;
        window.document.title = (sayaç != 0) ? `${sayaç} tane daha kaldı` : `😎 `;
        if (sayaç == 0) {
            for (const star of container.children) {
                star.texture = img;
            }
        }
    })
    star.scale.set((luck) ? 0.3 + Math.random() * 0.7 : scale);
    star.tint = 0xfa0000 * Math.random();
    star.x = rnd(-4 * window.innerWidth, 4 * window.innerWidth);
    star.y = rnd(-4 * window.innerHeight, 4 * window.innerHeight);
    star.initialPos = {
        x: star.x,
        y: star.y
    }
    star.goBack = false;
    star.l = Math.random() * 4;
    star.zIndex = scale;
    star.update = function() {
        if (this.goBack) {
            this.x = lerp(this.x, this.initialPos.x, 0.5);
            this.y = lerp(this.y, this.initialPos.y, 0.5);
            this.goBack = (this.x == this.initialPos.x) ? false : true;
        } else {
            this.x += Math.cos(cameraVector.a) * cameraVector.l * (scale / 10);
            this.y += Math.sin(cameraVector.a) * cameraVector.l * (scale / 10);
        }
    }

    container.addChild(star);
}

container.x = app.screen.width / 8;
container.y = app.screen.height / 8;
container.pivot.x = container.width / 8;
container.pivot.y = container.height / 8;
//console.log(sayaç + " tane öcü var");

app.ticker.add((delta) => {
    for (const star of container.children) {
        star.update();
    }
});