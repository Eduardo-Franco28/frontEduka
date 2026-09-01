import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "../styles/theme";
import useSubject from "../hooks/useSubject";
import ErrorMessage from "../components/ErrorMessage";
import TabBar from "../components/TabBar";
import useAppNavigation from "../hooks/useNavigation";
import useTheme from "../hooks/useTheme";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { getSubjectVisual } from "../constants/subjectVisuals";

export default function SubjectsScreen() {
  const { loading, subject, getAll, error } = useSubject();
  const { colors, fontScale } = useTheme();

  const navigation = useAppNavigation();

  const handleSelectSubject = (id: number, subject: string) => {
    if (id === null) return;

    navigation.navigate("TopicsScreen", { subjectId: id, subjectName: subject });
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <SafeAreaView
      style={[mainStyles.component, { backgroundColor: colors.BG_APP }]}
      edges={["top"]}
    >
      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={error} />

        {/* Step dots */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, { backgroundColor: colors.BORDER_WARM }]} />
          <View style={[styles.dot, { backgroundColor: colors.BORDER_WARM }]} />
          <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.PRIMARY }]} />
        </View>

        {/* Icon + Title */}
        <Text style={styles.titleEmoji}>📚</Text>
        <Text
          style={[
            styles.title,
            { color: colors.TEXT_PRIMARY, fontSize: 28 * fontScale },
          ]}
        >
          O que vamos{"\n"}aprender hoje?
        </Text>

        {/* Grid */}
        <View style={styles.grid}>
          {subject?.map((item) => {
            const visual = getSubjectVisual(item.name);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors.CARD }]}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={item.name}
                onPress={() => handleSelectSubject(item.id, item.name)}
              >
                <View style={[styles.cardIconBox, { backgroundColor: visual.bg }]}>
                  <FontAwesomeFreeSolid name={visual.icon} size={28} color={visual.color} />
                </View>
                <Text
                  style={[
                    styles.cardLabel,
                    { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 52,
    alignItems: "center",
  },

  // Step dots
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 24,
    borderRadius: 5,
  },

  // Title
  titleEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 28,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
  },

  // Card
  card: {
    width: "47%",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    gap: 10,
  },
  cardIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontWeight: "600",
  },
});