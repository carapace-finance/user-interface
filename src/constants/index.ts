export const HEADER_LINKS = [
  {
    key: "protect",
    title: "Protect",
    link: "/buy-protection",
    activePaths: ["/buy-protection", "/lending-pool", "/"]
  },
  {
    key: "earn",
    title: "Earn",
    link: "/sell-protection",
    activePaths: ["/sell-protection", "/protection-pool"]
  },
  {
    key: "portfolio",
    title: "Portfolio",
    link: "/buy-portfolio",
    activePaths: ["/buy-portfolio"]
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
      // {
      //   name: "Coming soon",
      //   link: "",
      //   target: ""
      // },
      {
        name: "Whitepaper",
        link: "https://www.carapace.finance/whitepaper",
        target: "_blank"
      }
      // {
      //   name: "User Doc",
      //   link: "",
      //   target: ""
      // },
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
  }
  // {
  // title: "LEGAL",
  // links: [
  //   {
  //     name: "Coming soon",
  //     link: "",
  //     target: ""
  //   }
  // {
  //   name: "Privacy Policy",
  //   link: "",
  //   target: ""
  // },
  // {
  //   name: "Terms of use",
  //   link: "",
  //   target: ""
  // },
  // ]
  // }
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
