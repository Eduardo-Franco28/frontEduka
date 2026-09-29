import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import useAppNavigation from "../hooks/useNavigation";
import mainStyles from "../styles/theme";
import TabBar from "../components/TabBar";
import SubjectCarousel from "../components/SubjectCarousel";
import ErrorMessage from "../components/ErrorMessage";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import useSubjectProgress, { SubjectWithProgress } from "../hooks/useSubjectProgress";
import useProgress from "../hooks/useProgress";

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const { colors, fontScale } = useTheme();
  const { user } = useAuth();

  const { getAll, subjects, error } = useSubjectProgress();
  const {
    getConcludedQuestions,
    getConcludedTopics,
    concludedQuestions,
    concludedTopics,
  } = useProgress();

  // Recarrega sempre que a tela volta ao foco: o aluno pode ter concluído uma
  // atividade e voltado pra Home, e os números têm que acompanhar.
  useFocusEffect(
    useCallback(() => {
      getAll();
      getConcludedQuestions();
      getConcludedTopics();
    }, []),
  );

  const handleSelectSubject = (item: SubjectWithProgress) => {
    // Com tópico pendente vai direto para a atividade; sem ele, mostra a lista.
    if (item.currentTopic) {
      navigation.navigate("ActivityScreen", { topicId: item.currentTopic.id });
      return;
    }
    navigation.navigate("TopicsScreen", {
      subjectId: item.id,
      subjectName: item.name,
    });
  };

  return (
    <View style={[mainStyles.component, { backgroundColor: colors.BG_APP }]}>
      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.avatarCircle, { borderColor: colors.PRIMARY, backgroundColor: colors.CARD }]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Ir para o perfil"
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Image
              source={require("../../assets/mascotePerfil.png")}
              style={styles.avatarImage}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY, fontSize: 22 * fontScale }]}>
              Olá {user?.nome} 👋
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.TEXT_MUTED, fontSize: 14 * fontScale }]}>
              Animado para aprender hoje?
            </Text>
          </View>
        </View>

        <ErrorMessage message={error} />

        <SubjectCarousel subjects={subjects} onPressSubject={handleSelectSubject} />

        {/* Progresso */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY, fontSize: 18 * fontScale }]}>
          Seu progresso
        </Text>

        <View
          style={[
            styles.progressCard,
            { backgroundColor: colors.CARD, borderColor: colors.BORDER_LIGHT },
          ]}
        >
          <View style={styles.progressTop}>
            <View style={styles.statsColumn}>
              <View style={[styles.statBox, { backgroundColor: colors.SURFACE_GREEN }]}>
                <Text style={[styles.statValue, { color: colors.SUCCESS, fontSize: 26 * fontScale }]}>
                  {concludedQuestions}
                </Text>
                <Text style={[styles.statLabel, { color: colors.TEXT_SUBTLE, fontSize: 12 * fontScale }]}>
                  atividades{"\n"}concluídas
                </Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.SURFACE_PRIMARY }]}>
                <Text style={[styles.statValue, { color: colors.PRIMARY, fontSize: 26 * fontScale }]}>
                  {concludedTopics}
                </Text>
                <Text style={[styles.statLabel, { color: colors.TEXT_SUBTLE, fontSize: 12 * fontScale }]}>
                  tópicos{"\n"}concluídos
                </Text>
              </View>
            </View>

            <Image
              source={require("../../assets/mascoteBracoCruzado.png")}
              style={styles.mascot}
            />
          </View>

          <TouchableOpacity
            style={[styles.achievementsButton, { backgroundColor: colors.SURFACE_YELLOW }]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Ver conquistas"
            onPress={() => navigation.navigate("AchievementsScreen")}
          >
            <FontAwesomeFreeSolid name="trophy" size={16} color={colors.WARNING} />
            <Text
              style={[
                styles.achievementsText,
                { color: colors.WARNING, fontSize: 16 * fontScale },
              ]}
            >
              Ver conquistas
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 92,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    flexShrink: 0,
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontWeight: "500",
  },

  // Section title
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
  },

  // Progresso
  progressCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
  },
  progressTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  statsColumn: {
    flex: 1,
    gap: 10,
  },
  statBox: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statValue: {
    fontWeight: "800",
    minWidth: 38,
  },
  statLabel: {
    flex: 1,
    fontWeight: "600",
    lineHeight: 15,
  },
  mascot: {
    width: 110,
    height: 130,
    resizeMode: "contain",
  },

  achievementsButton: {
    width: "100%",
    height: 52,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  achievementsText: {
    fontWeight: "700",
  },
});