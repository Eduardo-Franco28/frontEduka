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
import { COLORS } from "../styles/colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import useTopic from "../hooks/useTopic";
import { useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import LoadingPage from "../components/LoadingPage";
import useAppNavigation from "../hooks/useNavigation";

export default function TopicsScreen() {
  const navigator = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "TopicsScreen">>();

  const { subjectId, subjectName } = route.params;

  const { getBySubject, loading, error, topic } = useTopic();

  useEffect(() => {
    getBySubject(subjectId);
  }, []);

  const handleActivity = (id: number) =>{
    if(id === null) return;

    navigator.navigate("ActivityScreen", { topicId: id });
  }

  if (loading) {
    return <LoadingPage message="Carregando tópicos..." />;
  }

  return (
    <SafeAreaView style={mainStyles.component}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subjectName}</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={error} />

        {/* Bubble */}
        <View style={styles.bubble}>
          <Text style={styles.bubbleEmoji}>🦁</Text>
          <Text style={styles.bubbleText}>
            Escolha um tópico para estudar. Os ✓ já foram concluídos — ótimo
            trabalho!
          </Text>
        </View>

        {/* Section title */}
        
        <Text style={styles.sectionTitle}>Seus tópicos</Text>

        {topic?.map((item) => {
          return (
            <TouchableOpacity style={styles.card} activeOpacity={0.8} key={item.id} onPress={() => handleActivity(item.id)}>
              <View style={[styles.badge, styles.badgeComplete]}>
                <Text style={styles.badgeIcon}>{item.status}</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>{item.title}</Text>
                <Text style={styles.topicMeta}>{item.subTitle}</Text>
              </View>
              <View style={[styles.pill, styles.pillComplete]}>
                <Text style={[styles.pillText, styles.pillTextComplete]}>{item.percentConclued}%</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: COLORS.BG_WARM,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  headerPlaceholder: {
    width: 36,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // Bubble
  bubble: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 20,
  },
  bubbleEmoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  bubbleText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  // Badge (circle left)
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badgeComplete: {
    backgroundColor: COLORS.SUCCESS,
  },
  badgeInProgress: {
    backgroundColor: COLORS.INFO,
  },
  badgeLocked: {
    backgroundColor: COLORS.SURFACE_LOCKED,
  },
  badgeIcon: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  badgeNumber: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "700",
  },
  badgeNumberLocked: {
    fontSize: 15,
    color: COLORS.TEXT_MUTED,
    fontWeight: "600",
  },

  // Topic info
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 3,
  },
  topicMeta: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },

  // Pill (right badge)
  pill: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  pillComplete: {
    backgroundColor: COLORS.SURFACE_GREEN,
  },
  pillInProgress: {
    backgroundColor: COLORS.SURFACE_BLUE_PILL,
  },
  pillLocked: {
    backgroundColor: COLORS.SURFACE_LOCKED_PILL,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  pillTextComplete: {
    color: COLORS.SUCCESS,
  },
  pillTextInProgress: {
    color: COLORS.INFO,
  },
  pillTextLocked: {
    color: COLORS.TEXT_MUTED,
  },
});
