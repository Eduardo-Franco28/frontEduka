import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useState, useEffect } from "react";
import useAppNavigation from "../hooks/useNavigation";
import mainStyles from "../styles/theme";
import TabBar from "../components/TabBar";
import CarrosselMaterias from "../components/CarrosselMaterias";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { listarMateriasAtividadeDoDia } from "../services/api";

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const { colors, fontScale } = useTheme();

  const user = useAuth();

  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarMateriasAtividadeDoDia(user.token);
        setMaterias(dados);
      } catch (erro) {
        console.log("Erro ao carregar matérias:", erro.message);
      }
    }
    carregar();
  }, []);

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
              Olá! {user.user?.nome} 👋
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.TEXT_MUTED, fontSize: 14 * fontScale }]}>
              Animado para aprender hoje?
            </Text>
          </View>
        </View>

        {/* Daily Activity Carousel */}
        <CarrosselMaterias
          materias={materias}
          colors={colors}
          fontScale={fontScale}
          onPressMateria={(item) => navigation.navigate("SubjectsScreen", { materiaId: item.id })}
        />

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