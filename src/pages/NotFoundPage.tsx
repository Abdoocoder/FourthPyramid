import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MoveLeft, MoveRight, Home } from "lucide-react";
import { usePageEntrance } from "../lib/animations";

export function NotFoundPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const entranceRef = useRef<HTMLElement>(null);
  usePageEntrance(entranceRef, ".entrance-item");

  return (
    <main
      ref={entranceRef}
      className="min-h-[80dvh] flex items-center justify-center bg-background px-margin-mobile md:px-margin-desktop py-section-gap"
    >
      <div className="max-w-2xl w-full text-center flex flex-col items-center gap-8">
        <div className="entrance-item relative">
          <span className="text-[10rem] md:text-[14rem] font-bold text-surface-container-highest/30 select-none leading-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                <Home className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="entrance-item flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-on-background ltr:tracking-tight">
            {isAr ? "الصفحة غير موجودة" : "Page Not Found"}
          </h1>
          <p className="text-on-surface-variant text-lg max-w-[45ch] mx-auto leading-relaxed">
            {isAr
              ? "عذراً، الصفحة التي تبحث عنها قد تم نقلها أو أنها لم تعد موجودة. يرجى العودة إلى الصفحة الرئيسية أو استخدام قائمة التنقل."
              : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
          </p>
        </div>

        <Link
          to="/"
          className="entrance-item inline-flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-xl font-medium hover-lift-btn transition-all duration-250 shadow-sm"
        >
          {isAr ? <MoveRight className="w-5 h-5" /> : <MoveLeft className="w-5 h-5" />}
          <span>{isAr ? "العودة للرئيسية" : "Return to Home"}</span>
        </Link>
      </div>
    </main>
  );
}
