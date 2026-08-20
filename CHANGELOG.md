# Changelog

## 2.3.0 — 20/08/2026

- Substituído o planejamento dinâmico ativo pelo cronograma diário enviado pelo usuário.
- Adicionado `data/plano-diario.json` com 22 semanas, 129 dias, 215 aulas Gran e 13 complementos.
- Adicionado `js/fixed-plan.js` para converter o cronograma em eventos compatíveis com Hoje/Calendário.
- Plano, Hoje e Calendário passam a usar as datas e blocos exatos do cronograma de 20/08/2026 a 16/01/2027.
- Aulas planejadas foram vinculadas aos IDs reais de `curso-gran.json`; nenhuma das 215 aulas ficou sem mapeamento.
- Mantidos os blocos de questões, revisão 1-7-30, simulados, Atualidades/P3 e situação-problema/P4.
- Mantidos os complementos de Economia, Engenharia de Software e Infraestrutura previstos no plano.
- Schema de armazenamento atualizado para `bacen-ti-state-v9` com migração da v2.2.
- Cache PWA atualizado para `bacen-ti-v2.3`.
- Adicionado `tests/fixed-plan-smoke.mjs`.

## 2.2.0 — 18/08/2026

- Plano Pareto 80/20 adaptativo.
- Cronômetro por matéria/tópico.
- Revisão guiada.
- Cruzamento Edital × Gran.
- Correções do menu mobile.
