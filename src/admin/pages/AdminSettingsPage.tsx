import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { siteConfig } from "../../lib/constants";

const SETTING_KEYS = [
  "phone",
  "mobile",
  "whatsapp",
  "email",
  "fax",
  "address",
  "address_ar",
  "siteTitle",
  "metaDescription",
] as const;

type SettingKey = typeof SETTING_KEYS[number];

const DEFAULTS: Record<SettingKey, string> = {
  phone: siteConfig.phone,
  mobile: siteConfig.mobile,
  whatsapp: siteConfig.whatsapp,
  email: siteConfig.email,
  fax: siteConfig.fax,
  address: siteConfig.address,
  address_ar: siteConfig.address_ar,
  siteTitle: siteConfig.name,
  metaDescription: siteConfig.description,
};

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4">
      <h2 className="font-headline-sm text-headline-sm text-on-surface pb-3 border-b border-outline-variant">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function AdminSettingsPage() {
  const { t } = useTranslation();
  const savedSettings = useQuery(api.settings.getAll);
  const setMany = useMutation(api.settings.setMany);

  const [localValues, setLocalValues] = useState<Partial<Record<SettingKey, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const values = useMemo<Record<SettingKey, string>>(() => {
    const merged = { ...DEFAULTS };
    if (savedSettings) {
      for (const key of SETTING_KEYS) {
        if (savedSettings[key] !== undefined) merged[key] = savedSettings[key];
      }
    }
    for (const key of SETTING_KEYS) {
      if (localValues[key] !== undefined) merged[key] = localValues[key]!;
    }
    return merged;
  }, [savedSettings, localValues]);

  const set = (key: SettingKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValues((prev) => ({ ...prev, [key]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = SETTING_KEYS.map((key) => ({ key, value: values[key] }));
      await setMany({ entries });
      setLocalValues({});
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const isLoading = savedSettings === undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">{t("admin.settings")}</h1>
        <Button onClick={handleSave} disabled={saving || isLoading}>
          <Save className="w-4 h-4" />
          {saved ? t("admin.saved") : t("admin.saveSettings")}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-on-surface-variant animate-pulse font-body-sm text-body-sm">
          {t("admin.loading")}
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          <SettingsSection title={t("admin.settingsContact")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label={t("admin.settingsPhone")} id="s-phone" value={values.phone} onChange={set("phone")} />
              <Input label={t("admin.settingsMobile")} id="s-mobile" value={values.mobile} onChange={set("mobile")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label={t("admin.settingsWhatsapp")} id="s-wa" value={values.whatsapp} onChange={set("whatsapp")} />
              <Input label={t("admin.settingsFax")} id="s-fax" value={values.fax} onChange={set("fax")} />
            </div>
            <Input label={t("admin.settingsEmail")} id="s-email" value={values.email} onChange={set("email")} />
            <Input label={t("admin.settingsAddress")} id="s-addr" value={values.address} onChange={set("address")} />
            <Input label={t("admin.settingsAddressAr")} id="s-addr-ar" value={values.address_ar} onChange={set("address_ar")} dir="rtl" />
          </SettingsSection>

          <SettingsSection title={t("admin.settingsSeo")}>
            <Input label={t("admin.settingsSiteTitle")} id="s-title" value={values.siteTitle} onChange={set("siteTitle")} />
            <Input label={t("admin.settingsMetaDescription")} id="s-meta" value={values.metaDescription} onChange={set("metaDescription")} />
          </SettingsSection>
        </div>
      )}
    </div>
  );
}
