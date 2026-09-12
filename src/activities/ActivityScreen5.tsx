import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
 * Os cenários são os lugares e os animais são as peças. Igual às outras, com
 * três diferenças que só existem aqui:
 *
 * 1. UM LUGAR RECEBE VÁRIAS PEÇAS. O mar fica com golfinho e peixe. Quem libera
 *    isso é o `allowMultiple` do content — e é por causa dele que o backend
 *    cobra TODAS as peças colocadas, e não uma por buraco.
 *
 * 2. SEM SNAP. Se as peças pulassem pro centro do cenário, as duas do mar
 *    empilhariam no mesmo ponto e a de baixo desapareceria. Então cada uma fica
 *    onde o dedo soltou.
 *
 * 3. A PEÇA É UM EMOJI, não um desenho. Nas outras o `path` vem copiado do slot
 *    do board; aqui não há board, e o golfinho viria com o desenho do mar — o
 *    mesmo do peixe. Por isso o emoji tem campo próprio: o `icon`.
 *
 * As cores dos cenários são design, não dado: a paleta abaixo é aplicada na
 * ordem em que os cenários chegam.
 */

// Um par de cores por cenário, na ordem em que eles vêm do backend.
// Se um dia entrar um quarto cenário, é aqui que se acrescenta.
const ZONE_PALETTE = [
  { colors: [COLORS.SURFACE_BLUE, COLORS.INFO] as const, badge: COLORS.INFO },
  {
    colors: [COLORS.SURFACE_GREEN, COLORS.SUCCESS] as const,
    badge: COLORS.SUCCESS,
  },
  {
    colors: [COLORS.SURFACE_ORANGE, COLORS.WARNING] as const,
    badge: COLORS.WARNING,
  },
];

export default function ActivityScreen5() {
  const route = useRoute<RouteProp<RootStackParamList, "ActivityScreen5">>();
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

  const zones = questionContent.slots;
  const animals = currentActivity.lstAlternative ?? [];

  // Aqui "terminou" é ter colocado todos os animais, não um por cenário — são
  // 6 animais em 3 lugares. É a mesma conta que o backend faz.
  const isComplete = placedCount === animals.length;

  const handleAnswer = async () => {
    setLstWrongSlots([]);

    const response = await answer({
      questionId: currentActivity.id,
      lstFilledSlots: buildFilledSlots(),
    });

    if (!response) return;

    if (!response.correct) {
      setLstWrongSlots(response.lstWrongSlots);

      // Todo animal que foi pro cenário errado volta pra fileira de baixo.
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
        activityRoute: "ActivityScreen5",
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

  /**
   * Quantos animais estão neste cenário.
   *
   * Nas outras telas bastava saber "tem peça ou não" (o isSlotFilled do hook).
   * Aqui o número importa: é ele que mostra à criança que o mar já recebeu dois.
   */
  function countIn(zoneName: string) {
    return placements.filter((placement) => placement.slotName === zoneName)
      .length;
  }

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>{currentActivity.title}</Text>
        <Text style={styles.counter}>
          {placedCount} DE {animals.length} ANIMAIS
        </Text>

        <ErrorMessage message={error} />

        <TipButton
          tip="Arraste cada animal para o cenário onde ele vive"
          style={mainStyles.tipButton}
          autoOpen={false}
        />

        {/* ================================================================
            OS CENÁRIOS
            Como na palavra, o alvo já é uma View — então ele mesmo é o
            DropTarget, sem camada invisível por cima.
        ================================================================= */}
        <View style={styles.zonesGrid}>
          {zones.map((zone, position) => {
            const palette = ZONE_PALETTE[position % ZONE_PALETTE.length];
            const isWrong = lstWrongSlots.includes(zone.name);
            const total = countIn(zone.name);

            return (
              <DropTarget
                key={zone.name}
                id={zone.name}
                targets={targets}
                style={[
                  styles.zone,
                  // Diferente das outras telas, o vermelho não espera o cenário
                  // esvaziar: ele recebe várias peças, então "vazio" não é sinal
                  // de nada. O aviso sai quando a criança mexe ali de novo.
                  isWrong ? styles.zoneWrong : null,
                ]}
              >
                <LinearGradient
                  colors={[...palette.colors]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.zoneFill}
                >
                  <View style={styles.zoneBadge}>
                    <Text
                      style={[styles.zoneBadgeText, { color: palette.badge }]}
                    >
                      {zone.label ?? zone.name.toUpperCase()}
                    </Text>
                  </View>

                  {total > 0 ? (
                    <Text style={styles.zoneCount}>{total}</Text>
                  ) : null}
                </LinearGradient>
              </DropTarget>
            );
          })}
        </View>

        <Text style={styles.questionLabel}>
          *Arraste cada animal para o seu cenário!
        </Text>

        {/* ================================================================
            OS ANIMAIS
        ================================================================= */}
        <View style={styles.piecesGrid}>
          {animals.map((animal) => (
            <DraggablePiece
              key={animal.id}
              id={animal.id}
              targets={targets}
              pieces={pieces}
              onDrop={place}
              onMiss={remove}
              // Um cenário recebe vários animais: com snap eles empilhariam
              // todos no centro do cartão.
              snap={false}
            >
              <View
                style={[
                  styles.piece,
                  isPiecePlaced(animal.id) ? styles.piecePlaced : null,
                ]}
              >
                <Text style={styles.pieceEmoji}>{animal.icon}</Text>
                <Text style={styles.pieceLabel}>{animal.description}</Text>
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

  // OS CENÁRIOS
  zonesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  zone: {
    width: "47%",
    height: 112,
    borderRadius: 18,
    overflow: "hidden",
  },
  zoneWrong: {
    borderWidth: 3,
    borderColor: COLORS.DANGER,
  },
  zoneFill: {
    flex: 1,
    padding: 10,
  },
  zoneBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  zoneBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  // Quantos animais já caíram aqui. Fica no canto pra não brigar com as peças,
  // que pousam soltas por cima do cartão.
  zoneCount: {
    position: "absolute",
    right: 10,
    bottom: 8,
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },

  questionLabel: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "500",
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 14,
  },

  // OS ANIMAIS
  piecesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  piece: {
    width: 66,
    height: 78,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  piecePlaced: {
    borderColor: COLORS.SUCCESS,
  },
  pieceEmoji: {
    fontSize: 30,
  },
  pieceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.TEXT_MUTED,
  },

  footer: {
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
