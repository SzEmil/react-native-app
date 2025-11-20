// app/(tabs)/index.tsx
import { useState } from "react";
import {
  H2,
  Paragraph,
  Text,
  Separator,
  XStack,
  Label,
  RadioGroup,
  YStack,
} from "tamagui";
import { useAuth } from "components/providers/AuthProvider";
import { ScreenScrollView } from "components/ScreenScrollView";

export default function TabOneScreen() {
  const { user, token, authenticated, loading } = useAuth();
  const [satisfaction, setSatisfaction] = useState<string>("4");

  const statusLabel = loading
    ? "Ładowanie..."
    : authenticated
    ? "Zalogowany"
    : "Niezalogowany";

  return (
    <ScreenScrollView>
      {/* Nagłówek */}
      <H2 text="left">Profil użytkownika</H2>
      <Paragraph text="left" color="$color10">
        Podgląd danych aktualnie zalogowanego użytkownika.
      </Paragraph>

      <Separator />

      {/* Karta z danymi użytkownika */}
      <UserCard statusLabel={statusLabel} email={user?.email} token={token} />

      {/* Ankieta satysfakcji */}
      <SatisfactionCard
        satisfaction={satisfaction}
        onChange={setSatisfaction}
      />
    </ScreenScrollView>
  );
}

function UserCard({
  statusLabel,
  email,
  token,
}: {
  statusLabel: string;
  email?: string | null;
  token: string | null;
}) {
  return (
    <YStack
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      rounded="$4"
      p="$4"
      gap="$2"
    >
      <Paragraph fontSize="$3">
        <Text fontWeight="700">Status: </Text>
        {statusLabel}
      </Paragraph>

      <Paragraph fontSize="$3">
        <Text fontWeight="700">Email: </Text>
        {email ?? "—"}
      </Paragraph>

      <Paragraph fontSize="$2" color="$color10">
        <Text fontWeight="700">Token: </Text>
        {token ?? "—"}
      </Paragraph>
    </YStack>
  );
}

function SatisfactionCard({
  satisfaction,
  onChange,
}: {
  satisfaction: string;
  onChange: (val: string) => void;
}) {
  return (
    <YStack
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      rounded="$4"
      p="$4"
      gap="$3"
    >
      <Paragraph text="left" fontSize="$3" fontWeight="700">
        Jak bardzo jesteś zadowolony z aplikacji?
      </Paragraph>

      <RadioGroup
        aria-labelledby="satisfaction-group"
        name="satisfaction"
        value={satisfaction}
        onValueChange={onChange}
      >
        <YStack gap="$2">
          <RadioOption value="1" label="1 – Bardzo niezadowolony" />
          <RadioOption value="2" label="2 – Raczej niezadowolony" />
          <RadioOption value="3" label="3 – Jest OK" />
          <RadioOption value="4" label="4 – Zadowolony" />
          <RadioOption value="5" label="5 – Bardzo zadowolony" />
        </YStack>
      </RadioGroup>

      <Paragraph fontSize="$2" color="$color10">
        Aktualnie wybrano: <Text fontWeight="700">{satisfaction}/5</Text>
      </Paragraph>
    </YStack>
  );
}

function RadioOption({ value, label }: { value: string; label: string }) {
  const id = `satisfaction-${value}`;

  return (
    <XStack width="100%" items="center" gap="$2">
      <RadioGroup.Item id={id} value={value} size="$3">
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label htmlFor={id} size="$3">
        {label}
      </Label>
    </XStack>
  );
}
