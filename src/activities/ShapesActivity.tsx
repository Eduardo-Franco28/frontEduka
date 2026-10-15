import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import usePieceScale from "../hooks/usePieceScale";
import svgBoard from "../utils/svgBoard";
import { ActivityProps } from "../types/activity";
import { BoardSlot, FilledSlot, QuestionSlotContent } from "../types/subject";

const BOARD_HEIGHT = 230;

const SLOT_HIT_PADDING = 8;

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
  const scaled = usePieceScale();

  if (!question.board) {
    return (
      <Text style={styles.missing}>Esta atividade está sem desenho.</Text>
    );
  }

  const designs: BoardSlot[] = JSON.parse(question.board.slots);
  const content: QuestionSlotContent = JSON.parse(question.content);

  const completeSlots = designs.map((design) => {
    const slot = content.slots.find((item) => item.name === design.name);

    return { ...design, blank: slot?.blank ?? false };
  });

  const blankSlots = completeSlots.filter((slot) => slot.blank);
  const alternatives = question.lstAlternative ?? [];
  const board = svgBoard(question.board.viewBox, BOARD_HEIGHT);

  const isComplete = placedCount === blankSlots.length;

  const handleConfirm = async () => {
    setLstWrongSlots([]);

    const response = await onAnswer({ lstFilledSlots: buildFilledSlots() });

    if (!response || response.correct) return;

    setLstWrongSlots(response.lstWrongSlots);

    placements
      .filter((placement) => response.lstWrongSlots.includes(placement.slotName))
      .forEach((placement) => returnToBox(placement.pieceId));
  };

  function buildFilledSlots(): FilledSlot[] {
    return placements.map((placement) => ({
      name: placement.slotName,
      alternativeId: placement.pieceId,
    }));
  }

  function pieceSize(bbox: string) {
    const numbers = bbox.trim().split(/\s+/).map(Number);
    const drawingWidth = numbers[2];
    const drawingHeight = numbers[3];

    const scale = Math.min(
      scaled(PIECE_WIDTH) / drawingWidth,
      scaled(PIECE_HEIGHT) / drawingHeight,
    );

    return { width: drawingWidth * scale, height: drawingHeight * scale };
  }

  return (
    <View style={styles.container}>
      <Text style={mainStyles.activityTitle}>{question.title}</Text>
      <Text style={mainStyles.activitySubtitle}>
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
          <Svg
            viewBox={question.board.viewBox}
            width={board.width}
            height={board.height}
            preserveAspectRatio="xMidYMid meet"
          >
            {completeSlots.map((slot) => {
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
            <DraggablePiece
              key={alternative.id}
              id={alternative.id}
              targets={targets}
              pieces={pieces}
              onDrop={place}
              onMiss={remove}
              snap
              frameStyle={[
                styles.piece,
                { width: scaled(70), height: scaled(80) },
                isPiecePlaced(alternative.id) ? styles.piecePlaced : null,
              ]}
              footer={
                <Text style={[styles.pieceLabel, { fontSize: scaled(10) }]}>
                  {alternative.description}
                </Text>
              }
            >
              <Svg
                viewBox={alternative.bbox}
                width={size.width}
                height={size.height}
              >
                <Path d={alternative.path} fill={COLORS.WARNING} />
              </Svg>
            </DraggablePiece>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={answering || !isComplete}
          style={[
            mainStyles.primaryButton,
            !isComplete ? mainStyles.primaryButtonDisabled : null,
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

  boardCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  boardWrapper: {
    position: "relative",
  },
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
});
