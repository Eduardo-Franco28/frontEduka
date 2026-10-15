import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import ErrorMessage from "../components/ErrorMessage";
import CelebrationOverlay from "../components/CelebrationOverlay";
import useTopic from "../hooks/useTopic";
import useAppNavigation from "../hooks/useNavigation";
import { RootStackParamList } from "../types/navigation";
import { AttemptAlternativeRequest } from "../types/subject";
import { QuestionType } from "../enums/QuestionTypeEnum";
import DotsActivity from "../activities/DotsActivity";
import ShapesActivity from "../activities/ShapesActivity";
import LettersActivity from "../activities/LettersActivity";
import GroupsActivity from "../activities/GroupsActivity";

export default function ActivityScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "ActivityScreen">>();
  const navigation = useAppNavigation();
  const { getActivity, answer, answering, error, activity, loading } =
    useTopic();
  const [index, setIndex] = useState<number>(0);
  const [celebrating, setCelebrating] = useState<boolean>(false);

  const afterCelebration = useRef<(() => void) | null>(null);

  const { topicId } = route.params;

  useEffect(() => {
    getActivity(topicId).then((data) => {
      if (data == null) return;

      const start = data.lstQuestions.findIndex(
        (q) => q.id === data.resumeQuestionId,
      );
      setIndex(start === -1 ? 0 : start);
    });
  }, [topicId]);

  const currentActivity = activity?.lstQuestions[index];
  const totalQuestions = activity?.lstQuestions.length ?? 0;

  if (loading || !currentActivity?.content) {
    return <LoadingPage message="Carregando atividade..." />;
  }

  const question = currentActivity;

  const handleAnswer = async (
    attempt: Omit<AttemptAlternativeRequest, "questionId">,
  ) => {
    const response = await answer({ ...attempt, questionId: question.id });

    if (!response || !response.correct) return response;

    const isLastQuestion = index === totalQuestions - 1;

    afterCelebration.current = () => {
      if (isLastQuestion) {
        navigation.replace("ResultScreen", { topicId });
        return;
      }

      setIndex(index + 1);
    };

    setCelebrating(true);
    return response;
  };

  const finishCelebration = () => {
    setCelebrating(false);

    const next = afterCelebration.current;
    afterCelebration.current = null;
    next?.();
  };

  function renderActivity() {
    const props = { question, answering, onAnswer: handleAnswer };

    if (question.type === QuestionType.DRAG_DOTS)
      return <DotsActivity key={question.id} {...props} />;

    if (question.type === QuestionType.DRAG_TO_SLOTS)
      return <ShapesActivity key={question.id} {...props} />;

    if (question.type === QuestionType.DRAG_LETTERS)
      return <LettersActivity key={question.id} {...props} />;

    if (question.type === QuestionType.DRAG_SLOTS_TO_GROUP)
      return <GroupsActivity key={question.id} {...props} />;

    // TODO: ligar a atividade de subtração. O componente já existe, só falta
    // importar o SubtractionActivity e acrescentar:
    //   if (question.type === QuestionType.DRAG_SUBTRACTION)
    //     return <SubtractionActivity key={question.id} {...props} />;
    // Sem isso, o tópico Subtração mostra "ainda não está disponível".

    return (
      <Text style={styles.unsupported}>
        Esta atividade ainda não está disponível.
      </Text>
    );
  }

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <ScrollView
        style={mainStyles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={error} />
        {renderActivity()}
      </ScrollView>

      {celebrating && <CelebrationOverlay onDone={finishCelebration} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  unsupported: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 40,
  },
});