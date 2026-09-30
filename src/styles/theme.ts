import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

const mainStyles = StyleSheet.create({
  component: {
    flex: 1,
    backgroundColor: COLORS.BG_APP,
  },
  // Base de toda ScrollView do app. Telas que precisam de um espaçamento
  // diferente compõem: [mainStyles.scrollContent, styles.scrollContent]
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  primaryButton: {
    width: "100%",
    height: 60,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    height: 60,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 17,
    fontWeight: "600",
  },
  tipButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },

  // Título e subtítulo de toda atividade. O subtítulo é a linha pequena logo
  // abaixo do título: um contador ("2 DE 5 PEÇAS") ou uma instrução curta.
  activityTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.5,
    textAlign: "center",
  },
  activitySubtitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 6,
  },
});

export default mainStyles;
