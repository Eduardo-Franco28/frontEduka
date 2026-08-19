---
name: mock
description: Atualizar o backend falso (Mockoon) do Eduka em mock/mockoon-eduka.json — adicionar ou corrigir rotas, matérias, tópicos e questões, e validar que tudo responde certo. Use quando o backend real mudar um contrato, quando faltar dado de teste no app, ou quando alguém disser que o mock está desatualizado/quebrado.
---

# Atualizar o mock do Eduka

O arquivo `mock/mockoon-eduka.json` é um *environment* do Mockoon: um servidor
falso que responde as mesmas rotas do backend real, para desenvolver o front sem
backend e sem banco. Quem usa isso no dia a dia segue o `mock/README.md`.

**Esse JSON é a fonte da verdade.** Ele pode ter sido editado pela interface do
Mockoon, então nunca o regenere do zero sem antes ler o que está lá.

## Antes de mexer

1. Leia `mock/mockoon-eduka.json` para ver o estado atual.
2. Confira o contrato real nos tipos e nos services — é o que o app espera:
   - `src/types/subject.ts`, `src/types/auth.ts`
   - `src/services/authService.ts`, `subjectService.ts`, `activityService.ts`
     (são os únicos arquivos que falam com o axios; todas as rotas saem daí)
3. Se o pedido for sobre um campo novo, confirme como a tela consome ele antes
   de inventar formato.

## Rotas que o app chama

| Rota                      | Retorno                                    |
| ------------------------- | ------------------------------------------ |
| `POST /auth/login`        | `AuthResponse`                             |
| `POST /auth/register`     | `AuthResponse`                             |
| `GET /auth/me`            | `User`                                     |
| `GET /subject`            | `SubjectResponse[]`                        |
| `GET /topic/:id/subject`  | `TopicsResponse[]`                         |
| `GET /topic/:id/activity` | `ActivityResponse`                         |
| `POST /progress/answer`   | `AnsweredAlternativeResponse`              |

## Convenções de id (não quebre)

A lógica de acerto/erro depende **inteiramente** desse padrão numérico, porque o
Mockoon não tem banco para saber qual alternativa é a certa:

```
tópico       = idDaMateria * 100 + posição      (ex.: matéria 1 → 101, 102...)
questão      = idDoTopico  * 10  + posição      (ex.: tópico 101 → 1011, 1012, 1013)
alternativa  = idDoTopico  * 100 + (posição da questão * 10 + posição da alt)
                                                (ex.: questão 1011 → 10111..10114)
```

Disso saem duas regras que a rota `POST /progress/answer` usa:

- **A alternativa correta é sempre a segunda**, ou seja, id terminado em `2`.
  A regra é o regex `2$` sobre `lstAlternativeId.0`.
- **A última questão do tópico é a terceira**, id terminado em `3`, então a
  alternativa correta dela termina em `32`. O regex `32$` devolve
  `concluded: true`. Essa resposta precisa vir **antes** da regra `2$` na lista,
  porque o Mockoon usa a primeira que casar.

Ao montar as alternativas, o valor correto tem que ficar na **segunda posição**
da lista. Ex.: para `4 + 3`, as descrições são `["6", "7", "8", "9"]`.

## Detalhes que já causaram erro

- **`status` é string, não número.** `TopicStatus` é enum numérico no TS, mas o
  backend manda `"CONCLUIDO"` / `"EM_ANDAMENTO"` / `"NAO_INICIADO"`, e
  `TopicsScreen.tsx` renderiza `item.status` direto como texto.
- **`content` é uma string com JSON dentro**, não um objeto. `ActivityScreen`
  dá `JSON.parse` nele. No arquivo fica escapado:
  `"content": "{\"teste1\": 4, \"teste2\": 3}"`.
- **`type` da questão** é `"DRAG_DOTS"` (string), o único que a tela renderiza.
- A tela lê `questionContent.teste1` e `questionContent.teste2` — os nomes são
  esses mesmo.

## Como o arquivo é organizado

Estrutura do environment: `{ uuid, lastMigration: 33, name, port: 3000, routes,
rootChildren, cors: true, headers, ... }`.

- Toda rota nova precisa de um `uuid` **e** de uma entrada correspondente em
  `rootChildren` (`{ "type": "route", "uuid": "<mesmo uuid>" }`), senão o
  Mockoon não mostra ela.
- Cada rota tem `responses[]`. Exatamente uma resposta deve ter
  `"default": true` (é o fallback quando nenhuma regra casa).
- Regra por parâmetro de URL:
  `{ "target": "params", "modifier": "subjectId", "value": "1", "operator": "equals", "invert": false }`
- Regra por corpo da requisição:
  `{ "target": "body", "modifier": "lstAlternativeId.0", "value": "2$", "operator": "regex", "invert": false }`

### Templating (Handlebars)

Helpers já validados neste projeto:

- `{{urlParam 'topicId'}}` — parâmetro da URL
- `{{body 'name'}}` — campo do corpo da requisição
- `{{add (multiply (urlParam 'topicId') 10) 1}}` — aritmética com o parâmetro

A rota `GET /topic/:topicId/activity` usa isso para gerar as 3 questões a partir
do id do tópico. Por causa disso, **qualquer tópico novo já ganha atividade
automaticamente** — não precisa criar resposta nova para cada tópico.

Já `GET /topic/:subjectId/subject` tem uma resposta fixa por matéria, com regra
no `:subjectId`. Matéria nova = resposta nova ali.

## Validar depois de mexer (obrigatório)

Nunca entregue sem testar. O JSON é grande e um erro de escape passa fácil.

Suba o servidor em uma porta livre (a 3000 costuma estar ocupada):

```bash
npx @mockoon/cli start --data ./mock/mockoon-eduka.json --port 3333
```

Se acusar porta ocupada, ache e mate o processo:

```bash
netstat -ano | grep ":3333" | grep LISTENING
```

Depois teste as rotas que você mexeu, e no mínimo estas:

```bash
curl -s http://127.0.0.1:3333/subject
curl -s http://127.0.0.1:3333/topic/1/subject
curl -s http://127.0.0.1:3333/topic/101/activity
curl -s -X POST http://127.0.0.1:3333/progress/answer -H "Content-Type: application/json" -d '{"questionId":1011,"lstAlternativeId":[10112]}'
curl -s -X POST http://127.0.0.1:3333/progress/answer -H "Content-Type: application/json" -d '{"questionId":1013,"lstAlternativeId":[10132]}'
```

Esperado nas duas últimas: `{"correct":true,"concluded":false}` e
`{"correct":true,"concluded":true}`.

**Mate o servidor de teste quando terminar** — se ficar rodando solto, ele
segura a porta e a pessoa não consegue subir o mock depois.

## Não mexa nisso

- `src/constants/constant.ts` tem só uma linha ligada a isso
  (`process.env.EXPO_PUBLIC_API_URL ?? "<ip padrão>"`). O IP padrão é o do
  backend real do Eduardo — mantenha como fallback.
- `.env.local` é pessoal de cada dev e ignorado pelo git. Nunca versione.
- O mock não guarda estado: nada de tentar fazer progresso persistir entre
  requisições. Se o pedido exigir isso, avise que o caminho é outro (mock em
  TypeScript dentro do app, com estado em memória).

## Se mudar o contrato

Atualize também a tabela de rotas no fim do `mock/README.md`, e avise no resumo
o que o pessoal do front precisa saber (campo novo, id que mudou, etc.).
