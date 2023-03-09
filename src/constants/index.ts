export const HEADER_LINKS = [
  {
    key: "earn",
    title: "Earn",
    link: "/",
    activePaths: ["/sell-protection", "/protection-pool/", "/"]
  },
  {
    key: "protect",
    title: "Protect",
    link: "/buy-protection",
    activePaths: ["/buy-protection", "/lending-pool/"]
  },
  {
    key: "portfolio",
    title: "Portfolio",
    link: "/portfolio",
    activePaths: ["/portfolio"]
  }
];

export const FOOTER_LINKS = [
  {
    title: "SOCIAL",
    links: [
      {
        name: "Discord",
        link: "https://discord.gg/2hQC6q8CxA",
        target: "_blank"
      },
      {
        name: "Twitter",
        link: "https://twitter.com/carapacefinance",
        target: "_blank"
      },
      {
        name: "Blog",
        link: "https://www.carapace.finance/blog",
        target: "_blank"
      }
    ]
  },
  {
    title: "PROTOCOL DESIGN",
    links: [
      {
        name: "Whitepaper",
        link: "https://www.carapace.finance/whitepaper",
        target: "_blank"
      },
      {
        name: "Documentation",
        link: "https://www.carapace.finance/docs/",
        target: "_blank"
      }
    ]
  },
  {
    title: "DEVELOPER",
    links: [
      {
        name: "Github",
        link: "https://github.com/carapace-finance",
        target: "_blank"
      }
    ]
  },
  {
    title: "LEGAL",
    links: [
      {
        name: "Privacy Policy",
        link: "",
        target: "_blank"
      },
      {
        name: "Terms of Use",
        link: "",
        target: "_blank"
      }
    ]
  }
];

export interface protocolParameters {
  leverageRatioFloor: string;
  leverageRatioCeiling: string;
  leverageRatioBuffer: string;
  openCycleDurationInDays: number;
  cycleDurationInDays: number;
  minProtectionDurationInDays: number;
  protectionExtensionGracePeriodInDays: number;
}

export const protocolParameters = {
  leverageRatioFloor: "0.5",
  leverageRatioCeiling: "1",
  leverageRatioBuffer: "0.05",
  openCycleDurationInDays: 7,
  cycleDurationInDays: 90,
  minProtectionDurationInDays: 30,
  protectionPurchaseLimitsInDays: 270, // todo: this value needs to be this long as we advance time in the playground mode
  protectionExtensionGracePeriodInDays: 14
};

export const UNISWAP_V3_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
