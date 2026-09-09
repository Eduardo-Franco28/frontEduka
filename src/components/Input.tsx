import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import useTheme from "../hooks/useTheme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function Input({
  label,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState<boolean>(false);
  const { colors, fontScale } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: colors.TEXT_PRIMARY, fontSize: 14 * fontScale },
          ]}
        >
          {label}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.CARD,
            borderColor: colors.BORDER_LIGHT,
            color: colors.TEXT_DARK,
            fontSize: 15 * fontScale,
          },
          focused && { borderColor: colors.PRIMARY },
          !!error && { borderColor: colors.DANGER },
          style,
        ]}
        placeholderTextColor={colors.TEXT_MUTED}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />

      {!!error && (
        <Text
          style={[
            styles.error,
            { color: colors.DANGER, fontSize: 12 * fontScale },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 60,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  error: {
    marginTop: 4,
    fontWeight: "500",
  },
});