import { AIPlayerBasic } from "../implementations/AIPlayerBasic";
import { AIBase } from "../interfaces/AIBase";
import { AIPlayer } from "../interfaces/AIPlayer";

export class AIBasic implements AIBase {
    createAI(): AIPlayer {
        let ai = new AIPlayerBasic();
        // TODO define parameters of the AI factory
        return ai;
    }
}