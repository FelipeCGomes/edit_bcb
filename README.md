# BACEN Estudos TI — v2.3.1

Aplicação estática/PWA para preparação do BACEN TI, baseada no Edital nº 01/2024 e no curso Gran informado no projeto.

## Hotfix 2.3.1

- Corrige erro de sintaxe em `js/app.js` que mantinha o aplicativo preso na tela de carregamento.
- Atualiza o cache PWA para `bacen-ti-v2.3.1`, evitando que o navegador continue servindo o JavaScript quebrado.
- Mantém o plano diário, progresso e armazenamento `bacen-ti-state-v9` sem reset.
- A validação de sintaxe agora executa o parser em modo ES Module para detectar este tipo de erro antes da entrega.

## Plano diário ativo

A v2.3 substitui somente o motor do plano de estudos pelo cronograma diário fornecido no PDF `Plano_Estudos_BACEN_TI_Gran_Diario_20-08-2026_a_16-01-2027`.

- período do plano: **20/08/2026 a 16/01/2027**;
- carga: **2h de segunda a sexta e 3h no sábado (13h/semana)**;
- **22 semanas** e **129 dias planejados**;
- **215 aulas do Gran** vinculadas às aulas reais de `curso-gran.json`;
- **13 blocos de complemento do edital**;
- aproximadamente **167h de questões, revisões, simulados e P3/P4**;
- referência de planejamento para o edital: **16/11/2026**;
- referência de planejamento para a prova: **17/01/2027**.

As datas de edital/prova acima são referências do próprio cronograma e não são tratadas como datas oficiais.

## Integração com o restante do site

O cronograma fixo alimenta as telas **Plano de estudos**, **Hoje** e **Calendário**. As aulas do Gran continuam ligadas ao progresso do curso; ao concluir uma aula planejada, o progresso do curso é atualizado. Blocos de questões/revisão direcionam para os módulos já existentes, preservando ranking, questões por tópico, cronômetro, revisão 1-7-30, discursivas P3/P4 e mapa Edital × Gran.

O plano não é redistribuído automaticamente. Se uma tarefa não for concluída no dia previsto, ela permanece no histórico/cronograma original e o usuário decide quando recuperar o atraso.

## Migração

O armazenamento atual usa `bacen-ti-state-v9`. A migração lê automaticamente `bacen-ti-state-v8` e chaves legadas, preservando progresso, questões, cronômetro e discursivas. Ao migrar para a v2.3, apenas as configurações do plano ativo são ajustadas para o cronograma diário.

## Executar localmente

Por usar módulos ES e `fetch()` para os JSONs, abra por um servidor HTTP local, por exemplo:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Testes

```bash
node tests/fixed-plan-smoke.mjs
node tests/storage-migration.mjs
node tests/scheduler-smoke.mjs
node tests/ranking-smoke.mjs
node tests/gran-map-smoke.mjs
node tests/insights-smoke.mjs
node tests/ui-static.mjs
```
