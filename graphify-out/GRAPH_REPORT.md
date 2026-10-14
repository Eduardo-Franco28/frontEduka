# Graph Report - Eduka  (2026-10-08)

## Corpus Check
- 93 files · ~257,445 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 3)

## Summary
- 484 nodes · 1323 edges · 14 communities
- Extraction: 97% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.85)
- Token cost: 202,734 input · 0 output

## Community Hubs (Navigation)
- Navegação e Componentes Base
- Atividades Drag-and-Drop
- Contrato da API e Mock
- Arquitetura e Estado Atual
- Mascote Pinguim (Assets)
- Dependências do Projeto
- Auth e Splash
- Configuração Expo
- Receitas de Tela e Atividade
- Overlay de Celebração
- Enum de Escolaridade
- Modal de PIN
- Tema (Claro/Escuro)
- Configuração TypeScript

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 39 edges
2. `react` - 36 edges
3. `react-native` - 34 edges
4. `Front Skill: Como mexer no front do IntegraMente` - 28 edges
5. `useAppNavigation()` - 27 edges
6. `Mock Skill: Atualizar o mock do IntegraMente` - 23 edges
7. `@react-native-vector-icons/fontawesome-free-solid` - 21 edges
8. `ErrorMessage()` - 17 edges
9. `mainStyles` - 17 edges
10. `COLORS` - 16 edges

## Surprising Connections (you probably didn't know these)
- `.env.local Setup with Machine IPv4` --semantically_similar_to--> `EXPO_PUBLIC_API_URL Environment Variable`  [INFERRED] [semantically similar]
  mock/README.md → .claude/skills/front/references/arquitetura.md
- `Activity per Topic Map (201, 301, 304, 501, default dots)` --conceptually_related_to--> `Activity Types by question.type (DRAG_DOTS, DRAG_TO_SLOTS, DRAG_LETTERS, DRAG_SLOTS_TO_GROUP)`  [INFERRED]
  mock/README.md → .claude/skills/mock/SKILL.md
- `Second Option Is Always Correct` --semantically_similar_to--> `DRAG_DOTS ID Convention (second alternative correct, 32$ concludes)`  [INFERRED] [semantically similar]
  mock/README.md → .claude/skills/mock/SKILL.md
- `Mock README: Run the App Without the Backend` --conceptually_related_to--> `Stateless Mock (no persisted progress)`  [INFERRED]
  mock/README.md → .claude/skills/mock/SKILL.md
- `Data Flow: Screen -> Hook -> Service -> axios -> backend/mock` --semantically_similar_to--> `Layer Rule: Screen -> Hook -> Service -> api`  [INFERRED] [semantically similar]
  .claude/skills/front/references/arquitetura.md → .claude/skills/front/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Layered Data Access Pattern (Screen/Hook/Service/api)** — _claude_skills_front_skill_layer_rule, _claude_skills_front_skill_hook_returns_null_on_error, _claude_skills_front_references_arquitetura_data_flow, _claude_skills_front_references_receitas_new_endpoint_recipe, src_configs_api, src_utils_getmessageerrorutils [INFERRED 0.95]
- **Mock Backend Development Setup** — _claude_skills_mock_skill_mock_skill, mock_readme_run_without_backend, mock_mockoon_integramente, mock_readme_port_convention, mock_readme_env_local_setup, _claude_skills_front_references_arquitetura_expo_public_api_url [INFERRED 0.95]
- **Activity Component Dispatch by question.type** — src_screens_activityscreen, src_activities_dotsactivity, src_activities_shapesactivity, src_activities_lettersactivity, src_activities_groupsactivity, _claude_skills_mock_skill_activity_types_dispatch [EXTRACTED 1.00]

## Communities (14 total, 0 thin omitted)

### Community 0 - "Navegação e Componentes Base"
Cohesion: 0.07
Nodes (74): Flat Native Stack Navigation (headerShown false), ErrorMessage '' vs ?? Nullish Bug, Known Small Bugs in Profile Screens, Show-Password Checkbox Duplication (candidate Checkbox component), Recipe: Reusable Component (extend native props), Ready Components: Header, Input, ErrorMessage, LoadingPage, TabBar, App(), Routes() (+66 more)

### Community 1 - "Atividades Drag-and-Drop"
Cohesion: 0.09
Nodes (47): Activity Types by question.type (DRAG_DOTS, DRAG_TO_SLOTS, DRAG_LETTERS, DRAG_SLOTS_TO_GROUP), expo-speech, react, react-native, react-native-gesture-handler, react-native-reanimated, DotsActivity(), renderDots() (+39 more)

### Community 2 - "Contrato da API e Mock"
Cohesion: 0.05
Nodes (46): Backend API Contract (route table), Data Flow: Screen -> Hook -> Service -> axios -> backend/mock, EXPO_PUBLIC_API_URL Environment Variable, getMessageError Extraction Order, DRAG_DOTS ID Convention (second alternative correct, 32$ concludes), Mockoon Handlebars Templating Helpers and Pitfalls, Mock Route Table (plural /subjects, /topics, /stats), Mock Skill: Atualizar o mock do IntegraMente (+38 more)

### Community 3 - "Arquitetura e Estado Atual"
Cohesion: 0.05
Nodes (33): QuestionResponse.content Is a JSON String, Front Architecture Reference, Front Stack (Expo SDK 54, RN 0.81, React 19, TS strict), Naming Conventions (XxxScreen, useXxx, xxxService, XxxRequest/XxxResponse, Array<T>), TopicStatus Numeric Enum vs Backend String Divergence, ActivityScreen2 Alternative Selection Not Implemented, Front Current State Snapshot (28/08/2026), Dead Code Inventory (unused assets, vector-icons, palette tokens) (+25 more)

### Community 4 - "Mascote Pinguim (Assets)"
Cohesion: 0.05
Nodes (44): Penguin Mascot - Thinking Pose (side view, Gemini render), Autism Awareness Puzzle Lanyard, Blue Penguin Mascot (3D), Thinking / Pondering Pose, Penguin Mascot - Flying Pose (Gemini render), Autism Awareness Puzzle Lanyard, Flying / Gliding Pose, Blue Penguin Mascot (3D) (+36 more)

### Community 5 - "Dependências do Projeto"
Cohesion: 0.04
Nodes (45): dependencies, axios, expo, expo-linear-gradient, expo-secure-store, expo-speech, expo-status-bar, hoist-non-react-statics (+37 more)

### Community 6 - "Auth e Splash"
Cohesion: 0.14
Nodes (21): AuthContext as Only Global State, Session Restore on Boot (initializing flag), Recipe: New Endpoint (type -> service -> hook -> screen -> mock), expo-linear-gradient, Bubble(), BubbleProps, BUBBLES, Halo() (+13 more)

### Community 7 - "Configuração Expo"
Cohesion: 0.08
Nodes (23): backgroundColor, adaptiveIcon, edgeToEdgeEnabled, package, predictiveBackGestureEnabled, projectId, expo, android (+15 more)

### Community 8 - "Receitas de Tela e Atividade"
Cohesion: 0.31
Nodes (9): Answer Flow (concluded / correct / wrong), Drag and Drop Pattern (gesture-handler + reanimated), Front Recipes (step-by-step with code), Recipe: New Activity Type, Recipe: Create a New Screen, Resume Activity from resumeQuestionId, Screen File Order Convention, Screen Shell Choice (SafeAreaView / View / LinearGradient) (+1 more)

### Community 9 - "Overlay de Celebração"
Cohesion: 0.22
Nodes (9): CELEBRATION_DURATION_MS, CelebrationOverlay(), CelebrationOverlayProps, CONFETTI, ConfettiProps, { height: SCREEN_HEIGHT }, Sparkle(), SPARKS (+1 more)

### Community 10 - "Enum de Escolaridade"
Cohesion: 0.22
Nodes (8): Escolaridade, NONO_ANO, OITAVO_ANO, PRIMEIRO_MEDIO, SEGUNDO_MEDIO, SETIMO_ANO, SEXTO_ANO, TERCEIRO_MEDIO

### Community 11 - "Modal de PIN"
Cohesion: 0.32
Nodes (6): PinModal(), PinModalProps, styles, PinOperation, CONFIRM, CREATE

### Community 12 - "Tema (Claro/Escuro)"
Cohesion: 0.38
Nodes (5): ThemeContext, ThemeProviderProps, DARK_COLORS, ThemeColors, ThemeContextData

### Community 13 - "Configuração TypeScript"
Cohesion: 0.40
Nodes (4): expo/tsconfig.base, compilerOptions, strict, extends

## Ambiguous Edges - Review These
- `LettersActivity.tsx` → `ActivityScreen2 Alternative Selection Not Implemented`  [AMBIGUOUS]
  .claude/skills/front/references/estado-atual.md · relation: conceptually_related_to
- `ActivityScreen.tsx` → `ActivityScreen / ActivityScreen2 Near-Duplication`  [AMBIGUOUS]
  .claude/skills/front/references/estado-atual.md · relation: references
- `Backend API Contract (route table)` → `Mock Route Table (plural /subjects, /topics, /stats)`  [AMBIGUOUS]
  .claude/skills/mock/SKILL.md · relation: conceptually_related_to

## Knowledge Gaps
- **177 isolated node(s):** `Stack`, `name`, `slug`, `version`, `orientation` (+172 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 204 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `LettersActivity.tsx` and `ActivityScreen2 Alternative Selection Not Implemented`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `react` connect `Atividades Drag-and-Drop` to `Navegação e Componentes Base`, `Contrato da API e Mock`, `Mascote Pinguim (Assets)`, `Dependências do Projeto`, `Auth e Splash`, `Overlay de Celebração`, `Tema (Claro/Escuro)`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **What connects `Stack`, `name`, `slug` to the rest of the system?**
  _177 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Navegação e Componentes Base` be split into smaller, more focused modules?**
  _Cohesion score 0.07174416158215864 - nodes in this community are weakly interconnected._
- **What is the exact relationship between `ActivityScreen.tsx` and `ActivityScreen / ActivityScreen2 Near-Duplication`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Front Skill: Como mexer no front do IntegraMente` connect `Arquitetura e Estado Atual` to `Navegação e Componentes Base`, `Atividades Drag-and-Drop`, `Contrato da API e Mock`, `Auth e Splash`, `Receitas de Tela e Atividade`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `Atividades Drag-and-Drop` be split into smaller, more focused modules?**
  _Cohesion score 0.08944099378881988 - nodes in this community are weakly interconnected._