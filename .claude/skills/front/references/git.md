# Fluxo de branches e Pull Request

Repositório: <https://github.com/Eduardo-Franco28/frontEduka>

## Modelo de branches

```
main                 ← versão estável, o que "vale". Só recebe de develop
 └ develop           ← integração do time. É daqui que toda feature nasce
    └ feature/<nome> ← seu trabalho do dia a dia
```

Regra: **nunca commite direto em `main` nem em `develop`.** Todo trabalho nasce
de uma `feature/` e volta para `develop` por Pull Request.

Nome de branch: `feature/` + descrição curta em inglês, com hífen.
Ex.: `feature/new-activity`, `feature/edit-profile`.

Commits: em inglês, prefixo `feat:` (o projeto também tem `Core:` em um commit
antigo), descrição curta em minúsculas.

> **Para agentes:** não commite, não faça push e não abra PR sem o usuário pedir
> explicitamente. Este arquivo documenta o processo, não autoriza executá-lo.

---

## 1. Começar uma branch nova

Sempre partindo de um `develop` atualizado, senão você trabalha em cima de uma
base velha e cria conflito à toa:

```bash
git checkout develop
```

```bash
git pull origin develop
```

```bash
git checkout -b feature/nome-da-sua-feature
```

## 2. Durante o trabalho

```bash
git add .
```

```bash
git commit -m "feat: descricao curta do que voce fez"
```

## 3. Mandar para o GitHub

Na **primeira** vez que subir a branch, precisa do `-u` para ligar a branch
local à do servidor:

```bash
git push -u origin feature/nome-da-sua-feature
```

Nas vezes seguintes, só:

```bash
git push
```

---

## 4. Abrir o Pull Request (passo a passo no GitHub)

O PR é o pedido de "juntem meu trabalho no `develop`". É onde o time revisa e
onde fica o registro do que entrou.

### Passo 1 — Abrir a tela de comparação

Atalho: monte a URL trocando o nome da branch.

```
https://github.com/Eduardo-Franco28/frontEduka/compare/develop...SUA-BRANCH
```

Esse link já vem com a base certa preenchida.

Navegando na mão: repositório → aba **Pull requests** → botão **New pull
request** → nos dois dropdowns do topo, escolha a base e a compare.

### Passo 2 — Conferir a barra do topo

Tem que estar exatamente assim:

```
base: develop  ←  compare: feature/sua-branch
```

**Este é o erro mais comum do projeto.** Se você clicar no botão verde
"Compare & pull request" que o GitHub oferece logo depois do push, ele vem com
`base: main`, porque `main` é a branch padrão do repositório. Troque no dropdown
da esquerda para `develop` antes de continuar.

Logo abaixo aparece **✓ Able to merge** em verde e a lista dos seus commits. Se
aparecer "Can't automatically merge", tem conflito — veja a seção de problemas
no fim deste arquivo.

### Passo 3 — Título e descrição

Clique em **Create pull request**. Abre o formulário.

O GitHub preenche o título sozinho com o último commit ou o nome da branch —
troque por algo que descreva o conjunto, não só o último pedaço.

Modelo de descrição que funciona bem para o time:

```markdown
## O que entra

- Item do que foi feito
- Outro item

## Observações

- O que ficou pela metade e vai para o próximo PR
- Resultado do `npx tsc --noEmit` (erros novos? nenhum?)
```

### Passo 4 — Criar de verdade

Clique em **Create pull request** de novo. O primeiro botão abre o formulário,
o segundo cria o PR.

Depois de criado, adicione os colegas em **Reviewers**, na coluna da direita.

### Passo 5 — Merge

Quando alguém aprovar, o botão **Merge pull request** aparece dentro do próprio
PR. Clique nele e confirme.

O GitHub oferece um botão **Delete branch** logo depois do merge. Clicar nele
apaga a branch **do servidor** — se clicar, pule o `git push origin --delete` da
limpeza abaixo.

---

## 5. Limpeza depois que o PR foi mergeado

Faça na ordem. Você não consegue apagar a branch em que está, por isso o
`checkout` vem primeiro.

### Atualizar o `develop` local

Seu `develop` local ainda não sabe do merge que aconteceu no servidor:

```bash
git checkout develop
```

```bash
git pull origin develop
```

Agora seu `develop` local tem o seu trabalho e o dos outros.

### Apagar a branch local

```bash
git branch -d feature/nome-da-sua-feature
```

O `-d` minúsculo é o seguro: o git **recusa** apagar se a branch tiver algo que
ainda não foi mergeado. Se der o aviso `branch is not fully merged`, não force
sem entender — significa que tem commit seu que não entrou no `develop`.
O `-D` maiúsculo força e **perde** esse commit.

### Apagar a branch do servidor (origin)

Pule este comando se você já clicou em **Delete branch** no GitHub.

```bash
git push origin --delete feature/nome-da-sua-feature
```

### Limpar as referências mortas

Se a branch foi apagada pelo GitHub, seu git local ainda mostra
`origin/feature/...` em `git branch -a` até você podar:

```bash
git fetch --prune
```

### Conferir que ficou limpo

```bash
git branch -a
```

Sua branch não deve aparecer nem na lista local nem em `remotes/origin/`.

---

## Situações comuns

### "Já commitei em `develop` sem querer"

Ainda **sem push**, mova o commit para uma branch nova:

```bash
git branch feature/nome-certo && git reset --hard origin/develop && git checkout feature/nome-certo
```

O `reset --hard` descarta mudanças não commitadas — confira com `git status`
antes de rodar.

### "Minha branch ficou velha, `develop` andou"

Traga o que mudou para dentro da sua branch antes de abrir o PR:

```bash
git checkout feature/sua-branch
```

```bash
git merge develop
```

Se der conflito, o git marca os arquivos; resolva no editor, depois
`git add` neles e `git commit`.

### "O PR diz que não dá para fazer merge automático"

É conflito. Resolva com o `git merge develop` acima, dentro da sua branch, e dê
push. O PR atualiza sozinho — não precisa fechar e abrir outro.

### "Esqueci o `-u` no primeiro push"

Sem problema, é só rodar de novo com ele:

```bash
git push -u origin feature/sua-branch
```

### "Quero ver o que a minha branch tem a mais que o `develop`"

```bash
git log --oneline develop..feature/sua-branch
```

E o contrário, para saber se o `develop` andou sem você:

```bash
git log --oneline feature/sua-branch..develop
```

Se o segundo comando não devolver nada, o merge vai ser limpo.
