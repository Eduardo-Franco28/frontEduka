import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import useAppNavigation from "../hooks/useNavigation";
import useTheme from "../hooks/useTheme";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";

export default function ResultScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "ResultScreen">>();
  const { colors, fontScale } = useTheme();

  const { topicId, subjectId, subjectName } = route.params;

  // Tópico terminado: o histórico é limpo para o aluno não voltar com o gesto
  // e cair de novo na última questão, que já foi respondida.
  const handleNext = () => {
    if (subjectId && subjectName) {
      navigation.reset({
        index: 0,
        routes: [{ name: "TopicsScreen", params: { subjectId, subjectName } }],
      });
      return;
    }

    navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
  };

  // Toda atividade abre pela mesma tela, então tentar de novo é sempre ela.
  // `replace` pra não empilhar o resultado por baixo da atividade nova.
  const handleRetry = () => {
    navigation.replace("ActivityScreen", { topicId });
  };

  return (
    <SafeAreaView
      style={[styles.component, { backgroundColor: colors.BG_APP }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.content}>
        <Text style={[styles.confetti, { fontSize: 44 * fontScale }]}>🎉</Text>

        <Image
          source={require("../../assets/mascoteFeliz.png")}
          style={styles.mascote}
          resizeMode="contain"
          accessibilityLabel="Mascote comemorando"
        />

        <Text
          style={[
            styles.title,
            { color: colors.PRIMARY, fontSize: 30 * fontScale },
          ]}
        >
          Muito bem!
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Próxima atividade"
        >
          <LinearGradient
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={styles.button}
          >
            <View style={styles.buttonContent}>
              <Text style={[styles.primaryText, { fontSize: 17 * fontScale }]}>
                Próxima atividade
              </Text>
              <FontAwesomeFreeSolid name="arrow-right" size={16 * fontScale} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.CARD }]}
          onPress={handleRetry}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Tentar de novo"
        >
          <Text
            style={[
              styles.secondaryText,
              { color: colors.PRIMARY, fontSize: 17 * fontScale },
            ]}
          >
            Tentar de novo
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Texto + seta do botão, lado a lado.
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // A comemoração e os botões formam um bloco só, centralizado na tela: os
  // botões ficam logo abaixo do "Muito bem!", e não colados no rodapé.
  component: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  content: {
    alignItems: "center",
    gap: 8,
  },
  confetti: {
    lineHeight: 56,
  },
  mascote: {
    width: 130,
    height: 130,
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
    marginTop: 4,
  },

  // Botões
  buttonsContainer: {
    gap: 14,
    marginTop: 40,
  },
  button: {
    width: "100%",
    height: 60,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryText: {
    fontWeight: "700",
  },
});
