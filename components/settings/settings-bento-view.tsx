"use client";

import {
  Database,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  Languages,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SETTINGS_PREFERENCE_KEYS } from "@/lib/settings-preferences";
import {
  type CurrencyCode,
  useUserSettingsStore,
} from "@/lib/user-settings-store";
import { cn } from "@/lib/utils";

type InterfaceMode = "light" | "dark";

const DEFAULT_LANGUAGE = "en-US";
const TRANSACTION_EXPORT_ROWS = [
  {
    amount: 2450,
    category: "Electronics",
    date: "2026-04-13",
    merchant: "Amazon India",
    status: "Completed",
  },
  {
    amount: 850,
    category: "Lifestyle",
    date: "2026-04-12",
    merchant: "Blue Tokai Coffee",
    status: "Completed",
  },
  {
    amount: 35_000,
    category: "Essential",
    date: "2026-04-09",
    merchant: "Property Rent",
    status: "Scheduled",
  },
] as const;

const settingsCardClassName =
  "rounded-3xl border border-border/20 p-6 shadow-[0_12px_30px_rgba(79,100,91,0.05)]";

export function SettingsBentoView() {
  const { resolvedTheme, setTheme } = useTheme();
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>("light");
  const language = useUserSettingsStore((state) => state.language);
  const currency = useUserSettingsStore((state) => state.currency);
  const typographyScale = useUserSettingsStore(
    (state) => state.typographyScale
  );
  const incognitoBalances = useUserSettingsStore(
    (state) => state.incognitoBalances
  );
  const setLanguagePreference = useUserSettingsStore(
    (state) => state.setLanguage
  );
  const setCurrencyPreference = useUserSettingsStore(
    (state) => state.setCurrency
  );
  const setTypographyScalePreference = useUserSettingsStore(
    (state) => state.setTypographyScale
  );
  const setIncognitoBalancesPreference = useUserSettingsStore(
    (state) => state.setIncognitoBalances
  );
  const resetUserSettings = useUserSettingsStore(
    (state) => state.resetUserSettings
  );
  const [biometricLock, setBiometricLock] = useState(true);
  const [isPurgeArmed, setIsPurgeArmed] = useState(false);

  useEffect(() => {
    setInterfaceMode(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    document.documentElement.lang = language || DEFAULT_LANGUAGE;
  }, [language]);

  const formattedBalancePreview = useMemo(() => {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(84_250);
  }, [currency, language]);

  const saveLanguage = (nextLanguage: string | null) => {
    if (!nextLanguage) {
      return;
    }

    setLanguagePreference(nextLanguage);
  };

  const saveCurrency = (nextCurrency: string | null) => {
    if (!nextCurrency) {
      return;
    }

    const normalizedCurrency: CurrencyCode =
      nextCurrency === "USD" || nextCurrency === "EUR" || nextCurrency === "GBP"
        ? nextCurrency
        : "INR";

    setCurrencyPreference(normalizedCurrency);
  };

  const saveTypographyScale = (value: number | readonly number[]) => {
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    setTypographyScalePreference(normalizedValue);
  };

  const saveIncognitoBalances = (enabled: boolean) => {
    setIncognitoBalancesPreference(enabled);
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = downloadUrl;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleExportCsv = () => {
    const csvRows = [
      ["Date", "Merchant", "Category", "Amount", "Status"],
      ...TRANSACTION_EXPORT_ROWS.map((row) => [
        row.date,
        row.merchant,
        row.category,
        row.amount.toString(),
        row.status,
      ]),
    ];
    const csvContent = csvRows
      .map((row) =>
        row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    downloadFile(
      "trackami-transactions.csv",
      csvContent,
      "text/csv;charset=utf-8;"
    );
  };

  const handleExportPdf = () => {
    const reportWindow = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=980,height=720"
    );

    if (!reportWindow) {
      return;
    }

    const tableRows = TRANSACTION_EXPORT_ROWS.map(
      (row) => `<tr>
        <td>${row.date}</td>
        <td>${row.merchant}</td>
        <td>${row.category}</td>
        <td>${new Intl.NumberFormat(language, {
          style: "currency",
          currency,
          maximumFractionDigits: 2,
        }).format(row.amount)}</td>
        <td>${row.status}</td>
      </tr>`
    ).join("");

    reportWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Trackami Report</title>
          <style>
            body { font-family: Manrope, sans-serif; margin: 24px; color: #2f342e; }
            h1 { font-family: "Plus Jakarta Sans", sans-serif; margin-bottom: 8px; }
            p { color: #5c605a; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e0e4dc; }
            th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5c605a; }
          </style>
        </head>
        <body>
          <h1>Trackami Transactions Report</h1>
          <p>Generated ${new Date().toLocaleString(language)} • ${currency}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  const purgeArchiveData = () => {
    window.localStorage.removeItem(SETTINGS_PREFERENCE_KEYS.userSettings);
    window.localStorage.removeItem(SETTINGS_PREFERENCE_KEYS.currency);
    window.localStorage.removeItem(SETTINGS_PREFERENCE_KEYS.incognitoBalances);
    window.localStorage.removeItem(SETTINGS_PREFERENCE_KEYS.language);
    window.localStorage.removeItem(SETTINGS_PREFERENCE_KEYS.theme);
    window.localStorage.removeItem(SETTINGS_PREFERENCE_KEYS.typographyScale);

    resetUserSettings();
    setTheme("light");
    setInterfaceMode("light");
    document.documentElement.lang = DEFAULT_LANGUAGE;
  };

  const handlePurgeData = () => {
    if (!isPurgeArmed) {
      setIsPurgeArmed(true);
      return;
    }

    purgeArchiveData();
    setIsPurgeArmed(false);
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-extrabold font-heading text-3xl text-foreground tracking-tight sm:text-4xl">
          Settings
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Customize your Trackami experience. Changes sync instantly across your
          premium devices.
        </p>
      </header>

      <BentoGrid className="max-w-none gap-5 md:auto-rows-[minmax(15rem,auto)] md:grid-cols-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            settingsCardClassName,
            "space-y-7 bg-surface-container-lowest md:col-span-7"
          )}
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="space-y-1.5">
            <h2 className="flex items-center gap-2 font-bold font-heading text-lg">
              <Palette className="size-4 text-primary" />
              Visual Experience
            </h2>
            <p className="text-muted-foreground text-sm">
              Tune interface mode and readability to match your workflow.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="font-semibold text-muted-foreground text-sm">
                Interface Mode
              </p>
              <div className="inline-flex rounded-full bg-surface-container p-1">
                {[
                  { icon: Sun, label: "Light", value: "light" as const },
                  { icon: Moon, label: "Dark", value: "dark" as const },
                ].map((item) => {
                  const active = interfaceMode === item.value;
                  const Icon = item.icon;

                  return (
                    <button
                      className={cn(
                        "inline-flex min-w-24 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-xs transition-colors",
                        active
                          ? "bg-surface-container-lowest text-foreground shadow-sm"
                          : "text-muted-foreground"
                      )}
                      key={item.value}
                      onClick={() => {
                        setInterfaceMode(item.value);
                        setTheme(item.value);
                      }}
                      type="button"
                    >
                      <Icon className="size-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-muted-foreground text-sm">
                Typography Scaling
              </p>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-xs">A</span>
                <Slider
                  className="w-full"
                  max={5}
                  min={1}
                  onValueChange={saveTypographyScale}
                  step={1}
                  value={[typographyScale]}
                />
                <span className="font-semibold text-foreground text-lg">A</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            settingsCardClassName,
            "space-y-6 bg-surface-container-low md:col-span-5"
          )}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.03, duration: 0.25, ease: "easeOut" }}
        >
          <div className="space-y-1.5">
            <h2 className="flex items-center gap-2 font-bold font-heading text-lg">
              <Languages className="size-4 text-primary" />
              Localization
            </h2>
            <p className="text-muted-foreground text-sm">
              Language and currency preferences for regional formatting.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-widest">
                Primary Language
              </p>
              <Select onValueChange={saveLanguage} value={language}>
                <SelectTrigger className="w-full bg-surface-container-high">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (United States)</SelectItem>
                  <SelectItem value="fr-FR">French (Premium)</SelectItem>
                  <SelectItem value="es-ES">Spanish (Premium)</SelectItem>
                  <SelectItem value="ja-JP">Japanese (Premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-widest">
                Currency Format
              </p>
              <Select onValueChange={saveCurrency} value={currency}>
                <SelectTrigger className="w-full bg-surface-container-high">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            settingsCardClassName,
            "space-y-6 bg-surface-container-low md:col-span-6"
          )}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.06, duration: 0.25, ease: "easeOut" }}
        >
          <div className="space-y-1.5">
            <h2 className="flex items-center gap-2 font-bold font-heading text-lg">
              <ShieldCheck className="size-4 text-primary" />
              Privacy & Security
            </h2>
            <p className="text-muted-foreground text-sm">
              Secure your financial data with protected visibility controls.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-highest p-4">
              <div className="flex items-center gap-3">
                <Fingerprint className="size-4 text-foreground" />
                <span className="font-semibold text-foreground text-sm">
                  App Lock (Biometrics)
                </span>
              </div>
              <Switch
                checked={biometricLock}
                disabled
                onCheckedChange={setBiometricLock}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-surface-container-highest p-4">
              <div className="flex items-center gap-3">
                <EyeOff className="size-4 text-foreground" />
                <span className="font-semibold text-foreground text-sm">
                  Incognito Balances
                </span>
              </div>
              <Switch
                checked={incognitoBalances}
                onCheckedChange={saveIncognitoBalances}
              />
            </div>

            <div className="rounded-xl bg-surface-container-high p-3">
              <p className="font-medium text-[0.7rem] text-muted-foreground uppercase tracking-widest">
                Balance Preview
              </p>
              <p
                className="mt-1 font-semibold text-foreground text-sm transition-all"
                data-sensitive-balance="true"
              >
                {formattedBalancePreview}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            settingsCardClassName,
            "space-y-6 border-tertiary/20 bg-tertiary-container/25 md:col-span-6"
          )}
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.09, duration: 0.25, ease: "easeOut" }}
        >
          <div className="space-y-1.5">
            <h2 className="flex items-center gap-2 font-bold font-heading text-lg">
              <Database className="size-4 text-tertiary" />
              Data Management
            </h2>
            <p className="text-muted-foreground text-sm">
              Export logs for accounting workflows or backup continuity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex flex-col items-center gap-2 rounded-2xl bg-surface-container-lowest p-4 transition-colors hover:bg-white"
              onClick={handleExportCsv}
              type="button"
            >
              <FileSpreadsheet className="size-5 text-tertiary" />
              <span className="font-semibold text-xs">Export CSV</span>
            </button>
            <button
              className="flex flex-col items-center gap-2 rounded-2xl bg-surface-container-lowest p-4 transition-colors hover:bg-white"
              onClick={handleExportPdf}
              type="button"
            >
              <FileText className="size-5 text-tertiary" />
              <span className="font-semibold text-xs">Export PDF</span>
            </button>
          </div>

          <Button
            className={cn(
              "w-full transition-colors",
              isPurgeArmed &&
                "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
            )}
            onClick={handlePurgeData}
            type="button"
            variant="outline"
          >
            <Trash2 className="size-4" />
            {isPurgeArmed
              ? "Tap Again To Confirm Purge"
              : "Purge All Archive Data"}
          </Button>

          {isPurgeArmed ? (
            <button
              className="w-full font-medium text-muted-foreground text-xs underline decoration-border underline-offset-4"
              onClick={() => setIsPurgeArmed(false)}
              type="button"
            >
              Cancel purge
            </button>
          ) : null}
        </motion.div>
      </BentoGrid>
    </section>
  );
}
