import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import mainStyles from "../styles/theme";
import BackButton from "../components/BackButton";
import { COLORS } from "../styles/colors";
import TipButton from "../components/TipButton";

/**
 * Dados estáticos até o backend mandar o board.
 * Mesmo formato do mapa: um tabuleiro com slots nomeados, cada peça sabendo
 * em qual slot ela cai. Trocar o mapa por este corpo é só trocar os dados —
 * é a ideia de "um renderer de SVG serve pras duas atividades".
 *
 * `bbox` é o recorte do path pra desenhar a peça sozinha, em tamanho de card.
 */
const STATIC_BOARD = {
  // Recortado no corpo em si (x 90-210, y 24-312) em vez dos 300x340 cheios —
  // sem isso sobra muito vazio dos lados e o card fica alto à toa.
  viewBox: "84 18 132 300",
  slots: [
    {
      id: "cabeca",
      name: "Cabeça",
      path: "M122 52 A28 28 0 1 0 178 52 A28 28 0 1 0 122 52 Z",
      bbox: "116 18 68 68",
      blank: true,
    },
    {
      id: "tronco",
      name: "Tronco",
      path:
        "M136 86 L164 86 Q184 86 184 106 L184 182 Q184 202 164 202 L136 202 Q116 202 116 182 L116 106 Q116 86 136 86 Z",
      bbox: "110 80 80 128",
      blank: false, // já colocado, pro aluno ter uma âncora
    },
    {
      id: "braco-esquerdo",
      name: "Braço esq.",
      path:
        "M102 94 Q114 94 114 106 L114 184 Q114 196 102 196 Q90 196 90 184 L90 106 Q90 94 102 94 Z",
      bbox: "84 88 36 114",
      blank: true,
    },
    {
      id: "braco-direito",
      name: "Braço dir.",
      path:
        "M198 94 Q210 94 210 106 L210 184 Q210 196 198 196 Q186 196 186 184 L186 106 Q186 94 198 94 Z",
      bbox: "180 88 36 114",
      blank: true,
    },
    {
      id: "perna-esquerda",
      name: "Perna esq.",
      path:
        "M135 206 Q148 206 148 219 L148 299 Q148 312 135 312 Q122 312 122 299 L122 219 Q122 206 135 206 Z",
      bbox: "116 200 38 118",
      blank: true,
    },
    {
      id: "perna-direita",
      name: "Perna dir.",
      path:
        "M165 206 Q178 206 178 219 L178 299 Q178 312 165 312 Q152 312 152 299 L152 219 Q152 206 165 206 Z",
      bbox: "146 200 38 118",
      blank: true,
    },
  ],
};

// Altura do tabuleiro. É o único número a mexer se ainda não couber.
const BOARD_H = 210;

// Espaço que a peça tem dentro do card.
const PIECE_W = 40;
const PIECE_H = 44;

/**
 * Dimensiona a peça pela proporção do próprio `bbox`, em vez de espremer todas
 * num quadrado. Sem isso, um braço (36 x 114) vira uma fatia de ~10px e some.
 */
function tamanhoDaPeca(bbox: string) {
  const [, , w, h] = bbox.split(" ").map(Number);
  const escala = Math.min(PIECE_W / w, PIECE_H / h);
  return { width: w * escala, height: h * escala };
}

const TOTAL = STATIC_BOARD.slots.length;
const COLOCADAS = STATIC_BOARD.slots.filter((s) => !s.blank).length;

// As peças são os slots que ainda faltam — na vida real, embaralhados.
const PECAS = STATIC_BOARD.slots.filter((s) => s.blank);

export default function ActivityScreen4() {
  const [selecionada, setSelecionada] = useState<string | null>(null);

  return (
    <View style={mainStyles.component}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <Text style={styles.questionTitle}>Complete o corpo</Text>
        <Text style={styles.counter}>
          {COLOCADAS} DE {TOTAL} PARTES
        </Text>

        <TipButton
          tip="Arraste as partes do corpo para o lugar certo"
          style={styles.tipButton}
          autoOpen={false}
        />

        {/* ZONA 1 — card branco com o tabuleiro */}
        <View style={styles.boardCard}>
          <Svg
            viewBox={STATIC_BOARD.viewBox}
            width={BOARD_H * (132 / 300)}
            height={BOARD_H}
            preserveAspectRatio="xMidYMid meet"
          >
            {STATIC_BOARD.slots.map((slot) => (
              <Path
                key={slot.id}
                d={slot.path}
                fill={slot.blank ? "#fff" : COLORS.SURFACE_ORANGE}
                stroke={slot.blank ? COLORS.PRIMARY_LIGHT : COLORS.WARNING}
                strokeWidth={2.5}
                strokeDasharray={slot.blank ? "6 5" : undefined}
                strokeLinejoin="round"
              />
            ))}
          </Svg>
        </View>

        {/* ZONA 2 — dica */}
        <Text style={styles.questionLabel}>
          *Arraste as partes do corpo para o lugar certo!
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
              <Svg viewBox={peca.bbox} {...tamanhoDaPeca(peca.bbox)}>
                <Path d={peca.path} fill={COLORS.WARNING} />
              </Svg>
              <Text style={styles.pieceLabel}>{peca.name}</Text>
            </TouchableOpacity>
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

  // ZONA 1 — tabuleiro
  boardCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
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
  pieceSelected: {
    borderColor: COLORS.WARNING,
    backgroundColor: COLORS.SURFACE_ORANGE,
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
