import { Plateau, Rover as RoverData, ExplorationResult } from '../types';
import { Rover } from '../models/Rover';

export class MarsExplorationController {
  private occupiedPositions: Set<string> = new Set();

  processExploration(plateau: Plateau, roversData: RoverData[]): ExplorationResult[] {
    this.validatePlateau(plateau);
    this.validateRovers(roversData, plateau);
    
    const results: ExplorationResult[] = [];
    this.occupiedPositions.clear();

    for (let i = 0; i < roversData.length; i++) {
      const roverData = roversData[i];
      const rover = new Rover(roverData.position, roverData.instructions);
      
      const result = rover.executeInstructions(plateau, this.occupiedPositions);
      results.push(result);
      
      if (result.success) {
        console.log(`Sonda ${i + 1} finalizou em: ${rover.getFinalPositionString()}`);
      } else {
        console.error(`Sonda ${i + 1} falhou: ${result.error}`);
      }
    }

    return results;
  }

  private validatePlateau(plateau: Plateau): void {
    if (!plateau || typeof plateau.width !== 'number' || typeof plateau.height !== 'number') {
      throw new Error('Dados do planalto inválidos');
    }
    
    if (plateau.width < 0 || plateau.height < 0) {
      throw new Error('Dimensões do planalto devem ser positivas');
    }
  }

  private validateRovers(rovers: RoverData[], plateau: Plateau): void {
    if (!Array.isArray(rovers) || rovers.length === 0) {
      throw new Error('Pelo menos uma sonda deve ser fornecida');
    }

    for (let i = 0; i < rovers.length; i++) {
      const rover = rovers[i];
      
      if (!rover.position || !rover.instructions) {
        throw new Error(`Dados da sonda ${i + 1} incompletos`);
      }

      if (rover.position.x < 0 || rover.position.y < 0 || 
          rover.position.x > plateau.width || rover.position.y > plateau.height) {
        throw new Error(`Posição inicial da sonda ${i + 1} está fora do planalto`);
      }

      if (!['N', 'S', 'E', 'W'].includes(rover.position.direction)) {
        throw new Error(`Direção inválida para sonda ${i + 1}: ${rover.position.direction}`);
      }

      if (!/^[LRM]+$/.test(rover.instructions)) {
        throw new Error(`Instruções inválidas para sonda ${i + 1}: ${rover.instructions}`);
      }
    }
  }

  getFinalPositionsAsStrings(results: ExplorationResult[]): string[] {
    return results.map(result => {
      const position = `${result.finalPosition.x} ${result.finalPosition.y} ${result.finalPosition.direction}`;
      return result.success ? position : `${position} (ERRO: ${result.error})`;
    });
  }
}