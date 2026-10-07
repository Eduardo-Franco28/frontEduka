import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import mainStyles from "../styles/theme";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";
import usePieceScale from "../hooks/usePieceScale";
import { ActivityProps } from "../types/activity";

/**
 * DRAG_SUBTRACTION — subtrair entregando itens a um amigo.
 *
 * Recebe UMA questão pronta da ActivityScreen. Não busca nada, não troca de
 * questão e não navega.
 *
 * A criança tem `total` itens e o amigo pede `asked`. Ela arrasta os itens
 * pedidos até ele e conta os que ficaram na cesta — esse é o resultado.
 *
 * Duas coisas diferentes das outras atividades:
 *
 * 1. AS PEÇAS NÃO SÃO ALTERNATIVAS. Cada item é só uma posição (0, 1, 2...);
 *    as alternativas são os números da resposta, como no DotsActivity.
 *
 * 2. O NÚMERO QUE SOBRA NUNCA APARECE ESCRITO. Os itens restantes ficam na
 *    cesta pra criança contar. É o exercício, não uma informação a esconder.
 *
 * A área de entrega é um alvo só, embora mostre um círculo por item pedido:
 * alvo grande é mais fácil de acertar, e os círculos enchem em ordem.
 */

const DELIVERY_SLOT = "entrega";

interface SubtractionContent {
  /** Quantos itens a criança tem no começo. */
  total: number;
  /** Quantos o amigo pede. */
  asked: number;
  /** Emoji do item. Sem ele, usa maçã. */
  item?: string;
  /** Nome do amigo que pede. Sem ele, usa o mascote sem nome. */
  friend?: string;
}

export default function SubtractionActivity({
  question,
  answering,
  onAnswer,
}: ActivityProps) {
  const { targets, pieces, placedCount, place, remove, reset, isPiecePlaced } =
    useDragAndDrop();

  const [alternativeId, setAlternativeId] = useState<number | null>(null);
  // Peças e alvos crescem com o tamanho escolhido na Acessibilidade.
  const scaled = usePieceScale();
  const [wrong, setWrong] = useState<boolean>(false);

  const content: SubtractionContent = JSON.parse(question.content);
  const alternatives = question.lstAlternative ?? [];

  const item = content.item ?? "🍎";
  const friend = content.friend ?? "Amigo";
  const isComplete = placedCount >= content.asked;

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
        tip={`Arraste ${content.asked} para ${friend} e conte quantos sobraram na cesta`}
        style={mainStyles.tipButton}
        autoOpen={false}
      />

      <View style={styles.friendCard}>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {Math.min(placedCount, content.asked)} DE {content.asked}
          </Text>
        </View>

        <View style={styles.friendRow}>
          <Image
            source={require("../../assets/mascoteFeliz.png")}
            style={styles.friendImage}
          />

          <View style={styles.speechBubble}>
            <Text style={styles.friendName}>{friend.toUpperCase()}</Text>
            <Text style={styles.speechText}>
              Você poderia me dar {content.asked} {item}, por favor?
            </Text>
          </View>
        </View>

        <DropTarget
          id={DELIVERY_SLOT}
          targets={targets}
          style={styles.deliveryRow}
        >
          <Text style={styles.deliveryLabel}>
            DÊ AS {item} AQUI
          </Text>

          <View style={styles.deliverySlots}>
            {Array.from({ length: content.asked }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.deliverySlot,
                  {
                    width: scaled(44),
                    height: scaled(44),
                    borderRadius: scaled(44) / 2,
                  },
                  index < placedCount ? styles.deliverySlotFilled : null,
                ]}
              >
                {index < placedCount ? (
                  <Text style={[styles.deliveryEmoji, { fontSize: scaled(24) }]}>{item}</Text>
                ) : null}
              </View>
            ))}
          </View>
        </DropTarget>
      </View>

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
                { width: scaled(56), height: scaled(56) },
                isPiecePlaced(index) ? styles.itemBoxGiven : null,
              ]}
            >
              {isPiecePlaced(index) ? null : (
                <Text style={[styles.itemEmoji, { fontSize: scaled(30) }]}>{item}</Text>
              )}
            </View>
          </DraggablePiece>
        ))}
      </View>

      <Text style={styles.instruction}>
        {isComplete ? "TOQUE O NÚMERO CERTO" : `ARRASTE ${content.asked} PARA ${friend.toUpperCase()}`}
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
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 14,
  },

  // O AMIGO
  friendCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
  },
  counterBadge: {
    position: "absolute",
    right: 14,
    top: 14,
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    zIndex: 2,
  },
  counterText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.8,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  friendImage: {
    width: 76,
    height: 76,
    resizeMode: "contain",
  },
  speechBubble: {
    flex: 1,
    backgroundColor: COLORS.SURFACE_PRIMARY,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 18,
  },
  friendName: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.PRIMARY,
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  speechText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 19,
  },

  // A ÁREA DE ENTREGA
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
    paddingTop: 14,
  },
  deliveryLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.2,
  },
  deliverySlots: {
    flexDirection: "row",
    gap: 8,
  },
  deliverySlot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.BORDER_WARM,
    alignItems: "center",
    justifyContent: "center",
  },
  deliverySlotFilled: {
    borderStyle: "solid",
    borderColor: COLORS.PRIMARY_LIGHT,
    backgroundColor: COLORS.SURFACE_PRIMARY,
  },
  deliveryEmoji: {
    fontSize: 24,
  },

  // A CESTA
  basketLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: COLORS.TEXT_MUTED,
    textAlign: "center",
    marginBottom: 10,
  },
  basket: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 18,
  },
  itemBox: {
    width: 56,
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  itemBoxGiven: {
    backgroundColor: "transparent",
    borderStyle: "dashed",
    borderColor: COLORS.BORDER_LIGHT,
  },
  itemEmoji: {
    fontSize: 30,
  },

  instruction: {
    fontSize: 11,
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