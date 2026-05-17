export const DEAL_TYPES = {
  LIFETIME: "lifetime",
  CASHBACK: "cashback",
  DIRECT_DISCOUNT: "direct-discount",
  FLASH: "flash",
};

export const sourceConfigs = [
  {
    id: "appsumo",
    name: "AppSumo",
    type: DEAL_TYPES.LIFETIME,
    url: "https://appsumo.com/deals/",
    affiliateTemplate: "https://go.my-store.local/appsumo?url={url}",
    parserHints: {
      productRegex: /\"name\":\"([^\"]+)\"/g,
      priceRegex: /\"price\":\"?([0-9]+(?:\.[0-9]{1,2})?)\"?/g,
      imageRegex: /\"image\":\"([^\"]+)\"/g,
      tag: "lifetime",
    },
  },
  {
    id: "stacksocial",
    name: "StackSocial",
    type: DEAL_TYPES.LIFETIME,
    url: "https://www.stacksocial.com/sales",
    affiliateTemplate: "https://go.my-store.local/stacksocial?redirect={url}",
    parserHints: {
      productRegex: /\"name\":\"([^\"]+)\"/g,
      priceRegex: /\"price\":\"?([0-9]+(?:\.[0-9]{1,2})?)\"?/g,
      imageRegex: /\"image\":\"([^\"]+)\"/g,
      tag: "lifetime",
    },
  },
  {
    id: "cashbackhub",
    name: "Cashback Hub",
    type: DEAL_TYPES.CASHBACK,
    url: "https://www.cashbackmonitor.com/",
    affiliateTemplate: "https://go.my-store.local/cashback?merchant={merchant}",
    parserHints: {
      cashbackRegex: /([0-9]{1,2}(?:\.[0-9])?)%\s*Cash\s*Back/gi,
    },
  },
];
