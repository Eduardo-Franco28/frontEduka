import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import useTheme from "../hooks/useTheme";

/**
 * Quanto a comemoração fica na tela antes de seguir sozinha. O GIF do pulo
 * dura 2,6s, então este número tem que ser maior que isso para a criança ver
 * o pulo inteiro e o repique.
 */
export const CELEBRATION_DURATION_MS = 2900;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Proporcao do proprio GIF (330x324). Se a caixa nao tiver essa proporcao, o
// `contain` sobra espaco em cima e embaixo e o pinguim encolhe no meio dela.
const MASCOT_RATIO = 330 / 324;
const MASCOT_WIDTH = Math.round(Math.min(400, SCREEN_WIDTH * 0.94));
const MASCOT_HEIGHT = Math.round(MASCOT_WIDTH / MASCOT_RATIO);

const RAY_COUNT = 14;
const RAY_LENGTH = Math.round(MASCOT_WIDTH * 1.1);

// Papéis picados fixos em vez de sorteados: a criança vê a mesma comemoração
// toda vez, e repetição previsível acalma em vez de surpreender.
const CONFETTI = [
  { left: "4%", color: "#5B6AF0", size: 12, delay: 0, duration: 2400, spin: 420, drift: 18, round: false },
  { left: "10%", color: "#FFD766", size: 8, delay: 620, duration: 2200, spin: 280, drift: -12, round: true },
  { left: "14%", color: "#3da678", size: 9, delay: 300, duration: 2600, spin: -380, drift: -14, round: false },
  { left: "22%", color: "#FFD766", size: 14, delay: 140, duration: 2250, spin: 300, drift: 22, round: false },
  { left: "27%", color: "#5b82b5", size: 7, delay: 820, duration: 2450, spin: -240, drift: 10, round: true },
  { left: "31%", color: "#8B97F8", size: 10, delay: 500, duration: 2500, spin: -460, drift: -20, round: false },
  { left: "39%", color: "#e8893a", size: 12, delay: 70, duration: 2350, spin: 360, drift: 16, round: false },
  { left: "43%", color: "#3da678", size: 8, delay: 960, duration: 2300, spin: 320, drift: -8, round: true },
  { left: "47%", color: "#5b82b5", size: 9, delay: 400, duration: 2650, spin: -320, drift: -18, round: false },
  { left: "55%", color: "#3da678", size: 13, delay: 210, duration: 2300, spin: 440, drift: 20, round: false },
  { left: "59%", color: "#8B97F8", size: 7, delay: 700, duration: 2550, spin: -300, drift: 14, round: true },
  { left: "63%", color: "#FFD766", size: 10, delay: 580, duration: 2450, spin: -400, drift: -16, round: false },
  { left: "67%", color: "#e8893a", size: 8, delay: 1050, duration: 2250, spin: 260, drift: -10, round: true },
  { left: "71%", color: "#5B6AF0", size: 12, delay: 110, duration: 2550, spin: 340, drift: 14, round: false },
  { left: "75%", color: "#FFD766", size: 9, delay: 880, duration: 2400, spin: -340, drift: 12, round: true },
  { left: "79%", color: "#8B97F8", size: 9, delay: 440, duration: 2280, spin: -420, drift: -22, round: false },
  { left: "83%", color: "#3da678", size: 7, delay: 1180, duration: 2350, spin: 300, drift: 8, round: true },
  { left: "87%", color: "#e8893a", size: 13, delay: 260, duration: 2600, spin: 380, drift: 18, round: false },
  { left: "91%", color: "#5B6AF0", size: 8, delay: 760, duration: 2500, spin: -280, drift: -12, round: true },
  { left: "94%", color: "#5b82b5", size: 10, delay: 540, duration: 2380, spin: -360, drift: -12, round: false },
];

const SPARKS = [
  { top: "22%", left: "12%", size: 26, delay: 260 },
  { top: "16%", left: "78%", size: 20, delay: 520 },
  { top: "50%", left: "7%", size: 18, delay: 900 },
  { top: "46%", left: "86%", size: 24, delay: 420 },
  { top: "11%", left: "45%", size: 16, delay: 760 },
  { top: "60%", left: "22%", size: 15, delay: 1200 },
  { top: "58%", left: "72%", size: 19, delay: 1450 },
  { top: "30%", left: "92%", size: 14, delay: 1650 },
  { top: "70%", left: "50%", size: 17, delay: 1850 },
];

interface CelebrationOverlayProps {
  /** Chamado quando a comemoração acaba ou a criança toca para seguir. */
  onDone: () => void;
}

interface ConfettiProps {
  left: string;
  color: string;
  size: number;
  delay: number;
  duration: number;
  spin: number;
  drift: number;
  round: boolean;
}

function Confetti({
  left,
  color,
  size,
  delay,
  duration,
  spin,
  drift,
  round,
}: ConfettiProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [progress, duration, delay]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, SCREEN_HEIGHT * 0.9],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, drift, 0],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${spin}deg`],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.08, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: left as never,
        width: size,
        height: round ? size : size * 0.62,
        borderRadius: round ? size / 2 : 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    />
  );
}

function Sparkle({
  top,
  left,
  size,
  delay,
}: {
  top: string;
  left: string;
  size: number;
  delay: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 1400,
      delay,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [progress, delay]);

  const scale = progress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0.2, 1.1, 0.6],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.25, 0.7, 1],
    outputRange: [0, 1, 0.9, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: top as never,
        left: left as never,
        opacity,
        transform: [{ scale }],
      }}
    >
      <FontAwesomeFreeSolid name="star" size={size} color="#FFD766" />
    </Animated.View>
  );
}

/** Raios saindo do centro, uma vez só, no instante do acerto. */
function RayBurst({ delay }: { delay: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 1100,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [progress, delay]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1.5],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 0.55, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.burst, { opacity, transform: [{ scale }] }]}
    >
      {Array.from({ length: RAY_COUNT }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.ray,
            { transform: [{ rotate: `${(180 / RAY_COUNT) * index}deg` }] },
          ]}
        />
      ))}
    </Animated.View>
  );
}

/** Onda circular que abre a partir do mascote. */
function Ring({ color, delay }: { color: string; delay: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 1300,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [progress, delay]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 2.6],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.45, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        { borderColor: color, opacity, transform: [{ scale }] },
      ]}
    />
  );
}

export default function CelebrationOverlay({
  onDone,
}: CelebrationOverlayProps) {
  const { colors, fontScale } = useTheme();

  const mascotScale = useRef(new Animated.Value(0.6)).current;
  const mascotBounce = useRef(new Animated.Value(1)).current;
  const mascotOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  // Segura o callback numa ref: sem isso o timer reiniciaria toda vez que a
  // tela de cima renderizasse de novo.
  const done = useRef(onDone);
  done.current = onDone;

  // Tocar e o tempo acabar chamam o mesmo fim: a trava impede os dois juntos.
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    done.current();
  };

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(mascotOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(mascotScale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.back(1.8)),
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 420,
        delay: 260,
        useNativeDriver: true,
      }),
    ]);

    // Quique leve somado a escala de entrada: os dois `scale` se multiplicam.
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotBounce, {
          toValue: 1.06,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(mascotBounce, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    entrance.start();
    bounce.start();
    const timer = setTimeout(finish, CELEBRATION_DURATION_MS);

    return () => {
      entrance.stop();
      bounce.stop();
      clearTimeout(timer);
    };
  }, [mascotOpacity, mascotScale, mascotBounce, textOpacity]);

  return (
    <Pressable
      style={[styles.overlay, { backgroundColor: colors.BG_APP }]}
      onPress={finish}
      accessibilityRole="button"
      accessibilityLabel="Você acertou. Toque para continuar."
    >
      {CONFETTI.map((piece, index) => (
        <Confetti key={index} {...piece} />
      ))}

      {SPARKS.map((spark, index) => (
        <Sparkle key={index} {...spark} />
      ))}

      <View style={styles.center}>
        <RayBurst delay={120} />
        <RayBurst delay={700} />
        <Ring color={colors.PRIMARY} delay={60} />
        <Ring color={colors.SECONDARY} delay={520} />

        <Animated.View
          style={{
            opacity: mascotOpacity,
            transform: [{ scale: mascotScale }, { scale: mascotBounce }],
          }}
        >
          {/* A proporção segue a do GIF: esticar deforma o pinguim. */}
          <Image
            source={require("../../assets/pinguim_sorrindo_ciclo.gif")}
            style={styles.mascot}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            {
              color: colors.PRIMARY,
              fontSize: 34 * fontScale,
              opacity: textOpacity,
            },
          ]}
        >
          Você acertou!
        </Animated.Text>

        <Animated.Text
          style={[
            styles.hint,
            {
              color: colors.TEXT_MUTED,
              fontSize: 14 * fontScale,
              opacity: textOpacity,
            },
          ]}
        >
          Toque para continuar
        </Animated.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    overflow: "hidden",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  burst: {
    position: "absolute",
    width: RAY_LENGTH,
    height: RAY_LENGTH,
    alignItems: "center",
    justifyContent: "center",
  },
  ray: {
    position: "absolute",
    width: 4,
    height: RAY_LENGTH,
    borderRadius: 2,
    backgroundColor: "#FFD766",
  },
  ring: {
    position: "absolute",
    width: MASCOT_WIDTH * 0.7,
    height: MASCOT_WIDTH * 0.7,
    borderRadius: (MASCOT_WIDTH * 0.7) / 2,
    borderWidth: 4,
  },
  mascot: {
    width: MASCOT_WIDTH,
    height: MASCOT_HEIGHT,
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
  },
  hint: {
    textAlign: "center",
    marginTop: 12,
  },
});