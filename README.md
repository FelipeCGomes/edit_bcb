# Estudos TI — BACEN + Banco do Brasil

Aplicação estática, responsiva e instalável (PWA) para organizar a preparação de concursos de Tecnologia da Informação. Esta versão reúne dois perfis independentes:

- **BACEN — Tecnologia da Informação**: edital-base de 2024, curso Gran BACEN, 131 tópicos verticalizados e 916 aulas cadastradas.
- **Banco do Brasil — Agente de Tecnologia**: Seleção Externa 2022/001, material de estudo importado da planilha do projeto, edital verticalizado e 850 aulas cadastradas.

## O que mudou na v1.7

- Seletor de concurso na barra lateral e no cabeçalho.
- Troca instantânea de BACEN ↔ BB sem recarregar a aplicação.
- Dados, progresso, questões, calendário, revisões, links de aula, cronômetro e backups **separados por concurso**.
- Dashboard, pesos, edital, curso/material, produção textual e calendário adaptam-se ao concurso ativo.
- BB usa os pesos da prova de Agente de Tecnologia e treino de redação; BACEN mantém P3/P4.
- Corrigido o botão que abre/fecha a barra lateral no mobile com SVG próprio e `stroke` explícito para Android/iOS/WebView.
- PWA/cache atualizado para as duas bases.
- Novo módulo **Meu Ranking** no BACEN, usando os 150 candidatos da aba “Todos os 150”.
- Ranking histórico anonimizado: nomes e inscrições não são publicados.
- Projeção automática de P1 e P2 a partir das questões registradas, aplicando a regra Cebraspe (+1 / -0,5).
- Simulador livre de P1, P2, P3, P4 e títulos, com posição equivalente, percentil, referências históricas e candidatos próximos.
- Filtros de comparação por lista geral, candidatos negros e PCD.

## Estrutura

```text
estudos-ti/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── css/
│   ├── style.css
│   └── ranking.css
├── js/
│   ├── app.js                 # fonte completa legível
│   ├── app-loader.js          # carregador usado no GitHub Pages
│   ├── app-parts.json
│   ├── app-v17-parts/         # fragmentos de runtime
│   ├── data-loader.js
│   ├── storage.js
│   ├── scheduler.js
│   ├── charts.js
│   ├── ranking.js
│   └── utils.js
├── data/
│   ├── concursos.json
│   ├── edital.json
│   ├── curso-gran.json
│   ├── cobertura-gran.json
│   ├── pesos.json
│   ├── metadata.json
│   ├── config-padrao.json
│   ├── temas-discursiva.json
│   ├── bacen-ranking-2024.json # fonte completa no pacote
│   ├── edital-bb.json          # fonte completa no pacote
│   ├── curso-bb.json           # fonte completa no pacote
│   ├── cobertura-bb.json
│   ├── pesos-bb.json
│   ├── metadata-bb.json
│   ├── config-bb.json
│   ├── temas-redacao-bb.json
│   ├── frases-motivacionais.json
│   ├── fragment-map.json
│   └── parts/                  # dados grandes fragmentados para Pages/PWA
├── assets/favicon.svg
└── tests/
```


### Organização dos arquivos grandes

Para deixar a publicação no GitHub Pages e o cache PWA mais robustos, a versão de runtime divide o `app.js` e as bases maiores em fragmentos de texto carregados e remontados no navegador. O ZIP mantém também `js/app.js` e os JSONs originais completos e legíveis como fonte de desenvolvimento. O conteúdo remontado é validado nos testes para ser byte a byte equivalente às fontes.

## Publicar no GitHub Pages

1. Crie ou abra um repositório no GitHub.
2. Envie **o conteúdo da pasta `estudos-ti`** para a raiz do repositório.
3. Acesse **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha `main` e `/ (root)`.
6. Salve e aguarde o endereço do GitHub Pages.

> Não abra `index.html` diretamente pelo gerenciador de arquivos. Os JSONs são carregados com `fetch`, então use GitHub Pages ou um servidor local.

## Testar localmente

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Persistência e backup

O progresso usa `localStorage`, com uma chave independente para cada concurso. Trocar de BACEN para BB não mistura questões, aulas concluídas, datas ou cronogramas. A tela **Configurações** exporta/importa backup JSON apenas do concurso ativo.

## Observações sobre as bases

O edital verticalizado continua sendo a referência principal. O material de estudo é exibido separadamente para que uma aula cadastrada não seja confundida automaticamente com cobertura integral do edital.

Versão: **1.7.0**  
Atualização: **17/08/2026**
