import { Direction } from '../types';

export class LeftRotationStrategy {
  rotate(currentDirection: Direction): Direction {
    const rotations: Record<Direction, Direction> = {
      'N': 'W',
      'W': 'S',
      'S': 'E',
      'E': 'N'
    };
    
    return rotations[currentDirection];
  }
}

export class RightRotationStrategy {
  rotate(currentDirection: Direction): Direction {
    const rotations: Record<Direction, Direction> = {
      'N': 'E',
      'E': 'S',
      'S': 'W',
      'W': 'N'
    };
    
    return rotations[currentDirection];
  }
}

export class RotationStrategyFactory {
  private static strategies = {
    'L': new LeftRotationStrategy(),
    'R': new RightRotationStrategy(),
  };

  static createStrategy(rotation: 'L' | 'R') {
    const strategy = this.strategies[rotation];
    if (!strategy) {
      throw new Error(`Rotação não suportada: ${rotation}`);
    }
    return strategy;
  }
} 