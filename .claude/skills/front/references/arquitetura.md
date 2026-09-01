# Arquitetura do front

## Stack

| Peça              | Escolha                                          |
| ----------------- | ------------------------------------------------ |
| Runtime           | Expo SDK 54, React Native 0.81, React 19          |
| Linguagem         | TypeScript, `strict: true` (`expo/tsconfig.base`) |
| Navegação         | `@react-navigation/native` + `native-stack`       |
| HTTP              | axios com instância única e interceptor           |
| Estado global     | Context API — **só** para autenticação            |
| Estado de tela    | `useState` local + hooks de dados caseiros        |
| Armazenamento     | `expo-secure-store` (token)                       |
| Animação/gesto    | `react-native-reanimated` + `gesture-handler`     |
| Estilo            | `StyleSheet` do RN. Sem lib de UI, sem styled-components |

Não há: Redux, React Query, Zustand, formik/react-hook-form, i18n, tema escuro,
testes, linter/prettier configurado. **Não adicione nenhum deles sem pedirem.**

## Fluxo de dados

```
   Tela (useState + JSX)
     │  chama
     ▼
   Hook (useSubject / useTopic / useAuth)
     │  loading, error, dado
     │  try/catch → getMessageError → console.error → return null
     ▼
   Service (authService / subjectService / activityService)
     │  api.get<T>(...) → response.data
     ▼
   configs/api.ts  (axios + interceptor que injeta o Bearer)
     ▼
   backend real (:8080)  ou  mock Mockoon (:3000)
```

Quem escolhe o destino é `EXPO_PUBLIC_API_URL` no `.env.local`, com fallback em
`src/constants/constant.ts`.

### Por que erro vira `null`

Nenhuma exceção sobe até a tela. O hook captura, guarda a mensagem em `error` e
devolve `null`. A tela só precisa de:

```tsx
const response = await login({ email, password });
if (!response) { setErrorMessage("Verifique seu e-mail e senha."); return; }
```

Isso mantém as telas sem try/catch. `getMessageError` (em `src/utils/`) extrai a
mensagem na ordem: `error.response.data.message` → `error.message` → fallback.

## Autenticação

`AuthContext` (`src/contexts/AuthContext.tsx`) é o único estado global.

- `AuthContextData` (em `src/types/context.ts`) é o contrato: `user`, `loading`,
  `error`, `login`, `register`, `updateProfile`, `updatePassword`, `logOut`.
- Todas as funções seguem o mesmo molde: `setLoading(true)` → `setError(null)` →
  try → `setUser(response.userResponse)` → `storageService.save(STORAGE_KEY, token)`
  → catch com `getMessageError` → `finally setLoading(false)` → devolve `null` no erro.
- Existe um `initializing` separado do `loading`: no mount ele lê o token do
  SecureStore e chama `authService.me()`. **Enquanto isso o provider renderiza
  `<LoadingPage />` e nem monta a navegação** — é assim que o app decide se já
  tem sessão sem piscar tela de login.
- Se o `me()` falhar, o token é apagado e `user` vira `null`.
- Acesso é sempre pelo hook `useAuth()`, que lança erro se estiver fora do
  provider. Nunca importe `AuthContext` direto numa tela.

Adicionar uma operação de usuário = 3 edições: função no `AuthContext`, entrada
em `AuthContextData`, função no `authService`.

## Navegação

`App.tsx` monta a árvore inteira:

```
GestureHandlerRootView
  └ AuthProvider
      └ NavigationContainer
          └ Stack.Navigator (screenOptions={{ headerShown: false }})
```

- **Header nativo desligado em tudo.** O header é o componente
  `src/components/Header.tsx`.
- Stack única e plana: não há stacks aninhadas nem tab navigator. O `TabBar` é um
  componente próprio que só chama `navigation.navigate`.
- A rota inicial é `WelcomeScreen`, que decide para onde ir olhando `user`:
  `HomeScreen` se logado, `FirstScreen` se não.
- Tipagem vem de `RootStackParamList` (`src/types/navigation.ts`) através do hook
  `useAppNavigation()`. Rota que não estiver lá não compila.

Quando usar cada método:

| Método                              | Quando                                          |
| ----------------------------------- | ----------------------------------------------- |
| `navigate("X", params)`             | navegação normal, com voltar                     |
| `replace("X")`                      | troca a tela atual (Welcome → First, alternar login/cadastro) |
| `reset({ index: 0, routes: [...] })`| depois de login, cadastro, logout, salvar perfil — apaga o histórico |
| `goBack()`                          | dentro do `Header`, já tratado                   |

## Convenções de nomenclatura

| Coisa                | Padrão                    | Exemplo                       |
| -------------------- | ------------------------- | ----------------------------- |
| Tela                 | `XxxScreen.tsx`           | `TopicsScreen.tsx`            |
| Componente           | PascalCase, sem sufixo    | `Header.tsx`, `Input.tsx`     |
| Hook                 | `useXxx.ts`, default export | `useTopic.ts`               |
| Service              | `xxxService.ts`, funções soltas | `activityService.ts`    |
| Enum                 | `XxxEnum.ts`, enum sem sufixo | `TopicStatusEnum.ts` → `TopicStatus` |
| Util                 | `xxxUtils.ts`             | `getMessageErrorUtils.ts`     |
| Tipo que sai         | `XxxRequest`              | `LoginRequest`                |
| Tipo que volta       | `XxxResponse`             | `TopicsResponse`              |
| Props de componente  | `XxxProps` (interface)    | `HeaderProps`                 |
| Lista                | `Array<T>`, nunca `T[]`   | `Array<SubjectResponse>`      |

Exports: **default** para telas, componentes e hooks; **named** para services,
tipos, enums e utils (services são importados como `import * as xService`).

## Contrato com o backend

Rotas em uso (todas passam pelo interceptor de token, exceto login/register que
simplesmente não têm token ainda):

| Rota                        | Service                        | Retorno                       |
| --------------------------- | ------------------------------ | ----------------------------- |
| `POST /auth/login`          | `authService.login`            | `AuthResponse`                |
| `POST /auth/register`       | `authService.register`         | `AuthResponse`                |
| `PATCH /auth/profile`       | `authService.updateProfile`    | `AuthResponse`                |
| `PATCH /auth/password`      | `authService.updatePassword`   | `AuthResponse`                |
| `GET /auth/me`              | `authService.me`               | `User`                        |
| `GET /subject`              | `subjectService.getAll`        | `Array<SubjectResponse>`      |
| `GET /topic/:id/subject`    | `activityService.getTopicsBySubject` | `Array<TopicsResponse>` |
| `GET /topic/:id/activity`   | `activityService.getByTopic`   | `ActivityResponse`            |
| `POST /progress/answer`     | `activityService.answer`       | `AnsweredAlternativeResponse` |

Pegadinhas do contrato:

- `AuthResponse` é `{ token, userResponse }` — o usuário vem aninhado.
- `User.nome` está em português; o resto dos campos, em inglês.
- `QuestionResponse.content` é **string com JSON dentro**, precisa de
  `JSON.parse`. O formato varia por tipo de atividade.
- `TopicsResponse.status` é tipado como enum numérico `TopicStatus`, mas o
  backend manda string (`"CONCLUIDO"`) e `TopicsScreen` renderiza direto como
  texto. Divergência conhecida — veja `estado-atual.md`.
- `percentConclued`, `lstAlternative`, `lstQuestions`, `conclued` são grafias do
  backend. Não corrija no front sem o backend corrigir junto.

## Ambiente

- `EXPO_PUBLIC_API_URL` no `.env.local` (ignorado pelo git). Mudou? Reinicie com
  `npx expo start -c`, porque variáveis `EXPO_PUBLIC_` entram no bundle.
- Fallback em `src/constants/constant.ts` aponta para o backend real de um dos
  integrantes. Mantenha.
- Nunca use `localhost`: no celular, `localhost` é o próprio celular. Use o IP da
  máquina na rede.

## Git

```
main  ←  develop  ←  feature/<nome>
```

Nunca commite direto em `main` nem em `develop`. Toda feature nasce de um
`develop` atualizado e volta por Pull Request, com base `develop` (não `main`).

Commits em inglês, prefixo `feat:` (às vezes `Core:`), descrição curta em
minúsculas. Não commite nem faça push sem o usuário pedir.

O fluxo completo está em **`references/git.md`**: criar a branch, abrir o PR
passo a passo no GitHub, e os comandos de limpeza depois do merge (atualizar o
`develop` local, apagar a branch local e a do `origin`).
