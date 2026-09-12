import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import BackButton from "../components/BackButton";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import LoadingPage from "../components/LoadingPage";
import ErrorMessage from "../components/ErrorMessage";
import useDragAndDrop from "../hooks/useDragAndDrop";
import useTopic from "../hooks/useTopic";
import useAppNavigation from "../hooks/useNavigation";
import { RootStackParamList } from "../types/navigation";
import { FilledSlot, QuestionSlotContent } from "../types/subject";

/**
 * COMO ESTA TELA FUNCIONA
 *
 * A palavra é uma fila de lugares. Cada lugar é um "slot":
 *   - preenchido desde o começo (o "V" da UVA, que ancora a palavra)
 *   - vazio, esperando a criança arrastar a letra certa
 *
 * É a mesma mecânica do mapa e do boneco, com duas diferenças:
 *
 * 1. NÃO TEM BOARD. Não há desenho nenhum, então a questão vem com
 *    `board: null` e tudo que a tela precisa está no `content`. Por isso aqui
 *    não aparecem svgBoard, viewBox, path nem bbox.
 *
 * 2. TEM LETRA DISTRATORA. A UVA oferece 4 letras pra 2 buracos: o E e o O
 *    existem pra estar errados. No banco elas são alternativas com
 *    `correct: false` e sem `correctSlot` — e o backend trata quem não tem
 *    gabarito como sempre errada.
 *
 * O `name` do slot é a POSIÇÃO ("1", "2", "3"), não a letra. Se fosse a letra,
 * uma palavra como BANANA teria três lugares chamados "A" e o gabarito ficaria
 * ambíguo.
 */

export default function ActivityScreen2() {
  const route = useRoute<RouteProp<RootStackParamList, "ActivityScreen2">>();
  const navigation = useAppNavigation();
  const {
    targets,
    pieces,
    placements,
    placedCount,
    place,
    remove,
    returnToBox,
    reset,
    isSlotFilled,
    isPiecePlaced,
  } = useDragAndDrop();
  const { getActivity, answer, answering, error, activity, loading } =
    useTopic();
  const [index, setIndex] = useState<number>(0);
  const [lstWrongSlots, setLstWrongSlots] = useState<string[]>([]);

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

  // A partir daqui a questão existe e tem conteúdo. Não checo o board porque
  // esta atividade não usa nenhum.
  if (loading || !currentActivity?.content) {
    return <LoadingPage message="Carregando atividade..." />;
  }

  const questionContent: QuestionSlotContent = JSON.parse(
    currentActivity.content,
  );

  const slots = questionContent.slots;
  const blankSlots = slots.filter((slot) => slot.blank);
  const alternatives = currentActivity.lstAlternative ?? [];

  // O backend recusa tentativa incompleta como erro de requisição, não como
  // resposta errada. Então a tela não deixa enviar antes de completar.
  const isComplete = placedCount === blankSlots.length;

  const handleAnswer = async () => {
    setLstWrongSlots([]);

    const response = await answer({
      questionId: currentActivity.id,
      lstFilledSlots: buildFilledSlots(),
    });

    if (!response) return;

    if (!response.correct) {
      setLstWrongSlots(response.lstWrongSlots);

      // Toda letra que caiu no lugar errado volta pra fileira de baixo.
      placements
        .filter((placement) =>
          response.lstWrongSlots.includes(placement.slotName),
        )
        .forEach((placement) => returnToBox(placement.pieceId));

      return;
    }

    if (response.concluded) {
      navigation.navigate("ResultScreen", {
        topicId,
        activityRoute: "ActivityScreen2",
      });

      return;
    }

    reset();
    setIndex(index + 1);
  };

  /** O que a criança montou, no formato que o backend espera. */
  function buildFilledSlots(): FilledSlot[] {
    return placements.map((placement) => ({
      name: placement.slotName,
      alternativeId: placement.pieceId,
    }));
  }

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>{currentActivity.title}</Text>
        <Text style={styles.counter}>
          {placedCount} DE {blankSlots.length} LETRAS
        </Text>

        <ErrorMessage message={error} />

        <TipButton
          tip="Arraste as letras para completar a palavra"
          style={mainStyles.tipButton}
          autoOpen={false}
        />

        {/* ================================================================
            A PALAVRA
            Diferente do mapa, aqui não há duas camadas: o buraco JÁ é a View
            que recebe a peça, então ele mesmo é o DropTarget.
        ================================================================= */}
        <View style={styles.questionCard}>
          <View style={styles.answerRow}>
            {questionContent.hint ? (
              <Text style={styles.answerHint}>{questionContent.hint}</Text>
            ) : null}

            {slots.map((slot) => {
              // Letra que já vem pronta: só texto, não recebe nada.
              if (!slot.blank) {
                return (
                  <Text key={slot.name} style={styles.answerLetter}>
                    {slot.label}
                  </Text>
                );
              }

              // Só fica vermelho enquanto o buraco continuar vazio: assim que a
              // criança põe uma letra de novo, ele volta ao normal.
              const isWrong =
                lstWrongSlots.includes(slot.name) && !isSlotFilled(slot.name);

              return (
                <DropTarget
                  key={slot.name}
                  id={slot.name}
                  targets={targets}
                  style={[
                    styles.answerSlot,
                    isWrong ? styles.answerSlotWrong : null,
                    !isWrong && isSlotFilled(slot.name)
                      ? styles.answerSlotFilled
                      : null,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <Text style={styles.questionLabel}>
          *Arraste as letras para completar a palavra!
        </Text>

        {/* ================================================================
            AS LETRAS
            Todas arrastáveis — inclusive as que não entram na palavra.
        ================================================================= */}
        <View style={styles.tilesGrid}>
          {alternatives.map((alternative) => (
            <DraggablePiece
              key={alternative.id}
              id={alternative.id}
              targets={targets}
              pieces={pieces}
              onDrop={place}
              onMiss={remove}
              // Cada letra vai num lugar só, então ela pula pro centro do
              // buraco quando é solta.
              snap
            >
              <View
                style={[
                  styles.tile,
                  isPiecePlaced(alternative.id) ? styles.tilePlaced : null,
                ]}
              >
                <Text style={styles.tileText}>{alternative.description}</Text>
              </View>
            </DraggablePiece>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={answering || !isComplete}
            style={[
              mainStyles.primaryButton,
              !isComplete ? styles.buttonDisabled : null,
            ]}
            onPress={handleAnswer}
          >
            <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.5,
    textAlign: "center",
  },
  counter: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 6,
  },

  // A PALAVRA
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  answerHint: {
    fontSize: 40,
    lineHeight: 46,
    marginRight: 4,
  },
  // O buraco. Um pouco maior que a letra pronta porque é ele que recebe o
  // dedo da criança — e um alvo apertado é frustrante.
  answerSlot: {
    width: 52,
    height: 56,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.TEXT_PRIMARY,
  },
  answerSlotFilled: {
    backgroundColor: COLORS.SURFACE_ORANGE,
    borderBottomColor: COLORS.WARNING,
  },
  answerSlotWrong: {
    backgroundColor: "#fdecec",
    borderBottomColor: COLORS.DANGER,
  },
  answerLetter: {
    width: 46,
    height: 56,
    fontSize: 46,
    lineHeight: 52,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
  },

  questionLabel: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "500",
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },

  // AS LETRAS
  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  // 56 e não 76 como antes: a peça pousa em cima do buraco, e uma peça muito
  // maior que ele cobriria as letras vizinhas.
  tile: {
    width: 56,
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.BORDER_LIGHT,
  },
  tilePlaced: {
    borderColor: COLORS.SUCCESS,
  },
  tileText: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
  },

  footer: {
    marginTop: 32,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
