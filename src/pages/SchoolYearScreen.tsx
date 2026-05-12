import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import mainStyles from "../styles/theme";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import useAuth from "../hooks/useAuth";
import useAppNavigation from "../hooks/useNavigation";
import { Escolaridade } from "../enums/userGrades";

export default function SchoolYearScreen() {
  const [anoEscolar, setAnoEscolar] = useState<Escolaridade | null>(null);

  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "SchoolYearScreen">>();

  const { name, email, passwordFormat } = route.params;

  const { login, register, userLogin, userRegister, error, loading } = useAuth();   

  const handleSubmit = async() => {
    let response;
    
    response = await register({ name, email, password: passwordFormat, anoEscolar });

    if (!response) {
      Alert.alert("Erro", error || "Erro desconhecido");
      return;
    }

    console.log(response);
    navigation.navigate("HomeScreen");
  }

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seu ano escolar</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.dotsRow}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bubble}>
          <Text style={styles.bubbleEmoji}>🦁</Text>
          <Text style={styles.bubbleText}>
            Em qual ano do Ensino Médio você está? Isso ajuda a escolher o
            conteúdo certo para você.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.card, Escolaridade.PRIMEIRO_MEDIO === anoEscolar && styles.cardSelected]}
          onPress={() => setAnoEscolar(Escolaridade.PRIMEIRO_MEDIO)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: "#f0eef8" }]}>
            <Text style={styles.icon}>📓</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>1° Ano do Ensino Médio</Text>
            <Text style={styles.cardSubtitle}>Início do Ensino Médio</Text>
          </View>
          <View
            style={[styles.checkbox, Escolaridade.PRIMEIRO_MEDIO === anoEscolar && styles.checkboxSelected]}
          >
            {Escolaridade.PRIMEIRO_MEDIO === anoEscolar && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, Escolaridade.SEGUNDO_MEDIO === anoEscolar && styles.cardSelected]}
          onPress={() => setAnoEscolar(Escolaridade.SEGUNDO_MEDIO)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: "#e0f4ec" }]}>
            <Text style={styles.icon}>📗</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>2° Ano do Ensino Médio</Text>
            <Text style={styles.cardSubtitle}>
              Aprofundamento dos conteúdos
            </Text>
          </View>
          <View
            style={[styles.checkbox, Escolaridade.SEGUNDO_MEDIO === anoEscolar && styles.checkboxSelected]}
          >
            {Escolaridade.SEGUNDO_MEDIO === anoEscolar && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, Escolaridade.TERCEIRO_MEDIO === anoEscolar && styles.cardSelected]}
          onPress={() => setAnoEscolar(Escolaridade.TERCEIRO_MEDIO)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: "#e8f0f8" }]}>
            <Text style={styles.icon}>📘</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>3° Ano do Ensino Médio</Text>
            <Text style={styles.cardSubtitle}>
              Revisão e preparação para o ENEM
            </Text>
          </View>
          <View
            style={[styles.checkbox, Escolaridade.TERCEIRO_MEDIO === anoEscolar && styles.checkboxSelected]}
          >
            {Escolaridade.TERCEIRO_MEDIO === anoEscolar && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} activeOpacity={0.88} onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>Próximo →</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: "#f0ede8",
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
    color: "#2d3340",
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2d3340",
  },
  headerPlaceholder: {
    width: 36,
  },

  // Step dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    backgroundColor: "#f0ede8",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d0cdc5",
  },
  dotActive: {
    width: 20,
    backgroundColor: "#5b82b5",
    borderRadius: 4,
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
    color: "#2d3340",
    lineHeight: 20,
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
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#5b82b5",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  icon: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2d3340",
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#9a9a8e",
    lineHeight: 17,
  },

  // Checkbox
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d0cdc5",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxSelected: {
    backgroundColor: "#5b82b5",
    borderColor: "#5b82b5",
  },
  checkmark: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 15,
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: "#f0ede8",
  },
  nextButton: {
    backgroundColor: "#5b82b5",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
});
