import Link from "next/link";
import { getNavigationMap } from "../pageWrapper/getNavigationMap";

interface SideNavigationProps {
  menuPage: string;
}

export function SideNavigation({ menuPage }: SideNavigationProps) {
  return (
    <div className="hover:text-white text-inter font-medium text-sm">
      <div className="h-full bg-nh-bglight flex-col">
        <div className="pl-4 pt-8">
          {getNavigationMap().map((item, i) => (
            <div key={i}>
              <Link href={item.href}>
                <div
                  className={`transition duration-700 flex items-center justify-start py-4
                  ${
                    item.href === menuPage
                      ? "text-white"
                      : "text-nh-navigation-text"
                  }
                  hover:text-white cursor-pointer`}
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  <span>{item.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
