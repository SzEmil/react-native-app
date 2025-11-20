// lib/auth.ts

export const TEST_EMAIL = "test@example.com";
export const TEST_PASSWORD = "Test1234!";

export type MockUser = {
  email: string;
};

export type MockAuthResponse = {
  token: string;
  user: MockUser;
};

// udajemy „request” – tylko zestaw testowych danych przechodzi
export async function mockLogin(
  email: string,
  password: string
): Promise<MockAuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const isValid = email === TEST_EMAIL && password === TEST_PASSWORD;

  if (!isValid) {
    throw new Error("Nieprawidłowy email lub hasło");
  }

  // w prawdziwej aplikacji backend zwróci prawdziwy JWT
  const fakeToken = "mock-token-123"; // na razie zwykły string

  return {
    token: fakeToken,
    user: {
      email,
    },
  };
}

// mock „register” – na razie zawsze sukces i od razu loguje
export async function mockRegister(
  email: string,
  password: string
): Promise<MockAuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const fakeToken = "mock-token-123";

  return {
    token: fakeToken,
    user: {
      email,
    },
  };
}
