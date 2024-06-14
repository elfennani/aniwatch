import React from "react";
import { Link, Slot, usePathname } from "expo-router";
import { Iconify } from "react-native-iconify";
import cn from "@/utils/cn";

type Props = {};

const TabsLayout = (props: Props) => {
  const pathname = usePathname();

  const active = (path: string) => pathname == path;
  const size = 32;

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: <Iconify icon="material-symbols-light:home" size={size} />,
    },
    {
      name: "Completed",
      path: "/completed",
      icon: <Iconify icon="material-symbols-light:check" size={size} />,
    },
    {
      name: "Planned",
      path: "/planned",
      icon: (
        <Iconify icon="material-symbols-light:playlist-add-check" size={size} />
      ),
    },
    {
      name: "Dropped",
      path: "/dropped",
      icon: <Iconify icon="material-symbols-light:remove-done" size={size} />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: (
        <Iconify
          icon="material-symbols-light:notifications-outline-sharp"
          size={size}
        />
      ),
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <Iconify icon="material-symbols-light:person" size={size} />,
    },
  ];

  return (
    <div className="container mx-auto">
      <nav className="bg-white dark:bg-black fixed top-0 bottom-0 w-48">
        <ul className="flex flex-col pt-10 h-full">
          {routes.map((route) => (
            <li key={route.name}>
              <Link
                href={route.path}
                className={cn(
                  "flex items-center font-semibold text-zinc-500 text-xl py-3 gap-2",
                  active(route.path) && "text-purple-500"
                )}
              >
                {route.icon}
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pl-52 pt-10">
        <Slot />
      </div>
    </div>
  );
};

export default TabsLayout;
