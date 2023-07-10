import 'phaser';
import { game } from '../main';

 export class HowToScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HowToScene' });
    }

    create() {
        const gameWidth: number = Number(game.config.width);
        const gameHeight: number = Number(game.config.height);
        // Code de création du menu
        this.add.text(gameWidth / 2, gameHeight / 2 - 100, 'Comment Jouer', { fontSize: '48px'}).setOrigin(0.5);
        this.add.text(gameWidth / 2, gameHeight / 2, 'Utiliser la touche W sur votre grille pour placer un mur', { fontSize: '30px'}).setOrigin(0.5);
        this.add.text(gameWidth / 2, gameHeight / 2 + 50, 'Utiliser la touche T sur votre grille pour placer une tourelle', { fontSize: '30px'}).setOrigin(0.5);

         // Bouton de démarrage
        const returnButton = this.add.rectangle(gameWidth / 2, gameHeight / 2 + 200, 350, 50, 0xffffff).setOrigin(0.5);
        const buttonText = this.add.text(gameWidth / 2, gameHeight / 2 + 200, 'Retourner au menu', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);
       
        returnButton.setInteractive();

        // Gérer les événements de la souris pour le bouton
        returnButton.on('pointerover', () => {
            returnButton.setScale(1.1); // Augmenter l'échelle du bouton lors du survol
        });

        returnButton.on('pointerout', () => {
            returnButton.setScale(1); // Rétablir l'échelle normale du bouton lorsque la souris quitte le bouton
        });

        returnButton.on('pointerdown', () => {
            // Code à exécuter lorsque le bouton est cliqué
            this.scene.start('MenuScene'); // Transition vers une autre scène (par exemple, la scène du jeu)
        });
    }
}