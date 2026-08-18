# Changelog

## 2.2.0 — 18/08/2026

### Mobile
- Corrigido drawer lateral que podia ficar bloqueado por um backdrop invisível em smartphones.
- `hidden` do backdrop agora é respeitado com prioridade.
- Reforçados `z-index`, `pointer-events`, área de toque, ARIA e eventos do botão de menu.

### Plano 80/20
- Novo motor `js/pareto.js`.
- Núcleo de aproximadamente 20% dos tópicos recebe 80% da janela de conteúdo e da meta de questões.
- Prioridade combina peso oficial, sinal histórico BACEN/CESPE-Cebraspe, erros, pendência, risco de cobertura Gran, déficit de foco e revisão vencida.
- Aulas vinculadas ao núcleo entram antes na fila da matéria.
- Revisões/questões usam primeiro erros reais e depois tópicos do núcleo Pareto.

### Cronômetro
- Seleção de matéria e tópico exato do edital.
- Sessões salvas com prova, matéria, tópico, duração, observação e data.
- Tempo focado por matéria/tópico incorporado ao Desempenho 2.0 e ao Pareto.

### Revisões
- Protocolo de revisão ativa com instruções práticas.
- Recomendações diferentes para erro alto, médio, baixo e ausência de amostra.
- Integração com 1-7-30, caderno de erros, questões e cobertura Gran.

### Edital × Gran
- Criado cruzamento dos 129 tópicos objetivos com as 916 aulas.
- Estados: coberto, parcial, lacuna, divergência e sem mapeamento.
- Preservadas as exclusões declaradas na página do curso.
- Corrigidos falsos positivos de similaridade (contas monetárias, elasticidade, UX/UI e programação assíncrona).
- NFS/SMB incorporados como lacuna parcial no item de protocolos.
- Windows Server/DNS/DHCP marcado como divergência quando a grade encontrada conflita com a declaração da página do curso.

### Dados e armazenamento
- Schema atualizado para `bacen-ti-state-v8`.
- Migração automática a partir da v2.1 e versões anteriores.
- Configurações Pareto incluídas no backup/importação.
- Cache PWA atualizado para `bacen-ti-v2.2`.

## 2.1.0 — 17/08/2026
- Projeto exclusivo BACEN TI, P1/P2/P3/P4 e ranking temático.

## 2.0.0 — 17/08/2026
- Desempenho 2.0, índice de preparação, metas semanais, busca global, heatmap, revisão 1-7-30 e ranking histórico BACEN.
