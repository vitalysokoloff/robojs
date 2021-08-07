import Vector2 from "../js/game/vector2.js";
import Collider from "../js/game/collider.js";
import {GO, Roof, Wall, Robot, Laser} from "../js/game/gameObject.js";

let shot = new Audio("res/laser.ogg");
shot.volume = 0.5;
let exp = new Audio("res/explosion.ogg");
exp.volume = 0.2;
let music = new Audio("res/music.ogg");
music.loop = true;
music.volume = 0.1
let hit = new Audio("res/hit.ogg");

let sprites = new Image();
sprites.src = "res/spriteset.png";
sprites.onload = function(){
    sprites.isLoad = true;
  };
let gui = new Image();
gui.src = "res/interface.png";
gui.onload = function(){
    gui.isLoad = true;
  };

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
ctx.fillStyle = "#FFFFFF";

let lastTime = 0; // Нужно для дельтатайма

let floors = tileMaker(0, 300, 240);
let roofs = tileMaker(0, 0, 0);
let walls = wallsMaker(180, 240);
let bullet = Wall.bullet(540, 240, 0, 0);
let character = Robot.create(new Vector2(0, 120), new Collider(new Vector2(23, 145), new Vector2(14, 15)), new Collider(new Vector2(0, 120), new Vector2(60,60)));
character.isAlive = false;
let laser = new  Laser(new Vector2(30,0), new Collider(new Vector2(38,28), new Vector2(36, 8)), new Collider(new Vector2(120,120), new Vector2(60, 60)));
laser.isAlive = false;
let arraowDownPressed = false;
let arraowUpPressed = false;
let arraowLeftPressed = false;

let isPlay = false;
let scores = 0;
let totalScores = getTotalScores();

let mousePosition;

canvas.onclick = function(){
    if(!isPlay){
        if (mousePosition.x > 150 && mousePosition.x < 210) {
            if (mousePosition.y > 150 && mousePosition.y < 210) {
                character.isAlive = true;
                isPlay = true;                
            }
        }
    }
    else {
        if (!character.isAlive) {
            if (mousePosition.x > 150 && mousePosition.x < 210) {
                if (mousePosition.y > 170 && mousePosition.y < 230) {
                    document.location.reload();               
                }
            }
        }
        else {
            if (mousePosition.x > 280 && mousePosition.x < 340) {
                if (mousePosition.y > 420 && mousePosition.y < 480) {
                    character.up();;               
                }
            }
            if (mousePosition.x > 220 && mousePosition.x < 280) {
                if (mousePosition.y > 480 && mousePosition.y < 540) {
                    if (character.isAlive && !laser.isAlive) {
                        character.fire();
                        laser.isAlive = true;
                        laser.position.y = character.position.y;
                        laser.collider.top = character.position.y + 28; // колайдер смещается, т к координаты спрайта левый верхний угол, а колайдер меньше спрайта
                        laser.position.x = 30;
                        laser.collider.left = 30;
                        arraowLeftPressed = true;
                    };               
                }
            }
            if (mousePosition.x > 280 && mousePosition.x < 340) {
                if (mousePosition.y > 540 && mousePosition.y < 600) {
                    character.down();             
                }
            }
        }

    }
}

canvas.addEventListener('mouseup', function (e) {
    mousePosition = new Vector2(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    console.log(mousePosition.x + " " + mousePosition.y);
});

document.onkeydown = function (e) {
    switch (e.key) {
        case 'ArrowDown':
            if (!arraowDownPressed) {
                character.down();
                arraowDownPressed = true;
            }
            break;
        case 'ArrowUp':
            if (!arraowUpPressed) {
                character.up();
                arraowUpPressed = true;
            }
            break;
        case 'ArrowLeft':
            if (!arraowLeftPressed) {
                if (character.isAlive && !laser.isAlive) {
                    character.fire();
                    laser.isAlive = true;
                    laser.position.y = character.position.y;
                    laser.collider.top = character.position.y + 28; // колайдер смещается, т к координаты спрайта левый верхний угол, а колайдер меньше спрайта
                    laser.position.x = 30;
                    laser.collider.left = 30;
                    arraowLeftPressed = true;
                };
            };
            break;
    }
    
}

document.onkeyup = function (e) {
    switch (e.key) {
        case 'ArrowDown':
            if (arraowDownPressed)
                arraowDownPressed = false;
            break;
        case 'ArrowUp':
            if (arraowUpPressed)
                arraowUpPressed = false;
            break;
        case 'ArrowLeft':
            if (arraowLeftPressed) {
                arraowLeftPressed = false;
                shot.play();
            }
            break;
    }
    
}

function drawGUI() {
    if (gui.isLoad) {
        if (!isPlay) {
            ctx.drawImage(
            gui,
            0,
            0,
            60,
            60,
            150,
            150,
            60,
            60
            );        
        }
        else { 
            if (!character.isAlive) {
                ctx.drawImage(
                gui,
                60,
                0,
                60,
                60,
                150,
                170,
                60,
                60
                );
            }
        }
        ctx.drawImage(
        gui,
        120,
        0,
        60,
        60,
        280,
        420,
        60,
        60
        );
        ctx.drawImage(
        gui,
        0,
        60,
        60,
        60,
        280,
        540,
        60,
        60
        );
        ctx.drawImage(
        gui,
        60,
        60,
        60,
        60,
        220,
        480,
        60,
        60
        );
    }
}

function getTotalScores() {
    let data = JSON.parse(localStorage.getItem("roboJS"));
    if (data != null) {
        return data["scores"];
    }
    else {
        return 0;
    }
}

function setTotalScores() {
    if (scores >= totalScores) {
        localStorage.setItem("roboJS", JSON.stringify({"scores": scores}));
    }
}

function wallMaker(xFirstPosition, yPosition, i) {
    let subArr = [];
    let qty = 0;
    let hardQty = 0;
    let softQty = 0;
    for (let j = 0; j < 4; j++) {
        let rnd = Math.floor(Math.random() * 5);        
        switch (rnd) {
            case 0:
                subArr.push(Wall.hard(xFirstPosition, yPosition, i, j));
                qty += 1;
                hardQty +=1;
                break;
            case 1:
                subArr.push(Wall.empty(xFirstPosition, yPosition, i, j));
                softQty += 1;
                break;
            case 2:
                subArr.push(Wall.hard(xFirstPosition, yPosition, i, j));
                qty += 1;
                hardQty +=1;
                break;
            case 3:
                subArr.push(Wall.soft(xFirstPosition, yPosition, i, j));
                qty += 1;
                softQty += 1;
                break;
            case 4:
                subArr.push(Wall.hard(xFirstPosition, yPosition, i, j));
                qty += 1;
                hardQty +=1;
                break;
            }
        }
    if (qty > 2 && hardQty < 4 && softQty < 2)
        return subArr;
    else
        return wallMaker(xFirstPosition, yPosition, i);
}

function wallsMaker(xFirstPosition, yPosition, i) {
    let arr = [];
    for (let i = 0; i < 3; i++) {
        arr.push(wallMaker(xFirstPosition, yPosition, i));
    }
    return arr;
}

function tileMaker(xFirstPosition, yPosition, yFramePosition) {
    let arr = [];
    if (yPosition == 0) {
        for (let i = 0; i < 7; i++) {
            let size = new Vector2(60, 60);
            let position = new Vector2(xFirstPosition + i * 60, yPosition);
            let rnd = Math.floor(Math.random() * 3) // Разнообразие тайлов 0ой, 1ый, 2ой
            if (rnd == 2 && yFramePosition == 0) // Меняем размер тайла для 2го типа тайлов потолка
                size.y = 120;
            arr.push(new Roof(position, new Collider(position, size), new Collider(new Vector2(0 + rnd * 60, yFramePosition),size)));
        }
    }
    if (yPosition == 300) {
        for (let i = 0; i < 6; i++) {
            let size = new Vector2(60, 60);
            let position = new Vector2(xFirstPosition + i * 60, yPosition);
            let rnd = Math.floor(Math.random() * 3) // Разнообразие тайлов 0ой, 1ый, 2ой
            arr.push(new GO(position, new Collider(position, size), new Collider(new Vector2(0 + rnd * 60, yFramePosition),size)));
        }
    }
    
    return arr;
}

gameLoop();

function update() {

    if (isPlay) {
        if (character.isAlive) {
            music.play();
            // потлок
            roofs.forEach(function (roof) {
                roof.update();
            })
            if (walls[0][0].position.x > 500 && !walls[0][0].gotIt) {
                let p = walls[0][0].position;
                walls[0] = wallMaker(p.x, 240, 0);
                scores += 1;
            }
            if (walls[1][0].position.x > 500 && !walls[1][0].gotIt) {
                let p = walls[1][0].position;
                walls[1] = wallMaker(p.x, 240, 0);
                scores += 1;
            }
            if (walls[2][0].position.x > 500 && !walls[2][0].gotIt) {
                let p = walls[2][0].position;
                walls[2] = wallMaker(p.x, 240, 0);
                scores += 1;
            }


            // Стены
            walls.forEach(function (wall) {
                wall.forEach(function (block) {
                    block.update(); 
                    if (Collider.checkCollide(block.collider, character.collider)) {
                        if (block.isAlive) {
                            if (block.type == 1 || block.type == 2) {
                                character.isAlive = false;
                                character.kill();
                                music.pause();
                                music.currentTime = 0;
                                hit.play();
                                setTotalScores();
                            }
                        }
                    }
                    if (Collider.checkCollide(block.collider, laser.collider)) {
                        if (block.isAlive && laser.isAlive) {
                            if (block.type == 1 || block.type == 2) {
                                laser.kill();
                                block.kill();
                                exp.play();
                            }
                        }
                    }           
                });            
            });

            if (Collider.checkCollide(laser.collider, bullet.collider)) {
                if (bullet.isAlive && laser.isAlive) {
                    laser.kill();
                    bullet.kill();
                    exp.play();
                }
            }

            if (Collider.checkCollide(character.collider, bullet.collider)) {
                if (bullet.isAlive) {
                    character.isAlive = false;
                    character.kill();
                    music.pause();
                    music.currentTime = 0;
                    hit.play();
                }
            }

            bullet.update();

            if (bullet.position.x > 360 && !bullet.gotIt) {
                bullet.gotIt = true;
                bullet.position.y = Math.floor(Math.random() * 4) * 60 + 60;
                bullet.collider.top = bullet.position.y;
                bullet.isAlive = true;
                bullet.drawIt = true;
            }

            // Персонаж
            character.update();

            if (laser.isAlive){
                laser.update();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0,0,360,600);
    
    // Рисуем пол
    floors.forEach(function (floor) {
        floor.draw(ctx, sprites); 
    });
    // Рисуем потолок
    roofs.forEach(function (roof) {
        roof.draw(ctx, sprites); 
    });
    
    if(isPlay) {
        if (sprites.isLoad)
        {            
            // Стены
            walls.forEach(function (wall) {
                wall.forEach(function (block) {
                    if (block.drawIt) {
                        block.draw(ctx, sprites);
                    }
                });            
            });
            if (bullet.drawIt) {
                bullet.draw(ctx, sprites);
            }
            character.draw(ctx, sprites);
            ctx.font = "bold 14px sans-serif";
            ctx.fillText("TOTAL: " + totalScores, 10, 375);
            ctx.fillText("CURRENT: " + scores, 10, 394);
        }
        if (!character.isAlive) {
            ctx.font = "bold 48px sans-serif";
            ctx.fillText("DEATH", 100, 180);
        }
        if (laser.isAlive){
            laser.draw(ctx, sprites);
        }
    }
    
    drawGUI();
}

function gameLoop() {
    update();
    draw();
    window.requestAnimationFrame(gameLoop)
 }  
  