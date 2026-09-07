import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import mainStyles from "../styles/theme";
import BackButton from "../components/BackButton";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";

/**
 * Dados estáticos até o backend mandar o board.
 * É o formato que a gente desenhou: um tabuleiro com slots nomeados, e cada
 * peça sabendo em qual slot ela deveria cair (`correctSlot`).
 *
 * `bbox` é o recorte do path pra desenhar a peça sozinha, em tamanho de card.
 */
const STATIC_BOARD = {
  viewBox: "0 0 300 340",
  slots: [
    {
      id: "norte",
      name: "Norte",
      path:
        "M108 10 L140 14 L171 18 L186 40 L192 51 L205 62 L205 130 L192 158 L108 168 L73 165 L60 150 L30 145 L14 124 L11 106 L26 94 L39 82 L48 56 L59 38 L80 18 Z",
      bbox: "5 4 206 170",
      blank: true,
    },
    {
      id: "nordeste",
      name: "Nordeste",
      path:
        "M205 62 L228 70 L252 74 L272 86 L286 104 L282 124 L272 146 L270 172 L269 199 L206 199 L192 158 L205 130 Z",
      bbox: "186 56 106 149",
      blank: true,
    },
    {
      id: "centro-oeste",
      name: "Centro-Oeste",
      path:
        "M108 168 L192 158 L206 199 L196 214 L155 240 L122 248 L108 210 L101 184 Z",
      bbox: "95 152 117 102",
      blank: false, // já colocada, pro aluno ver como funciona
    },
    {
      id: "sudeste",
      name: "Sudeste",
      path:
        "M206 199 L269 199 L258 216 L240 231 L216 246 L193 256 L155 240 L196 214 Z",
      bbox: "149 193 126 69",
      blank: true,
    },
    {
      id: "sul",
      name: "Sul",
      path:
        "M122 248 L155 240 L193 256 L186 274 L172 296 L156 316 L146 328 L130 312 L122 292 L118 268 Z",
      bbox: "112 234 87 100",
      blank: true,
    },
  ],
};

const TOTAL = STATIC_BOARD.slots.length;
const COLOCADAS = STATIC_BOARD.slots.filter((s) => !s.blank).length;

// As peças são os slots que ainda faltam, embaralhados na vida real.
const PECAS = STATIC_BOARD.slots.filter((s) => s.blank);

export default function ActivityScreen3() {
  const [selecionada, setSelecionada] = useState<string | null>(null);

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>Monte o mapa</Text>
        <Text style={styles.counter}>
          {COLOCADAS} DE {TOTAL} REGIÕES
        </Text>

        <TipButton
          tip="Arraste cada região para o seu lugar no mapa"
          style={styles.tipButton}
          autoOpen={false}
        />

        {/* ZONA 1 — card branco com o tabuleiro */}
        <View style={styles.boardCard}>
          <Svg viewBox={STATIC_BOARD.viewBox} style={styles.board}>
            {STATIC_BOARD.slots.map((slot) => (
              <Path
                key={slot.id}
                d={slot.path}
                fill={slot.blank ? "#fff" : COLORS.SURFACE_PRIMARY}
                stroke={slot.blank ? COLORS.BORDER_LIGHT : COLORS.PRIMARY_LIGHT}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}
          </Svg>
        </View>

        {/* ZONA 2 — dica */}
        <Text style={styles.questionLabel}>
          *Arraste cada região para o seu lugar!
        </Text>

        {/* ZONA 3 — peças soltas sobre o fundo */}
        <View style={styles.piecesGrid}>
          {PECAS.map((peca) => (
            <TouchableOpacity
              key={peca.id}
              style={[
                styles.piece,
                selecionada === peca.id && styles.pieceSelected,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelecionada(peca.id)}
            >
              <Svg viewBox={peca.bbox} style={styles.pieceShape}>
                <Path d={peca.path} fill={COLORS.PRIMARY} />
              </Svg>
              <Text style={styles.pieceLabel}>{peca.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ZONA 4 — confirmar */}
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={0.85} style={mainStyles.primaryButton}>
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
    marginBottom: 12,
  },

  // ZONA 1 — tabuleiro
  boardCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    width: "100%",
    aspectRatio: 300 / 340,
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

  // ZONA 3 — peças
  piecesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  piece: {
    width: 76,
    height: 88,
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  pieceSelected: {
    borderColor: COLORS.PRIMARY_LIGHT,
    backgroundColor: COLORS.SURFACE_PRIMARY,
  },
  pieceShape: {
    width: 40,
    height: 40,
  },
  pieceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.TEXT_MUTED,
  },

  // ZONA 4 — confirmar
  footer: {
    marginTop: 32,
  },
});
