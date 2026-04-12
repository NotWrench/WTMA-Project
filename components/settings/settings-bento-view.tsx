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
import { useState } from "react";
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
import { cn } from "@/lib/utils";

type InterfaceMode = "light" | "dark";

const settingsCardClassName =
  "rounded-3xl border border-border/20 p-6 shadow-[0_12px_30px_rgba(79,100,91,0.05)]";

export function SettingsBentoView() {
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>("light");
  const [typographyScale, setTypographyScale] = useState<number[]>([3]);
  const [biometricLock, setBiometricLock] = useState(true);
  const [incognitoBalances, setIncognitoBalances] = useState(false);

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
                      onClick={() => setInterfaceMode(item.value)}
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
                  onValueChange={(value) => {
                    setTypographyScale(
                      Array.isArray(value) ? [...value] : [value]
                    );
                  }}
                  step={1}
                  value={typographyScale}
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
              <Select defaultValue="en-US">
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
              <Select defaultValue="INR">
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
                onCheckedChange={setIncognitoBalances}
              />
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
              type="button"
            >
              <FileSpreadsheet className="size-5 text-tertiary" />
              <span className="font-semibold text-xs">Export CSV</span>
            </button>
            <button
              className="flex flex-col items-center gap-2 rounded-2xl bg-surface-container-lowest p-4 transition-colors hover:bg-white"
              type="button"
            >
              <FileText className="size-5 text-tertiary" />
              <span className="font-semibold text-xs">Export PDF</span>
            </button>
          </div>

          <Button className="w-full" type="button" variant="outline">
            <Trash2 className="size-4" />
            Purge All Archive Data
          </Button>
        </motion.div>
      </BentoGrid>
    </section>
  );
}
