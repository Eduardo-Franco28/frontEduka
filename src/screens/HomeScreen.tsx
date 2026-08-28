import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import useAppNavigation from "../hooks/useNavigation";
import mainStyles from "../styles/theme";
import TabBar from "../components/TabBar";
import { COLORS } from "../styles/colors";
import useAuth from "../hooks/useAuth";

export default function HomeScreen() {
  const navigation = useAppNavigation();

  const user = useAuth();

  return (
    <View style={mainStyles.component}>
      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Olá {user.user?.nome} 👋</Text>
            <Text style={styles.headerSubtitle}>Pronto para aprender hoje?</Text>
          </View>
        </View>

        {/* Daily Activity Card */}
        <View style={styles.dailyCard}>
          <Text style={styles.dailyLabel}>ATIVIDADE DO DIA</Text>

          <View style={styles.dailySubject}>
            <View style={styles.dailyIconBox}>
              <Text style={styles.dailyIcon}>📐</Text>
            </View>
            <View>
              <Text style={styles.dailySubjectName}>Matemática</Text>
              <Text style={styles.dailySubjectDesc}>Contagem de objetos</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.dailyButton} activeOpacity={0.85}>
            <Text style={styles.dailyButtonText}>▶ Continuar matérias</Text>
          </TouchableOpacity>
        </View>

        {/* Continue studying */}
        <Text style={styles.sectionTitle}>Continue seus estudos</Text>

        <View style={styles.continueCard}>
          <View style={styles.continueTop}>
            <View style={styles.continueIconBox}>
              <Text style={styles.continueIcon}>📚</Text>
            </View>
            <View style={styles.continueMascotBox}>
              <Image source={require("../../assets/mascoteBracoCruzado.png")} style={styles.continueMascotEmoji} />
            </View>
            <View></View>
          </View>

          <TouchableOpacity style={mainStyles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate("ActivityScreen")}>
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
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
  headerMascot: {
    fontSize: 36,
  },

  // Daily Activity Card
  dailyCard: {
    height: 280,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },
  dailyLabel: {
    fontSize: 12,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  dailySubjectDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
  },
  dailyButton: {
   width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  dailyButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.PRIMARY_LIGHT,
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },

  // Continue Card
  continueCard: {
    height: 280,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.BORDER_LIGHT,
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
    backgroundColor: COLORS.BG_WARM,
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
