import { 
  LeftRotationStrategy, 
  RightRotationStrategy, 
  RotationStrategyFactory 
} from '../strategies/RotationStrategy';
import { Direction } from '../types';

describe('RotationStrategy', () => {
  describe('LeftRotationStrategy', () => {
    let strategy: LeftRotationStrategy;

    beforeEach(() => {
      strategy = new LeftRotationStrategy();
    });

    it('deve girar de norte para oeste', () => {
      const newDirection = strategy.rotate('N');
      expect(newDirection).toBe('W');
    });

    it('deve girar de oeste para sul', () => {
      const newDirection = strategy.rotate('W');
      expect(newDirection).toBe('S');
    });

    it('deve girar de sul para leste', () => {
      const newDirection = strategy.rotate('S');
      expect(newDirection).toBe('E');
    });

    it('deve girar de leste para norte', () => {
      const newDirection = strategy.rotate('E');
      expect(newDirection).toBe('N');
    });

    it('deve completar uma volta completa', () => {
      let direction: Direction = 'N';
      direction = strategy.rotate(direction); // N -> W
      direction = strategy.rotate(direction); // W -> S
      direction = strategy.rotate(direction); // S -> E
      direction = strategy.rotate(direction); // E -> N

      expect(direction).toBe('N');
    });
  });

  describe('RightRotationStrategy', () => {
    let strategy: RightRotationStrategy;

    beforeEach(() => {
      strategy = new RightRotationStrategy();
    });

    it('deve girar de norte para leste', () => {
      const newDirection = strategy.rotate('N');
      expect(newDirection).toBe('E');
    });

    it('deve girar de leste para sul', () => {
      const newDirection = strategy.rotate('E');
      expect(newDirection).toBe('S');
    });

    it('deve girar de sul para oeste', () => {
      const newDirection = strategy.rotate('S');
      expect(newDirection).toBe('W');
    });

    it('deve girar de oeste para norte', () => {
      const newDirection = strategy.rotate('W');
      expect(newDirection).toBe('N');
    });

    it('deve completar uma volta completa', () => {
      let direction: Direction = 'N';
      direction = strategy.rotate(direction); // N -> E
      direction = strategy.rotate(direction); // E -> S
      direction = strategy.rotate(direction); // S -> W
      direction = strategy.rotate(direction); // W -> N

      expect(direction).toBe('N');
    });
  });

  describe('RotationStrategyFactory', () => {
    it('deve criar estratégia de rotação para esquerda', () => {
      const strategy = RotationStrategyFactory.createStrategy('L');
      expect(strategy).toBeInstanceOf(LeftRotationStrategy);
    });

    it('deve criar estratégia de rotação para direita', () => {
      const strategy = RotationStrategyFactory.createStrategy('R');
      expect(strategy).toBeInstanceOf(RightRotationStrategy);
    });

    it('deve falhar ao tentar criar estratégia para rotação inválida', () => {
      expect(() => RotationStrategyFactory.createStrategy('X' as any)).toThrow(
        'Rotação não suportada: X'
      );
    });

    it('deve retornar a mesma instância para a mesma rotação', () => {
      const strategy1 = RotationStrategyFactory.createStrategy('L');
      const strategy2 = RotationStrategyFactory.createStrategy('L');
      expect(strategy1).toBe(strategy2);
    });
  });

  describe('Cenários de Borda', () => {
    it('deve funcionar com múltiplas rotações consecutivas', () => {
      const leftStrategy = new LeftRotationStrategy();
      const rightStrategy = new RightRotationStrategy();

      let direction: Direction = 'N';

      // 4 rotações para esquerda = volta completa
      for (let i = 0; i < 4; i++) {
        direction = leftStrategy.rotate(direction);
      }
      expect(direction).toBe('N');

      // 4 rotações para direita = volta completa
      for (let i = 0; i < 4; i++) {
        direction = rightStrategy.rotate(direction);
      }
      expect(direction).toBe('N');
    });

    it('deve voltar a posição original com rotações opostas', () => {
      const leftStrategy = new LeftRotationStrategy();
      const rightStrategy = new RightRotationStrategy();

      let direction: Direction = 'N';

      // Rotação para esquerda seguida de rotação para direita
      direction = leftStrategy.rotate(direction);  // N -> W
      direction = rightStrategy.rotate(direction); // W -> N

      expect(direction).toBe('N');
    });

    it('deve funcionar com todas as direções iniciais', () => {
      const leftStrategy = new LeftRotationStrategy();
      const rightStrategy = new RightRotationStrategy();

      const directions: Direction[] = ['N', 'S', 'E', 'W'];

      directions.forEach(initialDirection => {
        const leftResult = leftStrategy.rotate(initialDirection);
        const rightResult = rightStrategy.rotate(initialDirection);

        expect(leftResult).toBeDefined();
        expect(rightResult).toBeDefined();
        expect(leftResult).not.toBe(initialDirection);
        expect(rightResult).not.toBe(initialDirection);
      });
    });
  });

  describe('Propriedades Matemáticas', () => {
    it('deve ter rotações inversas', () => {
      const leftStrategy = new LeftRotationStrategy();
      const rightStrategy = new RightRotationStrategy();

      const directions: Direction[] = ['N', 'S', 'E', 'W'];

      directions.forEach(direction => {
        // Rotação para esquerda seguida de rotação para direita deve retornar à direção original
        let result = leftStrategy.rotate(direction);
        result = rightStrategy.rotate(result);

        expect(result).toBe(direction);
      });
    });

    it('deve ter rotações simétricas', () => {
      const leftStrategy = new LeftRotationStrategy();
      const rightStrategy = new RightRotationStrategy();

      const directions: Direction[] = ['N', 'S', 'E', 'W'];

      directions.forEach(direction => {
        // Duas rotações para esquerda = duas rotações para direita (volta completa)
        let leftTwice = direction;
        leftTwice = leftStrategy.rotate(leftTwice);
        leftTwice = leftStrategy.rotate(leftTwice);

        let rightTwice = direction;
        rightTwice = rightStrategy.rotate(rightTwice);
        rightTwice = rightStrategy.rotate(rightTwice);

        expect(leftTwice).toBe(rightTwice);
      });
    });
  });
}); 