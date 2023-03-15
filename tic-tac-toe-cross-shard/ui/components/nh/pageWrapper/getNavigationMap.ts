import { ClockIcon, LightningBoltIcon, PlayIcon } from "@heroicons/react/outline";
import translation from "../../../constants/en.global.json";

const navigationObject = translation.navigation;

export function getNavigationMap() {
  const navigation = [
     {
      name: navigationObject.currentGamesTitle,
      href: "/",
      icon: LightningBoltIcon,
    },
     {
      name: navigationObject.pastGamesTitle,
      href: "/pastgames",
      icon: ClockIcon,
    },
  ];
  return navigation;
}
