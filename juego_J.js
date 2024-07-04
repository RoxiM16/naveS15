var nave;
var balas;
var tiempoEntreBalas = 400;
var tiempo = 0;
var malos;
var timer;

var Juego = {
    preload: function () {
        juego.load.image('nave', 'img/nave.png');
        juego.load.image('laser', 'img/laser.png');
        juego.load.image('malo', 'img/malo.png');
        juego.load.image('bg', 'img/bg.png');
    },

    create: function () {
        this.fondo = juego.add.tileSprite(0, 0, juego.width, juego.height, 'bg'); // Ajustar el tamaño del tileSprite
        juego.physics.startSystem(Phaser.Physics.ARCADE);

        nave = juego.add.sprite(juego.width / 2, 485, 'nave');
        nave.anchor.setTo(0.5);
        juego.physics.arcade.enable(nave, true);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(50, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 0.5);
        balas.setAll('checkWorldBounds', true);
        balas.setAll('outOfBoundsKill', true);

        malos = juego.add.group();
        malos.enableBody = true;
        malos.physicsBodyType = Phaser.Physics.ARCADE;
        malos.createMultiple(30, 'malo');
        malos.setAll('anchor.x', 0.5);
        malos.setAll('anchor.y', 0.5);
        malos.setAll('checkWorldBounds', true);
        malos.setAll('outOfBoundsKill', true);

        timer = juego.time.events.loop(2000, this.crearEnemigo, this);
    },

    update: function () {
        nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

        if (juego.input.activePointer.isDown) {
            this.disparar();
        }
        
        // Colisión entre balas y enemigos
        juego.physics.arcade.overlap(balas, malos, this.colision, null, this);
    },

    disparar: function () {
        if (juego.time.now > tiempo && balas.countDead() > 0) {
            tiempo = juego.time.now + tiempoEntreBalas;
            var bala = balas.getFirstDead();
            bala.anchor.setTo(0.5);
            bala.reset(nave.x, nave.y);
            bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
            juego.physics.arcade.moveToPointer(bala, 200);
        }
    },

    crearEnemigo: function () {
        var enem = malos.getFirstDead();
        var num = Math.floor(Math.random() * 10 + 1);
        enem.reset(num * 38, 0);
        enem.anchor.setTo(0.5);
        enem.body.velocity.y = 100;
    },

    colision: function (bala, malo) {
        bala.kill();
        malo.kill();
    }
};