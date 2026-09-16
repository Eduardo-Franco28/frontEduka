import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
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

  const [openId, setOpenId] = useState<number | null>(null);

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

        <View style={[styles.summaryCard, { backgroundColor: colors.CARD }]}>
          <FontAwesomeFreeSolid name="trophy" size={20} color={colors.WARNING} />
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

        <Text
          style={[styles.hint, { color: colors.TEXT_MUTED, fontSize: 13 * fontScale }]}
        >
          Toque em uma matéria para ver o seu nível.
        </Text>

        {subjects.map((item) => (
          <SubjectRow
            key={item.id}
            subject={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
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

interface SubjectRowProps {
  subject: SubjectWithProgress;
  isOpen: boolean;
  onToggle: () => void;
  fontScale: number;
  isDark: boolean;
  cardColor: string;
  textColor: string;
  mutedColor: string;
  trackColor: string;
}

function SubjectRow({
  subject,
  isOpen,
  onToggle,
  fontScale,
  isDark,
  cardColor,
  textColor,
  mutedColor,
  trackColor,
}: SubjectRowProps) {
  const visual = getSubjectVisual(subject.name);

  const accent = isDark ? visual.gradient[1] : visual.gradient[0];
  const tint = accent + (isDark ? "26" : "1F");

  const percent =
    subject.totalTopics === 0
      ? 0
      : Math.round((subject.concludedTopics / subject.totalTopics) * 100);

  const levelIndex = getLevelIndex(percent);
  const currentLevel = levelIndex >= 0 ? ACHIEVEMENT_LEVELS[levelIndex] : null;
  const nextLevel = ACHIEVEMENT_LEVELS[levelIndex + 1] ?? null;
  const explainedLevel = currentLevel ?? ACHIEVEMENT_LEVELS[0];

  // Quantos tópicos ainda faltam para o próximo nível. Contar tópicos é mais
  // concreto do que falar em porcentagem.
  const topicsForNext = nextLevel
    ? Math.max(
        1,
        Math.ceil((nextLevel.minPercent / 100) * subject.totalTopics) -
          subject.concludedTopics
      )
    : 0;

  return (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={`${subject.name}, ${
          currentLevel ? `nível ${currentLevel.name}` : "não iniciado"
        }`}
        onPress={onToggle}
      >
        <View style={[styles.iconBox, { backgroundColor: tint }]}>
          <FontAwesomeFreeSolid name={visual.icon} size={20} color={accent} />
        </View>

        <View style={styles.rowInfo}>
          <Text
            style={[styles.subjectName, { color: textColor, fontSize: 16 * fontScale }]}
          >
            {subject.name}
          </Text>

          <View style={styles.levelRow}>
            <FontAwesomeFreeSolid
              name={explainedLevel.icon}
              size={11}
              color={currentLevel ? accent : mutedColor}
            />
            <Text
              style={[
                styles.levelTag,
                {
                  color: currentLevel ? accent : mutedColor,
                  fontSize: 13 * fontScale,
                },
              ]}
            >
              {currentLevel ? currentLevel.name : "Ainda não começou"}
            </Text>
          </View>

          <View style={[styles.track, { backgroundColor: trackColor }]}>
            <View
              style={[styles.trackFill, { backgroundColor: accent, width: `${percent}%` }]}
            />
          </View>
        </View>

        <FontAwesomeFreeSolid
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={14}
          color={mutedColor}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.detail, { backgroundColor: tint }]}>
          {/* Um selo por tópico: cheio = concluído, vazio = a conquistar */}
          <View style={styles.medalRow}>
            {Array.from({ length: subject.totalTopics }).map((_, index) => {
              const earned = index < subject.concludedTopics;
              return (
                <View
                  key={index}
                  style={[
                    styles.medal,
                    {
                      backgroundColor: earned ? accent : "transparent",
                      borderColor: earned ? accent : mutedColor,
                    },
                  ]}
                >
                  <FontAwesomeFreeSolid
                    name="star"
                    size={14}
                    color={earned ? "#fff" : mutedColor}
                  />
                </View>
              );
            })}
          </View>

          {/* Significado da palavra do nível atual */}
          <Text
            style={[styles.meaning, { color: textColor, fontSize: 13 * fontScale }]}
          >
            <Text style={styles.bold}>{explainedLevel.name}</Text> significa:{" "}
            {explainedLevel.meaning.charAt(0).toLowerCase() +
              explainedLevel.meaning.slice(1)}
          </Text>

          {/* Próximo nível como recompensa concreta */}
          {nextLevel ? (
            <View style={[styles.nextCard, { backgroundColor: cardColor }]}>
              <View style={[styles.nextIcon, { borderColor: accent }]}>
                <FontAwesomeFreeSolid name={nextLevel.icon} size={16} color={accent} />
              </View>
              <Text
                style={[styles.nextText, { color: textColor, fontSize: 13 * fontScale }]}
              >
                Falta{topicsForNext > 1 ? "m" : ""}{" "}
                <Text style={[styles.bold, { color: accent }]}>
                  {topicsForNext} tópico{topicsForNext > 1 ? "s" : ""}
                </Text>{" "}
                para o nível {nextLevel.name}
              </Text>
            </View>
          ) : (
            <View style={[styles.nextCard, { backgroundColor: cardColor }]}>
              <View style={[styles.nextIcon, { borderColor: accent }]}>
                <FontAwesomeFreeSolid name="crown" size={16} color={accent} />
              </View>
              <Text
                style={[styles.nextText, { color: textColor, fontSize: 13 * fontScale }]}
              >
                Você chegou ao nível máximo desta matéria!
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Resumo
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  summaryText: {
    flex: 1,
    fontWeight: "700",
  },
  hint: {
    marginBottom: 14,
    paddingHorizontal: 4,
    fontWeight: "500",
  },

  // Card da matéria
  card: {
    borderRadius: 18,
    marginBottom: 10,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: {
    flex: 1,
    gap: 4,
  },
  subjectName: {
    fontWeight: "700",
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  levelTag: {
    fontWeight: "700",
  },
  track: {
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4,
  },
  trackFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Detalhe
  detail: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  medalRow: {
    flexDirection: "row",
    gap: 8,
  },
  medal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  meaning: {
    lineHeight: 18,
    fontWeight: "500",
  },
  nextCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 10,
  },
  nextIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    flex: 1,
    lineHeight: 18,
    fontWeight: "600",
  },
});