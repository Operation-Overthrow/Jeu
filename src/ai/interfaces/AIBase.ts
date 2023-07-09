import { AIPlayer } from "./AIPlayer";

export interface AIBase {

    createAI(): AIPlayer;
}