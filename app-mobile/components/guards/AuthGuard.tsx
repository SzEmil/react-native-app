// components/AuthGuard.tsx
import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { YStack, Spinner, Text } from "tamagui";
import { useAuth } from "components/providers/AuthProvider";

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const { loading, authenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [checked, setChecked] = useState(false);

   useEffect(() => {
    // bierzemy pierwszy segment ścieżki
    const rootSegment = (segments as string[])[0];

    // jeśli z jakiegoś powodu nie ma segmentu – czekamy
    if (!rootSegment) {
      return;
    }

    const inLogin = rootSegment === "login";

    if (loading) {
      // jeszcze się inicjalizujemy – nic nie rób
      return;
    }

    if (!authenticated && !inLogin) {
      // niezalogowany → na /login
      router.replace("/login");
      return;
    }

    // wszystko OK – można pokazać dzieci
    setChecked(true);
  }, [loading, authenticated, segments, router]);

  if (loading || !checked) {
    // prosty ekran ładowania
    return (
      <YStack flex={1} justify="center" items={"center"}  bg="$background">
        <Spinner size="large" />
        <Text mt="$2">Ładowanie aplikacji...</Text>
      </YStack>
    );
  }

  return <>{children}</>;
}
