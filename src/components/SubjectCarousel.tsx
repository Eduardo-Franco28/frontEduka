import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { getSubjectVisual } from "../constants/subjectVisuals";
import { SubjectWithProgress } from "../hooks/useSubjectProgress";
import useTheme from "../hooks/useTheme";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 290;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

interface SubjectCarouselProps {
  subjects: Array<SubjectWithProgress>;
  onPressSubject: (subject: SubjectWithProgress) => void;
}

export default function SubjectCarousel({ subjects, onPressSubject }: SubjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const listRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { colors, fontScale } = useTheme();

  if (subjects.length === 0) return null;

  const goTo = (index: number) => {
    if (index < 0 || index > subjects.length - 1) return;

    listRef.current?.scrollToOffset({
      offset: index * SNAP_INTERVAL,
      animated: true,
    });
    setActiveIndex(index);
  };

  const isFirst = activeIndex === 0;
  const isLastCard = activeIndex === subjects.length - 1;

  return (
    <View style={styles.wrapper}>
      <Animated.FlatList
        ref={listRef}
        data={subjects}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        keyExtractor={(item: SubjectWithProgress) => String(item.id)}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event: any) => {
          setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL));
        }}
        renderItem={({ item, index }: { item: SubjectWithProgress; index: number }) => {
          const visual = getSubjectVisual(item.name);
          const isLast = index === subjects.length - 1;
          const topic = item.currentTopic;
          const waiting = !item.progressLoaded;
          const finished = item.progressLoaded && topic === null;

          const inputRange = [
            (index - 1) * SNAP_INTERVAL,
            index * SNAP_INTERVAL,
            (index + 1) * SNAP_INTERVAL,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.92, 1, 0.92],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.55, 1, 0.55],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={{
                width: CARD_WIDTH,
                marginRight: isLast ? 0 : CARD_GAP,
                transform: [{ scale }],
                opacity,
              }}
            >
              <LinearGradient
                colors={visual.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={styles.blobLarge} pointerEvents="none" />
                <View style={styles.blobSmall} pointerEvents="none" />

                {/* Matéria */}
                <View style={styles.subjectRow}>
                  <View style={styles.iconBox}>
                    <FontAwesomeFreeSolid name={visual.icon} size={26} color="#fff" />
                  </View>
                  <View style={styles.subjectInfo}>
                    <Text style={[styles.subjectName, { fontSize: 20 * fontScale }]}>
                      {item.name}
                    </Text>
                    {!waiting && (
                      <Text style={[styles.subjectMeta, { fontSize: 12 * fontScale }]}>
                        {item.concludedTopics} de {item.totalTopics} tópicos
                      </Text>
                    )}
                  </View>
                </View>

                {/* Tópico atual */}
                <View style={styles.topicBox}>
                  {waiting && (
                    <View style={styles.waitingRow}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={[styles.waitingText, { fontSize: 14 * fontScale }]}>
                        Carregando seu progresso...
                      </Text>
                    </View>
                  )}

                  {finished && (
                    <Text style={[styles.topicTitle, { fontSize: 17 * fontScale }]}>
                      Tudo concluído por aqui! 🎉
                    </Text>
                  )}

                  {!waiting && topic !== null && (
                    <>
                      <Text style={[styles.topicLabel, { fontSize: 11 * fontScale }]}>
                        CONTINUE EM
                      </Text>
                      <Text
                        style={[styles.topicTitle, { fontSize: 17 * fontScale }]}
                        numberOfLines={1}
                      >
                        {topic.title}
                      </Text>

                      <View style={styles.progressRow}>
                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${topic.percentConclued}%` },
                            ]}
                          />
                        </View>
                        <Text style={[styles.progressText, { fontSize: 12 * fontScale }]}>
                          {topic.percentConclued}%
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.CARD }]}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir ${item.name}`}
                  onPress={() => onPressSubject(item)}
                >
                  <FontAwesomeFreeSolid
                    name={finished ? "rotate-right" : "play"}
                    size={14}
                    color={visual.gradient[0]}
                  />
                  <Text
                    style={[
                      styles.buttonText,
                      { color: visual.gradient[0], fontSize: 16 * fontScale },
                    ]}
                  >
                    {waiting ? "Ver tópicos" : finished ? "Revisar matéria" : "Continuar"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          );
        }}
      />

      <View style={styles.arrowsLayer} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.arrow, { backgroundColor: colors.CARD }, isFirst && styles.arrowHidden]}
          activeOpacity={0.7}
          disabled={isFirst}
          accessibilityRole="button"
          accessibilityLabel="Matéria anterior"
          onPress={() => goTo(activeIndex - 1)}
        >
          <FontAwesomeFreeSolid name="chevron-left" size={16} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrow, { backgroundColor: colors.CARD }, isLastCard && styles.arrowHidden]}
          activeOpacity={0.7}
          disabled={isLastCard}
          accessibilityRole="button"
          accessibilityLabel="Próxima matéria"
          onPress={() => goTo(activeIndex + 1)}
        >
          <FontAwesomeFreeSolid name="chevron-right" size={16} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.dots}>
        {subjects.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Ir para ${item.name}`}
            onPress={() => goTo(index)}
          >
            <View
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
                {
                  backgroundColor:
                    index === activeIndex
                      ? getSubjectVisual(subjects[activeIndex].name).gradient[0]
                      : colors.BORDER_WARM,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
  },

  blobLarge: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -70,
    right: -50,
  },
  blobSmall: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: 60,
    left: -30,
  },

  // Matéria
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  subjectMeta: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },

  // Tópico
  topicBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 14,
    marginBottom: "auto",
    minHeight: 86,
    justifyContent: "center",
  },
  topicLabel: {
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  topicTitle: {
    fontWeight: "700",
    color: "#fff",
  },
  waitingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  waitingText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  progressText: {
    fontWeight: "700",
    color: "#fff",
  },

  button: {
    width: "100%",
    height: 54,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
  },
  buttonText: {
    fontWeight: "700",
  },

  arrowsLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  arrow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  arrowHidden: {
    opacity: 0,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
  },
});