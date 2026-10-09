# Entrega — Giselle Costa

> Preencha este arquivo. Ele nos ajuda a rodar e entender o seu projeto.

## Como rodar
_Passo a passo para subir o back-end e o front-end na minha máquina._

## O que foi feito
O primeiro passo foi a etapa de planejamento. Fiz a leitura do desafio e a análise do repositório para entender o que precisava ser desenvolvido e a ordem de prioridade. 
Além disso, tomei as primeiras decisões técnicas para implementação. 

## Onde guardei os dados
_Usei banco de dados ou memória? Por quê?_

## Decisões e dificuldades
- A fila é o componente mais importante do desafio em minha opinião. Antes de pensar em controller, front-end, etc, gostaria de abordar a solução da fila e criar os testes que validem o funcionamento esperado dela. Por conta disso, apesar de os testes serem requisitos desejáveis, irei tratá-los como necessários para o escopo mínimo.

- Decidi subir o projeto com Docker para garantir a reprodutibilidade na máquina do avaliador. Entendo que o custo de implementação do Docker é baixo em relação aos benefícios de facilitar a configuração.

- Irei armazenar os dados em memória para este desafio. Vou priorizar o desenvolvimento da fila e das regras de negócio, evitando gastar tempo com a infraestrutura do banco de dados. Entretanto, isso só é valido para o desafio. Em produção, a aplicação deve ser desenvolvida utilizando um banco de dados relacional para garantir a persistência da informação, além de armazenar um histórico de operações para fins de auditoria, e outros benefícios. 

## O que faria com mais tempo
_Próximos passos ou melhorias que ficaram de fora._
