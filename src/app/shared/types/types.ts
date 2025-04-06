import { IconType } from "react-icons";
import type { FC, SVGProps } from "react";

export type MenuLink = {
  id: number;
  title: string;
  url: string;
}

export type SocialLink = {
  id: number;
  title: string;
  url: string;
  icon: IconType
}

export type SocialBase = {
  id: number
  title: string
  url: string
  icons: {
    default: IconType
    filled: IconType
  },
  visibleInNav?: boolean
}

export type Diferencial = {
  id: number
  icon: FC<SVGProps<SVGSVGElement>>
  title: string
  description: string
}