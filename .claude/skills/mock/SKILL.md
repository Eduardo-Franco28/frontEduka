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
   - `src/types/subject.ts`, `src/types/auth.ts`, `src/types/activity.ts`
   - `src/services/authService.ts`, `subjectService.ts`, `activityService.ts`,
     `progressService.ts` (são os únicos arquivos que falam com o axios; todas
     as rotas saem daí)
3. Se o pedido for sobre um campo novo, confirme como a tela consome ele antes
   de inventar formato.
4. Se o backend real estiver rodando, prefira copiar os dados dele
   (`GET /topics/:id/activity`) em vez de inventar — principalmente os desenhos
   SVG dos boards.

## Rotas que o app chama

| Rota                           | Retorno                          |
| ------------------------------ | -------------------------------- |
| `POST /auth/login`             | `AuthResponse`                   |
| `POST /auth/register`          | `AuthResponse`                   |
| `GET /auth/me`                 | `User`                           |
| `GET /subjects`                | `SubjectResponse[]`              |
| `GET /topics/:id/subject`      | `TopicsResponse[]`               |
| `GET /topics/:id/activity`     | `ActivityResponse`               |
| `POST /progress/answer`        | `AnsweredAlternativeResponse`    |
| `GET /stats`                   | número: questões concluídas      |
| `GET /stats/:id`               | número: tópicos concluídos (o id é ignorado; o app chama `/stats/0`) |
| `GET /stats/:limit/unfinished` | `QuestionResponse[]`             |

As rotas de matéria e tópico são **no plural**. As no singular não existem mais.

## Os tipos de atividade

A `ActivityScreen` escolhe o componente pelo `type` de cada questão:

| `type`                | Componente         | No mock                         |
| --------------------- | ------------------ | ------------------------------- |
| `DRAG_DOTS`           | `DotsActivity`     | qualquer tópico sem regra própria |
| `DRAG_TO_SLOTS`       | `ShapesActivity`   | 301 corpo, 501 mapa             |
| `DRAG_LETTERS`        | `LettersActivity`  | 201 (UVA e BOLA)                |
| `DRAG_SLOTS_TO_GROUP` | `GroupsActivity`   | 304 animais                     |

`GET /topics/:topicId/activity` tem uma resposta por tópico especial (regra no
`:topicId`) e uma resposta padrão com template que gera 3 questões `DRAG_DOTS`
para **qualquer outro tópico**. Tópico novo já ganha atividade de pontos sem
precisar de nada.

## Convenções de id (não quebre)

O Mockoon não tem banco para saber qual peça é a certa, então **o gabarito mora
no próprio id**.

### Pontos (`DRAG_DOTS`)

```
tópico       = idDaMateria * 100 + posição      (ex.: matéria 1 → 101, 102...)
questão      = idDoTopico  * 10  + posição      (ex.: tópico 101 → 1011, 1012, 1013)
alternativa  = idDoTopico  * 100 + (posição da questão * 10 + posição da alt)
                                                (ex.: questão 1011 → 10111..10114)
```

- **A alternativa correta é sempre a segunda** (id terminado em `2`). A regra é
  o regex `2$` sobre `lstAlternativeId.0`.
- **A última questão do tópico é a terceira**, então a correta dela termina em
  `32`. O regex `32$` devolve `concluded: true` e precisa vir **antes** do `2$`.

### Arrastar pra lugares (os outros três tipos)

```
questão      = tópico * 10 + posição da questão
alternativa  = tópico * 1000 + posição da questão * 100 + posição da peça * 10 + LUGAR CERTO
```

- **O último dígito da alternativa é o nome do lugar certo.** A peça `201111`
  vai no lugar `"1"`, a `201123` no lugar `"3"`.
- **Distratora termina em `0`**: nunca combina com lugar nenhum, então sempre
  conta como errada.
- Por isso **os nomes dos lugares são números** (`"1"`, `"2"`...), inclusive no
  corpo, no mapa e nos grupos. O texto que aparece na tela vem do `label` do
  slot e da `description` da peça, não do `name`.
- O `board.slots` e o `content.slots` precisam usar **os mesmos nomes**.
- Máximo de 9 lugares por questão (um dígito).

A resposta `arrastar pra lugares` do `POST /progress/answer` (regra:
`lstFilledSlots` não nulo) calcula o `lstWrongSlots` comparando
`alternativeId % 10` com o `name` de cada peça enviada.

## Detalhes que já causaram erro

- **`status` é string, não número**: `"CONCLUIDO"` / `"EM_ANDAMENTO"` /
  `"NAO_INICIADO"`.
- **`content` é uma string com JSON dentro**, não um objeto. O mesmo vale para
  `board.slots`. As telas dão `JSON.parse` nos dois.
- **Toda alternativa tem `path`, `bbox` e `icon`**, mesmo que `null`. Toda
  questão tem `board`, mesmo que `null`.
- **`type` é o nome do enum como string** (`"DRAG_LETTERS"`), não número.
- A `DotsActivity` lê `content.teste1` e `content.teste2` — os nomes são esses.
- Na palavra, letra pronta tem `label` e letra vazia **não tem** (senão a
  resposta viaja junto).

## Como o arquivo é organizado

Estrutura do environment: `{ uuid, lastMigration: 33, name, port: 3000, routes,
rootChildren, cors: true, headers, ... }`.

- Toda rota nova precisa de um `uuid` **e** de uma entrada correspondente em
  `rootChildren` (`{ "type": "route", "uuid": "<mesmo uuid>" }`), senão o
  Mockoon não mostra ela.
- Cada rota tem `responses[]`. Exatamente uma resposta deve ter
  `"default": true` (é o fallback quando nenhuma regra casa). O Mockoon usa a
  **primeira** resposta cuja regra casar, então a ordem importa.
- Regra por parâmetro de URL:
  `{ "target": "params", "modifier": "topicId", "value": "201", "operator": "equals", "invert": false }`
- Regra por corpo da requisição:
  `{ "target": "body", "modifier": "lstAlternativeId.0", "value": "2$", "operator": "regex", "invert": false }`
- Resposta fixa (sem template) deve ter `"disableTemplating": true`, pra nenhum
  texto do corpo ser interpretado como Handlebars.
- Para editar o JSON, prefira um script Python salvo em arquivo. Heredoc grande
  no bash quebra com aspas e emoji.

### Templating (Handlebars)

Helpers já validados neste projeto:

- `{{urlParam 'topicId'}}` — parâmetro da URL
- `{{body 'name'}}` — campo do corpo como texto
- `{{bodyRaw 'lstFilledSlots.0.alternativeId'}}` — campo do corpo com o tipo original
- `{{add (multiply (urlParam 'topicId') 10) 1}}` — aritmética
- `{{modulo x 10}}`, `{{parseInt x}}`, `{{eq a b}}`, `{{concat a b}}`
- `{{setVar 'nome' valor}}` / `{{getVar 'nome'}}`

Armadilhas descobertas na prática:

- **`int` NÃO converte texto em número**: ele gera um número aleatório. Use
  `parseInt`.
- **`setVar` dentro de `{{#each}}` não sobrevive ao laço.** Por isso a correção
  por lugar não usa `#each`: o template tem uma checagem por posição
  (`lstFilledSlots.0` até `.9`), gerada por script. `#if` e `#unless` não têm
  esse problema.
- **`}}}` grudado** (fim de helper + fecha-chave do JSON) é lido como bloco não
  escapado e dá erro de parse. Deixe um espaço: `}} }`.

## Validar depois de mexer (obrigatório)

Nunca entregue sem testar. O JSON é grande e um erro de escape passa fácil.

O CLI já está instalado no projeto. Suba o servidor em uma porta livre (a 3000
costuma estar ocupada):

```bash
npx --no-install @mockoon/cli start --data ./mock/mockoon-eduka.json --port 3333
```

Se acusar porta ocupada, ache e mate o processo:

```bash
netstat -ano | grep ":3333" | grep LISTENING
```

Teste as rotas que você mexeu, e no mínimo:

```bash
curl -s http://127.0.0.1:3333/subjects
curl -s http://127.0.0.1:3333/topics/1/subject
curl -s http://127.0.0.1:3333/topics/101/activity
curl -s http://127.0.0.1:3333/topics/201/activity
curl -s -X POST http://127.0.0.1:3333/progress/answer -H "Content-Type: application/json" -d '{"questionId":1011,"lstAlternativeId":[10112]}'
curl -s -X POST http://127.0.0.1:3333/progress/answer -H "Content-Type: application/json" -d '{"questionId":1013,"lstAlternativeId":[10132]}'
curl -s -X POST http://127.0.0.1:3333/progress/answer -H "Content-Type: application/json" -d '{"questionId":2011,"lstFilledSlots":[{"name":"1","alternativeId":201111},{"name":"3","alternativeId":201123}]}'
curl -s -X POST http://127.0.0.1:3333/progress/answer -H "Content-Type: application/json" -d '{"questionId":2011,"lstFilledSlots":[{"name":"1","alternativeId":201130},{"name":"3","alternativeId":201123}]}'
```

Esperado nas quatro últimas, em ordem:
`{"correct":true,"concluded":false}`,
`{"correct":true,"concluded":true}`,
`{"correct":true,"concluded":true,"lstWrongSlots":[]}` e
`{"correct":false,"concluded":false,"lstWrongSlots":["1"]}` (distratora).

Para validar a fundo, leia as respostas de atividade e monte as tentativas a
partir delas (o lugar certo é `id % 10`), em vez de fixar ids no teste.

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

Atualize também as tabelas de rotas e de atividades no fim do `mock/README.md`,
e avise no resumo o que o pessoal do front precisa saber (campo novo, id que
mudou, etc.).
