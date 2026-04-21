import type { DashboardUser } from "@/components/dashboard/types";

interface DashboardSessionUser {
  email?: string | null;
  image?: string | null;
  name?: string | null;
}

interface DashboardSession {
  user?: DashboardSessionUser | null;
}

const DEFAULT_DASHBOARD_USER_NAME = "Trackami Member";
const DEFAULT_DASHBOARD_USER_PLAN = "Premium Plan";

export const getDashboardUser = (
  session: DashboardSession | null | undefined
): DashboardUser => {
  const sessionName = session?.user?.name?.trim() ?? "";
  const fallbackNameFromEmail = session?.user?.email?.split("@")[0];
  const isPlaceholderName =
    sessionName.toLowerCase() === DEFAULT_DASHBOARD_USER_NAME.toLowerCase();
  const name =
    (isPlaceholderName ? "" : sessionName) ||
    fallbackNameFromEmail ||
    DEFAULT_DASHBOARD_USER_NAME;

  return {
    name,
    email: session?.user?.email ?? null,
    image: session?.user?.image ?? null,
    plan: DEFAULT_DASHBOARD_USER_PLAN,
  };
};
