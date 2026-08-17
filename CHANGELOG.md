# Changelog

## 2.1.0 — 17/08/2026

### Foco exclusivo BACEN
- Banco do Brasil removido integralmente do projeto.
- Removidos dados, seletor de concurso, lógica multi-concurso e arquivos BB do cache PWA.
- Armazenamento simplificado para um único perfil BACEN, preservando migração da v2.0.

### P1 / P2 / P3 / P4
- Edital marcado e filtrável por prova.
- P1 e P2 separados no controle de questões.
- P3 e P4 separados no módulo discursivo e no ranking.
- Painéis visuais específicos para cada prova.

### Ranking temático
- Projeção P1/P2 baseada em acertos e erros por tema.
- Nota líquida de treino: acertos − 0,5 × erros.
- Ponderação pelo `pesoTopico` oficial do edital.
- Cobertura temática e confiança da amostra exibidas no ranking.
- Detalhamento por matéria e por item do edital.
- Temas sem questões diretas são extrapolados de forma explícita, sem ocultar a cobertura real.

### Discursivas
- Campo opcional de nota P3 (0–30).
- Campo opcional de nota P4 (0–50).
- Classificação da área técnica principal da P4.
- Ranking pode usar média das últimas 5 avaliações com nota.

### PWA e interface
- Cache atualizado para `bacen-ti-v2.1`.
- Manifest renomeado para BACEN Estudos TI.
- Layout responsivo dos novos painéis P1/P2/P3/P4.
- Mantido menu lateral mobile com SVG de stroke explícito.

## 2.0.0 — 17/08/2026
- Desempenho 2.0, índice de preparação, metas semanais, busca global, heatmap, revisão 1-7-30 e ranking histórico BACEN.
