import { useMutation } from "@tanstack/react-query";

import { postProductionSimulation } from "@/features/production/api/production";

export const usePostProductionSimulationMutation = () =>
  useMutation({
    mutationFn: postProductionSimulation,
  });
