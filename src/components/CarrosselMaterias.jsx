import { View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet } from "react-native";
import { useState, useRef } from "react";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

function CardMateria({ item, colors, fontScale, onPress }) {
  return (
    <View style={[styles.dailyCard, { backgroundColor: colors.PRIMARY_LIGHT, width: CARD_WIDTH }]}>
      <Text style={[styles.dailyLabel, { fontSize: 12 * fontScale }]}>ATIVIDADE DO DIA</Text>

      <View style={styles.dailySubject}>
        <View style={styles.dailyIconBox}>
          <Text style={styles.dailyIcon}>{item.icone}</Text>
        </View>
        <View>
          <Text style={[styles.dailySubjectName, { fontSize: 20 * fontScale }]}>{item.materia}</Text>
          <Text style={[styles.dailySubjectDesc, { fontSize: 14 * fontScale }]}>{item.descricao}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.dailyButton, { backgroundColor: colors.CARD }]}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <Text style={[styles.dailyButtonText, { color: colors.PRIMARY_LIGHT, fontSize: 17 * fontScale }]}>
          ▶ Continuar matérias
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CarrosselMaterias({ materias, colors, fontScale, onPressMateria }) {
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const listRef = useRef(null);

  const aoRolar = (evento) => {
    const indice = Math.round(evento.nativeEvent.contentOffset.x / CARD_WIDTH);
    setIndiceAtivo(indice);
  };

  if (!materias || materias.length === 0) {
    return null;
  }

  return (
    <View style={{ marginBottom: 24 }}>
      <FlatList
        ref={listRef}
        data={materias}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={aoRolar}
        renderItem={({ item }) => (
          <CardMateria
            item={item}
            colors={colors}
            fontScale={fontScale}
            onPress={() => onPressMateria(item)}
          />
        )}
      />

      <View style={styles.dots}>
        {materias.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === indiceAtivo ? colors.PRIMARY : colors.BORDER_LIGHT },
              i === indiceAtivo && styles.dotAtivo,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dailyCard: {
    height: 280,
    borderRadius: 22,
    padding: 20,
  },
  dailyLabel: {
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.2,
    marginBottom: 34,
  },
  dailySubject: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  dailyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  dailyIcon: { fontSize: 26 },
  dailySubjectName: { fontWeight: "700", color: "#fff", marginBottom: 3 },
  dailySubjectDesc: { color: "rgba(255,255,255,0.75)" },
  dailyButton: {
    width: "100%",
    height: 60,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  dailyButtonText: { fontWeight: "700" },
  dots: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 3 },
  dotAtivo: { width: 16 },
});