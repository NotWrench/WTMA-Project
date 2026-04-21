import { headers } from "next/headers";
import { SettingsBentoView } from "@/components/settings/settings-bento-view";
import { auth } from "@/lib/auth";
import {
  getDashboardSnapshot,
  getSettingsExportRows,
} from "@/lib/data/finance";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const [exportRows, snapshot] = await Promise.all([
    getSettingsExportRows(session.user.id),
    getDashboardSnapshot(session.user.id),
  ]);

  return (
    <SettingsBentoView
      exportRows={exportRows}
      monthlySpendingPaise={snapshot.totalSpendingPaiseCurrentMonth}
    />
  );
}
