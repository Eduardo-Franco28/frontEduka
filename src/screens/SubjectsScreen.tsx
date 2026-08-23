import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import mainStyles from "../styles/theme";
import useSubject from "../hooks/useSubject";
import ErrorMessage from "../components/ErrorMessage";
import TabBar from "../components/TabBar";
import useAppNavigation from "../hooks/useNavigation";

export default function SubjectsScreen() {
  const { loading, subject, getAll, error } = useSubject();

  const navigation = useAppNavigation();

  const handleSelectSubject = (id: number, subject: string) => {
    if (id === null) return;

    navigation.navigate("TopicsScreen", { subjectId: id, subjectName: subject });
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <SafeAreaView style={mainStyles.component} edges={["top"]}>
      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={error} />

        {/* Step dots */}
        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        {/* Icon + Title */}
        <Text style={styles.titleEmoji}>📚</Text>
        <Text style={styles.title}>O que vamos{"\n"}aprender hoje?</Text>

        {/* Grid */}
        <View style={styles.grid}>
          {/* Matemática */}
          {subject?.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card]}
                activeOpacity={0.85}
                onPress={() => handleSelectSubject(item.id, item.name)}
              >
                <Text style={styles.cardIcon}>📐</Text>
                <Text style={[styles.cardLabel]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 52,
    alignItems: "center",
  },

  // Step dots
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d0cdc5",
  },
  dotActive: {
    width: 24,
    backgroundColor: "#6b7fe8",
    borderRadius: 5,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9a9a8e",
    letterSpacing: 1.2,
    marginBottom: 24,
  },

  // Title
  titleEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2d3340",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 28,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
  },

  // Card
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    gap: 10,
  },
  cardSelected: {
    backgroundColor: "#eef0fd",
    borderColor: "#6b7fe8",
  },
  cardIcon: {
    fontSize: 36,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d3340",
  },
  cardLabelSelected: {
    color: "#6b7fe8",
  },
  checkmark: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 15,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    backgroundColor: "#f0ede8",
  },
  startButton: {
    backgroundColor: "#6b7fe8",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
});
