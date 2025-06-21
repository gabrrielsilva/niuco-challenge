import { Position, Plateau, ExplorationResult } from '../types';
import { CommandFactory } from '../commands/Command';

export class Rover {
  public position: Position;
  public instructions: string;

  constructor(position: Position, instructions: string) {
    this.position = { ...position };
    this.instructions = instructions;
  }

  executeInstructions(plateau: Plateau, occupiedPositions: Set<string>): ExplorationResult {
    const initialPositionKey = `${this.position.x},${this.position.y}`;
    if (occupiedPositions.has(initialPositionKey)) {
      return {
        finalPosition: { ...this.position },
        roverId: this.hashCode(),
        error: `Posição inicial (${this.position.x}, ${this.position.y}) já está ocupada por outro rover`,
        success: false
      };
    }

    occupiedPositions.add(initialPositionKey);

    let errorMessage: string | undefined;
    let success = true;

    for (const instruction of this.instructions) {
      try {
        const command = CommandFactory.createCommand(
          instruction,
          this,
          plateau,
          occupiedPositions
        );
        command.execute();
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        success = false;
        // console.error(`Erro ao executar instrução '${instruction}': ${errorMessage}`);
        break;
      }
    }

    return {
      finalPosition: { ...this.position },
      roverId: this.hashCode(),
      error: errorMessage,
      success
    };
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getInstructions(): string {
    return this.instructions;
  }

  private hashCode(): number {
    const str = `${this.position.x}${this.position.y}${this.position.direction}${this.instructions}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash * 31 + char) | 0;
    }
    return Math.abs(hash);
  }

  getFinalPositionString(): string {
    return `${this.position.x} ${this.position.y} ${this.position.direction}`;
  }
} 