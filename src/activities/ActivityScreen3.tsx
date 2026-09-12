import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
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
import svgBoard from "../utils/svgBoard";
import { RootStackParamList } from "../types/navigation";
import { BoardSlot, FilledSlot, QuestionSlotContent } from "../types/subject";

/**
 * COMO ESTA TELA FUNCIONA
 *
 * O mapa do Brasil é um SVG com 5 regiões. Cada região é um "slot" — um lugar.
 * Um slot pode estar:
 *   - preenchido desde o começo (o Centro-Oeste, que serve de âncora visual)
 *   - vazio, esperando a criança arrastar a região certa
 *
 * Os BURACOS ficam em cima do desenho, como retângulos invisíveis.
 * As PEÇAS ficam nos cartõezinhos embaixo, e a criança arrasta até o buraco.
 *
 * É a mesma mecânica da ActivityScreen4: só muda o desenho, que vem da API.
 */

// Altura do mapa na tela. É o único número a mexer se não couber.
// O mapa é 300x340 (mais alto que largo), então precisa de mais altura que o
// boneco pra não ficar magro demais.
const BOARD_HEIGHT = 260;

// Pixels a mais em volta do buraco. O desenho não muda de tamanho: só a área
// que aceita a peça fica maior, porque o Sul é estreito e acertar isso com o
// dedo de uma criança é difícil.
const SLOT_HIT_PADDING = 8;

// Espaço que o desenho da peça tem dentro do cartãozinho.
const PIECE_WIDTH = 44;
const PIECE_HEIGHT = 44;

// ---------------------------------------------------------------------------

export default function ActivityScreen3() {
  const route = useRoute<RouteProp<RootStackParamList, "ActivityScreen3">>();
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

  // A partir daqui a questão existe, com board e content. Se não existir, nem
  // vale desenhar — por isso a trava vem antes dos derivados, e não depois.
  if (loading || !currentActivity?.board || !currentActivity.content) {
    return <LoadingPage message="Carregando atividade..." />;
  }

  // O board traz o DESENHO de cada região; o content diz quais estão vazias.
  // São dois lugares porque o mesmo mapa serve pra várias questões, cada uma
  // escondendo regiões diferentes.
  const designs: BoardSlot[] = JSON.parse(currentActivity.board.slots);
  const questionContent: QuestionSlotContent = JSON.parse(
    currentActivity.content,
  );

  const completeSlots = designs.map((design) => {
    const slot = questionContent.slots.find(
      (content) => content.name === design.name,
    );

    return { ...design, blank: slot?.blank ?? false };
  });

  const blankSlots = completeSlots.filter((slot) => slot.blank);
  const alternatives = currentActivity.lstAlternative ?? [];
  const board = svgBoard(currentActivity.board.viewBox, BOARD_HEIGHT);

  const handleAnswer = async () => {
    setLstWrongSlots([]);

    const response = await answer({
      questionId: currentActivity.id,
      lstFilledSlots: buildFilledSlots(),
    });

    if (!response) return;

    if (!response.correct) {
      setLstWrongSlots(response.lstWrongSlots);

      // Toda peça que caiu num lugar errado volta pra caixa.
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
        activityRoute: "ActivityScreen3",
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
   * Em que tamanho desenhar a peça dentro do cartão.
   *
   * As regiões têm proporções bem diferentes — o Norte é largo (206x170) e o
   * Sul é estreito (87x100). Se todas fossem forçadas no mesmo quadrado, umas
   * ficariam esticadas. Então cada uma encolhe pelo lado que limita primeiro.
   */
  function pieceSize(bbox: string) {
    const numbers = bbox.trim().split(/\s+/).map(Number);
    const drawingWidth = numbers[2];
    const drawingHeight = numbers[3];

    // A menor das duas é a que faz caber nos dois sentidos.
    const scale = Math.min(
      PIECE_WIDTH / drawingWidth,
      PIECE_HEIGHT / drawingHeight,
    );

    return { width: drawingWidth * scale, height: drawingHeight * scale };
  }

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>{currentActivity.title}</Text>
        <Text style={styles.counter}>
          {placedCount} DE {blankSlots.length} REGIÕES
        </Text>

        <ErrorMessage message={error} />

        <TipButton
          tip="Arraste cada região para o seu lugar no mapa"
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
              viewBox={currentActivity.board.viewBox}
              width={board.width}
              height={board.height}
              preserveAspectRatio="xMidYMid meet"
            >
              {completeSlots.map((slot) => {
                // Só fica vermelho enquanto o buraco continuar vazio: assim que
                // a criança põe uma peça de novo, ele volta a ser laranja.
                const isWrong =
                  lstWrongSlots.includes(slot.name) && !isSlotFilled(slot.name);
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

                // Já preenchida (ou veio pronta): laranja sólido.
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
                São Views transparentes, uma exatamente em cima de cada região
                vazia do desenho. Quem a criança vê é o tracejado do SVG. */}
            {blankSlots.map((slot) => (
              <DropTarget
                key={slot.name}
                id={slot.name}
                targets={targets}
                style={[
                  styles.dropZone,
                  board.rectOf(slot.bbox, SLOT_HIT_PADDING),
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.questionLabel}>
          *Arraste cada região para o seu lugar!
        </Text>

        {/* ================================================================
            AS PEÇAS
        ================================================================= */}
        <View style={styles.piecesGrid}>
          {alternatives.map((alternative) => {
            if (!alternative.bbox || !alternative.path) return null;

            const size = pieceSize(alternative.bbox);

            return (
              <View
                key={alternative.id}
                style={[
                  styles.piece,
                  isPiecePlaced(alternative.id) ? styles.piecePlaced : null,
                ]}
              >
                <DraggablePiece
                  id={alternative.id}
                  targets={targets}
                  pieces={pieces}
                  onDrop={place}
                  onMiss={remove}
                  // Cada região vai num lugar só, então a peça pula pro centro
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
            disabled={answering}
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
  // A caixa que segura as duas camadas. O `relative` é o que faz os buracos se
  // posicionarem em relação a ela, e não à tela inteira.
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
    width: 72,
    height: 82,
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
