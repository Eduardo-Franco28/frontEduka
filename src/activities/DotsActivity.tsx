import { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import mainStyles from "../styles/theme";
import usePieceScale from "../hooks/usePieceScale";
import { COLORS } from "../styles/colors";
import { ActivityProps } from "../types/activity";
import TipButton from "../components/TipButton";

const DISTANCE = 60;

const DOTS_PER_COLUMN = 4;

const RESULT_MIN_COLUMNS = 3;
const RESULT_MAX_DOTS_PER_COLUMN = 5;

export default function DotsActivity({
  question,
  answering,
  onAnswer,
}: ActivityProps) {
  const [alternativeId, setAlternativeId] = useState<number | null>(null);
  const [wrongAlternativeId, setWrongAlternativeId] = useState<number | null>(null);
  const scaled = usePieceScale();
  const dotSize = { width: scaled(16), height: scaled(16), borderRadius: scaled(8) };
  const dotGap = scaled(6);

  const [placedFirst, setPlacedFirst] = useState(false);
  const [placedSecond, setPlacedSecond] = useState(false);
  const canAnswer = placedFirst && placedSecond;

  const translateX4 = useSharedValue(0);
  const translateY4 = useSharedValue(0);
  const translateX3 = useSharedValue(0);
  const translateY3 = useSharedValue(0);

  const finalPositionDotX4 = useSharedValue(0);
  const finalPositionDotY4 = useSharedValue(0);
  const finalPositionDotX3 = useSharedValue(0);
  const finalPositionDotY3 = useSharedValue(0);

  const targetRef = useRef<View | null>(null);
  const dotsRef4 = useRef<View | null>(null);
  const dotsRef3 = useRef<View | null>(null);

  const content = JSON.parse(question.content);
  const alternatives = question.lstAlternative ?? [];

  const resultTotal =
    (placedFirst ? content.teste1 : 0) + (placedSecond ? content.teste2 : 0);

  const resultPerColumn = Math.min(
    RESULT_MAX_DOTS_PER_COLUMN,
    Math.ceil(resultTotal / RESULT_MIN_COLUMNS),
  );

  const resetDots = () => {
    setAlternativeId(null);
    setPlacedFirst(false);
    setPlacedSecond(false);

    translateX3.value = 0;
    translateY3.value = 0;
    translateX4.value = 0;
    translateY4.value = 0;
  };

  const handleConfirm = async () => {
    if (alternativeId === null) return;

    const response = await onAnswer({ lstAlternativeId: [alternativeId] });

    if (!response || response.correct) return;

    setWrongAlternativeId(alternativeId);
    setTimeout(() => setWrongAlternativeId(null), 2000);
    resetDots();
  };

  const calculateDistance = () => {
    if (!targetRef.current) return;

    setTimeout(() => {
      targetRef.current?.measure((_x, _y, _w, _h, pageXTarget, pageYTarget) => {
        dotsRef4.current?.measure(
          (_x2, _y2, _w2, _h2, pageXDots4, pageYDots4) => {
            finalPositionDotX4.value = pageXTarget - pageXDots4;
            finalPositionDotY4.value = pageYTarget - pageYDots4;
          },
        );

        dotsRef3.current?.measure(
          (_x3, _y3, _w3, _h3, pageXDots3, pageYDots3) => {
            finalPositionDotX3.value = pageXTarget - pageXDots3;
            finalPositionDotY3.value = pageYTarget - pageYDots3;
          },
        );
      });
    }, 100);
  };

  const dragGesture4 = Gesture.Pan()
    .minDistance(0)
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
        translateX4.value = 0;
        translateY4.value = 0;
        runOnJS(setPlacedFirst)(true);
      } else {
        translateX4.value = withSpring(0);
        translateY4.value = withSpring(0);
      }
    });

  const dragGesture3 = Gesture.Pan()
    .minDistance(0)
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
        translateX3.value = 0;
        translateY3.value = 0;
        runOnJS(setPlacedSecond)(true);
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
      <Text style={mainStyles.activityTitle}>{question.title}</Text>
      <Text style={mainStyles.activitySubtitle}>Conte as bolinha e descubra o resultado</Text>

      <TipButton
        tip="Arraste as bolinhas para completar"
        style={mainStyles.tipButton}
        autoOpen={false}
      />

      <View style={styles.questionCard}>
        <View style={styles.questionEquation}>
          <View style={styles.numberGroup}>
            <Text style={styles.questionText}>{content.teste1}</Text>
            <View
              ref={dotsRef4}
              collapsable={false}
              onLayout={calculateDistance}
              style={[styles.dotsWrapper, { minHeight: scaled(70) }]}
            >
              {!placedFirst && (
                <GestureDetector gesture={dragGesture4}>
                  <Animated.View style={[animatedStyle4, styles.dotsColumns, { gap: dotGap }]}>
                    {renderDots(content.teste1, dotSize, dotGap, DOTS_PER_COLUMN)}
                  </Animated.View>
                </GestureDetector>
              )}
            </View>
          </View>

          <Text style={styles.operatorText}>+</Text>

          <View style={styles.numberGroup}>
            <Text style={styles.questionText}>{content.teste2}</Text>
            <View ref={dotsRef3} collapsable={false} style={[styles.dotsWrapper, { minHeight: scaled(70) }]}>
              {!placedSecond && (
                <GestureDetector gesture={dragGesture3}>
                  <Animated.View style={[animatedStyle3, styles.dotsColumns, { gap: dotGap }]}>
                    {renderDots(content.teste2, dotSize, dotGap, DOTS_PER_COLUMN)}
                  </Animated.View>
                </GestureDetector>
              )}
            </View>
          </View>

          <Text style={styles.operatorText}>=</Text>

          <View style={styles.targetGroup}>
            <View
              ref={targetRef}
              collapsable={false}
              style={[
                styles.targetBox,
                styles.targetDots,
                {
                  gap: dotGap,
                  minWidth: scaled(60),
                  minHeight: scaled(60),
                },
              ]}
            >
              {renderDots(resultTotal, dotSize, dotGap, resultPerColumn)}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.optionsRow}>
        {alternatives.map((alt) => (
          <TouchableOpacity
            key={alt.id}
            style={[
              styles.optionCard,
              alternativeId === alt.id && styles.optionCardSelected,
              wrongAlternativeId === alt.id && styles.optionCardWrong,
            ]}
            onPress={() => setAlternativeId(alt.id)}
            activeOpacity={0.8}
            disabled={!canAnswer}
          >
            <Text
              style={[
                styles.optionText,
                alternativeId === alt.id && styles.optionTextSelected,
                wrongAlternativeId === alt.id && styles.optionTextWrong,
              ]}
            >
              {alt.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          mainStyles.primaryButton,
          alternativeId === null ? mainStyles.primaryButtonDisabled : null,
        ]}
        onPress={handleConfirm}
        disabled={answering || alternativeId === null}
      >
        <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

function renderDots(amount: number, dotSize: object, gap: number, perColumn: number) {
  const columns = [];

  for (let start = 0; start < amount; start += perColumn) {
    const dotsInColumn = Math.min(perColumn, amount - start);

    columns.push(
      <View key={start} style={{ gap }}>
        {Array.from({ length: dotsInColumn }).map((dot, index) => (
          <View key={index} style={[styles.dotV, styles.dotVActive, dotSize]} />
        ))}
      </View>,
    );
  }

  return columns;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 10,
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
  dotsColumns: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    borderRadius: 12,
  },
  targetDots: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
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
  optionCardWrong: {
    borderColor: COLORS.DANGER,
    backgroundColor: "#fdecec",
  },
  optionTextWrong: {
    color: COLORS.DANGER,
  },
});
