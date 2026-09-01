import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import TabBar from "../components/TabBar";
import useTheme from "../hooks/useTheme";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";

const FONT_OPTIONS = [
  { label: "Pequeno", value: 0.9 },
  { label: "Normal", value: 1 },
  { label: "Grande", value: 1.15 },
  { label: "Muito grande", value: 1.3 },
];

export default function AccessibilityScreen() {
  const { isDark, toggleTheme, fontScale, setFontScale, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.component, { backgroundColor: colors.BG_APP }]} edges={["top"]}>
      <Header title="Acessibilidade" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tema */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY, fontSize: 16 * fontScale }]}>
          Aparência
        </Text>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.CARD }]}
          activeOpacity={0.8}
          onPress={toggleTheme}
          accessibilityRole="switch"
          accessibilityState={{ checked: isDark }}
          accessibilityLabel="Tema escuro"
        >
          <View style={[styles.iconBox, { backgroundColor: colors.SURFACE_PRIMARY }]}>
            <FontAwesomeFreeSolid
              name={isDark ? "moon" : "sun"}
              size={20}
              color={colors.PRIMARY}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardLabel, { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale }]}>
              Tema escuro
            </Text>
            <Text style={[styles.cardHint, { color: colors.TEXT_MUTED, fontSize: 12 * fontScale }]}>
              {isDark ? "Ativado" : "Desativado"}
            </Text>
          </View>
          <View
            style={[
              styles.toggle,
              { backgroundColor: isDark ? colors.PRIMARY : colors.SURFACE_LOCKED },
            ]}
          >
            <View style={[styles.toggleKnob, isDark && styles.toggleKnobActive]} />
          </View>
        </TouchableOpacity>

        {/* Tamanho da fonte */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.TEXT_PRIMARY, fontSize: 16 * fontScale, marginTop: 24 },
          ]}
        >
          Tamanho do texto
        </Text>

        <View style={[styles.card, styles.cardColumn, { backgroundColor: colors.CARD }]}>
          {FONT_OPTIONS.map((option) => {
            const isSelected = fontScale === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.fontOption,
                  {
                    backgroundColor: isSelected ? colors.SURFACE_PRIMARY : "transparent",
                    borderColor: isSelected ? colors.PRIMARY : colors.BORDER_LIGHT,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => setFontScale(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={option.label}
              >
                <Text
                  style={{
                    color: isSelected ? colors.PRIMARY : colors.TEXT_PRIMARY,
                    fontSize: 15 * option.value,
                    fontWeight: isSelected ? "700" : "500",
                  }}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <FontAwesomeFreeSolid name="check" size={16} color={colors.PRIMARY} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Idioma */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.TEXT_PRIMARY, fontSize: 16 * fontScale, marginTop: 24 },
          ]}
        >
          Idioma
        </Text>

        <View style={[styles.card, { backgroundColor: colors.CARD }]}>
          <View style={[styles.iconBox, { backgroundColor: colors.SURFACE_BLUE }]}>
            <FontAwesomeFreeSolid name="language" size={20} color={colors.INFO} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardLabel, { color: colors.TEXT_PRIMARY, fontSize: 15 * fontScale }]}>
              Português (Brasil)
            </Text>
            <Text style={[styles.cardHint, { color: colors.TEXT_MUTED, fontSize: 12 * fontScale }]}>
              Em breve mais idiomas
            </Text>
          </View>
        </View>
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  component: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  cardColumn: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontWeight: "600",
    marginBottom: 2,
  },
  cardHint: {
    fontWeight: "500",
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  toggleKnobActive: {
    alignSelf: "flex-end",
  },
  fontOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});