import { headers } from "next/headers";
import { ExpensesBentoView } from "@/components/expenses/expenses-bento-view";
import { auth } from "@/lib/auth";
import { getExpensesPageData } from "@/lib/data/finance";

export default async function ExpensesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const data = await getExpensesPageData(session.user.id);

  return <ExpensesBentoView data={data} />;
}
