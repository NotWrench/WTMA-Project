import { headers } from "next/headers";
import { BudgetBentoView } from "@/components/budgets/budget-bento-view";
import { auth } from "@/lib/auth";
import { getBudgetPageData } from "@/lib/data/finance";

export default async function BudgetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const data = await getBudgetPageData(session.user.id);

  return <BudgetBentoView data={data} />;
}
