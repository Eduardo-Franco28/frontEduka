import { View, Modal, Text, Pressable, StyleSheet } from "react-native";
import { COLORS } from "../styles/colors";
import * as Speech from "expo-speech"
import { useEffect } from "react";

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

  const speaker = () =>{
    Speech.speak(tip);
  }

  useEffect(() =>{
    if(visible)
      speaker()
  }, [visible])

  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.tipPanel}>
          <Text style={styles.tipText}>{tip}</Text>
          <Pressable style={styles.tipCloseBtn} onPress={onClose}>
            <Text style={styles.tipCloseBtnText}>Fechar Dica!</Text>
          </Pressable>
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
  },

  tipPanel: {
    width: 350,
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 40,
    padding: 15,
    justifyContent: "center",
    alignItems: "center"
  },

  tipText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 100,
    marginTop: 40
  },

  tipCloseBtn: {
    paddingHorizontal: 80,
    paddingVertical: 20,
    fontSize: 24,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 24
  },

  tipCloseBtnText: {
    fontSize: 20,
    color: "#fff"
  }
});
