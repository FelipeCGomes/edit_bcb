# BACEN Estudos TI — v1.5.0

Aplicação estática e PWA para preparação do BACEN — Tecnologia da Informação, pronta para GitHub Pages.

**Atualização:** 16/08/2026

## O que mudou na v1.5

- Layout revisado com abordagem **mobile-first** para smartphones.
- Remoção completa da barra de navegação inferior.
- Navegação única pela lateral; no celular ela funciona como um drawer com fundo escurecido, botão de fechar, tecla Esc e fechamento ao escolher uma tela.
- Correções de largura/overflow em Dashboard, Hoje, Plano, Calendário, Edital, Curso Gran, Questões, Revisões, Discursiva, Cobertura e Configurações.
- Tabelas grandes agora rolam dentro do próprio cartão em telas pequenas, sem estourar a página.
- Calendário semanal troca para uma agenda em lista em smartphones.
- Cards, formulários, filtros, campos de data/hora, botões e modais adaptados para toque.
- Modais viram uma folha inferior (bottom sheet) em smartphones.
- Header compacto e protegido contra estouro de títulos longos.
- Suporte a `safe-area` para aparelhos com notch/barra de gesto.
- Animações leves de entrada e transição; respeita `prefers-reduced-motion`.
- Correção da nomenclatura de **Fundamentos de Macroeconomia e Microeconomia** entre edital, pesos e curso, evitando falha silenciosa no cruzamento de questões/revisões.
- Cache PWA atualizado para `bacen-ti-v1.5`.

## Recursos mantidos

- 131 tópicos do edital verticalizado.
- 916 videoaulas da grade do Gran.
- Plano de estudos de segunda a domingo com horário e duração.
- Calendário por aula real, sem cortar aula no meio.
- Pré-edital / pós-edital e datas configuráveis.
- Reta final automática nos últimos 15 dias.
- Inteligência de questões por matéria e tópico.
- Revisões orientadas pelos erros.
- 500 frases motivacionais.
- 100 pares de temas para discursiva.
- Cronômetro, histórico, backup/importação e PWA.

## Publicar no GitHub Pages

1. Descompacte o ZIP.
2. Envie **o conteúdo da pasta `bacen-estudos`** para a raiz do repositório.
3. No GitHub: **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Branch: `main`, pasta `/ (root)`.
6. Salve e aguarde o endereço do GitHub Pages.

## Dados do usuário

O progresso continua salvo no `localStorage`. A versão 1.5 mantém a mesma chave de armazenamento da v1.4 para preservar o progresso existente.

Faça backup em **Configurações → Exportar JSON** antes de alterações grandes ou troca de dispositivo.

## Testes

Na pasta do projeto:

```bash
node --check js/app.js
node --check js/scheduler.js
node --check js/storage.js
node tests/storage-migration.mjs
node tests/scheduler-smoke.mjs
node tests/ui-static.mjs
```

Os testes cobrem migração do estado, agenda sem duplicação indevida, estrutura mobile/navegação e consistência das matérias objetivas.

## Observação sobre notificações

GitHub Pages não possui backend de push. O PWA usa os recursos disponíveis no navegador, mas notificações com o site totalmente fechado dependem do suporte do navegador a recursos de sincronização periódica. Para push garantido, seria necessário integrar um serviço como Firebase Cloud Messaging ou OneSignal.
