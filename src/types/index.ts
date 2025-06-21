export interface Position {
  x: number;
  y: number;
  direction: Direction;
}

export type Direction = 'N' | 'S' | 'E' | 'W';

export interface Plateau {
  width: number;
  height: number;
}

export interface Rover {
  position: Position;
  instructions: string;
}

export interface ExplorationResult {
  finalPosition: Position;
  roverId: number;
  error?: string;
  success: boolean;
}

export interface ExplorationData {
  plateau: Plateau;
  rovers: Rover[];
}

export interface Command {
  execute(): void;
}

export interface MovementStrategy {
  move(currentPosition: Position, plateau: Plateau): Position;
}

export interface RotationStrategy {
  rotate(currentDirection: Direction): Direction;
} 