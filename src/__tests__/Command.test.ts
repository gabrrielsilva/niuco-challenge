import { MoveCommand, RotateCommand, CommandFactory } from '../commands/Command';
import { Position, Plateau } from '../types';

// Mock do Rover para testes
class MockRover {
  public position: Position;
  public instructions: string;

  constructor(position: Position) {
    this.position = { ...position };
    this.instructions = '';
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getInstructions(): string {
    return this.instructions;
  }
}

describe('Command', () => {
  let plateau: Plateau;
  let occupiedPositions: Set<string>;

  beforeEach(() => {
    plateau = { width: 5, height: 5 };
    occupiedPositions = new Set<string>();
  });

  describe('MoveCommand', () => {
    it('deve mover rover para o norte corretamente', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });
      const command = new MoveCommand(rover, plateau, occupiedPositions);

      command.execute();

      expect(rover.position).toEqual({ x: 1, y: 2, direction: 'N' });
      expect(occupiedPositions.has('1,2')).toBe(true);
      expect(occupiedPositions.has('1,1')).toBe(false);
    });

    it('deve mover rover para o sul corretamente', () => {
      const rover = new MockRover({ x: 1, y: 2, direction: 'S' });
      const command = new MoveCommand(rover, plateau, occupiedPositions);

      command.execute();

      expect(rover.position).toEqual({ x: 1, y: 1, direction: 'S' });
      expect(occupiedPositions.has('1,1')).toBe(true);
      expect(occupiedPositions.has('1,2')).toBe(false);
    });

    it('deve mover rover para o leste corretamente', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'E' });
      const command = new MoveCommand(rover, plateau, occupiedPositions);

      command.execute();

      expect(rover.position).toEqual({ x: 2, y: 1, direction: 'E' });
      expect(occupiedPositions.has('2,1')).toBe(true);
      expect(occupiedPositions.has('1,1')).toBe(false);
    });

    it('deve mover rover para o oeste corretamente', () => {
      const rover = new MockRover({ x: 2, y: 1, direction: 'W' });
      const command = new MoveCommand(rover, plateau, occupiedPositions);

      command.execute();

      expect(rover.position).toEqual({ x: 1, y: 1, direction: 'W' });
      expect(occupiedPositions.has('1,1')).toBe(true);
      expect(occupiedPositions.has('2,1')).toBe(false);
    });

    it('deve falhar ao tentar sair do planalto', () => {
      const rover = new MockRover({ x: 1, y: 5, direction: 'N' });
      const command = new MoveCommand(rover, plateau, occupiedPositions);

      expect(() => command.execute()).toThrow(
        'Movimento inválido: sonda tentaria sair do planalto'
      );
    });

    it('deve falhar ao tentar ocupar posição já ocupada', () => {
      // Primeiro rover ocupa a posição
      const rover1 = new MockRover({ x: 1, y: 1, direction: 'N' });
      const command1 = new MoveCommand(rover1, plateau, occupiedPositions);
      command1.execute();

      // Segundo rover tenta ocupar a mesma posição final do primeiro
      const rover2 = new MockRover({ x: 0, y: 2, direction: 'E' });
      const command2 = new MoveCommand(rover2, plateau, occupiedPositions);

      expect(() => command2.execute()).toThrow('Posição ocupada');
    });

    it('deve permitir movimento para posição previamente ocupada após liberação', () => {
      // Primeiro rover move para (1,2)
      const rover1 = new MockRover({ x: 1, y: 1, direction: 'N' });
      const command1 = new MoveCommand(rover1, plateau, occupiedPositions);
      command1.execute();

      // Segundo rover pode ocupar (1,1) pois foi liberada
      const rover2 = new MockRover({ x: 1, y: 0, direction: 'N' });
      const command2 = new MoveCommand(rover2, plateau, occupiedPositions);

      expect(() => command2.execute()).not.toThrow();
      expect(rover2.position).toEqual({ x: 1, y: 1, direction: 'N' });
    });
  });

  describe('RotateCommand', () => {
    it('deve girar para a esquerda corretamente', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });
      const command = new RotateCommand(rover, 'L');

      command.execute();

      expect(rover.position.direction).toBe('W');
    });

    it('deve girar para a direita corretamente', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });
      const command = new RotateCommand(rover, 'R');

      command.execute();

      expect(rover.position.direction).toBe('E');
    });

    it('deve completar uma volta completa para esquerda', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });

      // 4 rotações para esquerda
      for (let i = 0; i < 4; i++) {
        const command = new RotateCommand(rover, 'L');
        command.execute();
      }

      expect(rover.position.direction).toBe('N');
    });

    it('deve completar uma volta completa para direita', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });

      // 4 rotações para direita
      for (let i = 0; i < 4; i++) {
        const command = new RotateCommand(rover, 'R');
        command.execute();
      }

      expect(rover.position.direction).toBe('N');
    });

    it('deve não alterar a posição x e y durante rotação', () => {
      const rover = new MockRover({ x: 3, y: 4, direction: 'N' });
      const command = new RotateCommand(rover, 'L');

      command.execute();

      expect(rover.position.x).toBe(3);
      expect(rover.position.y).toBe(4);
      expect(rover.position.direction).toBe('W');
    });
  });

  describe('CommandFactory', () => {
    it('deve criar MoveCommand para instrução M', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });
      const command = CommandFactory.createCommand('M', rover, plateau, occupiedPositions);

      expect(command).toBeInstanceOf(MoveCommand);
    });

    it('deve criar RotateCommand para instrução L', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });
      const command = CommandFactory.createCommand('L', rover, plateau, occupiedPositions);

      expect(command).toBeInstanceOf(RotateCommand);
    });

    it('deve criar RotateCommand para instrução R', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });
      const command = CommandFactory.createCommand('R', rover, plateau, occupiedPositions);

      expect(command).toBeInstanceOf(RotateCommand);
    });

    it('deve falhar ao tentar criar comando para instrução inválida', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });

      expect(() => CommandFactory.createCommand('X', rover, plateau, occupiedPositions))
        .toThrow('Instrução não reconhecida: X');
    });

    it('deve falhar ao tentar criar comando para instrução vazia', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });

      expect(() => CommandFactory.createCommand('', rover, plateau, occupiedPositions))
        .toThrow('Instrução não reconhecida: ');
    });
  });

  describe('Cenários de Borda', () => {
    it('deve funcionar no canto do planalto', () => {
      const rover = new MockRover({ x: 0, y: 0, direction: 'E' });
      const command = new MoveCommand(rover, plateau, occupiedPositions);

      command.execute();

      expect(rover.position).toEqual({ x: 1, y: 0, direction: 'E' });
    });

    it('deve funcionar no limite do planalto', () => {
      const rover = new MockRover({ x: 4, y: 4, direction: 'W' });
      const command = new MoveCommand(rover, plateau, occupiedPositions);

      command.execute();

      expect(rover.position).toEqual({ x: 3, y: 4, direction: 'W' });
    });

    it('deve funcionar com planalto de tamanho mínimo', () => {
      const smallPlateau = { width: 0, height: 0 };
      const rover = new MockRover({ x: 0, y: 0, direction: 'N' });
      const command = new MoveCommand(rover, smallPlateau, occupiedPositions);

      expect(() => command.execute()).toThrow('Movimento inválido');
    });

    it('deve funcionar com múltiplas rotações consecutivas', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });

      // Sequência de rotações: N -> W -> S -> E -> N
      const rotations = ['L', 'L', 'L', 'L'];
      rotations.forEach(rotation => {
        const command = new RotateCommand(rover, rotation as 'L' | 'R');
        command.execute();
      });

      expect(rover.position.direction).toBe('N');
    });
  });

  describe('Integração com Posições Ocupadas', () => {
    it('deve gerenciar corretamente as posições ocupadas', () => {
      const rover1 = new MockRover({ x: 1, y: 1, direction: 'N' });
      const rover2 = new MockRover({ x: 2, y: 1, direction: 'N' });
      const rover3 = new MockRover({ x: 1, y: 1, direction: 'E' });

      // Rover 1 move para (1,2)
      const command1 = new MoveCommand(rover1, plateau, occupiedPositions);
      command1.execute();

      // Rover 2 move para (2,2)
      const command2 = new MoveCommand(rover2, plateau, occupiedPositions);
      command2.execute();

      // Rover 3 move para (2,1)
      const command3 = new MoveCommand(rover3, plateau, occupiedPositions);
      command3.execute();

      expect(occupiedPositions.has('1,2')).toBe(true);
      expect(occupiedPositions.has('2,2')).toBe(true);
      expect(occupiedPositions.has('2,1')).toBe(true);
      expect(occupiedPositions.has('1,1')).toBe(false);
    });

    it('deve liberar posição antiga ao mover', () => {
      const rover = new MockRover({ x: 1, y: 1, direction: 'N' });
      
      // Adiciona posição inicial manualmente
      occupiedPositions.add('1,1');

      const command = new MoveCommand(rover, plateau, occupiedPositions);
      command.execute();

      expect(occupiedPositions.has('1,1')).toBe(false);
      expect(occupiedPositions.has('1,2')).toBe(true);
    });
  });
}); 