import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import { ActivityProps } from "../types/activity";

/**
 * DRAG_SUBTRACTION — subtrair entregando itens ao mascote.
 *
 * Recebe UMA questão pronta da ActivityScreen. Não busca nada, não troca de
 * questão e não navega.
 *
 * A criança tem `total` itens e o mascote pede `asked`. Ela arrasta os itens
 * pedidos até ele e conta os que ficaram na cesta — esse é o resultado.
 *
 * Duas coisas diferentes das outras atividades:
 *
 * 1. AS PEÇAS NÃO SÃO ALTERNATIVAS. Cada item é só uma posição (0, 1, 2...);
 *    as alternativas são os números da resposta, como no DotsActivity.
 *
 * 2. O NÚMERO QUE SOBRA NUNCA APARECE ESCRITO. Os itens restantes ficam na
 *    cesta pra criança contar. É o exercício, não uma informação a esconder.
 */

const MASCOT_SLOT = "mascote";

interface SubtractionContent {
  /** Quantos itens a criança tem no começo. */
  total: number;
  /** Quantos o mascote pede. */
  asked: number;
  /** Emoji do item. Sem ele, usa maçã. */
  item?: string;
}

export default function SubtractionActivity({
  question,
  answering,
  onAnswer,
}: ActivityProps) {
  const { targets, pieces, placedCount, place, remove, reset, isPiecePlaced } =
    useDragAndDrop();

  const [alternativeId, setAlternativeId] = useState<number | null>(null);
  const [wrong, setWrong] = useState<boolean>(false);

  const content: SubtractionContent = JSON.parse(question.content);
  const alternatives = question.lstAlternative ?? [];

  const item = content.item ?? "🍎";
  const isComplete = placedCount === content.asked;

  const handleConfirm = async () => {
    if (alternativeId === null) return;

    setWrong(false);

    const response = await onAnswer({ lstAlternativeId: [alternativeId] });

    if (!response || response.correct) return;

    setWrong(true);
    setAlternativeId(null);
    reset();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>{question.title}</Text>

      <TipButton
        tip={`Arraste ${content.asked} para o mascote e conte quantos sobraram na cesta`}
        style={mainStyles.tipButton}
        autoOpen={false}
      />

      {/* O MASCOTE — é ele que recebe os itens */}
      <DropTarget id={MASCOT_SLOT} targets={targets} style={styles.mascotArea}>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            Me dá {content.asked} {item}, por favor!
          </Text>
        </View>

        <Image
          source={require("../../assets/mascoteFeliz.png")}
          style={styles.mascotImage}
        />

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {placedCount} de {content.asked}
          </Text>
        </View>
      </DropTarget>

      {/* A CESTA — o que ainda não foi entregue */}
      <Text style={styles.basketLabel}>SUA CESTA</Text>

      <View style={styles.basket}>
        {Array.from({ length: content.total }).map((_, index) => (
          <DraggablePiece
            key={index}
            id={index}
            targets={targets}
            pieces={pieces}
            onDrop={place}
            onMiss={remove}
            snap={false}
          >
            <View
              style={[
                styles.itemBox,
                isPiecePlaced(index) ? styles.itemBoxGiven : null,
              ]}
            >
              <Text style={styles.itemEmoji}>{item}</Text>
            </View>
          </DraggablePiece>
        ))}
      </View>

      <Text style={styles.instruction}>
        {isComplete
          ? "QUANTOS SOBRARAM NA CESTA?"
          : `ARRASTE ${content.asked} PARA O MASCOTE`}
      </Text>

      <View style={styles.optionsRow}>
        {alternatives.map((alt) => (
          <TouchableOpacity
            key={alt.id}
            style={[
              styles.optionCard,
              alternativeId === alt.id ? styles.optionCardSelected : null,
              !isComplete ? styles.optionCardDisabled : null,
            ]}
            onPress={() => setAlternativeId(alt.id)}
            activeOpacity={0.8}
            disabled={!isComplete}
            accessibilityRole="button"
            accessibilityLabel={alt.description}
          >
            <Text
              style={[
                styles.optionText,
                alternativeId === alt.id ? styles.optionTextSelected : null,
              ]}
            >
              {alt.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {wrong ? (
        <Text style={styles.wrongText}>
          Não foi essa. Conte os {item} da cesta e tente de novo.
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          mainStyles.primaryButton,
          alternativeId === null ? styles.buttonDisabled : null,
        ]}
        onPress={handleConfirm}
        disabled={answering || alternativeId === null}
      >
        <Text style={mainStyles.primaryButtonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.2,
    textAlign: "center",
  },

  // O MASCOTE
  mascotArea: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    minHeight: 190,
    marginBottom: 18,
  },
  speechBubble: {
    backgroundColor: COLORS.SURFACE_PRIMARY,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 6,
    maxWidth: "85%",
  },
  speechText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    textAlign: "center",
  },
  mascotImage: {
    width: 110,
    height: 110,
    resizeMode: "contain",
  },
  counterBadge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: COLORS.SURFACE_GREEN,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  counterText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.SUCCESS,
  },

  // A CESTA
  basketLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginBottom: 8,
  },
  basket: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  itemBox: {
    width: 52,
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  itemBoxGiven: {
    borderColor: COLORS.SUCCESS,
  },
  itemEmoji: {
    fontSize: 28,
  },

  instruction: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.4,
    textAlign: "center",
    marginBottom: 12,
  },

  optionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  optionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionCardSelected: {
    borderColor: COLORS.PRIMARY_LIGHT,
    backgroundColor: COLORS.SURFACE_PRIMARY,
  },
  optionCardDisabled: {
    opacity: 0.45,
  },
  optionText: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  optionTextSelected: {
    color: COLORS.PRIMARY_LIGHT,
  },

  wrongText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.DANGER,
    textAlign: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});