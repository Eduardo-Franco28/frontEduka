import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import mainStyles from "../styles/theme";
import BackButton from "../components/BackButton";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import svgBoard from "../utils/svgBoard";
import useTopic from "../hooks/useTopic";
import { use, useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { BoardSlot, FilledSlot, QuestionSlotContent } from "../types/subject";
import LoadingPage from "../components/LoadingPage";
import useAppNavigation from "../hooks/useNavigation";
import ErrorMessage from "../components/ErrorMessage";

/**
 * COMO ESTA TELA FUNCIONA
 *
 * O boneco é um SVG com 6 partes. Cada parte é um "slot" — um lugar.
 * Um slot pode estar:
 *   - preenchido desde o começo (o tronco, que serve de âncora visual)
 *   - vazio, esperando a criança arrastar a peça certa
 *
 * Os BURACOS ficam em cima do desenho, como retângulos invisíveis.
 * As PEÇAS ficam nos cartõezinhos embaixo, e a criança arrasta até o buraco.
 *
 * Aqui peça e buraco têm o mesmo desenho (a peça da cabeça é redonda porque o
 * buraco da cabeça é redondo), então os dois saem da mesma lista. Quando o
 * backend entrar, eles passam a vir de lugares diferentes.
 */

// Altura do boneco na tela. É o único número a mexer se não couber.
const BOARD_HEIGHT = 210;

// Traduz "onde a parte está no desenho" para "onde ela está na tela em pixels".
// Precisa disso porque o buraco é um <Path> dentro do <Svg>, e o DropTarget é
// uma View — View não pode envolver um Path, então os buracos ficam por cima.

// Pixels a mais em volta do buraco. O desenho não muda de tamanho: só a área
// que aceita a peça fica maior, porque os braços têm só 25px de largura e
// acertar isso com o dedo de uma criança é difícil.
const SLOT_HIT_PADDING = 8;

// Espaço que o desenho da peça tem dentro do cartãozinho.
const PIECE_WIDTH = 40;
const PIECE_HEIGHT = 44;

// ---------------------------------------------------------------------------

export default function ActivityScreen4() {
  const route = useRoute<RouteProp<RootStackParamList, "ActivityScreen4">>();
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
    isSlotFilled
  } = useDragAndDrop();
  const { getActivity, answer, result, answering, error, activity, loading } =
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
      setIndex(start === -1 ? 0 : start); //Caso o usuario ja tenha terminado tudo nos conseguimos tratar
    });
  }, [topicId]);

  const currentActivity = activity.lstQuestions[index];

  if (loading || !currentActivity?.content || !currentActivity?.board) {
    return <LoadingPage message="Carregando atividade..." />;
  }

  const designs: BoardSlot[] = JSON.parse(currentActivity.board.slots)

  const questionContent: QuestionSlotContent = JSON.parse(currentActivity.content)

  const completeSlots = designs.map((design) => {
    const slots = questionContent.slots.find(
      (slot) => slot.name === design.name,
    );

    return {
      ...design,
      blank: slots?.blank ?? false,
    };
  });

  const blankSlots = completeSlots.filter((slot) => slot.blank);

  const alternatives = currentActivity.lstAlternative;

  const board = svgBoard(currentActivity.board?.viewBox ?? "", BOARD_HEIGHT);

  const handleAnswer = async () => {
    if (!currentActivity) return;

    setLstWrongSlots([]);

    const response = await answer({
      questionId: currentActivity.id,
      lstFilledSlots: buildFilledSlots(),
    });

    if (!response) return;

    if (!response.correct) {
      setLstWrongSlots(response.lstWrongSlots);

      //Faz toda a parte de voltar a peça pro lugar quando estiver na posição errada
    
      placements
        .filter((placement) => response.lstWrongSlots.includes(placement.slotName))
        .forEach(placement => returnToBox(placement.pieceId));

      return;
    }

    // Acabou o tópico inteiro: volta pra home.
    if (response.concluded) {
      navigation.navigate("ResultScreen", {
        topicId,
        activityRoute: "ActivityScreen4",
      });

      return;
    }

    reset();
    setIndex(index + 1);
  };

  function buildFilledSlots(): FilledSlot[] {
    return placements.map((placement) => ({
      name: placement.slotName,
      alternativeId: placement.pieceId
    }))
  }

  /**
   * Descobre em que tamanho desenhar a peça dentro do cartão.
   *
   * As partes têm proporções bem diferentes — a cabeça é quase quadrada (68x68)
   * e o braço é comprido (36x114). Se todas fossem forçadas no mesmo quadrado,
   * o braço viraria uma tirinha de 10px. Então cada uma encolhe pelo lado que
   * limita primeiro.
   */

  function calculateAlternativeSvg(bbox: string) {
    const numbers = bbox.split(" ").map(Number);
    const drawingWidth = numbers[2];
    const drawingHeight = numbers[3];

    const scaleByWidth = PIECE_WIDTH / drawingWidth;
    const scaleByHeight = PIECE_HEIGHT / drawingHeight;

    // A menor das duas é a que faz caber nos dois sentidos.
    const scale = Math.min(scaleByWidth, scaleByHeight);

    return {
      width: drawingWidth * scale,
      height: drawingHeight * scale,
    };
  }

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>{currentActivity?.title}</Text>
        <Text style={styles.counter}>
          {placedCount} DE {blankSlots?.length ?? "0"} PARTES
        </Text>

        <ErrorMessage message={error} />

        <TipButton
          tip="Arraste as partes do corpo para o lugar certo"
          style={mainStyles.tipButton}
          autoOpen={false}
        />

        {/* ================================================================
            O board
            Duas camadas: o desenho embaixo, os buracos invisíveis em cima.
        ================================================================= */}
        <View style={styles.boardCard}>
          <View
            style={[
              styles.boardWrapper,
              { width: board.width, height: board.height },
            ]}
          >
            {/* Camada de baixo: o desenho */}
            <Svg
              viewBox={currentActivity.board?.viewBox}
              width={board.width}
              height={board.height}
              preserveAspectRatio="xMidYMid meet"
            >
              {completeSlots?.map((slot) => {
                const isWrong = lstWrongSlots.includes(slot.name) && !isSlotFilled(slot.name);
                const isSlotEmpty = slot.blank && !isSlotFilled(slot.name);

                if (isWrong) {
                  return (
                    <Path
                      key={slot.name}
                      d={slot.path}
                      fill="#fdecec"
                      stroke={COLORS.DANGER}
                      strokeWidth={2.5}
                      strokeLinejoin="round"
                    />
                  );
                }

                // Buraco vazio: contorno tracejado roxo, fundo branco.
                if (isSlotEmpty) {
                  return (
                    <Path
                      key={slot.name}
                      d={slot.path}
                      fill="#fff"
                      stroke={COLORS.PRIMARY_LIGHT}
                      strokeWidth={2.5}
                      strokeDasharray="6 5"
                      strokeLinejoin="round"
                    />
                  );
                }

                // Já preenchido (ou veio pronto): laranja sólido.
                return (
                  <Path
                    key={slot.name}
                    d={slot.path}
                    fill={COLORS.SURFACE_ORANGE}
                    stroke={COLORS.WARNING}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                  />
                );
              })}
            </Svg>

            {/* Camada de cima: os buracos.
                São Views transparentes, uma exatamente em cima de cada parte
                vazia do desenho. Quem a criança vê é o tracejado do SVG. */}
            {blankSlots?.map((slot) => {
              const position = board.rectOf(slot.bbox, SLOT_HIT_PADDING);

              return (
                <DropTarget
                  key={slot.name}
                  id={slot.name}
                  targets={targets}
                  style={[styles.dropZone, position]}
                />
              );
            })}
          </View>
        </View>

        <Text style={styles.questionLabel}>
          *Arraste as partes do corpo para o lugar certo!
        </Text>

        {/* ================================================================
            AS PEÇAS
        ================================================================= */}
        <View style={styles.piecesGrid}>
          {alternatives.map((alternative) => {
            if (!alternative.bbox || !alternative.path) return null;

            const size = calculateAlternativeSvg(alternative.bbox);
            const isPlaced = isPiecePlaced(alternative.id);
            return (
              <View
                style={[styles.piece, isPlaced ? styles.piecePlaced : null]}
              >
                <DraggablePiece
                  key={alternative.id}
                  id={alternative.id}
                  targets={targets}
                  pieces={pieces}
                  onDrop={place}
                  onMiss={remove}
                  // Cada parte vai num lugar só, então a peça pula pro centro
                  // do buraco quando é solta.
                  snap
                >
                  <Svg
                    viewBox={alternative.bbox}
                    width={size.width}
                    height={size.height}
                  >
                    <Path d={alternative.path} fill={COLORS.WARNING} />
                  </Svg>
                </DraggablePiece>
                <Text style={styles.pieceLabel}>{alternative.description}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={mainStyles.primaryButton}
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

  boardCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  // A caixa que segura as duas camadas. O `relative` é o que faz os buracos
  // se posicionarem em relação a ela, e não à tela inteira.
  // A largura e a altura vêm do board, que é calculado dentro do componente
  // (depende do viewBox da API) — por isso ficam inline no JSX.
  boardWrapper: {
    position: "relative",
  },
  // Invisível de propósito.
  dropZone: {
    position: "absolute",
  },

  questionLabel: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "500",
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 14,
  },

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
  pieceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.TEXT_MUTED,
  },

  footer: {
    marginTop: 20,
  },
});
