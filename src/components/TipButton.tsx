import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { COLORS } from "../styles/colors";
import TipActivity from "./TipActivity";

interface TipButtonProps {
  tip: string;
  /** Abre a dica sozinho assim que a atividade aparece. */
  autoOpen?: boolean;
  /** Posicionamento — cada atividade decide onde o botão fica. */
  style?: StyleProp<ViewStyle>;
}

export default function TipButton({
  tip,
  autoOpen = true,
  style,
}: TipButtonProps) {
  const [visible, setVisible] = useState<boolean>(false);

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
          size={24}
          color={COLORS.PRIMARY}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.SURFACE_PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
});
