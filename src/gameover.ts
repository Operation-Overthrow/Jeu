import 'phaser';
import { game } from './main';

 export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const gameWidth: number = Number(game.config.width);
        const gameHeight: number = Number(game.config.height);
        // Code de création du menu
        this.add.text(gameWidth / 2, gameHeight / 2 - 100, 'Game Over', { fontSize: '48px'}).setOrigin(0.5);
        

         // Bouton de démarrage
        const startButton = this.add.rectangle(gameWidth / 2, gameHeight / 2, 350, 50, 0xffffff).setOrigin(0.5);
        const buttonText = this.add.text(gameWidth / 2, gameHeight / 2, 'Retourner au menu', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);
       
        startButton.setInteractive();

        // Gérer les événements de la souris pour le bouton
        startButton.on('pointerover', () => {
            startButton.setScale(1.1); // Augmenter l'échelle du bouton lors du survol
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1); // Rétablir l'échelle normale du bouton lorsque la souris quitte le bouton
        });

        startButton.on('pointerdown', () => {
            // Code à exécuter lorsque le bouton est cliqué
            this.scene.start('MenuScene'); // Transition vers une autre scène (par exemple, la scène du jeu)
        });
    }

}