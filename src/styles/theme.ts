import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

const mainStyles = StyleSheet.create({
  component: {
    flex: 1,
    backgroundColor: COLORS.BG_APP,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    textAlign: "center",
    marginBottom: 24,
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
});

export default mainStyles;
