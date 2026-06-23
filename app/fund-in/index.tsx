import { type Href, router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { AmountKeypad, centsToDecimal } from "@/components/AmountKeypad";
import { useTheme } from "@/contexts/ThemeContext";

export default function FundInScreen() {
  const { colors } = useTheme();
  const [amount, setAmount] = useState("");
  const [keypadVisible, setKeypadVisible] = useState(true);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
      }),
    [colors.background],
  );

  useFocusEffect(
    useCallback(() => {
      setKeypadVisible(true);
    }, []),
  );

  const handleDone = () => {
    setKeypadVisible(false);
    router.push({
      pathname: "/fund-in/confirm",
      params: { amount: centsToDecimal(amount) },
    });
  };

  const handleClose = () => {
    setKeypadVisible(false);
    router.replace("/" as Href);
  };

  return (
    <View style={styles.container}>
      <AmountKeypad
        visible={keypadVisible}
        amount={amount}
        onAmountChange={setAmount}
        onDone={handleDone}
        onClose={handleClose}
      />
    </View>
  );
}
