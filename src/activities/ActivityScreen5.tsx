import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import mainStyles from "../styles/theme";
import BackButton from "../components/BackButton";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";
import DropTarget from "../components/DropTarget";
import DraggablePiece from "../components/DraggablePiece";
import useDragAndDrop from "../hooks/useDragAndDrop";

/**
 * Dados estáticos até o backend mandar o board.
 *
 * Este é o tabuleiro do tipo "zones": em vez de buracos com formato, os alvos
 * são áreas que aceitam VÁRIAS peças. É a única das quatro atividades em que
 * um mesmo `correctZone` se repete — o mar recebe golfinho e peixe.
 * Por isso não precisa de SVG: as zonas são cartões.
 */
const STATIC_BOARD = {
  zones: [
    {
      id: "mar",
      name: "MAR",
      cores: [COLORS.SURFACE_BLUE, COLORS.INFO] as const,
      cor: COLORS.INFO,
    },
    {
      id: "floresta",
      name: "FLORESTA",
      cores: [COLORS.SURFACE_GREEN, COLORS.SUCCESS] as const,
      cor: COLORS.SUCCESS,
    },
    {
      id: "savana",
      name: "SAVANA",
      cores: [COLORS.SURFACE_ORANGE, COLORS.WARNING] as const,
      cor: COLORS.WARNING,
    },
  ],
  animais: [
    { id: "golfinho", name: "Golfinho", emoji: "🐬", correctZone: "mar" },
    { id: "peixe", name: "Peixe", emoji: "🐠", correctZone: "mar" },
    { id: "macaco", name: "Macaco", emoji: "🐒", correctZone: "floresta" },
    { id: "tucano", name: "Tucano", emoji: "🦜", correctZone: "floresta" },
    { id: "leao", name: "Leão", emoji: "🦁", correctZone: "savana" },
    { id: "zebra", name: "Zebra", emoji: "🦓", correctZone: "savana" },
  ],
};

const TOTAL = STATIC_BOARD.animais.length;

export default function ActivityScreen5() {
  const { targets, placements, placedCount, place, remove } = useDragAndDrop();

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>Onde eles vivem?</Text>
        <Text style={styles.counter}>
          {placedCount} DE {TOTAL} ANIMAIS
        </Text>

        <TipButton
          tip="Arraste cada animal para o cenário onde ele vive"
          style={styles.tipButton}
          autoOpen={false}
        />

        {/* ZONA 1 — os cenários, que recebem vários animais cada */}
        <View style={styles.zonesGrid}>
          {STATIC_BOARD.zones.map((zone) => (
            <DropTarget
              key={zone.id}
              id={zone.id}
              targets={targets}
              style={styles.zone}
            >
              <LinearGradient
                colors={[...zone.cores]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.zoneFill}
              >
                <View style={styles.zoneBadge}>
                  <Text style={[styles.zoneBadgeText, { color: zone.cor }]}>
                    {zone.name}
                  </Text>
                </View>
              </LinearGradient>
            </DropTarget>
          ))}
        </View>

        {/* ZONA 2 — dica */}
        <Text style={styles.questionLabel}>
          *Arraste cada animal para o seu cenário!
        </Text>

        {/* ZONA 3 — peças soltas sobre o fundo */}
        <View style={styles.piecesGrid}>
          {STATIC_BOARD.animais.map((animal) => (
            <DraggablePiece
              key={animal.id}
              id={animal.id}
              targets={targets}
              onDrop={place}
              onMiss={remove}
              // Um cenário recebe vários animais: sem o snap eles não empilham
              // todos no centro do cartão.
              snap={false}
            >
              <View
                style={[
                  styles.piece,
                  placements[animal.id] ? styles.piecePlaced : null,
                ]}
              >
                <Text style={styles.pieceEmoji}>{animal.emoji}</Text>
                <Text style={styles.pieceLabel}>{animal.name}</Text>
              </View>
            </DraggablePiece>
          ))}
        </View>

        {/* ZONA 4 — confirmar */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={mainStyles.primaryButton}
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

  // Só o posicionamento — a aparência mora no TipButton
  tipButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },

  // ZONA 1 — cenários
  zonesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  zone: {
    width: "47%",
    height: 112,
    borderRadius: 18,
    overflow: "hidden",
  },
  zoneFill: {
    flex: 1,
    padding: 10,
  },
  zoneBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  zoneBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
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

  // ZONA 3 — peças
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

  // ZONA 4 — confirmar
  footer: {
    marginTop: 20,
  },
});
