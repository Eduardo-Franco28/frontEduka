# Estilo visual do Eduka

Visual infantil/educacional: fundo lilás claro, cards brancos com cantos bem
arredondados, botões grandes (60px de altura), emoji no lugar de ícone, mascote
(leão) aparecendo nas telas. Nada de sombra — a separação é por cor de fundo e
borda.

## Paleta (`src/styles/colors.ts`)

Importe sempre `import { COLORS } from "../styles/colors";`.

| Grupo      | Token                  | Hex       | Uso                                    |
| ---------- | ---------------------- | --------- | -------------------------------------- |
| Marca      | `PRIMARY`              | `#5B6AF0` | Botão principal, links, foco de input  |
|            | `SECONDARY`            | `#8B97F8` | Fim do gradiente                       |
|            | `PRIMARY_LIGHT`        | `#6b7fe8` | Cards de destaque, valores em stats    |
| Texto      | `TEXT_PRIMARY`         | `#2d3340` | Título e texto padrão                  |
|            | `TEXT_DARK`            | `#2d3a4a` | Texto dentro de input                  |
|            | `TEXT_MUTED`           | `#9a9a8e` | Legenda, placeholder, meta             |
|            | `TEXT_SUBTLE`          | `#6b6b5e` | Texto secundário                       |
| Fundo      | `BG_APP`               | `#F4F5FF` | Fundo de toda tela (`mainStyles.component`) |
|            | `BG_WARM`              | `#f0ede8` | Divisórias, caixas de ícone            |
| Borda      | `BORDER_LIGHT`         | `#E8EAFF` | Borda de input, card, checkbox         |
|            | `BORDER_WARM`          | `#d0cdc5` | Bordas em fundo quente                 |
| Superfície | `SURFACE_PRIMARY`      | `#eef0fd` | Card selecionado                       |
|            | `SURFACE_BLUE`         | `#e8f0f8` | Avatar                                 |
|            | `SURFACE_BLUE_PILL`    | `#dce8f5` | Pill "em andamento"                    |
|            | `SURFACE_GREEN`        | `#d6f0e6` | Pill "concluído"                       |
|            | `SURFACE_GREEN_LIGHT`  | `#e0f4ec` | Caixa de ícone verde                   |
|            | `SURFACE_ORANGE`       | `#f5ece0` | Caixa de ícone laranja                 |
|            | `SURFACE_YELLOW`       | `#fef3e2` | Caixa de ícone amarela                 |
|            | `SURFACE_LOCKED`       | `#e8e5de` | Badge de item bloqueado                |
|            | `SURFACE_LOCKED_PILL`  | `#eeece8` | Pill de item bloqueado                 |
| Status     | `SUCCESS`              | `#3da678` | Concluído                              |
|            | `SUCCESS_DARK`         | `#4a9b6f` | Variante escura                        |
|            | `INFO`                 | `#5b82b5` | Em andamento, aba ativa                |
|            | `WARNING`              | `#e8893a` | Sequência de dias                      |
|            | `DANGER`               | `#e85b5b` | Erro, "Sair"                           |

Regra do par: cada estado tem **superfície + texto**. Concluído =
`SURFACE_GREEN` + `SUCCESS`. Em andamento = `SURFACE_BLUE_PILL` + `INFO`.
Bloqueado = `SURFACE_LOCKED_PILL` + `TEXT_MUTED`.

Só `#fff` e `#000` podem aparecer soltos (e `rgba(255,255,255,0.x)` sobre
gradiente). Qualquer outro hex novo entra em `colors.ts` primeiro.

## Estilos compartilhados (`src/styles/theme.ts`)

```ts
mainStyles.component          // flex:1 + BG_APP — casca de toda tela
mainStyles.scroll             // flex:1 — style do ScrollView
mainStyles.scrollContent      // padding 16/8/24 — contentContainerStyle
mainStyles.primaryButton      // 100% x 60, PRIMARY, radius 26, centralizado
mainStyles.primaryButtonText  // #fff, 17, 600
mainStyles.secondaryButton    // 100% x 60, borda 1.5 BORDER_LIGHT, radius 26
mainStyles.secondaryButtonText// PRIMARY, 17, 600
```

Para ajustar o padding de uma tela específica, **componha, não copie**:

```tsx
contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
```

## Escala visual

| Coisa                         | Valor                                    |
| ----------------------------- | ---------------------------------------- |
| Raio de card grande           | 20–24                                    |
| Raio de card de lista         | 18                                       |
| Raio de botão                 | 26 (pill: 100)                           |
| Raio de input                 | 18                                       |
| Altura de botão e input       | 60                                       |
| Padding horizontal de tela    | 16 (formulário de auth: 24; grid: 20)    |
| `gap` entre itens             | 8–16                                     |
| `marginBottom` entre blocos   | 10 (lista) / 20–24 (seção)               |
| Borda                         | `borderWidth: 1.5` (input) / `2` (card)  |

## Tipografia

Fonte é a do sistema — não há fonte customizada.

| Papel                  | Tamanho | Peso  | Cor              |
| ---------------------- | ------- | ----- | ---------------- |
| Título de tela grande  | 28–48   | `800` | `TEXT_PRIMARY`   |
| Título de header       | 18      | `700` | `TEXT_PRIMARY`   |
| Título de seção        | 16–18   | `600`–`700` | `TEXT_PRIMARY` |
| Texto de card          | 15      | `600` | `TEXT_PRIMARY`   |
| Corpo                  | 14      | `400`–`500` | `TEXT_PRIMARY` |
| Meta / legenda         | 12–13   | `400` | `TEXT_MUTED`     |
| Label de stat (CAIXA)  | 10–12   | `700` | `TEXT_MUTED` + `letterSpacing: 0.8–1.2` |

Peso é sempre string (`fontWeight: "700"`).

## Componentes prontos — use, não recrie

### `Header`
```tsx
<Header title="Editar Perfil" />              // com botão voltar
<Header title="Meu perfil" showBack={false} /> // sem
<Header title="X" onBack={() => ...} right={<Algo />} />
```
Já cuida do `goBack` e mantém o título centralizado com um espaçador de 36px.

### `Input`
Estende `TextInputProps`. Cuida sozinho de foco (borda `PRIMARY`), erro (borda
`DANGER` + texto) e placeholder na cor certa.
```tsx
<Input label="E-mail" placeholder="Digite seu e-mail" value={email}
  onChangeText={setEmail} autoCapitalize="none" autoCorrect={false}
  keyboardType="email-address" />
```

### `ErrorMessage`
Retorna `null` se não houver mensagem — pode ficar fixo no JSX.
```tsx
<ErrorMessage message={errorMessage ?? error} />
<ErrorMessage message={error} onRetry={() => getAll()} />
```

### `LoadingPage`
Tela cheia. Use como early return.
```tsx
if (loading) return <LoadingPage message="Carregando tópicos..." />;
```

### `TabBar`
Fora do `ScrollView`, último filho. Só nas 3 telas do menu. Ele já respeita a
safe area de baixo via `useSafeAreaInsets`.

## Padrões de UI que se repetem

**Checkbox "mostrar senha"** — aparece em 3 telas, copie de
`ChangePasswordScreen.tsx`. É uma `View` vazia que muda de `backgroundColor`.
Se for mexer nas três, vale extrair para `components/` — mas combine antes.

**Card com estado selecionado**
```tsx
<TouchableOpacity style={[styles.card, ativo && styles.cardSelected]} activeOpacity={0.85}>
```

**Bolinhas de progresso (step dots)** — usado em `SubjectsScreen` e
`SchoolYearScreen`: `dot` 10x10 redondo, o ativo fica com `width: 24`.

**Balão do mascote** — card branco, radius 18, emoji `🦁` + texto:
```tsx
<View style={styles.bubble}>
  <Text style={styles.bubbleEmoji}>🦁</Text>
  <Text style={styles.bubbleText}>Escolha um tópico para estudar...</Text>
</View>
```

**Mascote em imagem** — arquivos em `assets/`, referenciados com `require`:
`mascote.png` (padrão), `mascoteFeliz.png` (auth), `mascotePerfil.png` (avatar),
`mascoteBracoCruzado.png` (home). Os `Gemini_Generated_Image_*.png` não são
usados por ninguém.
```tsx
<Image source={require("../../assets/mascoteFeliz.png")} style={styles.mascote} />
```

## Organização do `StyleSheet`

Sempre no fim do arquivo, em `const styles`, com comentários de seção na mesma
ordem do JSX:

```tsx
const styles = StyleSheet.create({
  scrollContent: { paddingTop: 52 },

  // Profile card
  profileCard: { ... },
  avatarCircle: { ... },

  // Stats row
  statsRow: { ... },
});
```

Variantes vêm logo depois da base, com sufixo: `card` → `cardSelected`,
`badge` → `badgeComplete`/`badgeInProgress`/`badgeLocked`.

## Texto para o usuário

Português, tom direto e amigável, sem gíria. Erros começam pelo problema:
"E-mail não pode ser vazio", "As senhas não batem". Botões de ação principal
levam seta: `"Começar agora →"`, `"Entrar →"`.
