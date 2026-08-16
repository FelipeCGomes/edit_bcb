# BACEN Estudos TI — v1.4.0

Aplicação estática para planejamento de estudos do BACEN — Tecnologia da Informação, pronta para hospedagem no GitHub Pages.

**Atualização:** 16/08/2026

## Novidades da v1.4

- Campo **Data de início dos estudos**.
- Seletor **Pré-edital / Pós-edital**.
- No **Pré-edital**, a referência do ciclo é a data em que os estudos começaram.
- No **Pós-edital**, a janela oficial é calculada de **data de publicação do edital → primeira prova objetiva**.
- Data do edital e data da primeira prova objetiva são livres para alteração.
- Cálculo de dias desde o início, dias até a prova e janela total de preparação.
- Análise de capacidade real até a prova considerando a disponibilidade de cada dia.
- **Reta final automática nos últimos 15 dias**.
- Nos últimos 15 dias, segunda a sexta e domingo reservam automaticamente **60% da janela para revisão + questões**.
- Na reta final, o sábado passa automaticamente para **40% revisão + 40% questões + 15% simulado + 5% discursiva**.
- As revisões e questões da reta final priorizam os **tópicos/matérias com maior incidência de erros**.
- Novo registro de questões com **matéria + tópico exato do edital**.
- Monitoramento de:
  - total de questões;
  - questões nos últimos 7, 15 e 30 dias;
  - total de acertos e erros;
  - matéria com mais erros;
  - matéria com mais acertos;
  - precisão por matéria;
  - taxa de erro por matéria;
  - tópicos com mais erros.
- Nova **Revisão Inteligente**, que recomenda tópicos com base em erros, taxa de erro e peso da matéria na prova.
- As sugestões de revisão entram também no calendário da reta final.
- Preservada a migração de dados das versões anteriores v1/v2/v3.

## Recursos já existentes

- 131 tópicos do edital verticalizado.
- 916 videoaulas do curso Gran com matéria, tópico, aula, professor e duração real.
- Calendário semanal por aula, com horário de início/fim.
- Semana completa de segunda a domingo.
- Rateio inteligente por carga restante + peso da prova.
- 500 frases motivacionais.
- 100 pares de temas discursivos.
- Cronômetro.
- Revisões.
- Histórico de questões.
- PWA/offline.
- Backup/importação em JSON.
- Tema claro/escuro.
- Armazenamento local via `localStorage`.

## Estrutura

```text
bacen-estudos/
├── index.html
├── service-worker.js
├── manifest.webmanifest
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── charts.js
│   ├── scheduler.js
│   ├── storage.js
│   └── utils.js
├── data/
│   ├── edital.json
│   ├── curso-gran.json
│   ├── cobertura-gran.json
│   ├── pesos.json
│   ├── metadata.json
│   ├── config-padrao.json
│   ├── frases-motivacionais.json
│   └── temas-discursiva.json
└── assets/
    └── favicon.svg
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie **o conteúdo da pasta `bacen-estudos`** para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha `Deploy from a branch`.
5. Selecione `main` e `/ (root)`.
6. Salve e aguarde a publicação.

## Como configurar a fase da preparação

Abra **Plano de estudos → Fase da preparação e datas**.

### Pré-edital

Selecione **Pré-edital** e informe a data de início dos estudos. A data da primeira prova objetiva pode ficar em branco enquanto não for conhecida. Quando for informada, o site passa a calcular a viabilidade e a reta final.

### Pós-edital

Selecione **Pós-edital**, informe a data do edital e a data da primeira prova objetiva. A janela oficial passa a considerar edital → prova, enquanto a capacidade restante considera o tempo que ainda existe a partir de hoje.

## Reta final de 15 dias

Quando faltarem menos de 15 dias para a primeira prova objetiva, o calendário muda automaticamente. O objetivo é reduzir conteúdo novo e aumentar revisão e questões, com prioridade para os temas em que houver mais erros registrados.

Para obter recomendações mais precisas, registre as questões escolhendo o **tópico exato do edital**.

## Backup

Em **Configurações → Backup**, exporte periodicamente o JSON do progresso. O arquivo inclui datas, fase da preparação, questões, revisões, aulas assistidas, links cadastrados e configurações.

## Observação sobre notificações

GitHub Pages é hospedagem estática. Notificações com o site totalmente fechado dependem do suporte do navegador/PWA a recursos como Periodic Background Sync. Para push garantido em segundo plano, seria necessário integrar um serviço externo como Firebase Cloud Messaging ou OneSignal.

## Testes incluídos

Com Node.js instalado, execute na raiz do projeto:

```bash
node tests/scheduler-smoke.mjs
node tests/storage-migration.mjs
```

O primeiro valida agenda por aula, ausência de duplicidades e ativação da reta final. O segundo valida a migração do progresso salvo na v1.3 para o novo schema v4.
