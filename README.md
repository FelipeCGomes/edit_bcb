# BACEN Estudos TI — v2.2.0

Aplicação estática, responsiva e PWA para preparação do **Banco Central do Brasil — Tecnologia da Informação**, baseada no Edital nº 01/2024, na grade do curso Gran fornecida para o projeto, no desempenho registrado pelo usuário e em um sinal histórico conservador de provas oficiais BACEN/CESPE-Cebraspe.

## O que mudou na v2.2

### 1. Menu mobile corrigido

O drawer lateral foi corrigido para smartphones. O problema principal era o `backdrop`: em telas abaixo de 820 px, uma regra CSS podia sobrescrever o atributo HTML `hidden` e manter uma camada transparente sobre o cabeçalho, bloqueando o botão do menu.

A v2.2 garante:

- `.sidebar-backdrop[hidden]{display:none!important}`;
- botão mobile acima do conteúdo e clicável;
- controle de `pointer-events` da sidebar;
- SVG do menu/fechar com área de toque de 42 px;
- `aria-expanded` e `aria-hidden` sincronizados;
- fechamento por backdrop, item do menu, `Esc` e mudança para desktop.

### 2. Plano 80/20 adaptativo

A tela **Plano de estudos** agora possui o modo Pareto. Ele seleciona aproximadamente **20% dos tópicos objetivos como núcleo** e direciona **80% da janela de conteúdo** e **80% da meta de questões** para esse núcleo; os outros 20% mantêm cobertura do restante do edital.

O índice de prioridade não é uma alegação de “probabilidade exata de cair”. Ele combina sinais transparentes:

- 45% — peso oficial do tópico no BACEN 2024;
- 15% — sobreposição histórica conservadora com famílias vistas em provas oficiais anteriores do BACEN/CESPE-Cebraspe;
- 20% — erros do próprio usuário;
- 8% — tópico ainda não concluído;
- 5% — risco de cobertura do curso Gran;
- 5% — déficit de tempo focado na matéria;
- 2% — revisão 1-7-30 vencida.

O sinal histórico funciona apenas como reforço; o peso oficial do edital e o desempenho real do usuário são os fatores principais.

O calendário usa as aulas do Gran ligadas aos tópicos prioritários antes das demais aulas daquela matéria. Revisões e blocos de questões também recebem primeiro os tópicos com erros e depois o núcleo 80/20.

### 3. Cronômetro conectado à matéria e ao tópico

O cronômetro agora permite selecionar:

- matéria;
- item/tópico exato do edital;
- observação da sessão.

Ao finalizar, salva `subject`, `proof`, `topicId`, `topicLabel`, duração e data. Esse tempo aparece em **Desempenho 2.0** e alimenta o déficit de foco do plano 80/20. Assim, uma matéria já muito estudada não recebe prioridade artificial por falta de tempo.

### 4. Revisão guiada

A tela **Revisões** passou a mostrar um protocolo prático:

1. recuperação ativa sem consultar material;
2. identificação da causa do erro;
3. teoria cirúrgica somente no ponto necessário;
4. validação com questões C/E.

O sistema ajusta a recomendação conforme seu histórico:

- erro ≥ 40%: revisão corretiva, cerca de 30 min, 10–15 questões;
- erro entre 20% e 40%: revisão ativa, cerca de 22 min, 5–10 questões;
- erro < 20% com amostra: manutenção, cerca de 14 min, 5 questões;
- sem amostra suficiente: revisão diagnóstica + criação de uma primeira amostra.

A orientação também considera a cobertura do Gran. Se o tópico é lacuna ou parcial, a revisão manda complementar exatamente o ponto não coberto em vez de repetir aulas genéricas.

### 5. Edital × Curso Gran

Foi criado `data/edital-gran-map.json`, cruzando os **129 tópicos objetivos P1/P2** com as 916 aulas importadas do curso.

Cada tópico possui um status:

- **Coberto** — há aula correspondente encontrada na grade;
- **Parcial** — parte do item possui aula, mas existe lacuna declarada;
- **Lacuna** — o próprio Gran declara o tópico como não ministrado e não há cobertura equivalente confirmada;
- **Divergência** — a página declara ausência, mas a grade extraída contém aula explicitamente relacionada;
- **Sem mapeamento** — reservado para itens sem correspondência identificada.

A versão final possui:

- 114 cobertos;
- 7 parciais;
- 6 lacunas;
- 2 divergências;
- 0 sem mapeamento.

Casos de similaridade enganosa foram corrigidos manualmente. Por exemplo, aulas de **contas nacionais** não são tratadas como equivalentes a **contas do sistema monetário**, aulas genéricas de Python não contam como **programação assíncrona**, e aulas de ITIL não contam como **UX/UI**.

## Como os dados se conversam

```text
EDITAL (peso do tópico)
        │
        ├─────► GRAN (aula / lacuna / cobertura parcial)
        │             │
        │             ▼
QUESTÕES ─────► PLANO 80/20 ◄──── CRONÔMETRO
(acertos/erros)        │           (tempo por matéria/tópico)
        │              │
        ▼              ▼
   REVISÕES ◄──── CALENDÁRIO
   (1-7-30 +      (aulas + prática)
    erros + Gran)
        │
        ▼
   DESEMPENHO / RANKING
```

Exemplos:

- errar muito um tópico aumenta sua prioridade 80/20 e sua fila de revisão;
- concluir uma aula cria revisões 1-7-30;
- tempo salvo no cronômetro reduz o déficit de foco da matéria;
- uma lacuna do Gran aumenta a atenção do tópico e muda a dica de revisão;
- o calendário recebe as aulas ligadas aos tópicos 80/20;
- a reta final continua priorizando erros, mas usa o núcleo 80/20 para completar a fila;
- o ranking continua usando acertos/erros por tema e peso oficial do item.

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

### P3 e P4

- P3 — Atualidades, até 30 pontos;
- P4 — situação-problema de TI, até 50 pontos.

## Ranking histórico

`data/bacen-ranking-2024.json` mantém os 150 registros históricos de forma anonimizada. A projeção de P1/P2 usa cada tema como unidade de análise, com acertos, erros e `pesoTopico`. P3/P4 podem usar as notas recentes dos treinos discursivos.

A comparação histórica é um instrumento de acompanhamento e **não garante classificação futura**.

## Armazenamento e migração

A v2.2 usa:

```text
bacen-ti-state-v8
```

A migração procura automaticamente `bacen-ti-state-v7` e chaves BACEN anteriores. Questões, cronômetro, progresso, revisões, ranking e links de aulas são preservados. Backups importados também preservam a configuração Pareto.

## Rodando localmente

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## GitHub Pages

Envie o conteúdo desta pasta para a raiz do repositório e configure:

`Settings > Pages > Deploy from a branch > main > /(root)`

O arquivo `.nojekyll` já está incluído.

## Testes

```bash
node tests/storage-migration.mjs
node tests/scheduler-smoke.mjs
node tests/ranking-smoke.mjs
node tests/insights-smoke.mjs
node tests/gran-map-smoke.mjs
node tests/pareto-smoke.mjs
node tests/ui-static.mjs
```
