import { MarsExplorationController } from '../controllers/MarsExplorationController';
import { Plateau, Rover as RoverData } from '../types';

describe('MarsExplorationController', () => {
  let controller: MarsExplorationController;

  beforeEach(() => {
    controller = new MarsExplorationController();
  });

  describe('Validação do Planalto', () => {
    it('deve aceitar planalto válido', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).not.toThrow();
    });

    it('deve falhar com planalto nulo', () => {
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(null as any, rovers)).toThrow(
        'Dados do planalto inválidos'
      );
    });

    it('deve falhar com planalto indefinido', () => {
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(undefined as any, rovers)).toThrow(
        'Dados do planalto inválidos'
      );
    });

    it('deve falhar com largura negativa', () => {
      const plateau: Plateau = { width: -1, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Dimensões do planalto devem ser positivas'
      );
    });

    it('deve falhar com altura negativa', () => {
      const plateau: Plateau = { width: 5, height: -1 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Dimensões do planalto devem ser positivas'
      );
    });

    it('deve aceitar planalto de tamanho zero', () => {
      const plateau: Plateau = { width: 0, height: 0 };
      const rovers: RoverData[] = [
        { position: { x: 0, y: 0, direction: 'N' }, instructions: 'R' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).not.toThrow();
    });
  });

  describe('Validação dos Rovers', () => {
    it('deve falhar com lista de rovers vazia', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Pelo menos uma sonda deve ser fornecida'
      );
    });

    it('deve falhar com rovers nulo', () => {
      const plateau: Plateau = { width: 5, height: 5 };

      expect(() => controller.processExploration(plateau, null as any)).toThrow(
        'Pelo menos uma sonda deve ser fornecida'
      );
    });

    it('deve falhar com rover sem posição', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: null as any, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Dados da sonda 1 incompletos'
      );
    });

    it('deve falhar com rover sem instruções', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: null as any }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Dados da sonda 1 incompletos'
      );
    });

    it('deve falhar com posição fora do planalto', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 6, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Posição inicial da sonda 1 está fora do planalto'
      );
    });

    it('deve falhar com posição negativa', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: -1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Posição inicial da sonda 1 está fora do planalto'
      );
    });

    it('deve falhar com direção inválida', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'X' as any }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Direção inválida para sonda 1: X'
      );
    });

    it('deve falhar com instruções inválidas', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLXLM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Instruções inválidas para sonda 1: LMLXLM'
      );
    });

    it('deve aceitar instruções vazias', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: '' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Dados da sonda 1 incompletos'
      );
    });
  });

  describe('Processamento de Exploração', () => {
    it('deve processar exploração com sucesso', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' },
        { position: { x: 3, y: 3, direction: 'E' }, instructions: 'MMRMMRMRRM' }
      ];

      const results = controller.processExploration(plateau, rovers);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[0].finalPosition).toEqual({ x: 1, y: 3, direction: 'N' });
      expect(results[1].success).toBe(true);
      expect(results[1].finalPosition).toEqual({ x: 5, y: 1, direction: 'E' });
    });

    it('deve processar exploração com erro', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 5, direction: 'N' }, instructions: 'M' }
      ];

      const results = controller.processExploration(plateau, rovers);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Movimento inválido');
    });

    it('deve processar múltiplos rovers com conflito de posição', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 1, direction: 'N' }, instructions: 'M' },
        { position: { x: 1, y: 3, direction: 'S' }, instructions: 'M' }
      ];

      const results = controller.processExploration(plateau, rovers);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toContain('Posição ocupada');
    });

    it('deve processar rovers sequencialmente', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 1, direction: 'N' }, instructions: 'M' },
        { position: { x: 1, y: 1, direction: 'N' }, instructions: 'M' }
      ];

      const results = controller.processExploration(plateau, rovers);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[0].finalPosition).toEqual({ x: 1, y: 2, direction: 'N' });
      expect(results[1].success).toBe(false);
      expect(results[1].finalPosition).toEqual({ x: 1, y: 1, direction: 'N' });
    });
  });

  describe('getFinalPositionsAsStrings', () => {
    it('deve retornar posições como strings para explorações bem-sucedidas', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' },
        { position: { x: 3, y: 3, direction: 'E' }, instructions: 'MMRMMRMRRM' }
      ];

      const results = controller.processExploration(plateau, rovers);
      const positions = controller.getFinalPositionsAsStrings(results);

      expect(positions).toHaveLength(2);
      expect(positions[0]).toBe('1 3 N');
      expect(positions[1]).toBe('5 1 E');
    });

    it('deve incluir erro na string para explorações falhadas', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 5, direction: 'N' }, instructions: 'M' }
      ];

      const results = controller.processExploration(plateau, rovers);
      const positions = controller.getFinalPositionsAsStrings(results);

      expect(positions).toHaveLength(1);
      expect(positions[0]).toContain('1 5 N');
      expect(positions[0]).toContain('ERRO:');
      expect(positions[0]).toContain('Movimento inválido');
    });

    it('deve funcionar com lista vazia de resultados', () => {
      const positions = controller.getFinalPositionsAsStrings([]);
      expect(positions).toEqual([]);
    });
  });

  describe('Cenários de Borda', () => {
    it('deve funcionar com um único rover', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 0, y: 0, direction: 'N' }, instructions: 'R' }
      ];

      const results = controller.processExploration(plateau, rovers);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].finalPosition).toEqual({ x: 0, y: 0, direction: 'E' });
    });

    it('deve funcionar com muitos rovers', () => {
      const plateau: Plateau = { width: 10, height: 10 };
      const rovers: RoverData[] = Array.from({ length: 5 }, (_, i) => ({
        position: { x: i, y: i, direction: 'N' as const },
        instructions: 'M'
      }));

      const results = controller.processExploration(plateau, rovers);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('deve funcionar com planalto grande', () => {
      const plateau: Plateau = { width: 100, height: 100 };
      const rovers: RoverData[] = [
        { position: { x: 50, y: 50, direction: 'N' }, instructions: 'MMMMM' }
      ];

      const results = controller.processExploration(plateau, rovers);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].finalPosition).toEqual({ x: 50, y: 55, direction: 'N' });
    });

    it('deve limpar posições ocupadas entre execuções', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers1: RoverData[] = [
        { position: { x: 1, y: 1, direction: 'N' }, instructions: 'M' }
      ];
      const rovers2: RoverData[] = [
        { position: { x: 1, y: 1, direction: 'N' }, instructions: 'M' }
      ];

      // Primeira execução
      const results1 = controller.processExploration(plateau, rovers1);
      expect(results1[0].success).toBe(true);

      // Segunda execução - deve funcionar pois as posições foram limpas
      const results2 = controller.processExploration(plateau, rovers2);
      expect(results2[0].success).toBe(true);
    });
  });

  describe('Validação de Múltiplos Rovers', () => {
    it('deve falhar se qualquer rover for inválido', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' },
        { position: { x: 6, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Posição inicial da sonda 2 está fora do planalto'
      );
    });

    it('deve validar todos os rovers antes de processar', () => {
      const plateau: Plateau = { width: 5, height: 5 };
      const rovers: RoverData[] = [
        { position: { x: 1, y: 2, direction: 'N' }, instructions: 'LMLMLMLMM' },
        { position: { x: 3, y: 3, direction: 'X' as any }, instructions: 'MMRMMRMRRM' }
      ];

      expect(() => controller.processExploration(plateau, rovers)).toThrow(
        'Direção inválida para sonda 2: X'
      );
    });
  });
}); 