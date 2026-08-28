# Receitas — passo a passo com código

Todo trecho aqui é copiado/adaptado do que já existe no projeto. Prefira colar e
adaptar em vez de escrever do zero.

---

## 1. Criar uma tela nova

### Passo 1 — Declarar a rota em `src/types/navigation.ts`

```ts
export type RootStackParamList = {
  // ...
  MinhaTelaScreen: undefined;              // sem parâmetro
  OutraTelaScreen: { topicId: number };    // com parâmetro
};
```

Sem esse passo, `navigation.navigate("MinhaTelaScreen")` vira erro de tipo.

### Passo 2 — Criar `src/screens/MinhaTelaScreen.tsx`

Ordem do arquivo, sempre a mesma:

```
imports  →  export default function  →  useState  →  useNavigation/useRoute
→  hooks de dados  →  handlers  →  validar()  →  early return de loading
→  JSX  →  const styles = StyleSheet.create(...)
```

Esqueleto de tela com dados + formulário:

```tsx
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import Header from "../components/Header";
import Input from "../components/Input";
import ErrorMessage from "../components/ErrorMessage";
import LoadingPage from "../components/LoadingPage";
import useAppNavigation from "../hooks/useNavigation";

export default function MinhaTelaScreen() {
  const [nome, setNome] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigation = useAppNavigation();

  const handleSubmit = async () => {
    if (!validar()) return;

    const response = await algumHook.algumaCoisa({ nome: nome.trim() });

    if (!response) {
      setErrorMessage("Não foi possível salvar. Tente novamente.");
      return;
    }

    navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
  };

  const validar = () => {
    if (nome.trim() == "") {
      setErrorMessage("Nome não pode ser vazio");
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={mainStyles.component} edges={["top"]}>
      <Header title="Minha tela" />

      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={mainStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={errorMessage ?? error} />

        <Input
          label="Nome"
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={mainStyles.primaryButton} onPress={handleSubmit}>
          <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // seções comentadas aqui
});
```

Se a tela receber parâmetro:

```tsx
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

const route = useRoute<RouteProp<RootStackParamList, "OutraTelaScreen">>();
const { topicId } = route.params;
```

### Passo 3 — Registrar no `App.tsx`

```tsx
import MinhaTelaScreen from "./src/screens/MinhaTelaScreen";
// ...
<Stack.Screen name="MinhaTelaScreen" component={MinhaTelaScreen} />
```

### Passo 4 — Escolher a casca certa

| Situação                                    | Casca                                                        |
| ------------------------------------------- | ------------------------------------------------------------ |
| Tela de conteúdo, com header próprio         | `<SafeAreaView style={mainStyles.component} edges={["top"]}>` |
| Tela que só empilha conteúdo                | `<View style={mainStyles.component}>`                        |
| Tela de abertura / tela cheia colorida      | `<LinearGradient ... style={styles.gradient}>`               |

`TabBar` vai **fora** do `ScrollView`, como último filho, e só nas 3 telas do
menu (Home, Subjects, Profile).

---

## 2. Criar um endpoint novo

Sempre na ordem type → service → hook → tela.

### Passo 1 — Tipos em `src/types/`

Convenção de nome: `XxxRequest` para o que sai, `XxxResponse` para o que volta.
Listas usam `Array<T>`, não `T[]`.

```ts
// src/types/subject.ts
export interface RankingResponse {
  id: number;
  name: string;
  points: number;
}
```

### Passo 2 — Service em `src/services/`

Sem try/catch, sem estado, uma função por rota, `export async function`:

```ts
// src/services/rankingService.ts
import { api } from "../configs/api";
import { RankingResponse } from "../types/subject";

export async function getAll(): Promise<Array<RankingResponse>> {
  const response = await api.get<Array<RankingResponse>>("/ranking");
  return response.data;
}
```

Rota com parâmetro segue a concatenação que já existe no projeto:

```ts
const response = await api.get<ActivityResponse>("/topic/" + topicId + "/activity");
```

### Passo 3 — Hook em `src/hooks/`

Estrutura fixa: um `useState` por dado, `loading`, `error`, função async com
`setLoading(true)` / `setError(null)` / try / catch com `getMessageError` /
`finally`. Devolve o dado no sucesso e `null` no erro.

```ts
// src/hooks/useRanking.ts
import { useState } from "react";
import getMessageError from "../utils/getMessageErrorUtils";
import * as rankingService from "../services/rankingService";
import { RankingResponse } from "../types/subject";

export default function useRanking() {
  const [ranking, setRanking] = useState<Array<RankingResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await rankingService.getAll();
      setRanking(response);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(error, "Erro na busca do ranking");
      console.error("Ranking error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, ranking, loading, error };
}
```

Repare: o service é importado como namespace (`import * as rankingService`), e a
mensagem de fallback do `getMessageError` é em português, específica da operação.

**Se a operação for de autenticação/usuário**, não crie hook novo: adicione no
`AuthContext` (função + entrada em `AuthContextData` em `src/types/context.ts`),
seguindo `updateProfile`/`updatePassword`.

### Passo 4 — Consumir na tela

```tsx
const { getAll, loading, error, ranking } = useRanking();

useEffect(() => {
  getAll();
}, []);

if (loading) {
  return <LoadingPage message="Carregando ranking..." />;
}

// ...
<ErrorMessage message={error} />
{ranking?.map((item) => (
  <View key={item.id}>
    <Text>{item.name}</Text>
  </View>
))}
```

Sempre `?.map` (o dado começa `null`) e sempre `key={item.id}`.

### Passo 5 — Mock

Toda rota nova precisa existir no mock também, senão ninguém da equipe consegue
testar. Use a skill `/mock`.

---

## 3. Criar um componente reutilizável

Vive em `src/components/`, `export default function`, props tipadas numa
`interface XxxProps` logo acima do componente.

Se ele embrulha um componente nativo, **estenda as props dele** e repasse o
resto — é o que `Input` faz:

```tsx
interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function Input({ label, error, containerStyle, style, ...rest }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, !!error && styles.inputError, style]} {...rest} />
    </View>
  );
}
```

Regras:

- Props opcionais com `?`, com default no destructuring quando fizer sentido
  (`showBack = true` no `Header`).
- Aceite `style`/`containerStyle` para a tela poder ajustar sem duplicar.
- Renderize nada em vez de espaço vazio: `if (!message) return null;`
  (`ErrorMessage`) e `{title ? <Text>...</Text> : null}` (`Header`).
- Nunca chame API dentro de componente.
- `activeOpacity={0.7}` a `0.85` em todo `TouchableOpacity` clicável.

---

## 4. Criar um novo tipo de atividade

As atividades vivem em `src/activities/`, não em `screens/`. Hoje existem
`ActivityScreen` (arrastar bolinhas para somar) e `ActivityScreen2` (arrastar
letras para completar palavra). As duas compartilham o mesmo esqueleto.

### Como uma atividade funciona hoje

1. Recebe `topicId` por parâmetro de rota.
2. `useTopic().getActivity(topicId)` traz `ActivityResponse`
   (`{ resumeQuestionId, lstQuestions }`).
3. O índice inicial vem de `resumeQuestionId` — é assim que o app retoma de onde
   o aluno parou:

```tsx
useEffect(() => {
  getActivity(topicId).then((data) => {
    if (data == null) return;
    const start = data.lstQuestions.findIndex((q) => q.id === data.resumeQuestionId);
    setIndex(start === -1 ? 0 : start);
  });
}, [topicId]);
```

4. `currentActivity = activity?.lstQuestions[index]`.
5. **`content` vem como string com JSON dentro** e precisa de parse:

```tsx
const questionContent = currentActivity?.content
  ? JSON.parse(currentActivity.content)
  : null;
```

6. Responder: monta `AttemptAlternativeRequest`, chama `answer()`, e trata os
   três casos — `concluded` (fim do tópico → volta pra Home), `correct`
   (avança o índice e **zera os shared values na mão**), errado (`Alert.alert`).

```tsx
const attempt: AttemptAlternativeRequest = {
  questionId: currentActivity.id,
  lstAlternativeId: [alternativeId],
};
const response = await answer(attempt);
if (!response) return;
if (response.concluded) { navigation.navigate("HomeScreen"); return; }
if (response.correct) { /* reset + setIndex((pre) => pre + 1) */ }
else { Alert.alert("Resposta errada", "Voce marcou a resposta errada"); }
```

### Drag & drop (gesture-handler + reanimated)

Padrão usado nas duas telas:

- `useSharedValue` para `translateX/Y` de cada peça e para a posição de destino
  (`finalPositionDotX/Y`) — shared value em vez de state para não re-renderizar a
  cada frame.
- `useRef<View | null>` + `collapsable={false}` em cada peça e no alvo, para
  poder chamar `.measure()`.
- `onLayout` da primeira peça dispara `calculateDistance()`, que mede alvo e
  peças com `setTimeout(..., 100)` (espera a UI nativa estabilizar).
- `Gesture.Pan().onChange(...).onEnd(...)`: no `onEnd` calcula a distância
  euclidiana até o alvo; se `< DISTANCE` (60), gruda com `withSpring`, senão
  volta pra 0.
- Para chamar `setState` de dentro de um gesto, use `runOnJS(setX)(valor)`.
- **Shared values não zeram sozinhos entre questões** — zere manualmente no
  `handleAnswer` (tem comentário no código dizendo isso).

### Ao criar a terceira atividade

1. Adicione o valor no enum `src/enums/QuestionTypeEnum.ts`.
2. Crie `src/activities/ActivityScreenX.tsx` copiando a estrutura de
   `ActivityScreen2.tsx` (é a mais limpa das duas).
3. Declare a rota em `RootStackParamList` com `{ topicId: number }` e registre no
   `App.tsx`.
4. Aponte a navegação em `TopicsScreen.handleActivity`.
5. Combine com quem faz o mock/backend qual formato o `content` vai ter, e
   documente com um comentário no topo do arquivo (como o `STATIC_PUZZLE` faz).

> Hoje `TopicsScreen` escolhe a tela de atividade com uma linha comentada e outra
> ativa. O caminho certo, quando existirem 3+ tipos, é rotear por
> `question.type` — mas isso é decisão do time, não faça sozinho.
