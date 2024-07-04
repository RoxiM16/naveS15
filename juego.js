var nave;
var balas;
var tiempoEntreBalas = 400;
var tiempo = 0;
var malos;
var timer;
var puntos;
var txtPuntos;
var vidas;
var txtVidas;

var Juego={
	preload: function () {
		juego.load.image('nave','.img/nave.png');
		juego.load.image('laser','.img/laser.png');
		juego.load.image('malo','.img/malo.png');
		juego.load.image('bg','.img/bg.png');
		juego.load.audio('disparo', '.sonidos/disparo.mp3');
        juego.load.audio('explosion', '.sonidos/explosion.mp3');
	},

	create: function(){
		this.fondo = juego.add.tileSprite(0, 0, juego.width, juego.height, 'bg');
		juego.physics.startSystem(Phaser.Physics.ARCADE);

		nave = juego.add.sprite(juego.width/2, 485, 'nave');
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

		cursores = juego.input.keyboard.createCursorKeys();

		// Añadir sonidos
        sonidoDisparo = juego.add.audio('disparo');
        sonidoExplosion = juego.add.audio('explosion');

		// Añadir texto
        texto = juego.add.text(juego.width / 2, juego.height - 20, "Roxana Carolina Mendoza Flores U20229915", { font: "20px Arial", fill: "#ffffff" });
        texto.anchor.setTo(0.5);

		timer = juego.time.events.loop(2000, this.crearEnemigo, this);

		vidas = 3;
		juego.add.text(510,20, "Vidas:", {font: "14px Arial", fill: "#FFF"});
		txtVidas = juego.add.text(560, 20, "3", {font: "14px Arial", fill: "#FFF"});

		puntos = 0;
		juego.add.text(20, 20, "Puntos: ", {
			font: "14px Arial", fill: "#FFF"});

		txtPuntos = juego.add.text(80, 20, "0", {
			font: "14px Arial", fill: "#FFF"});
		
	},

	update: function () {
		this.fondo.tilePosition.y += 2;
        nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;
		
        if (juego.input.activePointer.isDown) {
            this.disparar();
        }
        
        // Colisión entre balas y enemigos
        juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

		malos.forEachAlive(function(malo){
			if(malo.position.y > 520 && malo.position.y < 521){
				vidas -= 1;
				txtVidas = vidas;
			}
		});

		// Movimiento horizontal de la nave
        if (cursores.left.isDown) {
            nave.x -= 5;
        } else if (cursores.right.isDown) {
            nave.x += 5;
        }

		// Limitar la nave dentro de los límites laterales
        if (nave.x < nave.width / 2) {
            nave.x = nave.width / 2;
        } else if (nave.x > juego.width - nave.width / 2) {
            nave.x = juego.width - nave.width / 2;
        }

		if(vidas == 0){
			juego.state.start("Terminado");
		}

		juego.physics.arcade.overlap(nave, malos, this.enemigoChocaNave, null, this);
    },

	disparar: function () {
        if (juego.time.now > tiempo && balas.countDead() > 0) {
            tiempo = juego.time.now + tiempoEntreBalas;
            var bala = balas.getFirstDead();
            bala.anchor.setTo(0.5);
            bala.reset(nave.x, nave.y);
            bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
            juego.physics.arcade.moveToPointer(bala, 200);
			sonidoDisparo.play();
        }

    },

	crearEnemigo: function () {
        var enem = malos.getFirstDead();
        var num = Math.floor(Math.random() * 10 + 1);
        enem.reset(num * 38, 0);
        enem.anchor.setTo(0.5);
        enem.body.velocity.y = 100;
    },

	colision: function(bala, malo){
		bala.kill();
		malo.kill();
		sonidoExplosion.play();
		puntos++;
		txtPuntos.text = puntos;
	},

	enemigoChocaNave: function (nave, malo) {
        malo.kill();
        vidas--;
        txtVidas.text = vidas;  // Actualizar el texto de las vidas
    }
};