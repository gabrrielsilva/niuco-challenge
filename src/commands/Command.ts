import { Position, Plateau } from '../types';
import { MovementStrategyFactory } from '../strategies/MovementStrategy';
import { RotationStrategyFactory } from '../strategies/RotationStrategy';

export abstract class Command {
  abstract execute(): void;
}

// Interface para o Rover que corresponde à implementação real
interface RoverInterface {
  position: Position;
  instructions: string;
  getPosition(): Position;
  getInstructions(): string;
}

export class MoveCommand extends Command {
  constructor(
    private rover: RoverInterface,
    private plateau: Plateau,
    private occupiedPositions: Set<string>
  ) {
    super();
  }

  execute(): void {
    const strategy = MovementStrategyFactory.createStrategy(this.rover.position.direction);
    const newPosition = strategy.move(this.rover.position, this.plateau);
    
    const positionKey = `${newPosition.x},${newPosition.y}`;
    if (this.occupiedPositions.has(positionKey)) {
      throw new Error(`Posição ocupada: (${newPosition.x}, ${newPosition.y}) já está sendo usada por outra sonda`);
    }
    
    const oldPositionKey = `${this.rover.position.x},${this.rover.position.y}`;
    this.occupiedPositions.delete(oldPositionKey);
    
    this.rover.position = newPosition;
    this.occupiedPositions.add(positionKey);
  }
}

export class RotateCommand extends Command {
  constructor(
    private rover: RoverInterface,
    private rotation: 'L' | 'R'
  ) {
    super();
  }

  execute(): void {
    const strategy = RotationStrategyFactory.createStrategy(this.rotation);
    const newDirection = strategy.rotate(this.rover.position.direction);
    this.rover.position.direction = newDirection;
  }
}

export class CommandFactory {
  static createCommand(
    instruction: string,
    rover: RoverInterface,
    plateau: Plateau,
    occupiedPositions: Set<string>
  ): Command {
    switch (instruction) {
      case 'M':
        return new MoveCommand(rover, plateau, occupiedPositions);
      case 'L':
      case 'R':
        return new RotateCommand(rover, instruction);
      default:
        throw new Error(`Instrução não reconhecida: ${instruction}`);
    }
  }
}