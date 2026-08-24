export function isMockDataEnabled(): boolean {
  const raw =
    typeof window === 'undefined'
      ? process.env.ENABLE_MOCK_DATA
      : process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA;
  return raw === 'true';
}
