import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import useAppNavigation from "../hooks/useNavigation";

export default function FirstScreen() {
  const navigation = useAppNavigation();

  return (
    <View style={styles.component}>
      <View style={styles.container}>
        <View style={styles.birdArea}>
          <Image source={require("../../assets/pet.png")} />
        </View>

        {/* Textos */}
        <Text style={styles.logo}>EduKa</Text>
        <Text style={styles.subtitle}>Seu companheiro de estudos.</Text>
        <Text style={styles.subtitle}>No seu ritmo, do seu jeito.</Text>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate("AuthScreen", { isLogin: false })
            }
          >
            <Text style={styles.primaryButtonText}>Começar agora →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("AuthScreen", { isLogin: true })}
          >
            <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  component: {
    flex: 1,
    backgroundColor: "#eef1f7",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 16,
  },
  birdArea: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  logo: {
    fontSize: 48,
    fontWeight: "800",
    color: "#4a6fa5",
  },
  subtitle: {
    fontSize: 15,
    color: "#7a8ba8",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 32,
    gap: 14,
  },
  primaryButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#4a6fa5",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#4a6fa5",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#4a6fa5",
    fontSize: 16,
    fontWeight: "600",
  },
});
