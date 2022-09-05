import { EyeOffIcon } from "./svg/EyeOffIcon";
import { BiSheildIcon } from "./svg/BiSheildIcon";
import { ViewGridIcon } from "./svg/ViewGridIcon";
import { BadgeCheckIcon } from "@heroicons/react/solid";

import {
  EyeIcon,
  GlobeIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SupportIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/outline";

export const productCards = [
  {
    id: 1,
    Icon: ViewGridIcon,
    title: "Out-of-the-box solutions let you ship fast",
    subtitle: "Our console allows you to quickly ship your applications and analyze data",
  },
  {
    id: 2,
    Icon: GlobeIcon,
    title: "Open Web Friendly",
    subtitle: "Enhance your application by interoperating with open source protocols and applications, from DeFi to NFTs",
  },
  {
    id: 3,
    Icon: BiSheildIcon,
    title: "Enterprise grade security and confidentiality",
    subtitle:
      "We leverage state-of-the-art privacy and permissioning techniques tailored to enterprises",
  },
  {
    id: 4,
    Icon: BadgeCheckIcon,
    title: "Ecosystem Interoperability",
    subtitle:
      "Our cross-shard routing contracts smoothly communicate with the public chain or other permissioned enterprise shards",
  },
];

export const offerings = [
  {
    id: "1a",
    title: "Uncompromising Security",
    subtitle:
      "Our cloud offerings are managed, standardized, tested, and externally audited, with robust access controls that scale to meet your project’s demands.",
    Icon: ShieldCheckIcon,
  },
  {
    id: "2a",
    title: "Store Private Information",
    subtitle:
      "We protect your data and strengthen trust when exchanging information with third parties.",
    Icon: EyeIcon,
  },
  {
    id: "3a",
    title: "Application Marketplace",
    subtitle:
      "Install applications and plugins from our Marketplace, right out of the box with no coding required.",
    Icon: GlobeIcon,
  },
  {
    id: "4a",
    title: "Robust Analytics and Tools",
    subtitle:
      "Intuitive dashboards let you manage, monitor, and analyze your applications and performance from day 1.",
    Icon: SupportIcon,
  },
  {
    id: "5a",
    title: "Developer Friendly",
    subtitle:
      "NEAR Protocol's intuitive developer tooling lets you build contracts in common languages like Rust, AssemblyScript or Javascript",
    Icon: ShoppingBagIcon,
  },
  {
    id: "6a",
    title: "Unique Domain Names",
    subtitle:
      "Assign a unique name to your Calimero shard on the public network. You can also assign subdomains, similar to using DNS.",
    Icon: SwitchHorizontalIcon,
  },
];
