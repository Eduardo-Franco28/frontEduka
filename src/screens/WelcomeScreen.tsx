import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import useAppNavigation from "../hooks/useNavigation";
import useAuth from "../hooks/useAuth";
import { COLORS } from "../styles/colors";

/**
 * A tela logo depois do carregamento. Mantém o mesmo gradiente e o mesmo
 * mascote da SplashLoading: o que muda é o convite para tocar.
 *
 * Nada acontece sozinho aqui — quem decide quando avançar é o aluno.
 */
export default function WelcomeScreen() {
  const navigation = useAppNavigation();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigation.replace("HomeScreen");
    } else {
      navigation.replace("FirstScreen");
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
      style={styles.gradient}
    >
      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Toque para começar"
        onPress={handleGetStarted}
      >
        <View style={styles.content}>
          <Image
            source={require("../../assets/mascote.png")}
            style={styles.mascot}
          />

          <Text style={styles.title}>IntegraMente</Text>
          <Text style={styles.subtitle}>Aprender do seu jeito</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.tapPill}>
            <Text style={styles.tapText}>Toque para começar</Text>
          </View>

          <View style={styles.rowBalls}>
            <View style={styles.stretchedBall} />
            <View style={styles.ball} />
            <View style={styles.ball} />
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  touchArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  mascot: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffffb0",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 56,
    alignItems: "center",
    gap: 20,
  },
  tapPill: {
    backgroundColor: "#ffffff26",
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#ffffff59",
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  tapText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  rowBalls: {
    flexDirection: "row",
    gap: 8,
  },
  ball: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffffffb0",
  },
  stretchedBall: {
    width: 26,
    height: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
});