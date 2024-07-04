var Terminado ={
	preload: function () {
		juego.load.image('fondo', '.img/bg.png');
	},

	create: function(){
		this.fondo = juego.add.tileSprite(0, 0, juego.width, juego.height, 'bg');
		var gameOverText = juego.add.text(juego.world.centerX, juego.world.centerY - 20, "GAME OVER", {
            font: "20px Arial",
            fill: "#ff0000",
            align: "center"
        });
        gameOverText.anchor.setTo(0.5);

        var restartText = juego.add.text(juego.world.centerX, juego.world.centerY + 20, "Haz CLICK en la pantalla para jugar de nuevo", {
            font: "12px Arial",
            fill: "#ffffff",
            align: "center"
        });
        restartText.anchor.setTo(0.5);

        juego.input.onDown.add(this.reiniciarJuego, this);
	},

	update: function () {
        this.fondo.tilePosition.y += 2;
	},

    reiniciarJuego: function () {
        juego.state.start('Juego');
    }

};