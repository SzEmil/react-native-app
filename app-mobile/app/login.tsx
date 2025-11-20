// app/login.tsx
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
import {
  YStack,
  XStack,
  H2,
  Paragraph,
  Input,
  Button,
  Label,
  Separator,
  Spinner,
  Text,
} from "tamagui";

import { useAuth } from "components/providers/AuthProvider";
import { TEST_EMAIL, TEST_PASSWORD } from "../lib/auth";

// Schemat walidacji Zod
const loginSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // czyścimy błąd tylko dla danego pola
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGeneralError(null);
  };

  const handleFillTestData = () => {
    setValues({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    setErrors({});
    setGeneralError(null);
  };

  const handleSubmit = async () => {
    setGeneralError(null);

    // Walidacja przez Zod
    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};

      // Uwaga: w Zod jest .issues, nie .errors
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof LoginFormValues;
        fieldErrors[fieldName] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);

      // logowanie przez AuthContext (w środku wywołuje mockLogin)
      await signIn(values.email, values.password);

      // Po poprawnym logowaniu przechodzimy do tabs
      // replace -> usuwa login z historii, żeby nie można było cofnąć się gestem
      router.replace("/(tabs)");
    } catch (e: any) {
      setGeneralError(e instanceof Error ? e.message : "Coś poszło nie tak");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <YStack
        flex={1}
        py="$4"
        px="$6"
        justify="center"
        items="center"
        bg="$background"
      >
        <YStack width="100%" gap="$4">
          {/* Nagłówek */}
          <YStack gap="$2">
            <H2 text="left">Zaloguj się</H2>
            <Paragraph text="left" color="$color10">
              Wpisz dane logowania do aplikacji, aby kontynuować.
            </Paragraph>
          </YStack>

          <Separator />

          {/* Pole e-mail */}
          <YStack gap="$1">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input
              id="email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={values.email}
              onChangeText={(text) => handleChange("email", text)}
              placeholder="np. jan.kowalski@example.com"
            />
            {errors.email && (
              <Text color="$red10" fontSize="$2">
                {errors.email}
              </Text>
            )}
          </YStack>

          {/* Pole hasło */}
          <YStack gap="$1">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              secureTextEntry
              autoCapitalize="none"
              value={values.password}
              onChangeText={(text) => handleChange("password", text)}
              placeholder="Twoje hasło"
            />
            {errors.password && (
              <Text color="$red10" fontSize="$2">
                {errors.password}
              </Text>
            )}
          </YStack>

          {/* Błąd ogólny */}
          {generalError && (
            <Paragraph color="$red10" fontSize="$2">
              {generalError}
            </Paragraph>
          )}

          {/* Przycisk logowania */}
          <Button
            theme="accent"
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            mt="$2"
          >
            {loading ? (
              <XStack items="center" gap="$2">
                <Spinner size="small" />
                <Text>Logowanie...</Text>
              </XStack>
            ) : (
              "Zaloguj się"
            )}
          </Button>

          {/* Przycisk auto-uzupełnienia danymi testowymi */}
          <Button
            mt="$2"
            variant="outlined"
            onPress={handleFillTestData}
            disabled={loading}
          >
            Użyj danych testowych
          </Button>

          {/* Info o danych testowych */}
          <YStack mt="$4" gap="$1">
            <Paragraph fontSize="$2" color="$color10">
              Dane testowe (mockowane):
            </Paragraph>
            <Paragraph fontSize="$2">
              <Text fontWeight="700">Email:</Text> {TEST_EMAIL}
            </Paragraph>
            <Paragraph fontSize="$2">
              <Text fontWeight="700">Hasło:</Text> {TEST_PASSWORD}
            </Paragraph>
          </YStack>
        </YStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}
