import { headers } from "next/headers";
import { ReportsBentoView } from "@/components/reports/reports-bento-view";
import { auth } from "@/lib/auth";
import { getReportsPageData } from "@/lib/data/finance";

export default async function ReportsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const data = await getReportsPageData(session.user.id);

  return <ReportsBentoView data={data} />;
}
