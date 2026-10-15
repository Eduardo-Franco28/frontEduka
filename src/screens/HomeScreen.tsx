import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useAppNavigation from "../hooks/useNavigation";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import mainStyles from "../styles/theme";
import TabBar from "../components/TabBar";
import SubjectCarousel, {
  CARD_HEIGHT,
  CARD_PADDING,
  CARD_RADIUS,
} from "../components/SubjectCarousel";
import ErrorMessage from "../components/ErrorMessage";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import useSubjectProgress, { SubjectWithProgress } from "../hooks/useSubjectProgress";

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const { colors, fontScale } = useTheme();
  const { user } = useAuth();

  const { getAll, subjects, error } = useSubjectProgress();

  useFocusEffect(
    useCallback(() => {
      getAll();
    }, []),
  );

  const handleSelectSubject = (item: SubjectWithProgress) => {
    if (item.currentTopic) {
      navigation.navigate("ActivityScreen", { topicId: item.currentTopic.id });
      return;
    }
    navigation.navigate("TopicsScreen", {
      subjectId: item.id,
      subjectName: item.name,
    });
  };

  return (
    <View style={[mainStyles.component, { backgroundColor: colors.BG_APP }]}>
      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={[mainStyles.scrollContent, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.avatarCircle, { borderColor: colors.PRIMARY, backgroundColor: colors.CARD }]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Ir para o perfil"
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Image
              source={require("../../assets/mascotePerfil.png")}
              style={styles.avatarImage}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY, fontSize: 22 * fontScale }]}>
              Olá, {user?.nome} 👋
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.TEXT_MUTED, fontSize: 14 * fontScale }]}>
              Animado para aprender hoje?
            </Text>
          </View>
        </View>

        <ErrorMessage message={error} />

        <SubjectCarousel subjects={subjects} onPressSubject={handleSelectSubject} />

        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY, fontSize: 18 * fontScale }]}>
          Continue seus estudos
        </Text>

        <View
          style={[
            styles.continueCard,
            { backgroundColor: colors.CARD, borderColor: colors.BORDER_LIGHT },
          ]}
        >
          <Image
            source={require("../../assets/mascoteBracoCruzado.png")}
            style={styles.mascot}
          />

          <TouchableOpacity
            style={mainStyles.primaryButton}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Ver matérias"
            onPress={() => navigation.navigate("SubjectsScreen")}
          >
            <View style={styles.buttonContent}>
              <FontAwesomeFreeSolid name="play" size={14 * fontScale} color="#fff" />
              <Text style={mainStyles.primaryButtonText}>Ver matérias</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 92,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    flexShrink: 0,
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerSubtitle: {
    fontWeight: "500",
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
  },

  continueCard: {
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    padding: CARD_PADDING,
    marginBottom: 10,
    borderWidth: 2,
    alignItems: "center",
    gap: 14,
  },
  mascot: {
    flex: 1,
    width: 160,
    resizeMode: "contain",
  },
});