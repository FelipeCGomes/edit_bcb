# Changelog

## 1.7.0 — 17/08/2026

- Importada a aba **Todos os 150** da planilha BACEN 2024 para uma base JSON anonimizada.
- Adicionada a tela **Meu Ranking** ao perfil BACEN.
- Projeção automática de P1/P2 com base nas questões registradas e regra de pontuação Cebraspe 2024.
- Adicionado simulador de P1, P2, P3, P4 e títulos.
- Adicionados posição equivalente, percentil, histograma de notas, referências históricas e comparação com candidatos próximos.
- Adicionados filtros Lista Geral, Negros e PCD.
- Ranking permanece oculto no perfil BB enquanto não houver uma base histórica própria.
- Ajustes responsivos específicos para a tela de ranking em smartphones de 390–620 px.
- PWA atualizado para cachear `ranking.js` e `bacen-ranking-2024.json`.
- Mantido o progresso existente dos perfis BACEN e BB.

## 1.6.0 — 16/08/2026

- Adicionado perfil **Banco do Brasil — Agente de Tecnologia**.
- Adicionado seletor BACEN TI ↔ BB Agente TI na lateral e no cabeçalho.
- Progressos e configurações separados por concurso.
- Adicionados edital, pesos, material de estudo e 100 propostas de redação para BB.
- Dashboard, calendário, plano, questões, revisões e produção textual passaram a usar metadados do concurso ativo.
- PWA/service worker atualizado para cachear as duas bases.
- Corrigido ícone do menu mobile com SVG e `stroke: currentColor` explícito.
- Melhoradas acessibilidade e áreas de toque dos controles do drawer mobile.
- Mantida migração automática do progresso BACEN das versões anteriores.
