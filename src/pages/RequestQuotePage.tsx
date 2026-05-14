import { useState, useRef, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import { Globe, CheckCircle, ArrowRight, Loader } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input, Textarea, Select } from "../components/ui/Input";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { usePageEntrance } from "../lib/animations";

function SuccessView() {
  const { t } = useTranslation();
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-section-gap">
      <div className="max-w-xl mx-auto text-center success-enter">
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="font-display-lg text-[clamp(1.6rem,4vw,2.5rem)] text-on-surface mb-4 leading-[1.1]">
          {t("quote.submittedTitle")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          {t("quote.submittedDesc")}
        </p>
        <Button as="a" href="/" variant="primary">
          {t("quote.returnHome")}
        </Button>
      </div>
    </div>
  );
}

export function RequestQuotePage() {
  const { t } = useTranslation();
  usePageTitle(t("nav.requestQuote"));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const createQuote = useMutation(api.quotes.create);

  usePageEntrance(leftPanelRef, ".entrance", { stagger: 0.13, delay: 0.05 });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    try {
      await createQuote({
        companyName: data.get("companyName") as string,
        contactName: data.get("contactName") as string,
        email: data.get("email") as string,
        phone: data.get("phone") as string,
        productType: data.get("productType") as string,
        quantity: (data.get("quantity") as string) || "",
        message: (data.get("message") as string) || "",
        honeypot: (data.get("website") as string) || undefined,
      });
      setSubmitted(true);
    } catch {
      setError(t("quote.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return <SuccessView />;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        <div ref={leftPanelRef} className="md:col-span-5 md:sticky md:top-32 pr-0 md:pr-8 mb-12 md:mb-0">
          <h1 className="entrance font-display-lg text-[clamp(1.6rem,4vw,3rem)] md:text-display-lg text-on-surface mb-6 leading-[1.1]">
            {t("quote.pageTitle")}
          </h1>
          <p className="entrance font-body-lg text-body-lg text-on-surface-variant mb-10">
            {t("quote.pageDesc")}
          </p>
          <div className="space-y-4">
            <div className="entrance flex items-center gap-3 bg-surface-container p-4 rounded-xl border border-outline-variant/50">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("quote.globalExportTitle")}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{t("quote.globalExportDesc")}</p>
              </div>
            </div>
            <div className="entrance flex items-center gap-3 bg-surface-container p-4 rounded-xl border border-outline-variant/50">
              <CheckCircle className="w-5 h-5 text-primary" />
              <div>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("quote.leaderTitle")}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{t("quote.leaderDesc")}</p>
              </div>
            </div>
          </div>
        </div>

        <div ref={formPanelRef} className="md:col-span-7">
          <div className="form-reveal bg-surface p-6 md:p-10 rounded-xl border border-outline-variant shadow-sm">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-sm font-body-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* honeypot — hidden from users, filled by bots */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label={t("quote.companyName")} id="companyName" name="companyName" placeholder={t("quote.companyNamePlaceholder")} required />
                <Input label={t("quote.contactName")} id="contactName" name="contactName" placeholder={t("quote.contactNamePlaceholder")} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label={t("quote.businessEmail")} id="email" name="email" type="email" placeholder={t("quote.businessEmailPlaceholder")} required />
                <Input label={t("quote.phoneNumber")} id="phone" name="phone" type="tel" placeholder={t("quote.phoneNumberPlaceholder")} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select label={t("quote.productType")} id="productType" name="productType" defaultValue="" required>
                  <option disabled value="">{t("quote.productTypePlaceholder")}</option>
                  <option value="injection">{t("quote.productOptionInjection")}</option>
                  <option value="blow">{t("quote.productOptionBlow")}</option>
                  <option value="extrusion">{t("quote.productOptionExtrusion")}</option>
                  <option value="custom">{t("quote.productOptionCustom")}</option>
                </Select>
                <Input label={t("quote.estimatedQuantity")} id="quantity" name="quantity" placeholder={t("quote.estimatedQuantityPlaceholder")} />
              </div>
              <Textarea label={t("quote.projectDetails")} id="message" name="message" placeholder={t("quote.projectDetailsPlaceholder")} />
              <div className="pt-4 border-t border-outline-variant">
                <Button type="submit" size="lg" variant="tertiary" className="w-full justify-center" disabled={submitting}>
                  {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  {t("quote.submitButton")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
