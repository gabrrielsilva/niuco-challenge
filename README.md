# Desafio Niuco 2025

## Problema

Um conjunto de sondas (rovers) foi enviado pela NASA a Marte e irá pousar num planalto retangular. Essas sondas devem percorrer a área mapeada seguindo instruções de controle para se movimentar.

### Regras do Sistema

- **Planalto**: Representado por uma matriz (0,0 - x,y) que define os limites da área explorável
- **Posicionamento**: As sondas são iniciadas com posições (x,y) e direções definidas (N, E, S, W)
- **Instruções de Movimento**:
  - `L`: Virar 90 graus para a esquerda
  - `R`: Virar 90 graus para a direita  
  - `M`: Mover um ponto à frente na direção atual

### Validações Implementadas

- **Tratamento de Entrada**: Todos os dados e instruções de entrada são validados
- **Limites do Planalto**: Se uma sonda tentar sair dos limites do planalto, o movimento é bloqueado
- **Colisão entre Sondas**: Se uma sonda tentar ocupar uma posição onde já existe outra sonda, o movimento é bloqueado
- **Tratamento de Saída**: Todas as violações de regras são tratadas explicitamente com mensagens de erro apropriadas

## Como configurar e rodar o projeto

### Pré-requisitos

- Docker instalado no seu sistema

### Tecnologias Utilizadas

- **TypeScript** - Linguagem de programação tipada
- **Express.js** - Framework web para APIs REST
- **Node.js** - Runtime JavaScript
- **Design Patterns** - Padrões de projeto (Command, Strategy, Factory, MVC)
- **SOLID** - Princípios de design de software
- **Jest** - Biblioteca para testes

### Configuração e Execução com Docker

#### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd desafio-niuco
```

#### 2. Construa e execute o projeto com Docker Compose

```bash
# Construir e iniciar o container
docker-compose up --build
```

#### 3. Verificar se a aplicação está rodando

A API estará disponível em: `http://localhost:3000`

Você pode testar acessando: `http://localhost:3000/` no seu navegador ou usando curl:

```bash
curl http://localhost:3000/
```

#### 4. Testar a API

Faça uma requisição POST para `/explore`:

```bash
curl -X POST http://localhost:3000/explore \
  -H "Content-Type: application/json" \
  -d '{
    "plateau": {
      "width": 5,
      "height": 5
    },
    "rovers": [
      {
        "position": { "x": 1, "y": 2, "direction": "N" },
        "instructions": "LMLMLMLMM"
      },
      {
        "position": { "x": 3, "y": 3, "direction": "E" },
        "instructions": "MMRMMRMRRM"
      }
    ]
  }'
```

### Comandos úteis do Docker

#### Parar a aplicação

```bash
docker-compose down
```

#### Ver logs da aplicação

```bash
docker-compose logs -f
```

#### Executar testes dentro do container

```bash
docker-compose exec server npm test
```

#### Executar linting

```bash
docker-compose exec server npm run lint
```

#### Acessar o shell do container

```bash
docker-compose exec server sh
```

### Estrutura da API

#### Endpoints disponíveis

- `GET /` - Informações sobre a API
- `POST /explore` - Processa exploração de sondas

#### Formato da requisição para `/explore`

```json
{
  "plateau": {
    "width": 5,
    "height": 5
  },
  "rovers": [
    {
      "position": { "x": 1, "y": 2, "direction": "N" },
      "instructions": "LMLMLMLMM"
    },
    {
      "position": { "x": 3, "y": 3, "direction": "E" },
      "instructions": "MMRMMRMRRM"
    }
  ]
}
```

#### Resposta da API

```json
{
  "success": true,
  "finalPositions": [
    "1 3 N",
    "5 1 E"
  ],
  "results": [
    {
      "finalPosition": {
        "x": 1,
        "y": 3,
        "direction": "N"
      },
      "roverId": 269356893,
      "success": true
    },
    {
      "finalPosition": {
        "x": 5,
        "y": 1,
        "direction": "E"
      },
      "roverId": 975259831,
      "success": true
    }
  ],
  "summary": {
    "totalRovers": 2,
    "successfulRovers": 2,
    "failedRovers": 0,
    "hasErrors": false
  }
}
```

## Decisões de projeto

### Web API como Interface principal

Permite integração com frontends, é fácil de testar usando ferramentas como Postman ou Insomnia e pode ser consumida por diversos clientes.

### Estrutura do projeto

O projeto segue uma arquitetura modular e bem organizada, separando responsabilidades em diferentes camadas:

```
src/                          # Código fonte principal
├── app.ts                    # Ponto de entrada da aplicação
├── controllers/              # Controladores da API
│   └── MarsExplorationController.ts
├── models/                   # Modelos de dados
│   └── Rover.ts
├── commands/                 # Padrão Command para instruções
│   └── Command.ts
├── strategies/               # Padrão Strategy para movimentos e rotações
│   ├── MovementStrategy.ts
│   └── RotationStrategy.ts
├── types/                    # Definições de tipos TypeScript
│   └── index.ts
└── __tests__/                # Testes unitários e de integração
    ├── Command.test.ts
    ├── Integration.test.ts
    ├── MarsExplorationController.test.ts
    ├── MovementStrategy.test.ts
    ├── RotationStrategy.test.ts
    └── Rover.test.ts
```

#### Explicação das pastas principais

- **`src/controllers/`**: Contém os controladores que gerenciam as requisições HTTP e a lógica de negócio principal
- **`src/models/`**: Define as entidades do domínio (como o Rover)
- **`src/commands/`**: Implementa o padrão Command para processar as instruções das sondas
- **`src/strategies/`**: Implementa o padrão Strategy para diferentes tipos de movimento e rotação
- **`src/types/`**: Centraliza as definições de tipos TypeScript
- **`src/__tests__/`**: Contém todos os testes unitários e de integração
- **`coverage/`**: Relatórios de cobertura de testes gerados pelo Jest

#### Padrões de Design utilizados

1. **Command Pattern**: Permite encapsular cada instrução como um objeto, facilitando a execução sequencial (fila) das instruções e permitindo extensões futuras, se quiser adicionar uma nova ação, como Scan por exemplo, é só adicionar o comando 'S' e criar um Command para essa instrução. Basicamente esse pattern anota as tarefas em uma lista, como um assistente, e ele cuida da execução dessa tarefa sem que eu precise saber os detalhes pra executar.

2. **Strategy Pattern**: Para implementar diferentes estratégias de movimento e rotação, como temos diferentes cálculos e algoritmos utiliei esse pattern para encapsular a lógica de cada movimento, de modo que fique fácil estender essas estratégias, se quisermos criar um novo movimento para NE por exemplo, é só criar o NorthEastMovementStrategy e adicioná-lo no MovementStrategyFactory, em vez de uma classe fazer tudo sozinha, ela delega a execução de uma parte do trabalho a um objeto separado que implementa o algoritmo específico, garantido baixo acoplamento e código fácil de manter.

3. **MVC**: Separação clara entre Modelos, Controladores e Lógica de negócio.

4. **Factory Pattern**: Utilizado para fabricar os objetos baseado em parâmetros de modo que não preciso ficar instanciando objetos em camadas mais altas, ou seja, promove um baixo acoplamento entre a camada mais próxima do cliente e a lógica de criação de objetos em camadas mais baixas, basicamente separa "O que" do "Como". Em vez de eu ter uma "linha de montagem" gigante eu tenho um "gerente de produção".

#### Explicações adicionais do SOLID Aplicado

**SRP**: Cada classe tem sua única responsabilidade, provomendo baixo acoplamento, facilitando manutenção e testes.

**OCP**: CommandFactory, MovementStrategyFactory e RotationStrategyFactory permitem estender as interfaces sem modificar as outras, ou seja, as entidades estão abertas pra extensão e fechadas pra modificação. 

**LSP**: Todas as estratégias implementam interfaces comuns e que podem ser substituídas por suas classes base sem afetar o funcionamento. Para Command ocorre o mesmo.

**ISP**: Estabeleci interfaces específicas para cada responsabilidade, em MovementStrategy por exemplo, para validar se o movimento excede o tamanho do planalto, para as direções S e W não precisamos saber o tamanho de plateau, então criei uma interface separada no caso do movimento ser para N ou E (PlateauAwareMovementStrategy) que requer o tamanho do plateau pra fazer os cálculos e validações.

**DIP**: Em vez de módulos de alto nível dependerem de módulos de baixo nível eles dependem de abstrações (Command, MovementStrategy, RotationStrategy) e o Rover não cria diretamente os comandos ele usa CommandFactory.

#### Testes

Foram escritos testes unitários e de integração que cobrem os principais cenários e possíveis falhas.

Pontos como:

1. **Movimentação básica e mudança de direção.**
2. **Respeito aos limites do planalto.**
3. **Conflito de posição**
4. **Vários cenários de entrada (erro/exceções).**
5. **Abstrações (classes e métodos)**

### Debugging no VSCode

Para o Debug eu pedi pra IA configurar um launch.json com os cenários de debug, quando precisei testar o fluxo da aplicação passo a passo adicionei um breakpoint nas linhas onde estavam os métodos e variáveis que queria observar e executei o debug. Dai fui clicando em "continue" sempre que chegava em um breakpoint, isso depois de passar o cursor em cima do método ou variavel que eu queria saber o valor no cenário executado.

### Pipeline de CI

Usei o Github Actions para o pipeline de Continuous Integration, a IA criou o ci.yml. Há três jobs específicos, um para testes, segurança e build/deploy. 

**Job test**: busca por erros de lint, faz o build, executa os testes e armazena os relatórios de coverage.

**Job security**: instala as dependências, faz a auditoria dos pacotes buscando por falhas de segurança e verifica se existem dependencias desatualizadas.

**Job build/deploy**: constrói os artefatos da aplicação que são armazenados como "build-artifacts-id" em Actions no GitHub. Junto dos coverage-reports.