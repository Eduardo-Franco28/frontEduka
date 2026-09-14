import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import { ActivityProps } from "../types/activity";
import { FilledSlot, QuestionSlotContent } from "../types/subject";

/**
 * DRAG_SLOTS_TO_GROUP — classificar em grupos.
 *
 * Recebe UMA questão pronta da ActivityScreen. Não busca nada, não troca de
 * questão e não navega: só desenha, deixa arrastar e manda a resposta.
 *
 * Os grupos são os lugares e os itens são as peças. Três diferenças que só
 * existem aqui:
 *
 * 1. UM GRUPO RECEBE VÁRIAS PEÇAS. O mar fica com golfinho e peixe. Quem
 *    permite isso no backend é o próprio tipo da questão.
 *
 * 2. SEM SNAP. Se as peças pulassem pro centro do grupo, as duas do mar
 *    empilhariam no mesmo ponto e a de baixo desapareceria.
 *
 * 3. A PEÇA É UM EMOJI, não um desenho: vem do campo `icon` da alternativa.
 *
 * As cores dos grupos são design, não dado: a paleta abaixo é aplicada na
 * ordem em que os grupos chegam.
 */

// Um par de cores por grupo, na ordem em que eles vêm do backend.
// Se um dia entrar um quarto grupo, a paleta recomeça do primeiro.
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

  const content: QuestionSlotContent = JSON.parse(question.content);

  const groups = content.slots;
  const items = question.lstAlternative ?? [];

  // Aqui "terminou" é ter colocado todas as peças, não uma por grupo — são 6
  // animais em 3 lugares. É a mesma conta que o backend faz.
  const isComplete = placedCount === items.length;

  const handleConfirm = async () => {
    setLstWrongSlots([]);

    const response = await onAnswer({ lstFilledSlots: buildFilledSlots() });

    // Acertou: a tela já trocou de questão. Não há nada a fazer aqui.
    if (!response || response.correct) return;

    setLstWrongSlots(response.lstWrongSlots);

    // Toda peça que foi pro grupo errado volta pra fileira de baixo.
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
   * Quantas peças estão neste grupo.
   *
   * Nas outras atividades bastava saber "tem peça ou não". Aqui o número
   * importa: é ele que mostra à criança que o mar já recebeu dois.
   */
  function countIn(groupName: string) {
    return placements.filter((placement) => placement.slotName === groupName)
      .length;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>{question.title}</Text>
      <Text style={styles.counter}>
        {placedCount} DE {items.length} PEÇAS
      </Text>

      <TipButton
        tip="Arraste cada item para o grupo certo"
        style={mainStyles.tipButton}
        autoOpen={false}
      />

      {/* OS GRUPOS — o alvo já é uma View, então ele mesmo é o DropTarget */}
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
                // O vermelho não espera o grupo esvaziar: ele recebe várias
                // peças, então "vazio" não é sinal de nada. O aviso sai no
                // próximo Confirmar.
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
                    style={[styles.groupBadgeText, { color: palette.badge }]}
                  >
                    {group.label ?? group.name.toUpperCase()}
                  </Text>
                </View>

                {total > 0 ? (
                  <Text style={styles.groupCount}>{total}</Text>
                ) : null}
              </LinearGradient>
            </DropTarget>
          );
        })}
      </View>

      <Text style={styles.questionLabel}>
        *Arraste cada item para o seu grupo!
      </Text>

      {/* AS PEÇAS */}
      <View style={styles.piecesGrid}>
        {items.map((item) => (
          <DraggablePiece
            key={item.id}
            id={item.id}
            targets={targets}
            pieces={pieces}
            onDrop={place}
            onMiss={remove}
            // Um grupo recebe várias peças: com snap elas empilhariam todas
            // no centro do cartão.
            snap={false}
          >
            <View
              style={[
                styles.piece,
                isPiecePlaced(item.id) ? styles.piecePlaced : null,
              ]}
            >
              <Text style={styles.pieceEmoji}>{item.icon}</Text>
              <Text style={styles.pieceLabel}>{item.description}</Text>
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

  // OS GRUPOS
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
  // Quantas peças já caíram aqui. Fica no canto pra não brigar com as peças,
  // que pousam soltas por cima do cartão.
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

  // AS PEÇAS
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
