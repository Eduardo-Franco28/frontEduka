import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import useAppNavigation from "../hooks/useNavigation";
import useTheme from "../hooks/useTheme";

interface BackButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function BackButton({ onPress, style }: BackButtonProps) {
  const navigation = useAppNavigation();
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.CARD }, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
    >
      <FontAwesomeFreeSolid
        name="arrow-left"
        size={16}
        color={colors.TEXT_PRIMARY}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
