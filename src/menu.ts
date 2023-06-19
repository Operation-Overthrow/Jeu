import 'phaser';
import { MyScene } from './main';

 export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Code de création du menu
        this.add.text(400, 100, 'Operation Overthrow', { fontSize: '48px'}).setOrigin(0.5);

         // Bouton de démarrage
        const startButton = this.add.rectangle(400, 200, 200, 50, 0xffffff).setOrigin(0.5);
        const buttonText = this.add.text(400, 200, 'Démarrer', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);
       
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
            this.scene.start('my-scene'); // Transition vers une autre scène (par exemple, la scène du jeu)
        });
    }

}