import { Pressable, Text, type PressableProps } from "react-native";

import { globalStyles } from "@/styles/global";

type ButtonProps = PressableProps & {
  title: string;
};

export function Button({ title, style, ...props }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        globalStyles.button,
        pressed && globalStyles.buttonPressed,
        style,
      ]}
      {...props}
    >
      <Text style={globalStyles.buttonText}>{title}</Text>
    </Pressable>
  );
}
