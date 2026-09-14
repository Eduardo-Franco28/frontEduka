import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import svgBoard from "../utils/svgBoard";
import { ActivityProps } from "../types/activity";
import { BoardSlot, FilledSlot, QuestionSlotContent } from "../types/subject";

/**
 * DRAG_TO_SLOTS — encaixar formas.
 *
 * Serve pra qualquer desenho: mapa do Brasil, corpo humano, e o que vier. O
 * desenho vem do board; o content diz quais partes estão vazias. Cada peça tem
 * o formato do buraco onde ela encaixa.
 *
 * Recebe UMA questão pronta da ActivityScreen. Não busca nada, não troca de
 * questão e não navega: só desenha, deixa arrastar e manda a resposta.
 *
 * Duas camadas no tabuleiro: o SVG embaixo e os buracos invisíveis em cima.
 * Precisa disso porque o buraco é um <Path> dentro do <Svg>, e o DropTarget é
 * uma View — View não pode envolver um Path.
 */

// Altura do desenho na tela. É o único número a mexer se não couber.
const BOARD_HEIGHT = 230;

// Pixels a mais em volta do buraco. O desenho não muda: só a área que aceita a
// peça fica maior, porque partes estreitas (um braço, o Sul) são difíceis de
// acertar com o dedo de uma criança.
const SLOT_HIT_PADDING = 8;

// Espaço que o desenho da peça tem dentro do cartãozinho.
const PIECE_WIDTH = 42;
const PIECE_HEIGHT = 44;

export default function ShapesActivity({
  question,
  answering,
  onAnswer,
}: ActivityProps) {
  const {
    targets,
    pieces,
    placements,
    placedCount,
    place,
    remove,
    returnToBox,
    isSlotFilled,
    isPiecePlaced,
  } = useDragAndDrop();
  const [lstWrongSlots, setLstWrongSlots] = useState<string[]>([]);

  // Encaixar formas sem desenho não tem o que mostrar. Esta checagem vem
  // depois dos hooks: nenhum hook pode ficar abaixo de um return.
  if (!question.board) {
    return (
      <Text style={styles.missing}>Esta atividade está sem desenho.</Text>
    );
  }

  // O board traz o DESENHO de cada parte; o content diz quais estão vazias.
  const designs: BoardSlot[] = JSON.parse(question.board.slots);
  const content: QuestionSlotContent = JSON.parse(question.content);

  const completeSlots = designs.map((design) => {
    const slot = content.slots.find((item) => item.name === design.name);

    return { ...design, blank: slot?.blank ?? false };
  });

  const blankSlots = completeSlots.filter((slot) => slot.blank);
  const alternatives = question.lstAlternative ?? [];
  const board = svgBoard(question.board.viewBox, BOARD_HEIGHT);

  // Um buraco, uma peça: terminou quando todo buraco vazio foi preenchido.
  const isComplete = placedCount === blankSlots.length;

  const handleConfirm = async () => {
    setLstWrongSlots([]);

    const response = await onAnswer({ lstFilledSlots: buildFilledSlots() });

    // Acertou: a tela já trocou de questão. Não há nada a fazer aqui.
    if (!response || response.correct) return;

    setLstWrongSlots(response.lstWrongSlots);

    // Toda peça que caiu num lugar errado volta pra caixa.
    placements
      .filter((placement) => response.lstWrongSlots.includes(placement.slotName))
      .forEach((placement) => returnToBox(placement.pieceId));
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
   * As partes têm proporções bem diferentes — a cabeça é quase quadrada e o
   * braço é comprido. Forçadas no mesmo quadrado, umas ficariam esticadas.
   * Então cada uma encolhe pelo lado que limita primeiro.
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
    <View style={styles.container}>
      <Text style={styles.questionTitle}>{question.title}</Text>
      <Text style={styles.counter}>
        {placedCount} DE {blankSlots.length} PEÇAS
      </Text>

      <TipButton
        tip="Arraste cada peça para o seu lugar no desenho"
        style={mainStyles.tipButton}
        autoOpen={false}
      />

      <View style={styles.boardCard}>
        <View
          style={[
            styles.boardWrapper,
            { width: board.width, height: board.height },
          ]}
        >
          {/* Camada de baixo: o desenho */}
          <Svg
            viewBox={question.board.viewBox}
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

          {/* Camada de cima: os buracos invisíveis, um em cima de cada parte
              vazia. Quem a criança vê é o tracejado do SVG. */}
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
        *Arraste cada peça para o lugar certo!
      </Text>

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
                // Cada peça vai num lugar só, então ela pula pro centro do
                // buraco quando é solta.
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
          disabled={answering || !isComplete}
          style={[
            mainStyles.primaryButton,
            !isComplete ? styles.buttonDisabled : null,
          ]}
          onPress={handleConfirm}
        >
          <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  missing: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginTop: 40,
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
  // A caixa que segura as duas camadas. O `relative` faz os buracos se
  // posicionarem em relação a ela, e não à tela inteira. Largura e altura vêm
  // do board (dependem do viewBox da API), por isso ficam inline no JSX.
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
    width: 70,
    height: 80,
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
  buttonDisabled: {
    opacity: 0.5,
  },
});
