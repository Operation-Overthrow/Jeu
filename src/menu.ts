import 'phaser';
import { game } from './main';
import { checkToken } from './utils';

 export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    async create() {
        // Code de création du menu
        // centrer le texte à partir de la taille du gameObject
        this.add.text(1500 / 2, 720 / 2 - 150, 'Operation Overthrow', { fontSize: '48px'}).setOrigin(0.5);

         // Bouton de démarrage
        const gameWidth: number = Number(game.config.width);
        const gameHeight: number = Number(game.config.height);
        
        if(!(await checkToken())) {
            const loginButton = this.add.rectangle(gameWidth / 2, gameHeight / 2, 250, 50, 0xffffff).setOrigin(0.5);
            this.add.text(gameWidth / 2, gameHeight / 2, 'Se connecter', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);
        
            loginButton.setInteractive();

            // Gérer les événements de la souris pour le bouton
            loginButton.on('pointerover', () => {
                loginButton.setScale(1.1); // Augmenter l'échelle du bouton lors du survol
            });

            loginButton.on('pointerout', () => {
                loginButton.setScale(1); // Rétablir l'échelle normale du bouton lorsque la souris quitte le bouton
            });

            loginButton.on('pointerdown', () => {
                // Code à exécuter lorsque le bouton est cliqué
                window.location.href = '/login.html';
            });
        } else {
            const startButton = this.add.rectangle(gameWidth / 2, gameHeight / 2 - 75, 200, 50, 0xffffff).setOrigin(0.5);
            this.add.text(gameWidth / 2, gameHeight / 2 - 75, 'Démarrer', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);
        
            startButton.setInteractive();

        const howToPlayButton = this.add.rectangle(gameWidth / 2, gameHeight / 2 + 100, 250, 50, 0xffffff).setOrigin(0.5);
        this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Comment jouer', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);

        startButton.setInteractive();
        howToPlayButton.setInteractive();

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

            const logoutButton = this.add.rectangle(gameWidth / 2, gameHeight / 2, 250, 50, 0xffffff).setOrigin(0.5);
            this.add.text(gameWidth / 2, gameHeight / 2, 'Se déconnecter', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);
        
            logoutButton.setInteractive();

            // Gérer les événements de la souris pour le bouton
            logoutButton.on('pointerover', () => {
                logoutButton.setScale(1.1); // Augmenter l'échelle du bouton lors du survol
            });

            logoutButton.on('pointerout', () => {
                logoutButton.setScale(1); // Rétablir l'échelle normale du bouton lorsque la souris quitte le bouton
            });

            logoutButton.on('pointerdown', () => {
                // Code à exécuter lorsque le bouton est cliqué
                localStorage.removeItem('token');
                // recharger la page
                window.location.reload();
            });

            howToPlayButton.on('pointerover', () => {
                howToPlayButton.setScale(1.1); // Augmenter l'échelle du bouton lors du survol
            });

            howToPlayButton.on('pointerout', () => {
                howToPlayButton.setScale(1); // Rétablir l'échelle normale du bouton lorsque la souris quitte le bouton
            });

            howToPlayButton.on('pointerdown', () => {
                // Code à exécuter lorsque le bouton est cliqué
                this.scene.start('HowToScene'); // Transition vers une autre scène (par exemple, la scène du jeu)
            });
        }

    }

}