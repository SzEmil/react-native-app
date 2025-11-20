// lib/auth-utils.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

// Klucz pod którym trzymamy token w pamięci urządzenia
export const STORAGE_KEY_ACCESS_TOKEN = 'accessToken'

// Wersja uproszczona – na razie nie dekodujemy JWT.
// Token traktujemy jako „ważny”, jeśli po prostu istnieje.
// Później tu wkleimy prawdziwe jwtDecode + exp.
export const isValidToken = (accessToken: string | null | undefined): boolean => {
  if (!accessToken) return false
  // TODO: po podpięciu prawdziwego backendu:
  // - zdekodować token (jwtDecode)
  // - sprawdzić decoded.exp > currentTime
  return true
}

// na razie nie ustawiamy timera wygasania tokena – zostawiamy podpis pod przyszłe JWT
export const tokenExpired = (exp: number, onTokenExpired: () => void) => {
  // TODO: po podpięciu prawdziwego JWT można tu dodać setTimeout jak w wersji web
  // na ten moment nie używamy exp w mockach
  console.log('tokenExpired() – mock, brak realnego licznika czasu')
  onTokenExpired()
}

// Ustawianie / czyszczenie sesji – odpowiednik setSession z weba
export const setSession = async (
  accessToken: string | null,
  onTokenExpired: () => void
): Promise<void> => {
  if (accessToken) {
    // zapisujemy token
    await AsyncStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, accessToken)

    // tutaj kiedyś:
    // - ustawimy nagłówek Authorization w axios
    // - ustawimy timer wygasania na podstawie exp
    // na razie tylko wywołujemy callback „na sztywno”
    console.log('setSession() – zapisano token (mock)')
    // tokenExpired(decoded.exp, onTokenExpired) w przyszłości
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN)
    console.log('setSession() – wyczyszczono token')
    onTokenExpired()
  }
}

// pomocniczy getter tokena
export const getStoredToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem(STORAGE_KEY_ACCESS_TOKEN)
  return token
}
