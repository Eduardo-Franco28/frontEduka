import { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import { ActivityProps } from "../types/activity";

/**
 * DRAG_DOTS — arrastar as bolinhas e marcar o resultado da conta.
 *
 * Recebe UMA questão pronta da ActivityScreen. Não busca nada, não troca de
 * questão e não navega.
 *
 * É a única que não é corrigida por lugar: a resposta é a alternativa marcada
 * (`lstAlternativeId`), não onde as peças caíram. O arrastar aqui ainda é o
 * antigo, feito na mão — não usa o useDragAndDrop.
 */

const DISTANCE = 60;

export default function DotsActivity({
  question,
  answering,
  onAnswer,
}: ActivityProps) {
  const [alternativeId, setAlternativeId] = useState<number | null>(null);
  const [canAnswer, setIsCanAnswer] = useState(false);

  const isAswerAble4 = useSharedValue(false);
  const isAswerAble3 = useSharedValue(false);

  // Animações dos blocos
  const translateX4 = useSharedValue(0);
  const translateY4 = useSharedValue(0);
  const translateX3 = useSharedValue(0);
  const translateY3 = useSharedValue(0);

  // Shared values pra evitar re-render no cálculo de distância
  const finalPositionDotX4 = useSharedValue(0);
  const finalPositionDotY4 = useSharedValue(0);
  const finalPositionDotX3 = useSharedValue(0);
  const finalPositionDotY3 = useSharedValue(0);

  const targetRef = useRef<View | null>(null);
  const dotsRef4 = useRef<View | null>(null);
  const dotsRef3 = useRef<View | null>(null);

  // O content desta atividade tem outro formato: os dois números da conta.
  const content = JSON.parse(question.content);
  const alternatives = question.lstAlternative ?? [];

  /** Volta as bolinhas pro lugar e limpa a escolha. */
  const resetDots = () => {
    setAlternativeId(null);
    setIsCanAnswer(false);

    // Shared values não zeram sozinhos.
    isAswerAble3.value = false;
    isAswerAble4.value = false;
    translateX3.value = 0;
    translateY3.value = 0;
    translateX4.value = 0;
    translateY4.value = 0;
  };

  const handleConfirm = async () => {
    if (alternativeId === null) return;

    const response = await onAnswer({ lstAlternativeId: [alternativeId] });

    // Acertou: a tela já trocou de questão. Não há nada a fazer aqui.
    if (!response || response.correct) return;

    resetDots();
    Alert.alert("Resposta errada", "Você marcou a resposta errada");
  };

  const calculateDistance = () => {
    if (!targetRef.current) return;

    // Pequeno delay só pra garantir que a UI nativa se estabilizou
    setTimeout(() => {
      targetRef.current?.measure((_x, _y, _w, _h, pageXTarget, pageYTarget) => {
        dotsRef4.current?.measure((_x2, _y2, _w2, _h2, pageXDots4, pageYDots4) => {
          finalPositionDotX4.value = pageXTarget - pageXDots4;
          finalPositionDotY4.value = pageYTarget - pageYDots4;
        });

        dotsRef3.current?.measure((_x3, _y3, _w3, _h3, pageXDots3, pageYDots3) => {
          finalPositionDotX3.value = pageXTarget - pageXDots3 + 20;
          finalPositionDotY3.value = pageYTarget - pageYDots3 - 6;
        });
      });
    }, 100);
  };

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
        if (!isAswerAble4.value) isAswerAble4.value = true;

        if (isAswerAble3.value) runOnJS(setIsCanAnswer)(true);
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

        if (isAswerAble4.value) runOnJS(setIsCanAnswer)(true);
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

  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>{question.title}</Text>

      <View style={styles.questionCard}>
        <View style={styles.questionEquation}>
          {/* Primeiro número */}
          <View style={styles.numberGroup}>
            <Text style={styles.questionText}>{content.teste1}</Text>
            <View
              ref={dotsRef4}
              collapsable={false}
              onLayout={calculateDistance}
              style={styles.dotsWrapper}
            >
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

          {/* Segundo número */}
          <View style={styles.numberGroup}>
            <Text style={styles.questionText}>{content.teste2}</Text>
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

          {/* O alvo */}
          <View style={styles.targetGroup}>
            <View
              ref={targetRef}
              collapsable={false}
              style={styles.targetBox}
            />
          </View>
        </View>
        <Text style={styles.questionLabel}>
          *Arraste as bolinhas para completar a soma!
        </Text>
      </View>

      <Text style={styles.instruction}>TOQUE O NÚMERO CERTO</Text>

      <View style={styles.optionsRow}>
        {alternatives.map((alt) => (
          <TouchableOpacity
            key={alt.id}
            style={[
              styles.optionCard,
              alternativeId === alt.id && styles.optionCardSelected,
            ]}
            onPress={() => setAlternativeId(alt.id)}
            activeOpacity={0.8}
            disabled={!canAnswer}
          >
            <Text
              style={[
                styles.optionText,
                alternativeId === alt.id && styles.optionTextSelected,
              ]}
            >
              {alt.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={mainStyles.primaryButton}
        onPress={handleConfirm}
        disabled={answering}
      >
        <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
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
