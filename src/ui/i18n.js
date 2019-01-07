import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        "To get started, edit <1>src/App.js</1> and save to reload.":
          "To get started, edit <1>src/App.js</1> and save to reload.",
        "gpmsTest": "Community",
        "adminMenu": "ADMIN",
        "columnDate": "DATE",

        "columnBootViolated": "BootViolated",
        "columnExeViolated": "ExeViolated",
        "columnOSViolated": "OSViolated",
        "columnMediaViolated": "MediaViolated",

        "searchStartDate": "From-Date",
        "searchEndDate": "To-Date",

        "buttonSearch": "Search",

        "menuStatistic": "Statistic",
        "menuDailyViolated": "DailyViolatedStatics"
      }
    },
    kr: {
      translations: {
        "To get started, edit <1>src/App.js</1> and save to reload.":
          "Starte in dem du, <1>src/App.js</1> editierst und speicherst.",
          "gpmsTest": "커뮤니티",
          "adminMenu": "어드민",
          "columnDate": "날짜",

          "columnBootViolated": "부팅보안침해",
          "columnExeViolated": "실행보안침해",
          "columnOSViolated": "OS보안침해",
          "columnMediaViolated": "매체보안침해",
          "searchStartDate": "조회시작일",
          "searchEndDate": "조회종료일",

          "buttonSearch": "조회",

          "menuStatistic": "통계",
          "menuDailyViolated": "일별침해통계"
      }
    }
  },
  fallbackLng: "en",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
});

export default i18n;
