import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import { ActivityProps } from "../types/activity";
import { FilledSlot, QuestionSlotContent } from "../types/subject";

/**
 * DRAG_LETTERS — completar a palavra.
 *
 * Recebe UMA questão pronta da ActivityScreen. Não busca nada, não troca de
 * questão e não navega: só desenha, deixa arrastar e manda a resposta.
 *
 * 1. NÃO TEM BOARD. Não há desenho: tudo que a tela precisa está no `content`.
 *    Por isso aqui não aparecem svgBoard, viewBox, path nem bbox.
 *
 * 2. TEM LETRA DISTRATORA. A UVA oferece 4 letras pra 2 buracos: o E e o O
 *    existem pra estar errados. No banco elas são alternativas com
 *    `correct: false` e sem `correctSlot`.
 *
 * O `name` do slot é a POSIÇÃO ("1", "2", "3"), não a letra. Se fosse a letra,
 * uma palavra como BANANA teria três lugares chamados "A".
 */
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
    isPiecePlaced,
  } = useDragAndDrop();
  const [lstWrongSlots, setLstWrongSlots] = useState<string[]>([]);

  const content: QuestionSlotContent = JSON.parse(question.content);

  const slots = content.slots;
  const blankSlots = slots.filter((slot) => slot.blank);
  const alternatives = question.lstAlternative ?? [];

  // O backend recusa tentativa incompleta como erro de requisição, não como
  // resposta errada. Então não deixa enviar antes de completar.
  const isComplete = placedCount === blankSlots.length;

  const handleConfirm = async () => {
    setLstWrongSlots([]);

    const response = await onAnswer({ lstFilledSlots: buildFilledSlots() });

    // Acertou: a tela já trocou de questão. Não há nada a fazer aqui.
    if (!response || response.correct) return;

    setLstWrongSlots(response.lstWrongSlots);

    // Toda letra que caiu no lugar errado volta pra fileira de baixo.
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

  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>{question.title}</Text>
      <Text style={styles.counter}>
        {placedCount} DE {blankSlots.length} LETRAS
      </Text>

      <TipButton
        tip="Arraste as letras para completar a palavra"
        style={mainStyles.tipButton}
        autoOpen={false}
      />

      {/* A PALAVRA — aqui não há duas camadas: o buraco JÁ é a View que
          recebe a peça, então ele mesmo é o DropTarget. */}
      <View style={styles.questionCard}>
        <View style={styles.answerRow}>
          {content.hint ? (
            <Text style={styles.answerHint}>{content.hint}</Text>
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

      {/* AS LETRAS — todas arrastáveis, inclusive as que não entram na palavra */}
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
  // 56 e não maior: a peça pousa em cima do buraco, e uma peça muito maior que
  // ele cobriria as letras vizinhas.
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
