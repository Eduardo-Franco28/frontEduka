import { Linking } from "react-native";
import axios from "axios";
import usePin from "./usePin";
import * as authService from "../services/authService";
import { TEO_WEB_URL } from "../constants/constant";

export default function useTeo() {
  const openTeoWithPin = async (pin: string): Promise<boolean> => {
    try {
      const response = await authService.createTeoCode({ pin });

      await Linking.openURL(`${TEO_WEB_URL}/?code=${encodeURIComponent(response.code)}`);

      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) return false;

      throw error;
    }
  };

  const { openPin, pinModalProps } = usePin(openTeoWithPin);

  const openTeo = () => openPin(() => {});

  return {
    openTeo,
    teoPinModalProps: pinModalProps,
  };
}
