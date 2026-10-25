import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import usePieceScale from "../hooks/usePieceScale";
import { ActivityProps } from "../types/activity";
import { FilledSlot, QuestionSlotContent } from "../types/subject";

export default function LettersActivity({
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
    isSlotFree,
    isPiecePlaced,
  } = useDragAndDrop();
  const [lstWrongSlots, setLstWrongSlots] = useState<string[]>([]);
  const scaled = usePieceScale();

  const content: QuestionSlotContent = JSON.parse(question.content);

  const slots = content.slots;
  const blankSlots = slots.filter((slot) => slot.blank);
  const alternatives = question.lstAlternative ?? [];

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

  return (
    <View style={styles.container}>
      <Text style={mainStyles.activityTitle}>{question.title}</Text>
      <Text style={mainStyles.activitySubtitle}>
        {placedCount} DE {blankSlots.length} LETRAS
      </Text>

      <TipButton
        tip="Arraste as letras para completar a palavra"
        style={mainStyles.tipButton}
        autoOpen={false}
      />

      <View style={styles.questionCard}>
        <View style={styles.answerRow}>
          {content.hint ? (
            <Text style={styles.answerHint}>{content.hint}</Text>
          ) : null}

          {slots.map((slot) => {
            if (!slot.blank) {
              return (
                <Text
                  key={slot.name}
                  style={[
                    styles.answerLetter,
                    {
                      width: scaled(46),
                      height: scaled(56),
                      fontSize: scaled(46),
                      lineHeight: scaled(52),
                    },
                  ]}
                >
                  {slot.label}
                </Text>
              );
            }

            const isWrong =
              lstWrongSlots.includes(slot.name) && !isSlotFilled(slot.name);

            return (
              <DropTarget
                key={slot.name}
                id={slot.name}
                targets={targets}
                style={[
                  styles.answerSlot,
                  { width: scaled(52), height: scaled(56) },
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

      <View style={styles.tilesGrid}>
        {alternatives.map((alternative) => (
          <DraggablePiece
            key={alternative.id}
            id={alternative.id}
            targets={targets}
            pieces={pieces}
            onDrop={place}
            onMiss={remove}
            canDrop={(slotName) => isSlotFree(slotName, alternative.id)}
            snap
          >
            <View
              style={[
                styles.tile,
                { width: scaled(56), height: scaled(56) },
                isPiecePlaced(alternative.id) ? styles.tilePlaced : null,
              ]}
            >
              <Text style={[styles.tileText, { fontSize: scaled(30) }]}>
                {alternative.description}
              </Text>
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

  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 12,
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  answerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    rowGap: 12,
  },
  answerHint: {
    fontSize: 40,
    lineHeight: 46,
    marginRight: 4,
  },
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

  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
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
});
