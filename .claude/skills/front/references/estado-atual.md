# Estado atual do front

Foto do projeto em **28/08/2026**, branch `feature/new-activity`. Confira se
ainda bate antes de confiar cegamente — o código anda.

Serve para você não "consertar" o que é intencional, nem achar que quebrou algo
que já estava quebrado.

## Verificação de partida

```bash
npx tsc --noEmit
```

Hoje esse comando devolve **exatamente 3 erros**, todos pré-existentes:

```
src/screens/HomeScreen.tsx(61,118): error TS2345  — navigate("ActivityScreen") sem topicId
src/screens/SchoolYearScreen.tsx(27,28): error TS2339 — userLogin não existe em AuthContextData
src/screens/SchoolYearScreen.tsx(27,39): error TS2339 — userRegister não existe em AuthContextData
```

Regra: **você não pode aumentar esse número.** Se ao terminar aparecerem 4, o
quarto é seu. Consertar os 3 antigos só se pedirem — o de `HomeScreen` mexe em
fluxo de produto (qual atividade o botão abre) e os de `SchoolYearScreen` mexem
numa tela que ninguém alcança.

## O que está pronto e funcionando

- Autenticação completa: cadastro, login, sessão persistida em SecureStore,
  restauração automática no boot, logout.
- Editar perfil e trocar senha.
- Listar matérias → listar tópicos da matéria → abrir atividade.
- Responder questão com feedback de certo/errado e conclusão do tópico.
- Mock do backend cobrindo todas as rotas (`/mock`).

## O que está pela metade

### Telas órfãs

**`src/screens/SchoolYearScreen.tsx`** — a rota existe em `RootStackParamList`,
mas a tela **não está registrada no `App.tsx`** e ninguém navega para ela. Além
disso ela chama `userLogin`/`userRegister`, que não existem mais no
`AuthContext` (foram renomeados para `login`/`register`). É de onde vêm 2 dos 3
erros de TS. O enum `Escolaridade` só é usado por ela, e tem um `TODO` dizendo
que a funcionalidade de série ainda não foi decidida.

Se pedirem para ativar essa tela: registrar no `App.tsx`, trocar
`userLogin`/`userRegister` por `login`/`register`, e definir com o backend se
`Escolaridade` entra no cadastro.

### `HomeScreen`

- O card "ATIVIDADE DO DIA" é **totalmente estático** — "Matemática / Contagem
  de objetos" está escrito no JSX e o botão não tem `onPress`.
- O botão "Continuar jornada" chama `navigate("ActivityScreen")` **sem o
  `topicId`** que a rota exige — daí o erro de TS. Em runtime abriria a
  atividade sem tópico.
- Usa `const user = useAuth()` e depois `user.user?.nome`, em vez do
  `const { user } = useAuth()` do resto do projeto.

### `ProfileScreen`

- Os três stats (`24` estrelas, `12` atividades, `3🔥` dias) são **hardcoded**.
  Não existe endpoint de progresso ainda.
- Os itens "Conquistas" e "Acessibilidade" não têm `onPress` — são placeholders.

### `TopicsScreen`

- O badge da esquerda renderiza `item.status` **cru como texto** (vem
  `"CONCLUIDO"` do backend) e usa sempre `styles.badgeComplete`. A pill da
  direita usa sempre `styles.pillComplete`.
- As variantes `badgeInProgress`, `badgeLocked`, `pillInProgress`, `pillLocked`
  **existem no StyleSheet mas nunca são usadas** — foram escritas esperando a
  lógica de status. É o gancho pronto para quem for implementar.
- O enum `TopicStatus` não é usado em nenhuma tela. O tipo diz enum numérico,
  o backend manda string. Ao implementar, alinhe o tipo com o backend primeiro.
- `handleActivity` tem `ActivityScreen` comentado e manda todo mundo para
  `ActivityScreen2`. Trocar de atividade hoje é (des)comentar linha.

### `ActivityScreen2`

- **A escolha de alternativa não está implementada.** `alternativeId` nunca
  recebe um id de verdade (não há lista de alternativas no JSX; só existe o
  estilo `optionsRow` sobrando). Como `handleAnswer` começa com
  `if (alternativeId === null) return`, **o botão "Confirmar" não faz nada**.
  Isso é o estado real da tela, não um bug que você causou.
- `canAnswer` é calculado pelos gestos mas não bloqueia nem libera nada.
- O quebra-cabeça é o objeto `STATIC_PUZZLE` fixo no topo do arquivo, esperando
  o backend mandar palavra e posições. `slotRefs` guarda todos os buracos, mas
  só o primeiro (`FIRST_BLANK`) é alvo do drag.

### `ActivityScreen` e `ActivityScreen2` são quase duplicados

~458 e ~457 linhas, com toda a lógica de drag/medição/resposta copiada. Só
mudam a ZONA 1 (bolinhas vs. letras) e a ZONA 2. Unificar é tentador e é uma
armadilha: a medição de posição é sensível e não há teste nenhum. **Só faça isso
com pedido explícito**, e uma tela por vez.

## Bugs pequenos e confirmados

Se pedirem "arrume os detalhes das telas de perfil", é aqui que estão:

1. **`EditProfileScreen` não esconde a senha.** Os três `Input` não têm
   `secureTextEntry`. O estado `hidePassword` e o checkbox "Mostrar senhas"
   existem, mas não estão ligados em campo nenhum. (`ChangePasswordScreen` e
   `AuthScreen` estão certos.)

2. **O erro do contexto nunca aparece em `EditProfileScreen` e
   `ChangePasswordScreen`.** Ambas fazem `<ErrorMessage message={errorMessage ?? error} />`
   com `errorMessage` iniciado como `""`. Como `""` não é nullish, o `??` nunca
   cai no `error` do `AuthContext`, e o `ErrorMessage` renderiza `null` porque
   `""` é falsy. O jeito certo é o do `AuthScreen`:
   `useState<string | null>(null)`.

3. **`authService.me(token)` recebe um `token` que não usa.** O interceptor em
   `configs/api.ts` já injeta o header. O parâmetro é resíduo — remover exige
   ajustar a chamada no `AuthContext`.

4. **`SubjectsScreen` mostra 📐 para toda matéria.** Não há mapa de ícone por
   matéria. Os estilos `cardSelected`, `cardLabelSelected`, `checkmark`,
   `footer`, `startButton` na mesma tela também estão sobrando.

5. **`result` do `useTopic` é desestruturado nas duas telas de atividade e nunca
   usado** — a decisão é tomada com o retorno direto de `answer()`.

6. **`Routes()` no `App.tsx` faz `const { user } = useAuth()` sem usar `user`.**
   Quem decide o destino é a `WelcomeScreen`.

## Código morto

Pode remover se estiver limpando de propósito, mas não remova "de passagem":

- `assets/Gemini_Generated_Image_*.png` (3 arquivos) — nenhum é referenciado.
- Dependências `@react-native-vector-icons/*` instaladas e não usadas em lugar
  nenhum. O padrão visual é emoji dentro de `<Text>`.
- `COLORS.TEXT_SUBTLE`, `COLORS.SUCCESS_DARK`, `COLORS.SURFACE_ORANGE`,
  `COLORS.SURFACE_YELLOW` — definidos e sem uso hoje. **Mantenha**: são a paleta
  planejada, não sobra.
- `mainStyles.secondaryButton` só é usado no `FirstScreen`. É estilo do design
  system, mantenha.

## Duplicação conhecida (candidata a componente)

O bloco "checkbox mostrar senha" está copiado em **3 telas** (`AuthScreen`,
`EditProfileScreen`, `ChangePasswordScreen`), com estilo idêntico
(`checkboxRow`, `checkbox`, `checkBoxChecked`, `checkboxLabel`). É o próximo
candidato natural a virar `src/components/Checkbox.tsx`. Não extraia por conta
própria — proponha.

Idem para o bloco "profile card" (avatar + nome), duplicado entre
`ProfileScreen` e `EditProfileScreen`.

## O que o projeto não tem

Não são omissões a corrigir por iniciativa própria — são decisões de escopo de
um TCC:

- Nenhum teste, nenhum linter, nenhum Prettier configurado.
- Sem tela de "esqueci minha senha".
- Sem tratamento de refresh token (token expirado = usuário deslogado no boot).
- Sem tema escuro, sem i18n, sem acessibilidade implementada (o item existe no
  menu do perfil, mas é placeholder).
- Sem tela de erro global / error boundary.
- Sem paginação em lista nenhuma.
