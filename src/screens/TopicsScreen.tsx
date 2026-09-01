import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "../styles/theme";
import TabBar from "../components/TabBar";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import useTopic from "../hooks/useTopic";
import { useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import LoadingPage from "../components/LoadingPage";
import useAppNavigation from "../hooks/useNavigation";
import useTheme from "../hooks/useTheme";
import { TopicStatus } from "../enums/TopicStatusEnum";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { getSubjectVisual } from "../constants/subjectVisuals";
import { ThemeColors } from "../styles/colors";

function getStatusVisuals(status: TopicStatus, colors: ThemeColors) {
  switch (status) {
    case TopicStatus.CONCLUIDO:
      return {
        badgeColor: colors.SUCCESS,
        pillColor: colors.SURFACE_GREEN,
        pillTextColor: colors.SUCCESS,
        icon: "check" as const,
        iconColor: "#fff",
      };
    case TopicStatus.EM_ANDAMENTO:
      return {
        badgeColor: colors.INFO,
        pillColor: colors.SURFACE_BLUE_PILL,
        pillTextColor: colors.INFO,
        icon: "pen" as const,
        iconColor: "#fff",
      };
    case TopicStatus.NAO_INICIADO:
    default:
      return {
        badgeColor: colors.SURFACE_LOCKED,
        pillColor: colors.SURFACE_LOCKED_PILL,
        pillTextColor: colors.TEXT_MUTED,
        icon: "lock" as const,
        iconColor: colors.TEXT_MUTED,
      };
  }
}

export default function TopicsScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "TopicsScreen">>();
  const { colors, fontScale } = useTheme();

  const { subjectId, subjectName } = route.params;

  const { getBySubject, loading, error, topic } = useTopic();

  const subjectVisual = getSubjectVisual(subjectName);

  const hasConcluded =
    topic?.some((item) => item.status === TopicStatus.CONCLUIDO) ?? false;

  const concludedCount =
    topic?.filter((item) => item.status === TopicStatus.CONCLUIDO).length ?? 0;

  useEffect(() => {
    getBySubject(subjectId);
  }, []);

  const handleActivity = (id: number) => {
    if (id === null) return;

    navigation.navigate("ActivityScreen2", { topicId: id });
  };

  if (loading) {
    return <LoadingPage message="Carregando tópicos..." />;
  }

  return (
    <SafeAreaView
      style={[mainStyles.component, { backgroundColor: colors.BG_APP }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: subjectVisual.bg }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.CARD }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <FontAwesomeFreeSolid
              name="arrow-left"
              size={16}
              color={colors.TEXT_PRIMARY}
            />
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.headerCenter}>
          <View
            style={[
              styles.headerIconBox,
              { borderColor: subjectVisual.color, backgroundColor: colors.CARD },
            ]}
          >
            <FontAwesomeFreeSolid
              name={subjectVisual.icon}
              size={34}
              color={subjectVisual.color}
            />
          </View>
          <Text
            style={[
              styles.headerTitle,
              { color: subjectVisual.color, fontSize: 32 * fontScale },
            ]}
          >
            {subjectName}
          </Text>
          <View style={[styles.headerBadge, { backgroundColor: colors.CARD }]}>
            <Text
              style={[
                styles.headerBadgeText,
                { color: subjectVisual.color, fontSize: 13 * fontScale },
              ]}
            >
              {concludedCount} de {topic?.length ?? 0} concluídos
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={error} />

        <Text
          style={[
            styles.message,
            { color: colors.TEXT_SUBTLE, fontSize: 15 * fontScale },
          ]}
        >
          {hasConcluded ? "Ótimo trabalho, continue assim!" : "Hora de aprender!"}
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.TEXT_PRIMARY, fontSize: 16 * fontScale },
          ]}
        >
          Seus tópicos
        </Text>

        {topic?.map((item) => {
          const { badgeColor, pillColor, pillTextColor, icon, iconColor } =
            getStatusVisuals(item.status, colors);
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.CARD }]}
              activeOpacity={0.8}
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.percentConclued}% concluído`}
              onPress={() => handleActivity(item.id)}
            >
              <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <FontAwesomeFreeSolid name={icon} size={16} color={iconColor} />
              </View>
              <View style={styles.topicInfo}>
                <Text
                  style={[
                    styles.topicName,
                    { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.topicMeta,
                    { color: colors.TEXT_MUTED, fontSize: 12 * fontScale },
                  ]}
                >
                  {item.subTitle}
                </Text>
              </View>
              <View style={[styles.pill, { backgroundColor: pillColor }]}>
                <Text
                  style={[
                    styles.pillText,
                    { color: pillTextColor, fontSize: 12 * fontScale },
                  ]}
                >
                  {item.percentConclued}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCenter: {
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  headerIconBox: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerBadge: {
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  headerBadgeText: {
    fontWeight: "700",
  },
  headerPlaceholder: {
    width: 40,
  },

  scrollContent: {
    paddingTop: 20,
  },

  message: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontWeight: "600",
    marginBottom: 3,
  },
  topicMeta: {
    fontWeight: "500",
  },

  pill: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  pillText: {
    fontWeight: "700",
  },
});