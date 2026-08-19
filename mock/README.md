# Como rodar o app sem o backend

Serve para mexer nas telas do app sem precisar do backend e do banco de dados.
No lugar deles, sobe um programa que finge ser o backend e devolve dados de
mentira. Para o app, é como se fosse o servidor de verdade.

São 4 passos. Faça uma vez e nunca mais precisa repetir (só os passos 3 e 4 toda
vez que for programar).

---

## Antes de tudo: qual porta é qual

A porta é o número depois dos dois pontos no endereço. É ela que decide se o app
vai falar com o backend de verdade ou com o de mentira:

| Porta    | Quem é                             | Quando usar                            |
| -------- | ---------------------------------- | -------------------------------------- |
| **3000** | Mock (backend de mentira, Mockoon) | Para mexer no front sem backend nenhum  |
| **8080** | Backend de verdade + banco         | Só funciona na máquina que roda o back  |

Neste guia você vai usar a **3000**, a do mock.

O endereço fica assim: `http://SEU_IP:3000` — o IP diz *qual computador*, a
porta diz *qual programa dentro dele*.

> Se um dia você apontar para a 8080 sem ter o backend de verdade rodando, o app
> vai abrir mas nada vai carregar. É esse o sintoma de porta errada.

---

## Passo 1 — Descobrir o IP do seu computador

Abra o **Prompt de Comando** (aperte a tecla Windows, digite `cmd`, Enter) e
digite:

```bash
ipconfig
```

Vai aparecer um monte de texto. Procure a linha **Endereço IPv4** e anote o
número. É algo parecido com `192.168.0.50`.

> Anote esse número, você vai usar no passo 2. Ele é o endereço do seu
> computador na sua rede de casa.

---

## Passo 2 — Criar o arquivo de configuração

Na pasta principal do projeto (a mesma onde fica o `package.json`), crie um
arquivo novo chamado exatamente:

```
.env.local
```

> Sim, começa com ponto. No VS Code: clique com o botão direito na área dos
> arquivos → **Novo Arquivo** → digite o nome com o ponto.

Dentro dele, escreva **uma linha só**, trocando `192.168.0.50` pelo número que
você anotou no passo 1:

```
EXPO_PUBLIC_API_URL=http://192.168.0.50:3000
```

Troque **só o IP**. O `:3000` do final tem que ficar, porque é a porta do mock —
é ela que manda o app falar com o backend de mentira em vez do de verdade.

Salve e feche.

> Esse arquivo é só seu. Ele não vai para o git, então não atrapalha ninguém da
> equipe nem dá conflito.
>
> É aqui também que você troca entre um e outro no futuro: `:3000` para o mock,
> `:8080` para o backend de verdade.

---

## Passo 3 — Ligar o backend de mentira

Abra o terminal **na pasta do projeto** (no VS Code: menu Terminal → Novo
Terminal) e rode:

```bash
npx @mockoon/cli start --data ./mock/mockoon-eduka.json --port 3000
```

Na primeira vez ele vai perguntar se quer instalar. Digite `y` e Enter.

Quando aparecer **"Server started on port 3000"**, está pronto.

O `--port 3000` do comando é a porta do mock, a mesma que você escreveu no
`.env.local`. **Os dois números têm que ser iguais**, senão o app procura em um
lugar e o mock está em outro.

> **Deixe esse terminal aberto.** Se fechar, o backend de mentira desliga e o
> app para de funcionar.

---

## Passo 4 — Ligar o app

Abra **outro** terminal (o do passo 3 tem que continuar aberto) e rode:

```bash
npx expo start -c
```

Leia o QR Code com o app **Expo Go** no celular.

> O `-c` no final é importante. Ele limpa o cache. Sem isso, o app pode ignorar
> a configuração que você fez no passo 2.

---

## Pronto, e agora?

Na tela de login, digite **qualquer** email e **qualquer** senha. Pode ser
`a@a.com` e `123`. O backend de mentira aceita tudo.

Daí em diante você navega normalmente: matérias, tópicos, atividades. Tudo com
dados de mentira, mas funcionando igual ao app de verdade.

### Respondendo as atividades

**A resposta certa é sempre a segunda opção.** Sempre. Não importa a conta que
aparece na tela.

- Clicar na segunda opção → acerta e vai para a próxima pergunta.
- Clicar na segunda opção da **última** pergunta → conclui o tópico e volta para
  a tela inicial.
- Clicar em qualquer outra → aparece o aviso de "Resposta errada".

Assim você consegue ver as três situações da tela de atividade sem precisar de
banco de dados.

### O que já vem pronto para você ver

- 5 matérias.
- Tópicos com situações diferentes de propósito: uns concluídos, uns em
  andamento, uns nem começados, com porcentagens variadas. Assim dá para ver
  todos os visuais da lista sem responder nada.
- 3 perguntas em cada tópico.

### Uma coisa que ele não faz

Não salva progresso. Se você responder tudo e recarregar o app, volta ao
começo. Isso é normal, não é bug.

---

## Toda vez que for programar

Só os passos 3 e 4:

1. Um terminal com o backend de mentira ligado.
2. Outro terminal com o app.

---

## Se der problema

**"Port 3000 is already in use"**

Já tem alguma coisa usando essa porta. Use outra, trocando nos **dois** lugares.

No terminal do passo 3:

```bash
npx @mockoon/cli start --data ./mock/mockoon-eduka.json --port 3001
```

E no arquivo `.env.local`, troque para a mesma porta:

```
EXPO_PUBLIC_API_URL=http://192.168.0.50:3001
```

**O app abre mas dá erro de conexão / fica carregando**

Primeiro confira o mais comum: abra o `.env.local` e veja se o final é `:3000`.
Se estiver `:8080`, o app está tentando falar com o backend de verdade, que não
está rodando na sua máquina. Troque para `:3000` e refaça o passo 4.

Se já estiver `:3000`, teste pelo navegador **do celular**. Digite:

```
http://SEU_IP:3000/subject
```

- Se aparecer uma lista com Matemática, Português etc. → o servidor está certo,
  o problema é o `.env.local`. Confira se o IP e a porta estão iguais aos que
  você usou, e rode o passo 4 de novo com o `-c`.
- Se não aparecer nada → o Firewall do Windows está bloqueando. Procure
  "Firewall" no menu Iniciar e libere a porta 3000, ou responda **Permitir** no
  aviso que o Windows mostra quando o servidor liga pela primeira vez.

**Mudei o `.env.local` e não mudou nada**

Você esqueceu o `-c`. Feche o terminal do app e rode de novo:

```bash
npx expo start -c
```

**Meu computador é Mac ou Linux**

Muda só o passo 1: em vez de `ipconfig`, use `ifconfig` (Mac) ou `ip addr`
(Linux) e procure o endereço que começa com `192.168`.

---

## Prefere clicar em vez de digitar?

Existe uma versão com telinha, se preferir:

1. Baixe em <https://mockoon.com/download/> e instale.
2. Abra o programa → menu **File → Open environment**.
3. Escolha o arquivo `mock/mockoon-eduka.json` (está nesta pasta).
4. Clique no botão de play (▶).

Isso substitui o passo 3. A vantagem é que dá para ver as requisições chegando e
mudar qualquer resposta clicando nela, sem digitar comando nenhum.

---

## Para quem vai mexer no mock (parte técnica)

As rotas que ele responde:

| Rota                      | O que devolve                                      |
| ------------------------- | -------------------------------------------------- |
| `POST /auth/login`        | token falso + usuário "Aluno Teste"                 |
| `POST /auth/register`     | token falso + o nome/email enviados                 |
| `GET /auth/me`            | usuário "Aluno Teste"                               |
| `GET /subject`            | 5 matérias                                          |
| `GET /topic/:id/subject`  | tópicos daquela matéria                             |
| `GET /topic/:id/activity` | 3 questões, geradas a partir do id do tópico        |
| `POST /progress/answer`   | se acertou, se errou, e se concluiu o tópico        |

Se o backend real mudar algum campo, alguém precisa atualizar o
`mockoon-eduka.json` na mão — ele é um JSON solto, não é conferido contra os
tipos em `src/types/`. Para isso existe uma skill no projeto: rode `/mock` no
Claude Code que ele cuida disso.
