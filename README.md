# Estudos TI 2.0

Hub estático e responsivo para preparação de concursos de Tecnologia da Informação.

## Concursos incluídos

- **BACEN TI** — base do Edital nº 01/2024, Cebraspe.
- **Banco do Brasil — Agente de Tecnologia** — base da Seleção Externa 2022/001, Cesgranrio.

O progresso de cada concurso é armazenado separadamente no navegador.

## Destaques da versão 2.0

### Command Center
O Dashboard passa a mostrar um **Índice de Preparação 0–100**, calculado a partir de:

- progresso das aulas;
- progresso do edital verticalizado;
- precisão em questões;
- quantidade acumulada de questões;
- consistência nos últimos 30 dias;
- cumprimento das metas da semana.

O índice é um indicador interno de organização e **não é uma nota oficial ou previsão garantida de aprovação**.

### Próxima melhor ação
O sistema escolhe uma ação entre:

1. revisão 1-7-30 vencida;
2. tópico com maior prioridade por erros;
3. aula ou prática agendada para hoje;
4. próxima aula ainda pendente.

### Desempenho 2.0
Nova tela com:

- heatmap de 12 semanas;
- sequência atual e melhor sequência;
- dias ativos;
- metas semanais;
- radar por matéria;
- revisões pendentes;
- diagnóstico automático;
- integração com o ranking BACEN 2024, quando o perfil BACEN está ativo.

### Revisão espaçada 1-7-30
Ao concluir uma aula ou tópico do edital, são criadas revisões automáticas para:

- 1 dia;
- 7 dias;
- 30 dias.

Ao clicar em **Revisado agora**, o estágio é salvo no histórico do concurso.

### Busca global
Use o botão **Buscar** no cabeçalho ou:

- `Ctrl + K` no Windows/Linux;
- `Cmd + K` no macOS.

A busca encontra itens do edital e aulas do material do concurso ativo.

## BACEN — ranking histórico

O perfil BACEN contém a base anonimizada dos 150 candidatos da planilha histórica de 2024.

O site não publica nomes ou números de inscrição. A comparação usa posição, modalidade, notas P1/P2/P3/P4, títulos, acertos e erros.

A posição exibida é uma **equivalência histórica**, não uma previsão oficial do próximo concurso.

## Dados incluídos

### BACEN
- 131 tópicos/subtópicos do edital verticalizado;
- 916 aulas;
- 500 frases motivacionais;
- 100 pares para treino P3/P4;
- ranking histórico com 150 candidatos anonimizados;
- lacunas declaradas do material do Gran.

### Banco do Brasil
- 111 tópicos verticalizados;
- 850 aulas na base de estudo;
- 100 propostas para treino de redação;
- materiais separados do BACEN.

## Instalação no GitHub Pages

1. Envie **o conteúdo desta pasta** para a raiz do repositório.
2. No GitHub, abra **Settings → Pages**.
3. Escolha **Deploy from a branch**.
4. Selecione `main` e `/ (root)`.

Todos os caminhos do projeto são relativos, portanto ele funciona em repositórios de projeto como:

`https://usuario.github.io/repositorio/`

## Armazenamento

O site não exige backend. O progresso é salvo em `localStorage`.

A versão 2.0 usa o schema **v6** e migra automaticamente o progresso das versões anteriores.

Como `localStorage` pertence ao navegador/dispositivo, use **Configurações → Backup** para exportar e importar dados entre dispositivos.

## Estrutura

```text
estudos-ti/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── charts.js
│   ├── insights.js
│   ├── ranking.js
│   ├── scheduler.js
│   ├── storage.js
│   └── utils.js
├── data/
│   ├── concursos.json
│   ├── edital.json
│   ├── edital-bb.json
│   ├── curso-gran.json
│   ├── curso-bb.json
│   ├── bacen-ranking-2024.json
│   └── ...
├── tests/
└── assets/
```

## Testes

Com Node.js instalado:

```bash
node tests/storage-migration.mjs
node tests/scheduler-smoke.mjs
node tests/ranking-smoke.mjs
node tests/insights-smoke.mjs
node tests/ui-static.mjs
```

## Observação sobre notificações

O PWA tenta usar notificações e `periodicSync` quando suportados pelo navegador. Em um GitHub Pages puro, o navegador não garante notificações quando o aplicativo está totalmente fechado. Push confiável em segundo plano exigiria um serviço externo, como FCM/OneSignal.
