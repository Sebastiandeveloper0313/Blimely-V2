import { createFileRoute } from "@tanstack/react-router";

import { Onboarding } from "@/features/onboarding/Onboarding";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
});
