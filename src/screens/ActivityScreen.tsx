import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import ErrorMessage from "../components/ErrorMessage";
import useTopic from "../hooks/useTopic";
import useAppNavigation from "../hooks/useNavigation";
import { RootStackParamList } from "../types/navigation";
import { AttemptAlternativeRequest } from "../types/subject";
import { QuestionType } from "../enums/QuestionTypeEnum";
import DotsActivity from "../activities/DotsActivity";
import ShapesActivity from "../activities/ShapesActivity";
import LettersActivity from "../activities/LettersActivity";
import GroupsActivity from "../activities/GroupsActivity";

/**
 * A tela de qualquer tópico.
 *
 * Ela não sabe desenhar atividade nenhuma: carrega o tópico, pega a questão
 * atual e entrega pro componente do tipo certo. Quando a criança acerta, é ela
 * que decide se vem outra questão ou se o tópico acabou.
 *
 * Quem arrasta, pinta os erros e devolve as peças é o componente.
 */
export default function ActivityScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "ActivityScreen">>();
  const navigation = useAppNavigation();
  const { getActivity, answer, answering, error, activity, loading } =
    useTopic();
  const [index, setIndex] = useState<number>(0);

  const { topicId } = route.params;

  useEffect(() => {
    getActivity(topicId).then((data) => {
      if (data == null) return;

      const start = data.lstQuestions.findIndex(
        (q) => q.id === data.resumeQuestionId,
      );
      // Se a criança já terminou tudo, não acha nenhuma e começa do início.
      setIndex(start === -1 ? 0 : start);
    });
  }, [topicId]);

  const currentActivity = activity?.lstQuestions[index];
  const totalQuestions = activity?.lstQuestions.length ?? 0;

  // Só checa o que TODA atividade precisa. O board não entra aqui: palavra e
  // grupos não têm, e quem precisa dele (ShapesActivity) confere sozinho.
  if (loading || !currentActivity?.content) {
    return <LoadingPage message="Carregando atividade..." />;
  }

  // Daqui pra baixo a questão existe. Guardar numa const nova fixa isso pro
  // TypeScript também dentro das funções abaixo.
  const question = currentActivity;

  const handleAnswer = async (
    attempt: Omit<AttemptAlternativeRequest, "questionId">,
  ) => {
    const response = await answer({ ...attempt, questionId: question.id });

    // Errou (ou falhou a rede): devolve pro componente, que sabe pintar os
    // lugares errados e mandar as peças de volta.
    if (!response || !response.correct) return response;

    // O `concluded` do backend fala da QUESTÃO, não do tópico: vem true em
    // todo acerto. Quem sabe se o tópico acabou é a posição na lista.
    const isLastQuestion = index === totalQuestions - 1;

    if (isLastQuestion) {
      navigation.navigate("ResultScreen", { topicId });
      return response;
    }

    setIndex(index + 1);
    return response;
  };

  /** Escolhe o componente pela mecânica da questão atual. */
  function renderActivity() {
    // O `key` zera a atividade ao trocar de questão: id novo, o React joga o
    // componente velho fora e monta um do zero — peças na caixa, nada pintado.
    // Sem ele, duas questões seguidas do mesmo tipo reaproveitariam o estado.
    const props = { question, answering, onAnswer: handleAnswer };

    if (question.type === QuestionType.DRAG_DOTS)
      return <DotsActivity key={question.id} {...props} />;

    if (question.type === QuestionType.DRAG_TO_SLOTS)
      return <ShapesActivity key={question.id} {...props} />;

    if (question.type === QuestionType.DRAG_LETTERS)
      return <LettersActivity key={question.id} {...props} />;

    if (question.type === QuestionType.DRAG_SLOTS_TO_GROUP)
      return <GroupsActivity key={question.id} {...props} />;

    // Tipo que ainda não tem componente: avisa em vez de quebrar.
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

      <View style={styles.content}>
        <ErrorMessage message={error} />
        {renderActivity()}
      </View>
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
    flex: 1,
    paddingHorizontal: 16,
  },
  unsupported: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 40,
  },
});
