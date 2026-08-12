import { useState, useRef, useEffect, act } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import mainStyles from "../styles/theme";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import useAppNavigation from "../hooks/useNavigation";
import { COLORS } from "../styles/colors";
import useTopic from "../hooks/useTopic";
import LoadingPage from "../components/LoadingPage";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

export default function ActivityScreen() {
  const [index, setIndex] = useState<number>(0);

  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "ActivityScreen">>();

  const { getActivity, loading, error, activity } = useTopic();
  const { topicId } = route.params;

  useEffect(() => {
    getActivity(topicId).then(data =>{
      if(data == null) return;

      const start = data.lstQuestions.findIndex(q => q.id === data.resumeQuestionId);
      setIndex(start === -1 ? 0 : start); //Caso o usuario ja tenha terminado tudo nos conseguimos tratar
    })
  }, [topicId])

  const currentActivity = activity?.lstQuestions[index]

  const questionContent = currentActivity?.content
  ? JSON.parse(currentActivity.content)
  : null;

  const [selected, setSelected] = useState<number | null>(null);
  const [canAnswer, setIsCanAnswer] = useState(false);
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
  const dotsRef4 = useRef<View | null>(null);
  const dotsRef3 = useRef<View | null>(null);

  const DISTANCE = 60;

  // 2. Função de medição segura
  const calculateDistance = () => {
    if (targetRef.current) {
      // Pequeno delay apenas para garantir que a UI nativa se estabilizou
      setTimeout(() => {
        targetRef.current?.measure((_x, _y, _w, _h, pageX_target, pageY_target) => {

          if (dotsRef4.current) {
            dotsRef4.current.measure((_x2, _y2, _w2, _h2, pageX_dots4, pageY_dots4) => {
              // Atribuir valor direto ao .value NÃO causa re-render do componente
              finalPositionDotX4.value = pageX_target - pageX_dots4;
              finalPositionDotY4.value = pageY_target - pageY_dots4;
            });
          }

          if (dotsRef3.current) {
            dotsRef3.current.measure((_x3, _y3, _w3, _h3, pageX_dots3, pageY_dots3) => {
              finalPositionDotX3.value = (pageX_target - pageX_dots3) + 20;
              finalPositionDotY3.value = (pageY_target - pageY_dots3) - 6;
            });
          }
        });
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
        Math.pow(translateY4.value - finalPositionDotY4.value, 2)
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
        Math.pow(translateY3.value - finalPositionDotY3.value, 2)
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
    transform: [{ translateX: translateX4.value }, { translateY: translateY4.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX3.value }, { translateY: translateY3.value }],
  }));

  // Precisa vir depois de todos os hooks, senão quebra a ordem deles.
  if (loading || !questionContent) {
    return <LoadingPage message="Carregando atividade..." />;
  }

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={{ justifyContent: "center", flex: 1 }}>
        <Text style={styles.questionTitle}>{currentActivity?.title}</Text>
        <View style={styles.questionCard}>

          <View style={styles.questionEquation}>

            {/* Bloco do Número 4 */}
            <View style={styles.numberGroup}>
              <Text style={styles.questionText}>{questionContent.teste1}</Text>
              {/* O onLayout dispara a função, mas agora ela é segura */}
              <View ref={dotsRef4} collapsable={false} onLayout={calculateDistance} style={styles.dotsWrapper}>
                <GestureDetector gesture={dragGesture4}>
                  <Animated.View style={[animatedStyle4, styles.dotsVertical]}>
                    <View style={[styles.dotV, styles.dotVActive]} />
                    <View style={[styles.dotV, styles.dotVActive]} />
                    <View style={[styles.dotV, styles.dotVActive]} />
                    <View style={[styles.dotV, styles.dotVActive]} />
                  </Animated.View>
                </GestureDetector>
              </View>
            </View>

            <Text style={styles.operatorText}>+</Text>

            {/* Bloco do Número 3 */}
            <View style={styles.numberGroup}>
              <Text style={styles.questionText}>{questionContent.teste2}</Text>
              <View ref={dotsRef3} collapsable={false} style={styles.dotsWrapper}>
                <GestureDetector gesture={dragGesture3}>
                  <Animated.View style={[animatedStyle3, styles.dotsVertical]}>
                    <View style={[styles.dotV, styles.dotVActive]} />
                    <View style={[styles.dotV, styles.dotVActive]} />
                    <View style={[styles.dotV, styles.dotVActive]} />
                  </Animated.View>
                </GestureDetector>
              </View>
            </View>

            <Text style={styles.operatorText}>=</Text>

            {/* Bloco do Alvo */}
            <View style={styles.targetGroup}>
              <View
                ref={targetRef}
                collapsable={false}
                style={styles.targetBox}
              />
            </View>

          </View>
          <Text style={styles.questionLabel}>*Arraste as bolinhas para completar a soma!</Text>
        </View>

        <Text style={styles.instruction}>TOQUE O NÚMERO CERTO</Text>

        <View style={styles.optionsRow}>
          {currentActivity?.lstAlternative?.map((alternative) => (
            <TouchableOpacity
              key={alternative.id}
              style={[styles.optionCard]}
              onPress={() => setSelected(alternative.id)}
              activeOpacity={0.8}
              disabled={!(canAnswer)}
            >
              <Text style={[styles.optionText]}>
                {alternative.description}
              </Text>
            </TouchableOpacity>
          ))}
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
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT,
  },
  backArrow: {
    fontSize: 20,
    color: COLORS.TEXT_PRIMARY,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 14,
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 320,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.2,
    textAlign: "center",
  },
  questionEquation: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    gap: 16,
    marginBottom: 34,
  },
  numberGroup: {
    flexDirection: "column",
    alignItems: "center",
    minWidth: 50,
  },
  targetGroup: {
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  questionText: {
    fontSize: 46,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    lineHeight: 52,
  },
  operatorText: {
    fontSize: 46,
    fontWeight: "400",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    lineHeight: 52,
  },
  dotsWrapper: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
  },
  dotsVertical: {
    gap: 6,
    alignItems: "center",
  },
  dotV: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotVActive: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  targetBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  instruction: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.4,
    textAlign: "center",
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  optionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
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
});
