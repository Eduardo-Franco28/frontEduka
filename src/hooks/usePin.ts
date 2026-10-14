import { useRef, useState } from "react";
import getMessageError from "../utils/getMessageErrorUtils";
import * as authService from "../services/authService";
import { PinOperation } from "../enums/PinOperationEnum";

export default function usePin() {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Guarda o que fazer quando o PIN estiver certo. É ref porque só precisa
  // ser lembrado até a validação, sem redesenhar a tela.
  const onSuccessRef = useRef<(() => void) | null>(null);

  const openPin = (onSuccess: () => void) => {
    onSuccessRef.current = onSuccess;
    setError(null);
    setVisible(true);
  };

  const closePin = () => {
    setVisible(false);
  };

  const verify = async (pin: string) => {
    setLoading(true);
    setError(null);

    try {
      const isValid = await authService.verifyPin({ pin });

      if (!isValid) {
        setError("PIN incorreto");
        return;
      }

      setVisible(false);
      onSuccessRef.current?.();
    } catch (error) {
      const errorMessage = getMessageError(error, "Não foi possível verificar o PIN");
      console.error("Pin error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    openPin,
    pinModalProps: {
      visible,
      operation: PinOperation.CONFIRM,
      error,
      loading,
      onClose: closePin,
      onConfirm: verify,
    },
  };
}
