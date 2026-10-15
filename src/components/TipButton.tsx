import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { COLORS } from "../styles/colors";
import TipActivity from "./TipActivity";
import useTheme from "../hooks/useTheme";

interface TipButtonProps {
  tip: string;
  autoOpen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function TipButton({
  tip,
  autoOpen = true,
  style,
}: TipButtonProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const { fontScale } = useTheme();

  useEffect(() => {
    if (autoOpen) setVisible(true);
  }, [autoOpen]);

  return (
    <>
      <TipActivity
        tip={tip}
        visible={visible}
        onClose={() => setVisible(false)}
      />

      <TouchableOpacity
        style={[styles.button, style]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        accessibilityLabel="Abrir dica"
      >
        <FontAwesomeFreeSolid
          name="lightbulb"
          size={18 * fontScale}
          color={COLORS.PRIMARY}
        />
        <Text style={[styles.label, { fontSize: 15 * fontScale }]}>Dica</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: COLORS.SURFACE_PRIMARY,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_LIGHT,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  label: {
    color: COLORS.PRIMARY,
    fontWeight: "800",
  },
});
