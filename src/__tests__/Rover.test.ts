import { Rover } from '../models/Rover';
import { Position, Plateau } from '../types';

describe('Rover', () => {
  let plateau: Plateau;

  beforeEach(() => {
    plateau = { width: 5, height: 5 };
  });

  describe('Construtor', () => {
    it('deve criar um rover com posição e instruções válidas', () => {
      const position: Position = { x: 1, y: 2, direction: 'N' };
      const instructions = 'LMLMLMLMM';
      const rover = new Rover(position, instructions);

      expect(rover.getPosition()).toEqual(position);
      expect(rover.getInstructions()).toBe(instructions);
    });

    it('deve criar uma cópia da posição para evitar mutação externa', () => {
      const position: Position = { x: 1, y: 2, direction: 'N' };
      const rover = new Rover(position, 'M');

      // Modificar a posição original não deve afetar o rover
      position.x = 10;
      position.y = 10;

      expect(rover.getPosition()).toEqual({ x: 1, y: 2, direction: 'N' });
    });
  });

  describe('Movimentação Básica', () => {
    it('deve mover para o norte corretamente', () => {
      const rover = new Rover({ x: 1, y: 1, direction: 'N' }, 'M');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 1, y: 2, direction: 'N' });
      expect(rover.getFinalPositionString()).toBe('1 2 N');
    });

    it('deve mover para o sul corretamente', () => {
      const rover = new Rover({ x: 1, y: 2, direction: 'S' }, 'M');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 1, y: 1, direction: 'S' });
    });

    it('deve mover para o leste corretamente', () => {
      const rover = new Rover({ x: 1, y: 1, direction: 'E' }, 'M');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 2, y: 1, direction: 'E' });
    });

    it('deve mover para o oeste corretamente', () => {
      const rover = new Rover({ x: 2, y: 1, direction: 'W' }, 'M');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 1, y: 1, direction: 'W' });
    });
  });

  describe('Mudança de Direção', () => {
    it('deve girar para a esquerda corretamente', () => {
      const rover = new Rover({ x: 1, y: 1, direction: 'N' }, 'L');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 1, y: 1, direction: 'W' });
    });

    it('deve girar para a direita corretamente', () => {
      const rover = new Rover({ x: 1, y: 1, direction: 'N' }, 'R');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 1, y: 1, direction: 'E' });
    });

    it('deve executar sequência de rotações corretamente', () => {
      const rover = new Rover({ x: 1, y: 1, direction: 'N' }, 'LLRR');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 1, y: 1, direction: 'N' });
    });
  });

  describe('Instruções Complexas', () => {
    it('deve executar sequência LMLMLMLMM corretamente', () => {
      const rover = new Rover({ x: 1, y: 2, direction: 'N' }, 'LMLMLMLMM');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 1, y: 3, direction: 'N' });
    });

    it('deve executar sequência MMRMMRMRRM corretamente', () => {
      const rover = new Rover({ x: 3, y: 3, direction: 'E' }, 'MMRMMRMRRM');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 5, y: 1, direction: 'E' });
    });
  });

  describe('Limites do Planalto', () => {
    it('deve falhar ao tentar sair do planalto pelo norte', () => {
      const rover = new Rover({ x: 1, y: 5, direction: 'N' }, 'M');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Movimento inválido: sonda tentaria sair do planalto');
    });

    it('deve falhar ao tentar sair do planalto pelo sul', () => {
      const rover = new Rover({ x: 1, y: 0, direction: 'S' }, 'M');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Movimento inválido: sonda tentaria sair do planalto');
    });

    it('deve falhar ao tentar sair do planalto pelo leste', () => {
      const rover = new Rover({ x: 5, y: 1, direction: 'E' }, 'M');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Movimento inválido: sonda tentaria sair do planalto');
    });

    it('deve falhar ao tentar sair do planalto pelo oeste', () => {
      const rover = new Rover({ x: 0, y: 1, direction: 'W' }, 'M');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Movimento inválido: sonda tentaria sair do planalto');
    });
  });

  describe('Conflito de Posição', () => {
    it('deve falhar ao tentar ocupar posição já ocupada', () => {
      // Primeiro rover ocupa a posição (1,2)
      const rover1 = new Rover({ x: 1, y: 1, direction: 'N' }, 'M');
      const occupiedPositions = new Set<string>();
      const result1 = rover1.executeInstructions(plateau, occupiedPositions);
      expect(result1.success).toBe(true);
      expect(result1.finalPosition).toEqual({ x: 1, y: 2, direction: 'N' });

      // Segundo rover tenta ocupar a posição (1,2) que já está ocupada
      const rover2 = new Rover({ x: 1, y: 2, direction: 'S' }, 'M');
      const result2 = rover2.executeInstructions(plateau, occupiedPositions);
      expect(result2.success).toBe(false);
      expect(result2.error).toContain('Posição inicial (1, 2) já está ocupada por outro rover');
    });

    it('deve permitir movimento para posição previamente ocupada após liberação', () => {
      const occupiedPositions = new Set<string>();

      // Primeiro rover move de (1,1) para (1,2)
      const rover1 = new Rover({ x: 1, y: 1, direction: 'N' }, 'M');
      const result1 = rover1.executeInstructions(plateau, occupiedPositions);
      expect(result1.success).toBe(true);

      // Segundo rover pode ocupar (1,1) pois foi liberada pelo primeiro rover
      const rover2 = new Rover({ x: 1, y: 0, direction: 'N' }, 'M');
      const result2 = rover2.executeInstructions(plateau, occupiedPositions);
      expect(result2.success).toBe(true);
    });
  });

  describe('Instruções Inválidas', () => {
    it('deve falhar com instrução não reconhecida', () => {
      const rover = new Rover({ x: 1, y: 1, direction: 'N' }, 'X');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Instrução não reconhecida');
    });

    it('deve parar na primeira instrução inválida', () => {
      const rover = new Rover({ x: 1, y: 1, direction: 'N' }, 'MLXRM');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Instrução não reconhecida');
      // Deve ter executado apenas ML antes de falhar
      // M: move para (1,2), L: gira para W, X: falha
      expect(result.finalPosition).toEqual({ x: 1, y: 2, direction: 'W' });
    });
  });

  describe('Métodos Auxiliares', () => {
    it('deve retornar posição como string no formato correto', () => {
      const rover = new Rover({ x: 3, y: 4, direction: 'S' }, '');
      expect(rover.getFinalPositionString()).toBe('3 4 S');
    });

    it('deve gerar hash code único para rover', () => {
      const rover1 = new Rover({ x: 1, y: 2, direction: 'N' }, 'LMLMLMLMM');
      const rover2 = new Rover({ x: 1, y: 2, direction: 'N' }, 'LMLMLMLMM');
      const rover3 = new Rover({ x: 1, y: 2, direction: 'S' }, 'LMLMLMLMM');

      const result1 = rover1.executeInstructions(plateau, new Set<string>());
      const result2 = rover2.executeInstructions(plateau, new Set<string>());
      const result3 = rover3.executeInstructions(plateau, new Set<string>());

      // Rovers idênticos devem ter o mesmo ID
      expect(result1.roverId).toBe(result2.roverId);
      // Rovers diferentes devem ter IDs diferentes
      expect(result1.roverId).not.toBe(result3.roverId);
    });
  });

  describe('Cenários de Borda', () => {
    it('deve funcionar com instruções vazias', () => {
      const rover = new Rover({ x: 1, y: 1, direction: 'N' }, '');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 1, y: 1, direction: 'N' });
    });

    it('deve funcionar no canto do planalto', () => {
      const rover = new Rover({ x: 0, y: 0, direction: 'N' }, 'R');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(plateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 0, y: 0, direction: 'E' });
    });

    it('deve funcionar com planalto de tamanho mínimo', () => {
      const smallPlateau = { width: 0, height: 0 };
      const rover = new Rover({ x: 0, y: 0, direction: 'N' }, 'R');
      const occupiedPositions = new Set<string>();

      const result = rover.executeInstructions(smallPlateau, occupiedPositions);

      expect(result.success).toBe(true);
      expect(result.finalPosition).toEqual({ x: 0, y: 0, direction: 'E' });
    });
  });
}); 