import { useEffect, useRef, useState } from "react";
import axios from "axios";
import getMessageError from "../utils/getMessageErrorUtils";
import * as authService from "../services/authService";
import { PinOperation } from "../enums/PinOperationEnum";

const DEFAULT_LOCK_SECONDS = 120;

async function verifyAppPin(pin: string): Promise<boolean> {
  return Boolean(await authService.verifyPin({ pin }));
}

export default function usePin(verifier: (pin: string) => Promise<boolean> = verifyAppPin) {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const onSuccessRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!lockedUntil) return;

    const timer = setTimeout(() => {
      setLockedUntil(null);
      setError(null);
    }, lockedUntil - Date.now());

    return () => clearTimeout(timer);
  }, [lockedUntil]);

  const openPin = (onSuccess: () => void) => {
    onSuccessRef.current = onSuccess;

    if (!lockedUntil) setError(null);

    setVisible(true);
  };

  const closePin = () => {
    setVisible(false);
  };

  const verify = async (pin: string) => {
    setLoading(true);
    setError(null);

    try {
      const isValid = await verifier(pin);

      if (!isValid) {
        setError("PIN incorreto");
        return;
      }

      setVisible(false);
      onSuccessRef.current?.();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const seconds =
          Number(error.response.headers["retry-after"]) || DEFAULT_LOCK_SECONDS;
        const minutes = Math.ceil(seconds / 60);

        setLockedUntil(Date.now() + seconds * 1000);
        setError(
          `Muitas tentativas. Tente de novo em ${minutes} ${minutes === 1 ? "minuto" : "minutos"}.`,
        );
        return;
      }

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
      locked: lockedUntil !== null,
      onClose: closePin,
      onConfirm: verify,
    },
  };
}
