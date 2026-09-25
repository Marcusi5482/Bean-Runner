import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

kaplay({
    background: [62, 175, 250],
    setFullscreen: true,
    orientation: "landscape",
});

loadSprite("bean", "/sprites/bean.png");
loadSprite("ghost", "/sprites/ghosty.png");
loadSprite("heart", "/sprites/heart.png");
loadSound("burp", "/sounds/burp.mp3");

setGravity(675);

setFullscreen(true);

scene("game", () => {
    let i = 0;
    let score = 0;
    let speed_ghost = 1.0;
    let center_x_gh = center().x * 2.5;
    let center_y_gh = center().y - 8;

    const player = add([
        sprite("bean"),
        pos(30, 10),
        health(3),
        area(), // дает игроку хитбокс
        body(), // включает физику игрока
    ]);

    const heart1 = add([
        sprite("heart"),
        pos(width() / 1.01, 10),
        opacity(1),
        anchor("topright"),
    ]);

    const heart2 = heart1.add([
        sprite("heart"),
        pos(-43, 0),
        opacity(1),
        anchor("topright"),
    ]);

    const heart3 = heart2.add([
        sprite("heart"),
        pos(-43, 0),
        opacity(1),
        anchor("topright"),
    ]);

    // const score_text = add([
    //     text("Score: " + score),
    //     pos(10, 10),
    // ]);

    add([
        pos(center().x, center().y * 1.5),
        anchor("center"),
        rect(width(), height() / 2),
        color(128, 10, 1),
    ]);

    add([
        rect(width(), 9),
        pos(center()),
        anchor("center"),
        color(14, 184, 2),
        area(),
        body({ isStatic: true}),
    ]);

    player.onCollide("enemy", (enemy) => {
        player.hurt(1);
        destroy(enemy);

        switch(player.hp())
        {
            case 0:
                go("gameover", score);
                break;
            case 1:
                heart2.opacity = 0;
                break;
            case 2:
                heart1.opacity = 0;
                break;
            
        }
    });

    player.onCollide("health", (health) => {
        if(player.hp() != 3) {
            switch(player.hp())
            {
                case 1:
                    heart2.opacity = 1;
                    break;
                case 2:
                    heart1.opacity = 1;
                    break;

            }
            player.heal(1); 
        }
        destroy(health);
    });

    onUpdate(() =>{
        i++;
        score++;
        //score_text.text = "Score: " + score;

        if(i >= 100)
            speed_ghost = speed_ghost + 0.01;
            //speed_ghost++;

        if(i >= rand(250 - (speed_ghost * 10), 1000)) {
            if(rand(1, 10) == 1){
                add([
                    sprite("heart"),
                    pos(center_x_gh, center_y_gh),
                    area(),
                    anchor("bot"),
                    offscreen(),
                    "health",
                    "moveleft",
                ]);
            } else {
                add([
                    sprite("ghost"),
                    pos(center_x_gh, center_y_gh),
                    area(),
                    anchor("bot"),
                    offscreen(),
                    "enemy",
                    "moveleft",
                ]);
            }
            
            i = 0;
        }

        
    });

    onUpdate("moveleft", (objects) => {
        objects.move(-100 * speed_ghost, 0);
        if (!objects.isOffScreen() && objects.offscreen != {destroy: true}) {
            objects.offscreen = {destroy: true};
        }
    });

    onKeyPress("space", () => {
        // Проверяем, стоит ли персонаж на земле, чтобы он не прыгал в воздухе
        if (player.isGrounded()) {
            player.jump(600);
        }
    });

    onMousePress(() => {
        if (player.isGrounded()) {
            player.jump(600);
        }
    });
});

scene("gameover", (score) => {
    play("burp", {
        volume: 0.5,
        lopp: false,
    });
    add([
        text("Game Over"),
        pos(center().x, center().y - 100),
        anchor("center"),
    ]);

    add([
        text("Score: " + score),
        pos(center().x, center().y - 50),
        anchor("center"),
    ]);

    add([
        text("space or click mouse"),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("to restart"),
        pos(center().x, center().y + 50),
        anchor("center"),
    ]);

    onKeyPress("space", () => {
        go("game");
    });

    onMousePress(() => {
        go("game");
    });
});

go("game");

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
