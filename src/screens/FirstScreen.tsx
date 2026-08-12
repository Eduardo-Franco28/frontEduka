import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import mainStyles from "../styles/theme";
import useAppNavigation from "../hooks/useNavigation";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/colors";

export default function FirstScreen() {
  const navigation = useAppNavigation();

  return (
    <View style={mainStyles.component}>
      <View style={styles.container}>
        <View style={styles.birdArea}>
          <Image source={require("../../assets/mascote.png")} />
        </View>

        {/* Textos */}
        <Text style={styles.title}>Bem-vindo ao</Text>
        <Text style={styles.logo}>IntegraMente!</Text>
        <Text style={styles.subtitle}>Aprender do seu jeito,</Text>
        <Text style={styles.subtitle}>no seu ritmo.</Text>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AuthScreen", { isLogin: false })
            }
          >
            <LinearGradient
              colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
              style={mainStyles.primaryButton}
            >
              <Text style={mainStyles.primaryButtonText}>Começar agora →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={mainStyles.secondaryButton}
            onPress={() => navigation.navigate("AuthScreen", { isLogin: true })}
          >
            <Text style={mainStyles.secondaryButtonText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 48,
  },
  birdArea: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  title: {
    fontSize: 44,
    fontWeight: "800",
    color: "#000",
  },
  logo: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.PRIMARY,
    marginTop: -12,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 16,
    color: "#7a8ba8",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 32,
    gap: 14,
  },
});
