# BACEN Estudos TI — v2.1.0

Aplicação estática, responsiva e PWA para preparação do **Banco Central do Brasil — Tecnologia da Informação**, baseada no Edital nº 01/2024 e na grade de estudos importada para o projeto.

## O que mudou na v2.1

- Removido integralmente o Banco do Brasil: interface, dados, lógica, cache e documentação.
- Projeto agora é 100% BACEN TI.
- Edital organizado por **P1, P2, P3 e P4**.
- Questões objetivas separadas por **P1 e P2**, com matéria e tema exato do edital.
- Ranking BACEN 2024 agora usa desempenho **por tema**:
  - questões resolvidas;
  - acertos;
  - erros;
  - taxa de acerto;
  - nota líquida de treino Cebraspe: `acertos - 0,5 × erros`;
  - peso oficial do tema (`pesoTopico`) no edital.
- Um tema com muitas questões não domina artificialmente a projeção: a nota projetada é ponderada pelo peso oficial do tema.
- O ranking mostra cobertura temática direta de P1/P2 e nível de confiança da amostra.
- P3 e P4 podem ser alimentadas pelas notas dos treinos discursivos.
- Na P4, o treino pode ser classificado pela área técnica principal: Ciência de Dados, Segurança, Engenharia de Software, Infraestrutura, Bancos de Dados ou Gestão de TI.
- P3/P4 automáticas usam a média das últimas 5 avaliações com nota; é possível desligar e simular manualmente.
- Migração automática da versão multi-concurso v2.0 (`estudos-ti-state-v6-bacen`) para a nova chave BACEN v7.

## Estrutura das provas

### P1 — Conhecimentos Básicos — 50 itens
- Língua Portuguesa — 25
- Noções de Lógica e Estatística — 10
- Direito Administrativo — 5
- Fundamentos de Macroeconomia e Microeconomia — 10

### P2 — Conhecimentos Específicos TI — 70 itens
- Ciência de Dados — 14
- Segurança da Informação — 7
- Engenharia de Software — 24
- Infraestrutura em TI — 17
- Bancos de Dados — 4
- Gestão em TI — 4

### P3 — Atualidades
- dissertação de até 40 linhas;
- valor máximo de 30 pontos.

### P4 — Situação-problema de TI
- conhecimentos específicos de TI;
- resposta de até 80 linhas;
- valor máximo de 50 pontos.

## Ranking histórico

A base `data/bacen-ranking-2024.json` contém os 150 registros da aba **Todos os 150**, de forma anonimizada. Nomes e números de inscrição não são publicados no site.

A projeção objetiva não simplesmente calcula a média de todas as questões. Ela usa cada tema do edital como unidade de análise e aplica o peso oficial daquele tema. Temas sem amostra direta usam primeiro a média temática da própria matéria. Questões lançadas como “Geral da matéria” servem como fallback quando não há tema direto; a cobertura temática continua visível para deixar a incerteza explícita.

A comparação histórica é uma ferramenta de acompanhamento e **não garante classificação futura**.

## Recursos mantidos

- Dashboard e Desempenho 2.0.
- Índice de preparação.
- Busca global `Ctrl+K` / `Cmd+K`.
- Calendário semanal por aula real e duração real.
- Planejamento pré-edital/pós-edital.
- Reta final automática de 15 dias.
- Revisão 1-7-30.
- Revisão inteligente pelos tópicos com mais erros.
- Heatmap de consistência.
- Metas semanais.
- 916 videoaulas BACEN cadastradas.
- 131 objetos verticalizados no edital.
- 100 pares para P3/P4.
- 500 frases motivacionais.
- Cronômetro.
- Backup/importação JSON.
- Tema claro/escuro.
- PWA e funcionamento offline após o primeiro carregamento.

## Rodando localmente

Não abra `index.html` diretamente, pois os JSONs são carregados via `fetch()`.

```bash
python -m http.server 8080
```

Depois abra `http://localhost:8080`.

## GitHub Pages

Envie o conteúdo desta pasta para a raiz do repositório e configure:

`Settings > Pages > Deploy from a branch > main > /(root)`

O arquivo `.nojekyll` já está incluído.

## Armazenamento

A versão 2.1 usa:

```text
bacen-ti-state-v7
```

Na primeira abertura, procura automaticamente versões anteriores do BACEN, incluindo a chave da versão 2.0 multi-concurso:

```text
estudos-ti-state-v6-bacen
```

Assim, a remoção do BB não exige apagar o seu progresso BACEN.

## Testes

```bash
node tests/storage-migration.mjs
node tests/scheduler-smoke.mjs
node tests/ranking-smoke.mjs
node tests/insights-smoke.mjs
node tests/ui-static.mjs
```
