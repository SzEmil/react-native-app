import { Link, Tabs } from "expo-router";
import { Button, useTheme } from "tamagui";
import { Atom, AudioWaveform } from "@tamagui/lucide-icons";
import { useAuth } from "components/providers/AuthProvider";
import { AuthGuard } from "components/guards/AuthGuard";

export default function TabLayout() {
  const theme = useTheme();

  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.red10.val,
          tabBarStyle: {
            backgroundColor: theme.background.val,
            borderTopColor: theme.borderColor.val,
          },
          headerStyle: {
            backgroundColor: theme.background.val,
            borderBottomColor: theme.borderColor.val,
          },
          headerTintColor: theme.color.val,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Tab One",
            tabBarIcon: ({ color }) => <Atom color={color as any} />,
            headerRight: () => (
              <Button mr="$4" size="$2.5" onPress={handleLogout}>
                Wyloguj
              </Button>
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: "Tab Two",
            tabBarIcon: ({ color }) => <AudioWaveform color={color as any} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
