//canvas wieght and hieght set to inner width and height
const canvas = document.getElementById('my_canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//select element from html wiht given name
const scoreEl = document.querySelector("#scoreEl");
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const bigScoreEl = document.querySelector("#bigScoreEl");
let container = document.getElementById("container");

//select audio from the file
let backgroundMusic = new Audio('./sound/background.mp3');
let destroy = new Audio("./sound/destroyed.mp3");
let bullet = new Audio("./sound/shoot.mp3");
let nice = new Audio("./sound/nice.mpeg");
let slowmusic = new Audio("./sound/slow.mp3");

//change the volume of the audio
backgroundMusic.volume = 0.5;
bullet.volume = 0.3;
destroy.volume = 0.3;

// set time intervel of the background music to loop the background music 
let backgroundIntervel = setInterval(() => {
    backgroundMusic.play()
}, 1000);


let callOnce = 0;
let flag = false;
//load the enemy image
let arr_image = [];
function loadImage() {
    this.enemy = new Image();

    let numer = 1;
    let loaded = 0;
    function imageLoaded() {
        loaded++;
        if (numer === loaded)
            // console.log("loading is done for images");
            return;
    }
    this.enemy.onload = function () {
        imageLoaded();
    }
    //Set images src
    this.enemy.src = "../images/enemy.png";

}

function fillArray() {
    var load = new loadImage();
    arr_image.push(load.enemy)
}

//make player class to fetch the object and method
class Player {
    constructor(x, y, radius, color) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

    }
    draw() {
        //draw the image in the canvas of player
        var img = new Image();
        img.src = "https://res.cloudinary.com/dc4stsmlc/image/upload/v1570612478/Codepen/sprite_bj90k9.png";
        var ctx = document.getElementById('my_canvas').getContext('2d');
        ctx.drawImage(img, 200, 12, 70, 79, this.x - 35, this.y - 35, 90, 99);
    }
    //change the position of the player 
    leftRight() {
        if (this.x < canvas.width)
            this.x += 10;
    }
    rightLeft() {
        if (this.x > 0)
            this.x -= 10;
    }
    upDown() {
        if (this.y > 0)
            this.y -= 10;
    }
    downUp() {
        if (this.y < canvas.height)
            this.y += 10;
    }
    currentPosition() {
        return [this.x, this.y];
    }
}

// class for the bullet
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        var img = new Image();
        img.src = "https://res.cloudinary.com/dc4stsmlc/image/upload/v1570612478/Codepen/sprite_bj90k9.png";
        c.drawImage(img, 200, 90, 70, 79, this.x - 5, this.y - 65, 50, 50);
    }
    upadate() {
        //update the position of the bullect according to the bullet velocity
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        let img = arr_image[0];
        c.drawImage(img, this.x, this.y, 60, 60);
    }
    upadate() {
        // change the speed when slow gift is taken
        this.draw();
        if (slow) {
            this.x += this.velocity.x * 0.2;
            this.y += this.velocity.y * 0.2;
            setTimeout(() => {
                slow = false;
            }, 5000);
        }

        else {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }

    }
}

//class of the diamond bonus
class Bonus {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        var img = new Image();
        img.src = "./images/gift.png";
        c.drawImage(img, this.x, this.y, 50, 70);
    }
    upadate() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

//class for alaram gift
class Slowbonus {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        var img = new Image();
        img.src = "./images/stop.png";
        c.drawImage(img, this.x, this.y, 30, 40);

    }
    upadate() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

const fraction = 0.99;
// class of the particle when enemy is destroyed particle move around
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
    upadate() {
        this.draw();
        this.velocity.x *= fraction;
        this.velocity.y *= fraction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}


// set the postion variable
let x = canvas.width / 2;
let y = canvas.height / 2;
//call the main player
let player = new Player(x, y, 20, 'antiquewhite');
let slow = false;
// array to store the element
let projectiles = [];
let enemies = [];
let particles = [];

//call the init funtion to start the game with player
// initalize all the array will use in game later
function init() {
    player = new Player(x, y, 20, 'antiquewhite');
    projectiles = [];
    enemies = [];
    particles = [];
    bonuses = [];
    Slowbonuses = [];
    score = 0;
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
}

// make the enemy by calling this function in every one second
// here x and y position is random and velocity is taken by getting angle between player and random x and y and push in the enemy array
function spawnEnemies() {
    setInterval(() => {
        p = player.currentPosition();
        const radius = (30 - 6) + 6
        let x
        let y
        if (Math.random() < 0.5) {
            const radius = 30
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        y = 0;
        const color = `hsl(${Math.random() * 360}, 50% , 50%)`
        const angle = Math.atan2(-y + p[1], -x + p[0])

        const velocity = {
            x: Math.cos(angle) * 2 * (1 + (score * 0.002)),
            y: Math.sin(angle) * 2 * (1 + (score * 0.002)),
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));

    }, 1000)
}

// call this function to genrate diamond bonus , the setintervel is make new bonus in every one second and push in the bonus array
function callBonus() {
    setInterval(() => {
        p = player.currentPosition();
        const radius = 15;
        let x
        let y
        if (Math.random() < 0.5) {
            const radius = 30
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        y = 0;
        const color = `white`;
        const angle = Math.atan2(-y + p[1], -x + p[0])
        const velocity = {
            x: Math.cos(angle) * 3 * (1 + (score * 0.002)),
            y: Math.sin(angle) * 3 * (1 + (score * 0.002)),
        }
        bonuses.push(new Bonus(x, y, radius, color, velocity));
    }, 4000 + Math.random() * 1000);
}

// call this fuction for slow bonus and it has setintervel which will make the bonus in every one second and then push in the slowBonus array
function callSlowbonus() {
    setInterval(() => {
        p = player.currentPosition();
        const radius = 15;
        let x
        let y
        if (Math.random() < 0.5) {
            const radius = 30
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        y = 0;
        const color = `white`;

        const angle = Math.atan2(-y + p[1], -x + p[0])
        const velocity = {
            x: Math.cos(angle) * 3,
            y: Math.sin(angle) * 3,
        }
        Slowbonuses.push(new Slowbonus(x, y, radius, color, velocity));
    }, 6000 + Math.random() * 1000);
}

// define variable animationId to control the animation frame
let animationId;
let score = 0;
let pause = false;
// when click on up down left right arrow this will chnage the position of the player
document.onkeydown = function (e) {
    if (e.keyCode == 40) {

        player.downUp();
    }
    if (e.keyCode == 39) {

        player.leftRight();
    }
    if (e.keyCode == 38) {

        player.upDown();
    }
    if (e.keyCode == 37) {

        player.rightLeft();
    }
    // this will pause the game
    if (e.keyCode == 80) {
        pause = !pause;
        // console.log(pause);
        animate();
    }
}

// change the bool value of the pause
function paused() {
    pause = !pause;
    animate();
}

// main function which control the animation
// pause is checked here in the start
function animate() {
    let p = document.getElementById("pause");
    if (pause) {
        p.innerHTML = "resume";
        p.style.visibility = "visible";
        return;
    }
    else {
        p.innerHTML = "pause";
    }

    // call the animation repeatedly for the animation frame
    animationId = requestAnimationFrame(animate)

    c.fillStyle = 'rgba(0,0,0,0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // console.log("Hello from animate");
    player.draw();

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        }
        else {
            particle.upadate();
        }
    })

    // call all the bullet
    projectiles.forEach((projectile, index) => {
        projectile.upadate()
        //remove form edges of screen
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            // splice bullet from the bullet arrray
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0)
        }
    })

    // call the function for bonus 
    bonuses.forEach((bonus, index) => {
        bonus.upadate()
        //remove form edges of screen
        if (bonus.x + bonus.radius < 0 || bonus.x - bonus.radius > canvas.width || bonus.y + bonus.radius < 0 || bonus.y - bonus.radius > canvas.height) {
            setTimeout(() => {
                // enemies.splice(index,1);
                bonuses.splice(index, 1);
            }, 0)
        }
        const dist = Math.hypot(player.x - bonus.x, player.y - bonus.y);
        // condition to check the bonus is taken by player to increase the score by 40
        if (dist - bonus.radius - player.radius < 5) {
            nice.play();
            score += 40;
            scoreEl.innerHTML = score;
            bonus.radius = 0;
            bonuses.splice(index, 1);
        }
    })

    // for slow bonus functionaltity 
    Slowbonuses.forEach((bonus, index) => {
        bonus.upadate()
        //remove form edges of screen
        if (bonus.x + bonus.radius < 0 || bonus.x - bonus.radius > canvas.width || bonus.y + bonus.radius < 0 || bonus.y - bonus.radius > canvas.height) {
            setTimeout(() => {
                // splice slowBonus from the array
                Slowbonuses.splice(index, 1);
            }, 0)
        }
        // check the distance between player and slowBonus
        const dist = Math.hypot(player.x - bonus.x, player.y - bonus.y);
        if (dist - bonus.radius - player.radius < 5) {
            slowmusic.play();
            slow = true;
            bonus.radius = 0;
            Slowbonuses.splice(index, 1);
        }
    })

    // for enemy array
    enemies.forEach((enemy, index) => {
        // update the position 
        enemy.upadate();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        // check the distance between the player and enemy
        if (dist - enemy.radius - player.radius < 5) {
            // upgrade heigh score
            let hieghestScore = sessionStorage.getItem('score');
            if (hieghestScore != null) {
                if (hieghestScore < score) {
                    hieghestScore = score;
                    sessionStorage.setItem('score', hieghestScore)
                }
            }
            else {
                hieghestScore = score;
                sessionStorage.setItem('score', hieghestScore)
            }
            document.getElementById('display').innerHTML = "Highest score is  " + hieghestScore;

            // cancel all the animation and dstop the game 
            cancelAnimationFrame(animationId);
            clearInterval(backgroundIntervel);

            // pause the background music 
            destroy.play();
            backgroundMusic.pause();
            setTimeout(() => {
                destroy.pause();
            }, 2000);
            modalEl.style.display = 'flex';
            document.getElementById("btnDiv").style.display = "none";
            document.getElementById("ins").style.display = "none";
            document.getElementById("textDiv").innerHTML = "Game Over, Restarting in few seconds..";
            modalEl.style.background = 'url(../images/backgound.jpg)';
            bigScoreEl.innerHTML = score;
            // restart the game
            setTimeout(() => {
                location.reload("index.html")
            }, 5000);
        }
        // check if any bullet is touching the enemy if so splice from the array and increase the score
        projectiles.forEach((projectile, ProjectileIndex) => {
            bullet.play();
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius < 18) {
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, 'gray',
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 5),
                            y: (Math.random() - 0.5) * (Math.random() * 5)
                        }))
                }
                score += 10;
                scoreEl.innerHTML = score;
                enemies.splice(index, 1);
                projectiles.splice(ProjectileIndex, 1);

                destroy.play();
            }
        })
    })
}



// taking the click position and genrating bullt in that direction 
addEventListener('click', (event) => {
    p = player.currentPosition();
    const angle = Math.atan2(event.clientY - p[1], event.clientX - p[0])
    const velocity = {
        x: Math.cos(angle) * 12,
        y: Math.sin(angle) * 12,
    }
    projectiles.push(new Projectile(p[0], p[1], 5, "white", velocity))
})

// when the button is click this is will be called first 
startGameBtn.addEventListener('click', () => {
    document.documentElement.requestFullscreen().catch((e) => {
        console.log(e);
    })
    loadImage();
    fillArray();
    init();
    animate();
    spawnEnemies();
    callBonus();
    callSlowbonus();
    modalEl.style.display = 'none';
})