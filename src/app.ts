import express, { Request, Response } from 'express';
import { MarsExplorationController } from './controllers/MarsExplorationController';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/explore', (req: Request, res: Response) => {
  try {
    const { plateau, rovers } = req.body;
    
    if (!plateau || !rovers) {
      return res.status(400).json({ 
        error: 'Dados inválidos. É necessário fornecer plateau e rovers.' 
      });
    }

    const controller = new MarsExplorationController();
    const results = controller.processExploration(plateau, rovers);
    const finalPositions = controller.getFinalPositionsAsStrings(results);
    
    res.json({ 
      success: true, 
      finalPositions,
      results
    });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    });
  }
});

app.get('/', (_: Request, res: Response) => {
  res.json({
    title: 'Desafio Niuco 2025',
    description: 'API para controle de sondas em Marte',
    endpoints: {
      'POST /explore': 'Processa exploração de sondas',
      'GET /': 'Informações sobre a API'
    },
    example: {
      plateau: { width: 5, height: 5 },
      rovers: [
        {
          position: { x: 1, y: 2, direction: 'N' },
          instructions: 'LMLMLMLMM'
        },
        {
          position: { x: 3, y: 3, direction: 'E' },
          instructions: 'MMRMMRMRRM'
        }
      ]
    }
  });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});