export const signalsQueryKeys = {
  all: ["signals"] as const,
  list: () => [...signalsQueryKeys.all, "list"] as const,
};