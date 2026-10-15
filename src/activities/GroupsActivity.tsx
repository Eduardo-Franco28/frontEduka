import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import usePieceScale from "../hooks/usePieceScale";
import { ActivityProps } from "../types/activity";
import { FilledSlot, QuestionSlotContent } from "../types/subject";

const GROUP_PALETTE = [
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

export default function GroupsActivity({
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
    isPiecePlaced,
  } = useDragAndDrop();
  const [lstWrongSlots, setLstWrongSlots] = useState<string[]>([]);
  const scaled = usePieceScale();

  const content: QuestionSlotContent = JSON.parse(question.content);

  const groups = content.slots;
  const items = question.lstAlternative ?? [];

  const isComplete = placedCount === items.length;

  const handleConfirm = async () => {
    setLstWrongSlots([]);

    const response = await onAnswer({ lstFilledSlots: buildFilledSlots() });

    if (!response || response.correct) return;

    setLstWrongSlots(response.lstWrongSlots);

    placements
      .filter((placement) =>
        response.lstWrongSlots.includes(placement.slotName),
      )
      .forEach((placement) => returnToBox(placement.pieceId));
  };

  function buildFilledSlots(): FilledSlot[] {
    return placements.map((placement) => ({
      name: placement.slotName,
      alternativeId: placement.pieceId,
    }));
  }

  function countIn(groupName: string) {
    return placements.filter((placement) => placement.slotName === groupName)
      .length;
  }

  return (
    <View style={styles.container}>
      <Text style={mainStyles.activityTitle}>{question.title}</Text>
      <Text style={mainStyles.activitySubtitle}>
        {placedCount} DE {items.length} PEÇAS
      </Text>

      <TipButton
        tip="Arraste cada item para o grupo certo"
        style={mainStyles.tipButton}
        autoOpen={false}
      />

      <View style={styles.groupsGrid}>
        {groups.map((group, position) => {
          const palette = GROUP_PALETTE[position % GROUP_PALETTE.length];
          const isWrong = lstWrongSlots.includes(group.name);
          const total = countIn(group.name);

          return (
            <DropTarget
              key={group.name}
              id={group.name}
              targets={targets}
              style={[
                styles.group,
                { height: scaled(112) },
                isWrong ? styles.groupWrong : null,
              ]}
            >
              <LinearGradient
                colors={[...palette.colors]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.groupFill}
              >
                <View style={styles.groupBadge}>
                  <Text
                    style={[
                      styles.groupBadgeText,
                      { color: palette.badge, fontSize: scaled(10) },
                    ]}
                  >
                    {group.label ?? group.name.toUpperCase()}
                  </Text>
                </View>

                {total > 0 ? (
                  <Text style={[styles.groupCount, { fontSize: scaled(20) }]}>{total}</Text>
                ) : null}
              </LinearGradient>
            </DropTarget>
          );
        })}
      </View>

      <Text style={styles.questionLabel}>
        *Arraste cada item para o seu grupo!
      </Text>

      <View style={styles.piecesGrid}>
        {items.map((item) => (
          <DraggablePiece
            key={item.id}
            id={item.id}
            targets={targets}
            pieces={pieces}
            onDrop={place}
            onMiss={remove}
            snap={false}
            frameStyle={[
              styles.piece,
              { width: scaled(66), height: scaled(78) },
              isPiecePlaced(item.id) ? styles.piecePlaced : null,
            ]}
            footer={
              <Text style={[styles.pieceLabel, { fontSize: scaled(10) }]}>
                {item.description}
              </Text>
            }
          >
            <Text style={[styles.pieceEmoji, { fontSize: scaled(30) }]}>
              {item.icon}
            </Text>
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

  groupsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  group: {
    width: "47%",
    height: 112,
    borderRadius: 18,
    overflow: "hidden",
  },
  groupWrong: {
    borderWidth: 3,
    borderColor: COLORS.DANGER,
  },
  groupFill: {
    flex: 1,
    padding: 10,
  },
  groupBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  groupBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  groupCount: {
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
});
