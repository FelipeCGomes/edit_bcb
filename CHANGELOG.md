# Changelog

## 2.0.0 — 17/08/2026

Grande revisão do hub de estudos.

### Novo Command Center
- Índice de preparação 0–100 combinando curso, edital, precisão, volume de questões, consistência e metas semanais.
- Próxima melhor ação calculada entre revisão vencida, ponto fraco, agenda do dia e próxima aula.
- Meta semanal de tempo e questões no Dashboard.
- Sequência atual, melhor sequência e dias ativos.

### Desempenho 2.0
- Nova tela exclusiva de diagnóstico integrado.
- Heatmap de atividade das últimas 12 semanas.
- Radar por matéria usando erros, precisão e peso da prova.
- Diagnóstico automático e integração com o ranking histórico do BACEN.
- Metas configuráveis de tempo, questões e precisão.

### Revisão 1-7-30
- Conteúdos concluídos entram automaticamente em revisões após 1, 7 e 30 dias.
- Histórico de revisão separado por concurso.
- Revisão espaçada convive com revisões manuais e recomendações por erros.

### Busca global
- Busca rápida por matéria, item do edital, tecnologia, tópico ou aula.
- Atalho Ctrl+K / Cmd+K.
- Abertura direta da aula encontrada ou do item correspondente no edital.

### Questões
- Ritmo semanal comparado com meta configurada.
- Projeção simplificada conforme a banca ativa.
- Mantido diagnóstico por tópico, matéria, acertos e erros.

### Arquitetura e compatibilidade
- Schema de armazenamento atualizado para v6 com migração automática das versões anteriores.
- Cache PWA atualizado para `estudos-ti-v2.0`.
- Novo motor `insights.js` isolando métricas e regras de diagnóstico.
- Layout mobile e desktop refinado para os novos painéis.
- Mantidos BACEN TI e Banco do Brasil Agente de Tecnologia com dados independentes.
- Mantido ranking BACEN 2024 anonimizado com 150 candidatos.

## 1.7.0 — 17/08/2026
- Ranking histórico BACEN 2024.
- Projeção P1/P2 e simulador P3/P4/títulos.
- Base dos 150 candidatos anonimizada.

## 1.6.0 — 16/08/2026
- Hub multi-concurso: BACEN TI e Banco do Brasil Agente de Tecnologia.

## 1.5.0 — 16/08/2026
- Revisão responsiva para smartphones e drawer lateral.
