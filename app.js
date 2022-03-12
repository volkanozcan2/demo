const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    resizeTo: window
});
let play = false;
const player = document.getElementById("muzak");
document.body.appendChild(app.view);
document.addEventListener("keydown", function(e) {
    if (e.code == "Space") {
        play = !play;
        (play) ? player.play(): player.pause();
    }
});
let cameraVector = {
    a: 0,
    l: 0
}
let center = {}
const container = new PIXI.Container(50000);
container.sortableChildren = true
document.addEventListener("mousemove", function(e) {
    center.x = app.screen.width / 2;
    center.y = app.screen.height / 2;
    a = center.x - e.x;
    b = center.y - e.y;
    cameraVector.a = Math.atan2(center.y - e.y, center.x - e.x);
    cameraVector.l = Math.sqrt(a * a + b * b);
})
app.stage.addChild(container);
let sayaç = 0;
const texture = PIXI.Texture.from('star.png');
const öcü = PIXI.Texture.from('öcü.png');
const rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min))
const AdvancedBloom = new PIXI.filters.AdvancedBloomFilter({
    bloomScale: 2,
    brightness: 2
});
const bloom = new PIXI.filters.BloomFilter();
container.filters = [bloom];

for (let i = 0; i < 10000; i++) {
    let luck = ~~(Math.random() * 1000) == 999;
    sayaç += (luck) ? 1 : 0;
    const star = (luck) ? new PIXI.Sprite(öcü) : new PIXI.Sprite(texture);
    let scale = (Math.random()) / 4
    star.anchor.set(0.5);
    star.scale.set((luck) ? 0.3 + Math.random() * 0.7 : scale);
    star.tint = 0xfa0000 * Math.random();
    star.x = rnd(-4 * window.innerWidth, 4 * window.innerWidth);
    star.y = rnd(-4 * window.innerHeight, 4 * window.innerHeight);
    star.l = Math.random() * 4;
    star.zIndex = scale;
    star.update = function() {
        this.x += Math.cos(cameraVector.a) * cameraVector.l * (scale / 10);
        this.y += Math.sin(cameraVector.a) * cameraVector.l * (scale / 10);
    }
    container.addChild(star);
}

container.x = app.screen.width / 8;
container.y = app.screen.height / 8;

container.pivot.x = container.width / 8;
container.pivot.y = container.height / 8;
console.log(sayaç + " tane öcü var")
app.ticker.add((delta) => {
    for (const star of container.children) {
        star.update();

    }
});