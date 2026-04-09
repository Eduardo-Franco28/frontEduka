import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import mainStyles from "../styles/theme";

export default function HomeScreen() {
  return (
    <View style={mainStyles.component}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0ede8" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🦁</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Bom dia, Larry!</Text>
            <Text style={styles.headerSubtitle}>
              Você tem 3 atividades hoje
            </Text>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.cardTitle}>Progresso semanal</Text>
            <Text style={styles.progressCount}>4 / 7 dias</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "57%" }]} />
          </View>

          <View style={styles.daysRow}>
            <View style={[styles.dayBox, styles.dayBoxActive]} />
            <View style={[styles.dayBox, styles.dayBoxActive]} />
            <View style={[styles.dayBox, styles.dayBoxActive]} />
            <View style={[styles.dayBox, styles.dayBoxActive]} />
            <View style={[styles.dayBox, styles.dayBoxInactive]} />
            <View style={[styles.dayBox, styles.dayBoxInactive]} />
            <View style={[styles.dayBox, styles.dayBoxInactive]} />
          </View>

          <View style={styles.daysLabels}>
            <Text style={styles.dayLabel}>Seg</Text>
            <Text style={styles.dayLabel}>Dom</Text>
          </View>
        </View>

        {/* Subjects */}
        <Text style={styles.sectionTitle}>Suas matérias</Text>

        {/* Matemática */}
        <View style={styles.card}>
          <View style={styles.subjectRow}>
            <View
              style={[styles.subjectIconBox, { backgroundColor: "#e8f0f8" }]}
            >
              <Text style={styles.subjectIcon}>📐</Text>
            </View>
            <View style={styles.subjectInfo}>
              <View style={styles.subjectTopRow}>
                <Text style={styles.subjectName}>Matemática</Text>
                <Text style={[styles.subjectPercent, { color: "#5b82b5" }]}>
                  80%
                </Text>
              </View>
              <Text style={styles.subjectActivities}>8 de 10 atividades</Text>
              <View style={styles.subjectBarBg}>
                <View
                  style={[
                    styles.subjectBarFill,
                    { width: "80%", backgroundColor: "#5b82b5" },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Ciências da Natureza */}
        <View style={styles.card}>
          <View style={styles.subjectRow}>
            <View
              style={[styles.subjectIconBox, { backgroundColor: "#e0f4ec" }]}
            >
              <Text style={styles.subjectIcon}>✏️</Text>
            </View>
            <View style={styles.subjectInfo}>
              <View style={styles.subjectTopRow}>
                <Text style={styles.subjectName}>Ciências da Natureza</Text>
                <Text style={[styles.subjectPercent, { color: "#3da678" }]}>
                  50%
                </Text>
              </View>
              <Text style={styles.subjectActivities}>5 de 10 atividades</Text>
              <View style={styles.subjectBarBg}>
                <View
                  style={[
                    styles.subjectBarFill,
                    { width: "50%", backgroundColor: "#3da678" },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Linguagens */}
        <View style={styles.card}>
          <View style={styles.subjectRow}>
            <View
              style={[styles.subjectIconBox, { backgroundColor: "#f5ece0" }]}
            >
              <Text style={styles.subjectIcon}>📚</Text>
            </View>
            <View style={styles.subjectInfo}>
              <View style={styles.subjectTopRow}>
                <Text style={styles.subjectName}>Linguagens</Text>
                <Text style={[styles.subjectPercent, { color: "#c47d2e" }]}>
                  30%
                </Text>
              </View>
              <Text style={styles.subjectActivities}>3 de 10 atividades</Text>
              <View style={styles.subjectBarBg}>
                <View
                  style={[
                    styles.subjectBarFill,
                    { width: "30%", backgroundColor: "#c47d2e" },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <View style={styles.tabItem}>
          <Text style={styles.tabIconActive}>🏠</Text>
          <Text style={styles.tabLabelActive}>Início</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>📋</Text>
          <Text style={styles.tabLabel}>Trajetória</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>Perfil</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Header
  header: {
    backgroundColor: "#5b82b5",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#e8a83a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.82)",
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },

  // Weekly Progress
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3340",
  },
  progressCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5b82b5",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#e8e5de",
    borderRadius: 100,
    marginBottom: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#5b82b5",
    borderRadius: 100,
  },
  daysRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  dayBox: {
    flex: 1,
    height: 36,
    borderRadius: 10,
  },
  dayBoxActive: {
    backgroundColor: "#5b82b5",
  },
  dayBoxInactive: {
    backgroundColor: "#e8e5de",
  },
  daysLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayLabel: {
    fontSize: 11,
    color: "#9a9a8e",
  },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3340",
    marginBottom: 8,
    marginTop: 6,
    paddingHorizontal: 4,
  },

  // Subject cards
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  subjectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  subjectIcon: {
    fontSize: 20,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d3340",
  },
  subjectPercent: {
    fontSize: 13,
    fontWeight: "600",
  },
  subjectActivities: {
    fontSize: 12,
    color: "#9a9a8e",
    marginBottom: 8,
  },
  subjectBarBg: {
    height: 6,
    backgroundColor: "#e8e5de",
    borderRadius: 100,
  },
  subjectBarFill: {
    height: "100%",
    borderRadius: 100,
  },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e0ddd7",
    paddingVertical: 10,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.45,
  },
  tabIconActive: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 11,
    color: "#9a9a8e",
  },
  tabLabelActive: {
    fontSize: 11,
    color: "#5b82b5",
    fontWeight: "600",
  },
});
