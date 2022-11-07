import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-http-backend";

import translationEN from "./en/translation.json";
import translationID from "./id/translation.json";

i18n
  .use(XHR)
  .use(LanguageDetector)
  .init({
    react: {
      useSuspense: false,
    },
    debug: false,
    lng: i18n.options.lng,
    fallbackLng: "id", // use id if detected lng is not available
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    resources: {
      en: {
        translations: translationEN,
      },
      id: {
        translations: translationID,
      },
    },
    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",
  });

export default i18n;
