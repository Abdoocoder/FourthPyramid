import { useState, useRef, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../lib/usePageTitle";
import { useMutation } from "convex/react";
import { Phone, Mail, MessageCircle, MapPin, CheckCircle, Send, Loader, Printer } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { siteConfig } from "../lib/constants";
import { api } from "@convex/_generated/api";
import { usePageEntrance, useScrollReveal } from "../lib/animations";

function SuccessView() {
  const { t } = useTranslation();
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-section-gap">
      <div className="max-w-xl mx-auto text-center success-enter">
        <div className="success-icon-ring relative w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="font-display-lg text-[clamp(1.6rem,4vw,2.5rem)] text-on-surface mb-4 leading-[1.1]">
          {t("contact.submittedTitle")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          {t("contact.submittedDesc")}
        </p>
        <Button as="a" href="/" variant="primary">{t("contact.returnHome")}</Button>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { t, i18n } = useTranslation();
  usePageTitle(t("nav.contact"));
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const createContact = useMutation(api.contacts.create);

  usePageEntrance(pageHeaderRef, ".entrance", { stagger: 0.13, delay: 0.05 });
  useScrollReveal(gridRef, ".grid-reveal");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const name = data.get("contact-name") as string;
    const email = data.get("contact-email") as string;
    const subject = data.get("subject") as string;
    const message = data.get("contact-message") as string;
    const honeypot = data.get("website") as string;
    if (!name || !email || !subject || !message) return;
    setSending(true);
    setError("");
    try {
      await createContact({ name, email, subject, message, honeypot: honeypot || undefined });
      setSubmitted(true);
    } catch {
      setError(t("contact.error"));
    } finally {
      setSending(false);
    }
  };

  if (submitted) return <SuccessView />;

  return (
    <div className="pt-28 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div ref={pageHeaderRef} className="mb-12">
        <h1 className="entrance font-display-lg text-[clamp(1.8rem,4vw,3rem)] md:text-display-lg text-on-surface mb-4 leading-[1.1]">
          {t("contact.pageTitle")}
        </h1>
        <p className="entrance font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {t("contact.pageDesc")}
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap">
          <div className="grid-reveal md:col-span-5 space-y-6">
            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant grid-stagger">
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="group flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <p className="font-data-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-0.5">{t("contact.phone")}</p>
                <span className="font-body-sm text-body-sm text-on-surface font-medium" dir="ltr">{siteConfig.phone}</span>
              </div>
            </a>
            <a
              href={`tel:${siteConfig.mobile.replace(/\D/g, "")}`}
              className="group flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <p className="font-data-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-0.5">{t("contact.mobile")}</p>
                <span className="font-body-sm text-body-sm text-on-surface font-medium" dir="ltr">{siteConfig.mobile}</span>
              </div>
            </a>
            <div className="flex items-center gap-4 px-6 py-5">
              <Printer className="w-4 h-4 text-on-surface-variant shrink-0" />
              <div>
                <p className="font-data-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-0.5">{t("contact.fax")}</p>
                <span className="font-body-sm text-body-sm text-on-surface-variant" dir="ltr">{siteConfig.fax}</span>
              </div>
            </div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="group flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-all duration-200"
            >
              <Mail className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <p className="font-data-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-0.5">{t("contact.email")}</p>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">{siteConfig.email}</span>
              </div>
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <p className="font-data-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-0.5">{t("contact.whatsapp")}</p>
                <span className="font-body-sm text-body-sm text-on-surface font-medium" dir="ltr">{siteConfig.whatsapp}</span>
              </div>
            </a>
            <div className="flex items-start gap-4 px-6 py-5">
              <MapPin className="w-4 h-4 text-on-surface-variant shrink-0 mt-0.5" />
              <div>
                <p className="font-data-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-0.5">{t("contact.address")}</p>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {i18n.language === "ar" ? siteConfig.address_ar : siteConfig.address}
                </span>
              </div>
            </div>
          </div>

          <div className="h-[250px] bg-surface-container-highest border border-outline-variant rounded-xl overflow-hidden">
            <iframe
              title="Company Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent("Umm Butma Industrial Area, Al-Muwaqar, Amman, Jordan")}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="grid-reveal md:col-span-7">
          <div className="bg-surface p-6 md:p-10 rounded-xl border border-outline-variant shadow-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{t("contact.formTitle")}</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* honeypot — hidden from users, filled by bots */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label={t("contact.yourName")} id="contact-name" name="contact-name" placeholder={t("contact.yourNamePlaceholder")} required />
                <Input label={t("contact.yourEmail")} id="contact-email" name="contact-email" type="email" placeholder={t("contact.yourEmailPlaceholder")} required />
              </div>
              <Input label={t("contact.subject")} id="subject" name="subject" placeholder={t("contact.subjectPlaceholder")} required />
              <Textarea label={t("contact.message")} id="contact-message" name="contact-message" placeholder={t("contact.messagePlaceholder")} required />
              {error && (
                <div id="form-error" className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm" role="alert">
                  {error}
                </div>
              )}
              <div className="pt-4 border-t border-outline-variant">
                <Button type="submit" size="lg" variant="tertiary" className="w-full justify-center" disabled={sending} aria-describedby={error ? "form-error" : undefined}>
                  {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {t("contact.sendButton")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
