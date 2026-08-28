---
name: front
description: Padrões do app React Native/Expo do Eduka (TCC) — como criar telas, componentes, hooks, services, tipos e estilos seguindo a arquitetura que já existe. Use SEMPRE que for mexer em qualquer coisa dentro de src/ ou App.tsx: nova tela, novo endpoint, novo componente, novo tipo de atividade, ajuste de UI, refactor ou correção de bug no front.
---

# Como mexer no front do Eduka

App React Native + Expo (TypeScript, `strict: true`), navegação por stack nativa,
axios para API, Context só para autenticação. Tudo em português no código voltado
ao usuário e nos comentários; nomes de código em inglês (com exceções herdadas,
veja "Inconsistências aceitas").

**Regra de ouro: copie o padrão do arquivo vizinho.** Este projeto é de TCC,
mexido por 6 pessoas com níveis diferentes. Consistência vale mais do que
sofisticação. Nunca introduza uma biblioteca, um padrão de estado ou uma
abstração nova sem o usuário pedir explicitamente.

## Onde está o quê

Este arquivo é o resumo. Abra a referência conforme a tarefa:

| Arquivo                        | Leia quando                                              |
| ------------------------------ | -------------------------------------------------------- |
| `references/arquitetura.md`    | Entender camadas, auth, navegação, contrato da API, nomes |
| `references/receitas.md`       | Criar tela, endpoint, componente ou atividade (com código)|
| `references/ui.md`             | Mexer em qualquer coisa visual — paleta, tamanhos, componentes |
| `references/estado-atual.md`   | **Antes de qualquer tarefa maior** — o que está pela metade, bugs e erros de TS já existentes |

## Antes de escrever qualquer código

1. Abra o arquivo mais parecido com o que você vai criar e siga a estrutura dele:
   - tela com formulário → `src/screens/ChangePasswordScreen.tsx`
   - tela com lista vinda da API → `src/screens/TopicsScreen.tsx`
   - tela estática → `src/screens/FirstScreen.tsx`
   - componente reutilizável → `src/components/Input.tsx`
   - hook de dados → `src/hooks/useSubject.ts`
2. Confira o contrato em `src/types/` antes de inventar campo.
3. Rode `npx tsc --noEmit` **antes** de mexer, para saber quais erros já existiam
   (hoje existem 3 — veja `references/estado-atual.md`). Você não pode adicionar
   erro novo, mas também não precisa consertar os antigos sem pedirem.

## Mapa das pastas (`src/`)

| Pasta         | O que vive ali                                                        |
| ------------- | --------------------------------------------------------------------- |
| `screens/`    | Uma tela = um arquivo `XxxScreen.tsx`, `export default function`       |
| `activities/` | Telas de atividade (o jogo em si). Separadas por serem complexas       |
| `components/` | UI reutilizável entre telas. Sem chamada de API dentro                 |
| `hooks/`      | Estado + orquestração. É quem chama o service e guarda loading/error   |
| `services/`   | **Únicos** arquivos que falam com o axios. Um por domínio              |
| `contexts/`   | Só `AuthContext`. Estado global de usuário                            |
| `configs/`    | `api.ts` — instância do axios e interceptor do token                   |
| `types/`      | Interfaces das requests/responses e do stack de navegação              |
| `enums/`      | Enums do domínio (`TopicStatus`, `QuestionType`, `Escolaridade`)       |
| `styles/`     | `colors.ts` (paleta) e `theme.ts` (`mainStyles` compartilhado)         |
| `constants/`  | `API_URL` e `STORAGE_KEY`                                             |
| `utils/`      | Funções puras. Hoje só `getMessageErrorUtils.ts`                       |

Imports são **sempre relativos** (`../hooks/useAuth`). Não existe path alias
configurado — não adicione um.

## A regra de camadas (nunca fure)

```
Tela  →  Hook  →  Service  →  api (axios)  →  backend
         ↑ estado          ↑ só request/response
```

- **Tela nunca importa `api` nem um `service` direto.** Sempre passa por um hook
  (ou pelo `useAuth`, no caso de autenticação).
- **Service não tem try/catch, não tem estado.** Ele chama, tipa e devolve
  `response.data`. Só isso.
- **Hook tem `loading`, `error` e o dado.** Ele é quem faz try/catch, chama
  `getMessageError`, loga no console e devolve `null` no erro.
- **Componente não chama API.** Recebe tudo por prop.

O único lugar que fura isso é o `AuthContext`, e é de propósito: ele é um
"hook global" porque o usuário precisa ser compartilhado entre telas.

## Detalhes que os agentes erram

- **Erro nunca sobe como exceção para a tela.** Todo hook devolve `null` no
  catch. A tela decide o que mostrar checando `if (!response)`.
- **`ErrorMessage` some sozinho** quando `message` é vazio — não envolva em
  condicional. O padrão nas telas é `<ErrorMessage message={errorMessage ?? error} />`.
- **Token**: nunca leia/escreva o token na tela. O interceptor em
  `src/configs/api.ts` já injeta o `Bearer`; salvar/remover é papel do
  `AuthContext` via `storageService`.
- **Não use `AsyncStorage`.** O projeto usa `expo-secure-store` através de
  `src/services/storageService.ts`.
- **Toda rota nova precisa entrar em três lugares**: `RootStackParamList`
  (`src/types/navigation.ts`), `<Stack.Screen>` no `App.tsx`, e o arquivo da tela.
  Esquecer o primeiro faz o `navigate()` virar erro de tipo.
- **Hooks antes de qualquer `return` condicional.** As telas de atividade têm um
  comentário explícito sobre isso — o `if (loading) return <LoadingPage />` fica
  depois de todos os `useSharedValue`/`useRef`.
- **Depois de login/logout use `navigation.reset`**, não `navigate`, para o
  usuário não conseguir voltar com o gesto.

## Estilo de UI (resumo)

Detalhes e paleta completa em `references/ui.md`.

- Cor **sempre** de `COLORS` (`src/styles/colors.ts`). Nunca hex solto em código
  novo — mesmo que arquivos antigos ainda tenham (`#fff` e `#000` são tolerados).
- `StyleSheet.create` no **fim** do arquivo, `const styles = ...`, agrupado com
  comentários de seção (`// Header`, `// Card`).
- Estilo compartilhado vem de `mainStyles` (`src/styles/theme.ts`):
  `component`, `scroll`, `scrollContent`, `primaryButton`, `primaryButtonText`,
  `secondaryButton`, `secondaryButtonText`.
- Para variar o base, **componha**: `style={[mainStyles.scrollContent, styles.scrollContent]}`.
- Estado visual = array de estilos: `style={[styles.card, selecionado && styles.cardSelected]}`.
- Botão principal com gradiente: `TouchableOpacity` > `LinearGradient` com
  `colors={[COLORS.PRIMARY, COLORS.SECONDARY]}` e `style={mainStyles.primaryButton}`.
- Ícones são **emoji dentro de `<Text>`**. Não use as libs de vector-icons que
  estão no `package.json` — nenhuma tela usa, e o padrão visual atual é emoji.

## Receitas

Passo a passo completo (com código) em `references/receitas.md`:

- Criar uma tela nova
- Criar um endpoint novo (type → service → hook → tela)
- Criar um componente reutilizável
- Criar um novo tipo de atividade em `src/activities/`

## Testar o que você fez

Não existe suíte de testes. A verificação mínima obrigatória:

```bash
npx tsc --noEmit
```

Depois, se a mudança for visual ou de fluxo, o app roda contra o mock (não
precisa do backend real):

```bash
npx @mockoon/cli start --data ./mock/mockoon-eduka.json --port 3000
```

```bash
npx expo start -c
```

Se você mudou um contrato de API, o mock precisa acompanhar — existe a skill
`/mock` para isso. Chame ela em vez de editar `mock/mockoon-eduka.json` no braço.

## Inconsistências aceitas (não "conserte" por conta própria)

O código mistura português e inglês de propósito herdado. Não faça refactor
disso sem pedirem, porque o backend também usa esses nomes:

- `user.nome` (português) enquanto `LoginRequest.email/password` é inglês.
- Funções de validação chamadas `validar()`.
- `percentConclued`, `lstAlternative`, `conclued` — vêm assim do backend.
- Indentação varia entre 2 e 4 espaços em arquivos antigos. Em arquivo novo use
  **2 espaços**; em arquivo existente, siga o que já está lá.

## Nunca faça

- Instalar dependência sem pedirem.
- Trocar a navegação por tabs do React Navigation — o `TabBar` é manual de
  propósito e chama `navigation.navigate` direto.
- Criar `index.ts` de barril nas pastas.
- Mexer em `.env.local` (é pessoal, ignorado pelo git) ou no fallback de IP em
  `src/constants/constant.ts`.
- Reescrever `ActivityScreen.tsx` / `ActivityScreen2.tsx` sem pedido explícito:
  são protótipos de mecânica de jogo com medição de posição sensível.

## Contexto do projeto

Leia `references/estado-atual.md` antes de tarefas maiores: lista o que está
pronto, o que está pela metade, os 3 erros de TS que já existem e as telas órfãs.
