import {
  View,
  Modal,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import useTheme from "../hooks/useTheme";
import { PinOperation } from "../enums/PinOperationEnum";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

interface PinModalProps {
  visible: boolean;
  operation: PinOperation;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  error?: string | null;
  loading?: boolean;
  locked?: boolean;
}

const PIN_LENGTH = 4;

export default function PinModal({
  visible,
  operation,
  onClose,
  onConfirm,
  error,
  loading = false,
  locked = false,
}: PinModalProps) {
  const { colors, fontScale } = useTheme();

  const [pin, setPin] = useState<string>("");
  const inputRef = useRef<TextInput>(null);

  const isCreate = operation === PinOperation.CREATE;

  const isComplete = pin.length === PIN_LENGTH;

  useEffect(() => {
    if (!visible || error) setPin("");
  }, [visible, error]);

  useEffect(() => {
    if (locked) inputRef.current?.blur();
  }, [locked]);

  // Se o teclado foi fechado pelo botão voltar, o input continua "focado" e o
  // focus() sozinho não reabre. Tirar o foco antes faz o teclado voltar.
  const openKeyboard = () => {
    if (locked) return;

    inputRef.current?.blur();
    inputRef.current?.focus();
  };

  const handleChangePin = (text: string) => {
    setPin(text);

    if (text.length === PIN_LENGTH) inputRef.current?.blur();

    if (isCreate) return;
    if (text.length === PIN_LENGTH) onConfirm(text);
  };

  let subtitle = isCreate
    ? "Escolha 4 números fáceis de lembrar"
    : "Digite seu PIN";

  if (error) subtitle = error;
  if (loading) subtitle = "Verificando...";
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      // O Android ignora o foco se ele vier junto com a abertura do modal,
      // então esperamos um instante antes de abrir o teclado.
      onShow={() => {
        if (!locked) setTimeout(() => inputRef.current?.focus(), 100);
      }}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.panel, { backgroundColor: colors.CARD }]}>
          <View
            style={[styles.iconBox, { backgroundColor: colors.SURFACE_PRIMARY }]}
          >
            <FontAwesomeFreeSolid name="lock" size={24} color={colors.PRIMARY} />
          </View>

          <Text
            style={[
              styles.title,
              { color: colors.TEXT_PRIMARY, fontSize: 22 * fontScale },
            ]}
          >
            {isCreate ? "Crie um PIN" : "Área do responsável"}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: error ? colors.DANGER : colors.TEXT_MUTED,
                fontSize: 14 * fontScale,
              },
            ]}
          >
            {subtitle}
          </Text>

          <Pressable
            style={styles.pinRow}
            onPress={openKeyboard}
          >
            {Array.from({ length: PIN_LENGTH }).map((cardPin, index) => (
              <View
                key={index}
                style={[
                  styles.pinBox,
                  { backgroundColor: colors.SURFACE_PRIMARY },
                  index === pin.length && [
                    styles.pinBoxFocused,
                    { borderColor: colors.PRIMARY },
                  ],
                ]}
              >
                {pin[index] && (
                  <View style={[styles.dot, { backgroundColor: colors.PRIMARY }]} />
                )}
              </View>
            ))}
          </Pressable>

          <TextInput
            ref={inputRef}
            value={pin}
            onChangeText={handleChangePin}
            editable={!loading && !locked}
            keyboardType="number-pad"
            maxLength={PIN_LENGTH}
            style={styles.hiddenInput}
          />

          <TouchableOpacity
            onPress={isCreate ? () => onConfirm(pin) : onClose}
            activeOpacity={0.7}
            disabled={!isComplete && isCreate}
          >
            <Text
              style={[
                styles.actionText,
                {
                  color: isCreate ? colors.PRIMARY : colors.TEXT_MUTED,
                  fontSize: 15 * fontScale,
                },
              ]}
            >
              {isCreate ? "Confirmar" : "Cancelar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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

  panel: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: "center",
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },

  pinRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 24,
  },
  pinBox: {
    flex: 1,
    height: 72,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  pinBoxFocused: {
    borderWidth: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },

  actionText: {
    fontWeight: "600",
    paddingVertical: 4,
  },
});
