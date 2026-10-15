import {
  View,
  Modal,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import * as Speech from "expo-speech";
import { useEffect } from "react";
import useTheme from "../hooks/useTheme";

interface TipActivityProps {
  tip: string;
  visible: boolean;
  onClose: () => void;
}

export default function TipActivity({
  tip,
  visible,
  onClose,
}: TipActivityProps) {
  const { colors, fontScale } = useTheme();

  const speaker = () => {
    if (!visible) return;

    Speech.speak(tip);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.tipPanel, { backgroundColor: colors.CARD }]}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: colors.PRIMARY, shadowColor: colors.PRIMARY },
            ]}
          >
            <FontAwesomeFreeSolid name="lightbulb" size={28} color="#fff" />
          </View>

          <Text
            style={[
              styles.title,
              { color: colors.TEXT_PRIMARY, fontSize: 22 * fontScale },
            ]}
          >
            Dica
          </Text>

          <Text
            style={[
              styles.tipText,
              {
                color: colors.TEXT_SUBTLE,
                fontSize: 18 * fontScale,
                lineHeight: 28 * fontScale,
              },
            ]}
          >
            {tip}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.speakButton,
                { backgroundColor: colors.SURFACE_PRIMARY },
              ]}
              activeOpacity={0.7}
              accessibilityLabel="Ouvir a dica"
              onPress={() => speaker()}
            >
              <FontAwesomeFreeSolid
                name="volume-high"
                size={20}
                color={colors.PRIMARY}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor: colors.PRIMARY,
                  shadowColor: colors.PRIMARY,
                },
              ]}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={[styles.closeButtonText, { fontSize: 17 * fontScale }]}>
                Entendi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  tipPanel: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontWeight: "800",
    marginBottom: 12,
  },
  tipText: {
    textAlign: "center",
    marginBottom: 24,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  speakButton: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
