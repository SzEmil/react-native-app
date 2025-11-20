// components/layout/ScreenScrollView.tsx
import { ReactNode } from "react";
import { ScrollView, YStack } from "tamagui";

type Props = {
  children: ReactNode;
};

export function ScreenScrollView({ children }: Props) {
  return (
    <ScrollView
      flex={1}
      bg="$background"
      // to działa i na RN, i na web (Tamagui przekazuje do RN ScrollView)
      contentContainerStyle={{
        py: 16,
        px: 16,
      }}
      // (opcjonalnie) wyłącz bounce na iOS:
      // bounces={false}
    >
      <YStack gap="$4">{children}</YStack>
    </ScrollView>
  );
}
