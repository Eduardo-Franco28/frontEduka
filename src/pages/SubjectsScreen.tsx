import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import mainStyles from "../styles/theme";

export default function SubjectsScreen() {
  const [matematica, setMatematica] = useState(true);
  const [cienciasNatureza, setCienciasNatureza] = useState(false);
  const [linguagens, setLinguagens] = useState(false);
  const [cienciasHumanas, setCienciasHumanas] = useState(false);

  return (
    <View style={mainStyles.component}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0ede8" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Matérias</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Escolha as matérias que você quer estudar. Você pode mudar depois.
        </Text>

        {/* Matemática */}
        <TouchableOpacity
          style={[styles.card, matematica && styles.cardSelected]}
          onPress={() => setMatematica(!matematica)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: "#e8f0f8" }]}>
            <Text style={styles.icon}>📐</Text>
          </View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectName}>Matemática</Text>
            <Text style={styles.subjectDescription}>Álgebra, geometria e mais</Text>
          </View>
          <View style={[styles.checkbox, matematica && styles.checkboxSelected]}>
            {matematica && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Ciências da Natureza */}
        <TouchableOpacity
          style={[styles.card, cienciasNatureza && styles.cardSelected]}
          onPress={() => setCienciasNatureza(!cienciasNatureza)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: "#e0f4ec" }]}>
            <Text style={styles.icon}>✏️</Text>
          </View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectName}>Ciências da Natureza</Text>
            <Text style={styles.subjectDescription}>Física, Química e Biologia</Text>
          </View>
          <View style={[styles.checkbox, cienciasNatureza && styles.checkboxSelected]}>
            {cienciasNatureza && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Linguagens */}
        <TouchableOpacity
          style={[styles.card, linguagens && styles.cardSelected]}
          onPress={() => setLinguagens(!linguagens)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: "#f5ece0" }]}>
            <Text style={styles.icon}>📚</Text>
          </View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectName}>Linguagens</Text>
            <Text style={styles.subjectDescription}>Português, Literatura e Redação</Text>
          </View>
          <View style={[styles.checkbox, linguagens && styles.checkboxSelected]}>
            {linguagens && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Ciências Humanas */}
        <TouchableOpacity
          style={[styles.card, cienciasHumanas && styles.cardSelected]}
          onPress={() => setCienciasHumanas(!cienciasHumanas)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, { backgroundColor: "#fef3e2" }]}>
            <Text style={styles.icon}>🌎</Text>
          </View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectName}>Ciências Humanas</Text>
            <Text style={styles.subjectDescription}>História, Geografia e Filosofia</Text>
          </View>
          <View style={[styles.checkbox, cienciasHumanas && styles.checkboxSelected]}>
            {cienciasHumanas && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.88}>
          <Text style={styles.saveButtonText}>Salvar e continuar →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b6b5e",
    lineHeight: 20,
    marginBottom: 20,
  },
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
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2d3340",
    marginBottom: 3,
  },
  subjectDescription: {
    fontSize: 13,
    color: "#9a9a8e",
    lineHeight: 17,
  },
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
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: "#f0ede8",
  },
  saveButton: {
    backgroundColor: "#4a9b6f",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
});