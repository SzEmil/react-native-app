// components/AuthGuard.tsx
import { useEffect } from "react";
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

  // pierwszy segment ścieżki, np. "login" albo "(tabs)"
  const rootSegment = (segments as string[])[0];
  const inLogin = rootSegment === "login";

  useEffect(() => {
    // jeśli router jeszcze nie zainicjowany – czekamy
    if (!rootSegment) return;

    // jeśli wciąż inicjalizujemy auth (AsyncStorage) -> nie nawigujemy
    if (loading) return;

    // jeśli NIEzalogowany, a NIE jesteśmy na /login -> przekieruj na /login
    if (!authenticated && !inLogin) {
      router.replace("/login");
    }
  }, [loading, authenticated, inLogin, rootSegment, router]);

  // 1) Pierwsze uruchomienie aplikacji – czytamy dane z AsyncStorage
  if (loading) {
    return (
      <YStack flex={1} justify="center" items="center" bg="$background">
        <Spinner size="large" />
        <Text mt="$2">Ładowanie aplikacji...</Text>
      </YStack>
    );
  }

  // 2) Niezalogowany i NIE na /login:
  //    właśnie uruchomiliśmy router.replace("/login"),
  //    więc nic tu nie renderujemy – zaraz i tak wejdzie ekran loginu.
  if (!authenticated && !inLogin) {
    return null;
  }

  // 3) Wszystko OK – zwracamy dzieci (chroniony content)
  return <>{children}</>;
}
