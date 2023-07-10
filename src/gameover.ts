import 'phaser';
import { game } from './main';

 export class GameOverScene extends Phaser.Scene {
    private music!: Phaser.Sound.HTML5AudioSound|Phaser.Sound.WebAudioSound|Phaser.Sound.NoAudioSound;

    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        this.music = this.sound.add('gameover');
        this.music.play();

        const gameWidth: number = Number(game.config.width);
        const gameHeight: number = Number(game.config.height);
        // Code de création du menu
        this.add.text(gameWidth / 2, gameHeight / 2 - 100, 'Game Over', { fontSize: '48px'}).setOrigin(0.5);
        console.log(this.scene);

        const score = localStorage.getItem('score');
        this.add.text(gameWidth / 2, gameHeight / 2 - 50, `Score: ${score}`, { fontSize: '24px'}).setOrigin(0.5);
        
        const saveScoreButton = this.add.rectangle(gameWidth / 2, gameHeight / 2, 350, 50, 0xffffff).setOrigin(0.5);
        const saveButtonText = this.add.text(gameWidth / 2, gameHeight / 2, 'Sauvegarder le score', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);

        saveScoreButton.setInteractive();

        // Gérer les événements de la souris pour le bouton
        saveScoreButton.on('pointerover', () => {
            saveScoreButton.setScale(1.1); // Augmenter l'échelle du bouton lors du survol
        });

        saveScoreButton.on('pointerout', () => {
            saveScoreButton.setScale(1); // Rétablir l'échelle normale du bouton lorsque la souris quitte le bouton
        });

        saveScoreButton.on('pointerdown', () => {
            // sauvegarder le score
            saveScore(score);
            this.scene.start('MenuScene'); // Transition vers une autre scène (par exemple, la scène du jeu)
        });

         // Bouton de démarrage
        const startButton = this.add.rectangle(gameWidth / 2, gameHeight / 2 + 100, 350, 50, 0xffffff).setOrigin(0.5);
        const buttonText = this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Retourner au menu', { fontSize: '24px',color:'#000000'}).setOrigin(0.5);
       
        startButton.setInteractive();

        // Gérer les événements de la souris pour le bouton
        startButton.on('pointerover', () => {
            startButton.setScale(1.1); // Augmenter l'échelle du bouton lors du survol
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1); // Rétablir l'échelle normale du bouton lorsque la souris quitte le bouton
        });

        startButton.on('pointerdown', () => {
            this.music.stop();
            // Code à exécuter lorsque le bouton est cliqué
            this.scene.start('MenuScene'); // Transition vers une autre scène (par exemple, la scène du jeu)
        });
    }

}

function saveScore(score: string | null) {
    let scoreNumber = Number(score);
    if (scoreNumber > 0) {
        const url = 'http://localhost:8000/api/games/';
        const data = {
            score: scoreNumber
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
    }
}
