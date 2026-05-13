import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MessageCircle, MapPin, CheckCircle, Send } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { siteConfig } from "../lib/constants";

export function ContactPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-section-gap">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-6">
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

  return (
    <div className="pt-28 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="mb-12">
        <h1 className="font-display-lg text-[clamp(1.8rem,4vw,3rem)] md:text-display-lg text-on-surface mb-4 leading-[1.1]">
          {t("contact.pageTitle")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {t("contact.pageDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap">
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-4 p-6 bg-surface-container border border-outline-variant rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("contact.phone")}</p>
              <a href={`tel:${siteConfig.phone}`} className="font-body-lg text-body-lg text-primary hover:underline">{siteConfig.phone}</a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-surface-container border border-outline-variant rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("contact.email")}</p>
              <a href={`mailto:${siteConfig.email}`} className="font-body-lg text-body-lg text-primary hover:underline">{siteConfig.email}</a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-surface-container border border-outline-variant rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("contact.whatsapp")}</p>
              <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} className="font-body-lg text-body-lg text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {siteConfig.whatsapp}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-surface-container border border-outline-variant rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface">{t("contact.address")}</p>
              <p className="font-body-lg text-body-lg text-on-surface-variant">{siteConfig.address}</p>
            </div>
          </div>

          <div className="h-[250px] bg-surface-container-highest border border-outline-variant rounded-xl overflow-hidden">
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.0!2d35.9!3d31.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzAwLjAiTiAzNcKwNTQnMDAuMCJF!5e0!3m2!1sen!2sjo!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="bg-surface p-6 md:p-10 rounded-xl border border-outline-variant shadow-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{t("contact.formTitle")}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label={t("contact.yourName")} id="contact-name" placeholder={t("contact.yourNamePlaceholder")} required />
                <Input label={t("contact.yourEmail")} id="contact-email" type="email" placeholder={t("contact.yourEmailPlaceholder")} required />
              </div>
              <Input label={t("contact.subject")} id="subject" placeholder={t("contact.subjectPlaceholder")} required />
              <Textarea label={t("contact.message")} id="contact-message" placeholder={t("contact.messagePlaceholder")} />
              <div className="pt-4 border-t border-outline-variant">
                <Button type="submit" size="lg" variant="tertiary" className="w-full justify-center">
                  <Send className="w-4 h-4" /> {t("contact.sendButton")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
