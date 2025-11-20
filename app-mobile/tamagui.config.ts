// tamagui.config.ts
import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

// Tworzymy config na bazie defaultConfig v4
export const config = createTamagui({
  ...defaultConfig,

  // tutaj możemy nadpisywać / rozszerzać ustawienia
  settings: {
    // bierzemy wszystkie dotychczasowe ustawienia…
    ...defaultConfig.settings,

    // …i dopisujemy rekomendację dla nowych projektów:
    // zachowanie bliższe czystemu React Native (flex itp.)
    styleCompat: "react-native",
  },

  // tutaj MOŻESZ w przyszłości dodać swoje media,
  // np. short screeny albo coś pod tablety:
  // media: {
  //   ...defaultConfig.media,
  //   short: { maxHeight: 700 },
  // },
});

export default config;

// Typy – żeby Tamagui znał Twój config (themes, tokens, media)
export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
