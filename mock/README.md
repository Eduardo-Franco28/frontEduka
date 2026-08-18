# Backend falso (Mockoon)

Este arquivo serve para quem quer mexer no **front** sem ter o backend e o banco
rodando na máquina. Ele sobe um servidor local que responde exatamente as mesmas
rotas do backend de verdade, com dados fixos.

Nada disso afeta quem roda com o backend real: é só uma questão de para onde a
variável `EXPO_PUBLIC_API_URL` está apontando.

---

## 1. Subir o backend falso

Escolha **um** dos dois jeitos.

### Opção A — Mockoon com interface (mais fácil)

1. Baixe em <https://mockoon.com/download/> e instale.
2. Abra o Mockoon → menu **File → Open environment** → selecione
   `mock/mockoon-eduka.json` (este diretório).
3. Clique no botão ▶ (play) para iniciar. Ele sobe na porta **3000**.

A vantagem daqui é que dá para editar qualquer resposta clicando nela, sem mexer
em código, e ver as requisições chegando na aba de logs.

### Opção B — Sem instalar nada, pelo terminal

```bash
npx @mockoon/cli start --data ./mock/mockoon-eduka.json --port 3000
```

Deixe esse terminal aberto enquanto estiver programando.

---

## 2. Apontar o app para ele

Na raiz do projeto, copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Abra o `.env.local` e coloque o **IP da sua máquina na rede local** (não use
`localhost`: no celular, `localhost` é o próprio celular):

```
EXPO_PUBLIC_API_URL=http://192.168.0.50:3000
```

Para descobrir seu IP no Windows: `ipconfig` → procure "Endereço IPv4" na sua
rede Wi-Fi.

O `.env.local` é ignorado pelo git, então cada pessoa tem o seu e ninguém
sobrescreve a configuração do outro.

Depois disso, inicie o app **limpando o cache** (variáveis de ambiente ficam
embutidas no bundle, então sem isso a alteração não é lida):

```bash
npx expo start -c
```

---

## 3. Como fazer login

Qualquer email e senha funcionam — o mock aceita tudo e devolve um token falso.
Também dá para usar a tela de cadastro; o nome e o email digitados voltam na
resposta.

---

## O que o mock responde

| Rota                        | O que devolve                                        |
| --------------------------- | ---------------------------------------------------- |
| `POST /auth/login`          | token falso + usuário "Aluno Teste"                   |
| `POST /auth/register`       | token falso + o nome/email enviados                   |
| `GET /auth/me`              | usuário "Aluno Teste"                                 |
| `GET /subject`              | 5 matérias                                            |
| `GET /topic/:id/subject`    | tópicos daquela matéria (uma resposta por matéria)    |
| `GET /topic/:id/activity`   | 3 questões, geradas a partir do id do tópico          |
| `POST /progress/answer`     | se acertou, se errou, e se concluiu o tópico          |

Os tópicos têm estados variados de propósito (`CONCLUIDO`, `EM_ANDAMENTO`,
`NAO_INICIADO`, com percentuais diferentes), para dar para ver todos os visuais
da lista sem precisar responder nada.

### Respondendo as atividades

**A alternativa correta é sempre a segunda da lista.** É assim que o mock
consegue distinguir acerto de erro sem ter banco: os ids das alternativas
terminam em 1, 2, 3 e 4, e a regra olha para o id terminado em 2.

- Acertar a 1ª ou a 2ª questão → avança para a próxima.
- Acertar a 3ª (última) questão → conclui o tópico e volta para a Home.
- Qualquer outra alternativa → cai no alerta de "Resposta errada".

Ou seja, dá para percorrer os três caminhos da tela de atividade sem tocar em
nada. O que o mock **não** faz é guardar progresso: ao recarregar o app, os
percentuais voltam ao valor inicial.

---

## Voltar a usar o backend de verdade

Basta editar o `.env.local` apontando para o backend real e reiniciar com
`npx expo start -c`:

```
EXPO_PUBLIC_API_URL=http://192.168.0.161:8080
```

Se o arquivo `.env.local` nem existir, o app usa o endereço padrão que já estava
no código antes — ou seja, quem não criar o arquivo continua com o
comportamento de sempre.

---

## Se não conectar

- **O celular não acha o servidor:** o Firewall do Windows costuma bloquear a
  porta 3000 para outros aparelhos. Libere a porta ou responda "Permitir" no
  aviso que aparece na primeira execução. Teste pelo navegador do celular:
  `http://SEU_IP:3000/subject` tem que devolver a lista de matérias.
- **Mudou o `.env.local` e nada aconteceu:** faltou o `-c` no
  `npx expo start -c`. As variáveis são embutidas no bundle na hora do build.
- **Porta 3000 ocupada:** troque a porta no Mockoon (ou no `--port`) e ajuste o
  `.env.local` para a mesma porta.

---

## Se o backend mudar

Este arquivo é um JSON estático: ele **não** é validado contra os tipos em
`src/types/`. Se o contrato do backend mudar (campo novo, campo renomeado),
alguém precisa atualizar as respostas aqui na mão, senão o front vai continuar
sendo desenvolvido em cima de um formato que o backend não fala mais.
