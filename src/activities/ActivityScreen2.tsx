import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import mainStyles from "../styles/theme";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import useAppNavigation from "../hooks/useNavigation";
import BackButton from "../components/BackButton";
import { COLORS } from "../styles/colors";
import useTopic from "../hooks/useTopic";
import LoadingPage from "../components/LoadingPage";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { AttemptAlternativeRequest } from "../types/subject";
import TipButton from "../components/TipButton";

// Dados estáticos até o backend mandar a palavra e as posições dos buracos.
// `blank: true` = buraco que o aluno preenche arrastando uma peça.
const STATIC_PUZZLE = {
  hint: "🍇",
  word: [
    { char: "U", blank: true },
    { char: "V", blank: false },
    { char: "A", blank: true },
  ],
  tiles: ["A", "U", "E", "O"],
};

// Índice do primeiro buraco — é nele que o drag que já existe mira.
const FIRST_BLANK = STATIC_PUZZLE.word.findIndex((l) => l.blank);

export default function ActivityScreen2() {
  const [index, setIndex] = useState<number>(0);
  const [alternativeId, setAlternativeId] = useState<number | null>(null);
  const [canAnswer, setIsCanAnswer] = useState(false);

  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "ActivityScreen2">>();

  const { getActivity, loading, error, activity, answer, result } = useTopic();
  const { topicId } = route.params;

  useEffect(() => {
    getActivity(topicId).then((data) => {
      if (data == null) return;

      const start = data.lstQuestions.findIndex(
        (q) => q.id === data.resumeQuestionId,
      );
      setIndex(start === -1 ? 0 : start); //Caso o usuario ja tenha terminado tudo nos conseguimos tratar
    });
  }, [topicId]);

  useEffect(() => {
    // setTipVisible(true)
  }, [])

  const currentActivity = activity?.lstQuestions[index];

  const questionContent = currentActivity?.content
    ? JSON.parse(currentActivity.content)
    : null;

  const handleAnswer = async () => {
    if (alternativeId === null || !currentActivity?.id) return;

    const attempt: AttemptAlternativeRequest = {
      questionId: currentActivity.id,
      lstAlternativeId: [alternativeId],
    };

    const response = await answer(attempt);

    if (!response) return;

    if (response.concluded) {
      navigation.navigate("HomeScreen");

      return;
    }

    if (response.correct) {
      setAlternativeId(null);
      setIsCanAnswer(false);

      isAswerAble3.value = false; // shared values não zeram sozinhos
      isAswerAble4.value = false;
      translateX3.value = 0;
      translateY3.value = 0;
      translateX4.value = 0;
      translateY4.value = 0;

      setIndex((pre) => pre + 1);
    } else {
      setAlternativeId(null);
      setIsCanAnswer(false);

      isAswerAble3.value = false; // shared values não zeram sozinhos
      isAswerAble4.value = false;
      translateX3.value = 0;
      translateY3.value = 0;
      translateX4.value = 0;
      translateY4.value = 0;

      Alert.alert("Resposta errada", "Voce marcou a resposta errada");
    }
  };

  const isAswerAble4 = useSharedValue(false);
  const isAswerAble3 = useSharedValue(false);

  // Animações dos blocos
  const translateX4 = useSharedValue(0);
  const translateY4 = useSharedValue(0);
  const translateX3 = useSharedValue(0);
  const translateY3 = useSharedValue(0);

  // 1. Mudança para useSharedValue para evitar re-renders no cálculo de distância
  const finalPositionDotX4 = useSharedValue(0);
  const finalPositionDotY4 = useSharedValue(0);
  const finalPositionDotX3 = useSharedValue(0);
  const finalPositionDotY3 = useSharedValue(0);

  const targetRef = useRef<View | null>(null);
  // Um ref por buraco da palavra, pra medir a posição de cada slot.
  const slotRefs = useRef<Array<View | null>>([]);
  const dotsRef4 = useRef<View | null>(null);
  const dotsRef3 = useRef<View | null>(null);

  const DISTANCE = 60;

  // 2. Função de medição segura
  const calculateDistance = () => {
    if (targetRef.current) {
      // Pequeno delay apenas para garantir que a UI nativa se estabilizou
      setTimeout(() => {
        targetRef.current?.measure(
          (_x, _y, _w, _h, pageX_target, pageY_target) => {
            if (dotsRef4.current) {
              dotsRef4.current.measure(
                (_x2, _y2, _w2, _h2, pageX_dots4, pageY_dots4) => {
                  // Atribuir valor direto ao .value NÃO causa re-render do componente
                  finalPositionDotX4.value = pageX_target - pageX_dots4;
                  finalPositionDotY4.value = pageY_target - pageY_dots4;
                },
              );
            }

            if (dotsRef3.current) {
              dotsRef3.current.measure(
                (_x3, _y3, _w3, _h3, pageX_dots3, pageY_dots3) => {
                  finalPositionDotX3.value = pageX_target - pageX_dots3 + 20;
                  finalPositionDotY3.value = pageY_target - pageY_dots3 - 6;
                },
              );
            }
          },
        );
      }, 100);
    }
  };

  // Gestos atualizados usando .value dos shared values de destino
  const dragGesture4 = Gesture.Pan()
    .onChange((event) => {
      translateX4.value = event.translationX;
      translateY4.value = event.translationY;
    })
    .onEnd(() => {
      const distance = Math.sqrt(
        Math.pow(translateX4.value - finalPositionDotX4.value, 2) +
          Math.pow(translateY4.value - finalPositionDotY4.value, 2),
      );
      if (distance < DISTANCE) {
        translateX4.value = withSpring(finalPositionDotX4.value);
        translateY4.value = withSpring(finalPositionDotY4.value);
        // O setState aqui só roda uma vez quando o bloco entra no alvo, não gera loop
        if (!isAswerAble4.value) isAswerAble4.value = true;

        if (isAswerAble3.value) {
          runOnJS(setIsCanAnswer)(true);
        }
      } else {
        translateX4.value = withSpring(0);
        translateY4.value = withSpring(0);
      }
    });

  const dragGesture3 = Gesture.Pan()
    .onChange((event) => {
      translateX3.value = event.translationX;
      translateY3.value = event.translationY;
    })
    .onEnd(() => {
      const distance = Math.sqrt(
        Math.pow(translateX3.value - finalPositionDotX3.value, 2) +
          Math.pow(translateY3.value - finalPositionDotY3.value, 2),
      );
      if (distance < DISTANCE) {
        translateX3.value = withSpring(finalPositionDotX3.value);
        translateY3.value = withSpring(finalPositionDotY3.value);
        if (!isAswerAble3.value) isAswerAble3.value = true;

        if (isAswerAble4.value) {
          runOnJS(setIsCanAnswer)(true);
        }
      } else {
        translateX3.value = withSpring(0);
        translateY3.value = withSpring(0);
      }
    });

  const animatedStyle4 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX4.value },
      { translateY: translateY4.value },
    ],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX3.value },
      { translateY: translateY3.value },
    ],
  }));

  // Precisa vir depois de todos os hooks, senão quebra a ordem deles.
  if (loading || !questionContent) {
    return <LoadingPage message="Carregando atividade..." />;
  }

  return (
    <View style={mainStyles.component}>
      
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>{currentActivity?.title}</Text>

        <TipButton
          tip="Arraste as letras para completar a palavra"
          style={styles.tipButton}
        />

        {/* ZONA 1 — card branco com a linha da palavra */}
        <View style={styles.questionCard}>
          <View style={styles.answerRow}>
            <Text style={styles.answerHint}>{STATIC_PUZZLE.hint}</Text>

            {STATIC_PUZZLE.word.map((letter, i) =>
              letter.blank ? (
                <View
                  key={i}
                  collapsable={false}
                  style={styles.answerSlot}
                  ref={(el) => {
                    slotRefs.current[i] = el;
                    // o primeiro buraco continua sendo o alvo do drag que já existe
                    if (i === FIRST_BLANK) targetRef.current = el;
                  }}
                />
              ) : (
                <Text key={i} style={styles.answerLetter}>
                  {letter.char}
                </Text>
              ),
            )}
          </View>
        </View>

        {/* ZONA 2 — dica */}
        <Text style={styles.questionLabel}>
          *Arraste as letras para completar a palavra!
        </Text>

        {/* ZONA 3 — peças arrastáveis, soltas sobre o fundo */}
        <View style={styles.tilesGrid}>
          <GestureDetector gesture={dragGesture4}>
            <Animated.View style={animatedStyle4}>
              <View style={styles.tile}>
                <Text style={styles.tileText}>{STATIC_PUZZLE.tiles[0]}</Text>
                <View
                  ref={dotsRef4}
                  collapsable={false}
                  onLayout={calculateDistance}
                />
              </View>
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={dragGesture3}>
            <Animated.View style={animatedStyle3}>
              <View style={styles.tile}>
                <Text style={styles.tileText}>{STATIC_PUZZLE.tiles[1]}</Text>
                <View ref={dotsRef3} collapsable={false} />
              </View>
            </Animated.View>
          </GestureDetector>

          {/* Peças extras: ainda SEM gesto de arrastar (falta ligar) */}
          {STATIC_PUZZLE.tiles.slice(2).map((letra, i) => (
            <View key={i} style={styles.tile}>
              <Text style={styles.tileText}>{letra}</Text>
            </View>
          ))}
        </View>

        {/* ZONA 4 — confirmar */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleAnswer}
            activeOpacity={0.85}
            style={mainStyles.primaryButton}
          >
            <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 24,
  },

  // Coluna principal: as 4 zonas empilhadas
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 24,
  },

  // Só o posicionamento — a aparência mora no TipButton
  tipButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },

  // ZONA 1 — card branco com a linha da palavra
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  tile: {
    width: 76,
    height: 76,
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  tileText: {
    fontSize: 40,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
  },
  questionLabel: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "500",
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },

  // A linha da palavra, que agora vive dentro do card
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  answerHint: {
    fontSize: 40,
    lineHeight: 46,
    marginRight: 4,
  },
  answerSlot: {
    width: 46,
    height: 48,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.TEXT_PRIMARY,
  },
  answerLetter: {
    width: 46,
    height: 48,
    fontSize: 46,
    lineHeight: 44,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
  },

  // Não usados hoje: sobraram da versão de múltipla escolha
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  optionCardSelected: {
    borderColor: COLORS.PRIMARY_LIGHT,
    backgroundColor: COLORS.SURFACE_PRIMARY,
  },
  optionText: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  optionTextSelected: {
    color: COLORS.PRIMARY_LIGHT,
  },

  // ZONA 4 — confirmar
  footer: {
    marginTop: 48,
  },
});
