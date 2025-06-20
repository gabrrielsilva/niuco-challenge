import { Position, Direction, Plateau } from '../types';

export class NorthMovementStrategy {
  move(currentPosition: Position, plateau: Plateau): Position {
    const newY = currentPosition.y + 1;
    
    if (newY > plateau.height) {
      throw new Error(`Movimento inválido: sonda tentaria sair do planalto (y: ${newY} > ${plateau.height})`);
    }
    
    return { ...currentPosition, y: newY };
  }
}

export class SouthMovementStrategy {
  move(currentPosition: Position, plateau: Plateau): Position {
    const newY = currentPosition.y - 1;
    
    if (newY < 0) {
      throw new Error(`Movimento inválido: sonda tentaria sair do planalto (y: ${newY} < 0)`);
    }
    
    if (newY > plateau.height) {
      throw new Error(`Movimento inválido: sonda tentaria sair do planalto (y: ${newY} > ${plateau.height})`);
    }
    
    return { ...currentPosition, y: newY };
  }
}

export class EastMovementStrategy {
  move(currentPosition: Position, plateau: Plateau): Position {
    const newX = currentPosition.x + 1;
    
    if (newX > plateau.width) {
      throw new Error(`Movimento inválido: sonda tentaria sair do planalto (x: ${newX} > ${plateau.width})`);
    }
    
    return { ...currentPosition, x: newX };
  }
}

export class WestMovementStrategy {
  move(currentPosition: Position, plateau: Plateau): Position {
    const newX = currentPosition.x - 1;
    
    if (newX < 0) {
      throw new Error(`Movimento inválido: sonda tentaria sair do planalto (x: ${newX} < 0)`);
    }
    
    if (newX > plateau.width) {
      throw new Error(`Movimento inválido: sonda tentaria sair do planalto (x: ${newX} > ${plateau.width})`);
    }
    
    return { ...currentPosition, x: newX };
  }
}

// Factory Pattern para criar estratégias de movimento
export class MovementStrategyFactory {
  private static strategies = {
    'N': new NorthMovementStrategy(),
    'S': new SouthMovementStrategy(),
    'E': new EastMovementStrategy(),
    'W': new WestMovementStrategy()
  };

  static createStrategy(direction: Direction) {
    const strategy = this.strategies[direction];
    if (!strategy) {
      throw new Error(`Direção não suportada: ${direction}`);
    }
    return strategy;
  }
} 