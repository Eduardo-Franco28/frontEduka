import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message }: LoadingPageProps) {
  return (
    <View style={[mainStyles.component, styles.container]}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />

      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  message: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
});
