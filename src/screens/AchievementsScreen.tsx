import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import mainStyles from "../styles/theme";
import Header from "../components/Header";
import TabBar from "../components/TabBar";
import ErrorMessage from "../components/ErrorMessage";
import LoadingPage from "../components/LoadingPage";
import useTheme from "../hooks/useTheme";
import useSubjectProgress, { SubjectWithProgress } from "../hooks/useSubjectProgress";
import { getSubjectVisual } from "../constants/subjectVisuals";
import { ACHIEVEMENT_LEVELS, getLevelIndex } from "../constants/achievementLevels";

export default function AchievementsScreen() {
  const { colors, fontScale, isDark } = useTheme();
  const { getAll, subjects, loading, error } = useSubjectProgress();

  useEffect(() => {
    getAll();
  }, []);

  if (loading && subjects.length === 0) {
    return <LoadingPage message="Carregando suas conquistas..." />;
  }

  const masteredCount = subjects.filter(
    (item) => item.totalTopics > 0 && item.concludedTopics === item.totalTopics
  ).length;

  return (
    <SafeAreaView
      style={[mainStyles.component, { backgroundColor: colors.BG_APP }]}
      edges={["top"]}
    >
      <Header title="Conquistas" />

      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={mainStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={error} />

        <Text
          style={[
            styles.intro,
            { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale },
          ]}
        >
          Cada matéria tem cinco níveis. Quanto mais tópicos você conclui, mais
          alto você chega.
        </Text>

        <View style={[styles.summaryCard, { backgroundColor: colors.CARD }]}>
          <FontAwesomeFreeSolid name="trophy" size={22} color={colors.WARNING} />
          <Text
            style={[
              styles.summaryText,
              { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale },
            ]}
          >
            {masteredCount === 0
              ? "Nenhuma matéria dominada ainda"
              : `${masteredCount} de ${subjects.length} matérias dominadas`}
          </Text>
        </View>

        {subjects.map((item) => (
          <SubjectThermometer
            key={item.id}
            subject={item}
            fontScale={fontScale}
            isDark={isDark}
            cardColor={colors.CARD}
            textColor={colors.TEXT_PRIMARY}
            mutedColor={colors.TEXT_MUTED}
            trackColor={colors.SURFACE_LOCKED}
          />
        ))}
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
}

interface SubjectThermometerProps {
  subject: SubjectWithProgress;
  fontScale: number;
  isDark: boolean;
  cardColor: string;
  textColor: string;
  mutedColor: string;
  trackColor: string;
}

function SubjectThermometer({
  subject,
  fontScale,
  isDark,
  cardColor,
  textColor,
  mutedColor,
  trackColor,
}: SubjectThermometerProps) {
  const visual = getSubjectVisual(subject.name);

  // No escuro o tom claro do gradiente contrasta melhor; no claro, o tom
  // escuro. O fundo usa a mesma cor com transparência, então funciona nos dois.
  const accent = isDark ? visual.gradient[1] : visual.gradient[0];
  const tint = accent + (isDark ? "26" : "1F");

  const percent =
    subject.totalTopics === 0
      ? 0
      : Math.round((subject.concludedTopics / subject.totalTopics) * 100);

  const levelIndex = getLevelIndex(percent);
  const currentLevel = levelIndex >= 0 ? ACHIEVEMENT_LEVELS[levelIndex] : null;
  const nextLevel = ACHIEVEMENT_LEVELS[levelIndex + 1] ?? null;

  // O nível é sempre apresentado como algo que o aluno alcançou, nunca como
  // um traço de personalidade dele.
  const headline = currentLevel
    ? `Você chegou ao nível ${currentLevel.name}!`
    : `Conclua um tópico para chegar ao nível ${ACHIEVEMENT_LEVELS[0].name}`;

  const explainedLevel = currentLevel ?? ACHIEVEMENT_LEVELS[0];

  return (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      {/* Cabeçalho da matéria */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: tint }]}>
          <FontAwesomeFreeSolid name={visual.icon} size={22} color={accent} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text
            style={[styles.subjectName, { color: textColor, fontSize: 17 * fontScale }]}
          >
            {subject.name}
          </Text>
          <Text
            style={[styles.subjectMeta, { color: mutedColor, fontSize: 12 * fontScale }]}
          >
            {subject.concludedTopics} de {subject.totalTopics} tópicos
          </Text>
        </View>
        <Text style={[styles.percent, { color: accent, fontSize: 18 * fontScale }]}>
          {percent}%
        </Text>
      </View>

      {/* Termômetro */}
      <View style={styles.thermometer}>
        <View style={[styles.track, { backgroundColor: trackColor }]} />
        <View
          style={[
            styles.trackFill,
            {
              backgroundColor: accent,
              width:
                levelIndex < 0
                  ? 0
                  : `${(levelIndex / (ACHIEVEMENT_LEVELS.length - 1)) * 100}%`,
            },
          ]}
        />

        {ACHIEVEMENT_LEVELS.map((level, index) => {
          const reached = index <= levelIndex;
          const isCurrent = index === levelIndex;

          return (
            <View key={level.name} style={styles.step}>
              <View
                style={[
                  styles.stepMark,
                  { backgroundColor: reached ? accent : trackColor },
                  isCurrent && styles.stepMarkCurrent,
                  isCurrent && { borderColor: tint },
                ]}
              >
                <FontAwesomeFreeSolid
                  name={level.icon}
                  size={12}
                  color={reached ? "#fff" : mutedColor}
                />
              </View>
              <Text
                style={[
                  styles.stepName,
                  {
                    color: reached ? textColor : mutedColor,
                    fontWeight: isCurrent ? "800" : "500",
                    fontSize: 10 * fontScale,
                  },
                ]}
                numberOfLines={1}
              >
                {level.name}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Nível atual, o significado da palavra e o que vem depois */}
      <View style={[styles.levelBox, { backgroundColor: tint }]}>
        <View style={styles.levelHeader}>
          <FontAwesomeFreeSolid name={explainedLevel.icon} size={18} color={accent} />
          <Text style={[styles.levelName, { color: accent, fontSize: 16 * fontScale }]}>
            {headline}
          </Text>
        </View>

        <Text style={[styles.levelMeaning, { color: textColor, fontSize: 13 * fontScale }]}>
          <Text style={styles.levelWord}>{explainedLevel.name}</Text> significa:{" "}
          {explainedLevel.meaning.charAt(0).toLowerCase() + explainedLevel.meaning.slice(1)}
        </Text>

        {nextLevel && (
          <View style={styles.nextLevelRow}>
            <FontAwesomeFreeSolid name={nextLevel.icon} size={12} color={mutedColor} />
            <Text
              style={[styles.nextLevel, { color: mutedColor, fontSize: 12 * fontScale }]}
            >
              Chegue a {nextLevel.minPercent}% para alcançar o nível {nextLevel.name}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginBottom: 16,
    paddingHorizontal: 4,
    lineHeight: 21,
    fontWeight: "500",
  },

  // Resumo
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  summaryText: {
    flex: 1,
    fontWeight: "700",
  },

  // Card da matéria
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: {
    flex: 1,
  },
  subjectName: {
    fontWeight: "700",
    marginBottom: 2,
  },
  subjectMeta: {
    fontWeight: "500",
  },
  percent: {
    fontWeight: "800",
  },

  // Termômetro
  thermometer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingHorizontal: 2,
  },
  // Trilho e preenchimento ficam atrás das marcas
  track: {
    position: "absolute",
    top: 12,
    left: 14,
    right: 14,
    height: 3,
    borderRadius: 2,
  },
  trackFill: {
    position: "absolute",
    top: 12,
    left: 14,
    height: 3,
    borderRadius: 2,
  },
  step: {
    alignItems: "center",
    width: 62,
    gap: 6,
  },
  stepMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  stepMarkCurrent: {
    borderWidth: 3,
  },
  stepName: {
    textAlign: "center",
  },

  // Nível atual
  levelBox: {
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelName: {
    flex: 1,
    fontWeight: "800",
  },
  levelMeaning: {
    lineHeight: 18,
    fontWeight: "500",
  },
  levelWord: {
    fontWeight: "800",
  },
  nextLevelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  nextLevel: {
    flex: 1,
    fontWeight: "600",
  },
});