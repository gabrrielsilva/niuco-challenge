import { 
  NorthMovementStrategy, 
  SouthMovementStrategy, 
  EastMovementStrategy, 
  WestMovementStrategy,
  MovementStrategyFactory 
} from '../strategies/MovementStrategy';
import { Position, Plateau } from '../types';

describe('MovementStrategy', () => {
  let plateau: Plateau;

  beforeEach(() => {
    plateau = { width: 5, height: 5 };
  });

  describe('NorthMovementStrategy', () => {
    let strategy: NorthMovementStrategy;

    beforeEach(() => {
      strategy = new NorthMovementStrategy();
    });

    it('deve mover para o norte corretamente', () => {
      const position: Position = { x: 1, y: 1, direction: 'N' };
      const newPosition = strategy.move(position, plateau);

      expect(newPosition).toEqual({ x: 1, y: 2, direction: 'N' });
    });

    it('deve falhar ao tentar sair do planalto pelo norte', () => {
      const position: Position = { x: 1, y: 5, direction: 'N' };

      expect(() => strategy.move(position, plateau)).toThrow(
        'Movimento inválido: sonda tentaria sair do planalto (y: 6 > 5)'
      );
    });

    it('deve permitir movimento no limite do planalto', () => {
      const position: Position = { x: 1, y: 4, direction: 'N' };
      const newPosition = strategy.move(position, plateau);

      expect(newPosition).toEqual({ x: 1, y: 5, direction: 'N' });
    });
  });

  describe('SouthMovementStrategy', () => {
    let strategy: SouthMovementStrategy;

    beforeEach(() => {
      strategy = new SouthMovementStrategy();
    });

    it('deve mover para o sul corretamente', () => {
      const position: Position = { x: 1, y: 2, direction: 'S' };
      const newPosition = strategy.move(position, plateau);

      expect(newPosition).toEqual({ x: 1, y: 1, direction: 'S' });
    });

    it('deve falhar ao tentar sair do planalto pelo sul', () => {
      const position: Position = { x: 1, y: 0, direction: 'S' };

      expect(() => strategy.move(position, plateau)).toThrow(
        'Movimento inválido: sonda tentaria sair do planalto (y: -1 < 0)'
      );
    });

    it('deve permitir movimento no limite do planalto', () => {
      const position: Position = { x: 1, y: 1, direction: 'S' };
      const newPosition = strategy.move(position, plateau);

      expect(newPosition).toEqual({ x: 1, y: 0, direction: 'S' });
    });
  });

  describe('EastMovementStrategy', () => {
    let strategy: EastMovementStrategy;

    beforeEach(() => {
      strategy = new EastMovementStrategy();
    });

    it('deve mover para o leste corretamente', () => {
      const position: Position = { x: 1, y: 1, direction: 'E' };
      const newPosition = strategy.move(position, plateau);

      expect(newPosition).toEqual({ x: 2, y: 1, direction: 'E' });
    });

    it('deve falhar ao tentar sair do planalto pelo leste', () => {
      const position: Position = { x: 5, y: 1, direction: 'E' };

      expect(() => strategy.move(position, plateau)).toThrow(
        'Movimento inválido: sonda tentaria sair do planalto (x: 6 > 5)'
      );
    });

    it('deve permitir movimento no limite do planalto', () => {
      const position: Position = { x: 4, y: 1, direction: 'E' };
      const newPosition = strategy.move(position, plateau);

      expect(newPosition).toEqual({ x: 5, y: 1, direction: 'E' });
    });
  });

  describe('WestMovementStrategy', () => {
    let strategy: WestMovementStrategy;

    beforeEach(() => {
      strategy = new WestMovementStrategy();
    });

    it('deve mover para o oeste corretamente', () => {
      const position: Position = { x: 2, y: 1, direction: 'W' };
      const newPosition = strategy.move(position, plateau);

      expect(newPosition).toEqual({ x: 1, y: 1, direction: 'W' });
    });

    it('deve falhar ao tentar sair do planalto pelo oeste', () => {
      const position: Position = { x: 0, y: 1, direction: 'W' };

      expect(() => strategy.move(position, plateau)).toThrow(
        'Movimento inválido: sonda tentaria sair do planalto (x: -1 < 0)'
      );
    });

    it('deve permitir movimento no limite do planalto', () => {
      const position: Position = { x: 1, y: 1, direction: 'W' };
      const newPosition = strategy.move(position, plateau);

      expect(newPosition).toEqual({ x: 0, y: 1, direction: 'W' });
    });
  });

  describe('MovementStrategyFactory', () => {
    it('deve criar estratégia para direção norte', () => {
      const strategy = MovementStrategyFactory.createStrategy('N');
      expect(strategy).toBeInstanceOf(NorthMovementStrategy);
    });

    it('deve criar estratégia para direção sul', () => {
      const strategy = MovementStrategyFactory.createStrategy('S');
      expect(strategy).toBeInstanceOf(SouthMovementStrategy);
    });

    it('deve criar estratégia para direção leste', () => {
      const strategy = MovementStrategyFactory.createStrategy('E');
      expect(strategy).toBeInstanceOf(EastMovementStrategy);
    });

    it('deve criar estratégia para direção oeste', () => {
      const strategy = MovementStrategyFactory.createStrategy('W');
      expect(strategy).toBeInstanceOf(WestMovementStrategy);
    });

    it('deve falhar ao tentar criar estratégia para direção inválida', () => {
      expect(() => MovementStrategyFactory.createStrategy('X' as any)).toThrow(
        'Direção não suportada: X'
      );
    });

    it('deve retornar a mesma instância para a mesma direção', () => {
      const strategy1 = MovementStrategyFactory.createStrategy('N');
      const strategy2 = MovementStrategyFactory.createStrategy('N');
      expect(strategy1).toBe(strategy2);
    });
  });

  describe('Cenários de Borda', () => {
    it('deve funcionar com planalto de tamanho mínimo', () => {
      const smallPlateau = { width: 0, height: 0 };
      const northStrategy = new NorthMovementStrategy();
      const southStrategy = new SouthMovementStrategy();
      const eastStrategy = new EastMovementStrategy();
      const westStrategy = new WestMovementStrategy();

      // Todas as estratégias devem falhar ao tentar mover
      expect(() => northStrategy.move({ x: 0, y: 0, direction: 'N' }, smallPlateau))
        .toThrow('Movimento inválido: sonda tentaria sair do planalto (y: 1 > 0)');
      
      expect(() => southStrategy.move({ x: 0, y: 0, direction: 'S' }, smallPlateau))
        .toThrow('Movimento inválido: sonda tentaria sair do planalto (y: -1 < 0)');
      
      expect(() => eastStrategy.move({ x: 0, y: 0, direction: 'E' }, smallPlateau))
        .toThrow('Movimento inválido: sonda tentaria sair do planalto (x: 1 > 0)');
      
      expect(() => westStrategy.move({ x: 0, y: 0, direction: 'W' }, smallPlateau))
        .toThrow('Movimento inválido: sonda tentaria sair do planalto (x: -1 < 0)');
    });

    it('deve funcionar com planalto grande', () => {
      const largePlateau = { width: 100, height: 100 };
      const northStrategy = new NorthMovementStrategy();
      const position: Position = { x: 50, y: 99, direction: 'N' };

      const newPosition = northStrategy.move(position, largePlateau);
      expect(newPosition).toEqual({ x: 50, y: 100, direction: 'N' });
    });

    it('deve não modificar a posição original', () => {
      const strategy = new NorthMovementStrategy();
      const originalPosition: Position = { x: 1, y: 1, direction: 'N' };
      const positionCopy = { ...originalPosition };

      strategy.move(positionCopy, plateau);

      expect(originalPosition).toEqual({ x: 1, y: 1, direction: 'N' });
    });
  });
}); 