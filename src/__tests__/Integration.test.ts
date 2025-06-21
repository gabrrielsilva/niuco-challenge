import { MarsExplorationController } from '../controllers/MarsExplorationController';
import { Plateau, Rover as RoverData } from '../types';

describe('Integration Tests', () => {
  let controller: MarsExplorationController;

  beforeEach(() => {
    controller = new MarsExplorationController();
  });

  describe('Cenário Original do Exemplo', () => {
    it('deve executar o exemplo original corretamente', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' },
        { position: { x: 3, y: 3, direction: 'E' }, instructions: 'MMRMMRMRRM' }
      ];

      const results = controller.processExploration(plateau, rovers);
      const positions = controller.getFinalPositionsAsStrings(results);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(positions[0]).toBe('1 3 N');
      expect(positions[1]).toBe('5 1 E');
    });
  });

  describe('Cenários Complexos', () => {
    it('deve lidar com múltiplos rovers em posições próximas', () => {
      const plateau: Plateau = { width: 10, height: 10 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 1, direction: 'N' }, instructions: 'MMMM' },
        { position: { x: 2, y: 1, direction: 'N' }, instructions: 'MMMM' },
        { position: { x: 3, y: 1, direction: 'N' }, instructions: 'MMMM' }
      ];

      const results = controller.processExploration(plateau, rovers);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Cenários de Erro', () => {
    it('deve lidar com rover que tenta sair do planalto', () => {
      const plateau: Plateau = { width: 3, height: 3 };
      const rovers: RoverData[] = [
        { position: { x: 0, y: 0, direction: 'W' }, instructions: 'M' }
      ];

      const results = controller.processExploration(plateau, rovers);

      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Movimento inválido');
    });
  });
}); 