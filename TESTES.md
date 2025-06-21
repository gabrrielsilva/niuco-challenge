# Testes Unitários - Desafio Niuco

Este documento descreve os testes unitários implementados para o sistema de exploração de Marte.

## Estrutura dos Testes

Os testes estão organizados na pasta `src/__tests__/` e seguem a estrutura do código:

### 1. `Rover.test.ts` - Testes da Classe Rover

**Cobertura:**
- ✅ Construtor e inicialização
- ✅ Movimentação básica (Norte, Sul, Leste, Oeste)
- ✅ Mudança de direção (Rotação esquerda e direita)
- ✅ Instruções complexas (sequências LMLMLMLMM, MMRMMRMRRM)
- ✅ Limites do planalto (validação de saída dos limites)
- ✅ Conflito de posição (detecção de posições ocupadas)
- ✅ Instruções inválidas (caracteres não reconhecidos)
- ✅ Métodos auxiliares (getFinalPositionString, hashCode)
- ✅ Cenários de borda (instruções vazias, cantos do planalto)

**Principais Cenários Testados:**
- Movimento para todas as direções
- Rotação completa (360 graus)
- Falha ao tentar sair do planalto
- Falha ao tentar ocupar posição já ocupada
- Execução parcial de instruções com erro
- Geração de IDs únicos para rovers

### 2. `MovementStrategy.test.ts` - Testes das Estratégias de Movimento

**Cobertura:**
- ✅ NorthMovementStrategy
- ✅ SouthMovementStrategy
- ✅ EastMovementStrategy
- ✅ WestMovementStrategy
- ✅ MovementStrategyFactory

**Principais Cenários Testados:**
- Movimento válido em todas as direções
- Falha ao tentar sair do planalto
- Movimento no limite do planalto
- Criação de estratégias via factory
- Validação de direções inválidas
- Cenários de borda (planalto mínimo, planalto grande)

### 3. `RotationStrategy.test.ts` - Testes das Estratégias de Rotação

**Cobertura:**
- ✅ LeftRotationStrategy
- ✅ RightRotationStrategy
- ✅ RotationStrategyFactory

**Principais Cenários Testados:**
- Rotação para esquerda em todas as direções
- Rotação para direita em todas as direções
- Volta completa (4 rotações)
- Cancelamento de rotações opostas
- Propriedades matemáticas das rotações
- Criação de estratégias via factory

### 4. `Command.test.ts` - Testes dos Comandos

**Cobertura:**
- ✅ MoveCommand
- ✅ RotateCommand
- ✅ CommandFactory

**Principais Cenários Testados:**
- Execução de comandos de movimento
- Execução de comandos de rotação
- Validação de limites do planalto
- Detecção de conflitos de posição
- Gerenciamento de posições ocupadas
- Criação de comandos via factory
- Validação de instruções inválidas

### 5. `MarsExplorationController.test.ts` - Testes do Controlador Principal

**Cobertura:**
- ✅ Validação do planalto
- ✅ Validação dos rovers
- ✅ Processamento de exploração
- ✅ Geração de resultados
- ✅ Cenários de erro

**Principais Cenários Testados:**
- Validação de dados de entrada
- Processamento de múltiplos rovers
- Detecção de conflitos de posição
- Geração de strings de posição final
- Limpeza de estado entre execuções
- Validação de múltiplos rovers

### 6. `Integration.test.ts` - Testes de Integração

**Cobertura:**
- ✅ Cenário original do exemplo
- ✅ Cenários complexos
- ✅ Cenários de erro

**Principais Cenários Testados:**
- Execução do exemplo original (LMLMLMLMM, MMRMMRMRRM)
- Múltiplos rovers em posições próximas
- Detecção de saída do planalto

## Execução dos Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Configuração do Jest

O projeto está configurado com:
- **Preset:** ts-jest para suporte ao TypeScript
- **Cobertura:** Relatórios em texto, lcov e HTML
- **Padrão de arquivos:** `**/__tests__/**/*.test.ts`
- **Exclusões:** `src/app.ts` e `src/types/**`

## Cobertura de Testes

Os testes cobrem:

### Funcionalidades Principais
- ✅ Movimentação básica e mudança de direção
- ✅ Respeito aos limites do planalto
- ✅ Conflito de posição
- ✅ Validação de entrada
- ✅ Tratamento de erros

### Abstrações Testadas
- ✅ Classe Rover (modelo principal)
- ✅ Estratégias de movimento (padrão Strategy)
- ✅ Estratégias de rotação (padrão Strategy)
- ✅ Comandos (padrão Command)
- ✅ Factory classes
- ✅ Controlador principal

### Cenários de Erro/Exceção
- ✅ Instruções inválidas
- ✅ Posições fora do planalto
- ✅ Conflitos de posição
- ✅ Dados de entrada inválidos
- ✅ Direções inválidas

## Qualidade dos Testes

### Características dos Testes Implementados

1. **Isolamento:** Cada teste é independente e não depende de outros
2. **Completude:** Cobertura de casos de sucesso e erro
3. **Legibilidade:** Nomes descritivos em português
4. **Manutenibilidade:** Estrutura organizada e reutilizável
5. **Performance:** Testes rápidos e eficientes

### Padrões Utilizados

- **Arrange-Act-Assert:** Estrutura clara dos testes
- **Setup/Teardown:** Uso de `beforeEach` para preparação
- **Mocks:** MockRover para testes de comandos
- **Factory:** Criação de dados de teste reutilizáveis

## Resultados Esperados

Com a implementação completa dos testes, espera-se:

- **Cobertura de código:** >90%
- **Testes passando:** 100%
- **Cenários críticos:** Todos cobertos
- **Validação de regras de negócio:** Completa

## Próximos Passos

Para melhorar ainda mais a qualidade dos testes:

1. **Testes de Performance:** Para cenários com muitos rovers
2. **Testes de Stress:** Para validar limites do sistema
3. **Testes de Integração:** Com APIs externas (se aplicável)
4. **Testes de UI:** Para interface de usuário (se implementada) 