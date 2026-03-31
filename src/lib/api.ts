export async function fetchBootstrap() {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/bootstrap");
  if (!response.ok) {
    throw new Error("bootstrap fetch failed");
  }
  return response.json();
}
