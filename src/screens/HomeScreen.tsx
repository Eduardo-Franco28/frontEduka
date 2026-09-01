import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import useAppNavigation from "../hooks/useNavigation";
import mainStyles from "../styles/theme";
import TabBar from "../components/TabBar";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const { colors, fontScale } = useTheme();

  const user = useAuth();

  return (
    <View style={[mainStyles.component, { backgroundColor: colors.BG_APP }]}>
      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY, fontSize: 22 * fontScale }]}>
              Olá {user.user?.nome} 👋
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.TEXT_MUTED, fontSize: 14 * fontScale }]}>
              Pronto para aprender hoje?
            </Text>
          </View>
        </View>

        {/* Daily Activity Card */}
        <View style={[styles.dailyCard, { backgroundColor: colors.PRIMARY_LIGHT }]}>
          <Text style={[styles.dailyLabel, { fontSize: 12 * fontScale }]}>ATIVIDADE DO DIA</Text>

          <View style={styles.dailySubject}>
            <View style={styles.dailyIconBox}>
              <Text style={styles.dailyIcon}>📐</Text>
            </View>
            <View>
              <Text style={[styles.dailySubjectName, { fontSize: 20 * fontScale }]}>Matemática</Text>
              <Text style={[styles.dailySubjectDesc, { fontSize: 14 * fontScale }]}>Contagem de objetos</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.dailyButton, { backgroundColor: colors.CARD }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("SubjectsScreen")}
          >
            <Text style={[styles.dailyButtonText, { color: colors.PRIMARY_LIGHT, fontSize: 17 * fontScale }]}>
              ▶ Continuar matérias
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue studying */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY, fontSize: 18 * fontScale }]}>
          Continue seus estudos
        </Text>

        <View
          style={[
            styles.continueCard,
            { backgroundColor: colors.CARD, borderColor: colors.BORDER_LIGHT },
          ]}
        >
          <View style={styles.continueTop}>
            <View style={[styles.continueIconBox, { backgroundColor: colors.BG_WARM }]}>
              <Text style={styles.continueIcon}>📚</Text>
            </View>
            <View style={styles.continueMascotBox}>
              <Image source={require("../../assets/mascoteBracoCruzado.png")} style={styles.continueMascotEmoji} />
            </View>
            <View></View>
          </View>

          <TouchableOpacity
            style={mainStyles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("ActivityScreen2", { topicId: 101 })}
          >
            <Text style={mainStyles.primaryButtonText}>▶ Continuar jornada</Text>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontWeight: "500",
  },

  // Daily Activity Card
  dailyCard: {
    height: 280,
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },
  dailyLabel: {
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.2,
    marginBottom: 34,
  },
  dailySubject: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  dailyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  dailyIcon: {
    fontSize: 26,
  },
  dailySubjectName: {
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  dailySubjectDesc: {
    color: "rgba(255,255,255,0.75)",
  },
  dailyButton: {
    width: "100%",
    height: 60,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  dailyButtonText: {
    fontWeight: "700",
  },

  // Section title
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
  },

  // Continue Card
  continueCard: {
    height: 280,
    borderRadius: 22,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
  },
  continueTop: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 16,
    minHeight: 100,
  },
  continueIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  continueIcon: {
    fontSize: 26,
  },
  continueMascotBox: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 38,
  },
  continueMascotEmoji: {
    width: 150,
    height: 170,
  },
});