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
    // Adiciona a posição inicial às posições ocupadas
    const initialPositionKey = `${this.position.x},${this.position.y}`;
    occupiedPositions.add(initialPositionKey);

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
        console.error(`Erro ao executar instrução '${instruction}': ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        // Continua executando as próximas instruções mesmo se uma falhar
      }
    }

    return {
      finalPosition: { ...this.position },
      roverId: this.hashCode()
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
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  getFinalPositionString(): string {
    return `${this.position.x} ${this.position.y} ${this.position.direction}`;
  }
} 