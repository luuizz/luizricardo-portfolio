import { PiGithubLogo, PiGithubLogoFill, PiLinkedinLogo, PiLinkedinLogoFill, PiMicrosoftWordLogo, PiMicrosoftWordLogoFill, PiWhatsappLogo, PiWhatsappLogoFill } from "react-icons/pi";
import { SocialBase } from "../types/types";

// socialBase.ts
export const baseSocialLinks: SocialBase[] = [
  {
    id: 1,
    title: 'Linkedin',
    url: 'https://www.linkedin.com/in/luiz-ricardo-da-silva-tezoto-66807567/',
    icons: {
      default: PiLinkedinLogo,
      filled: PiLinkedinLogoFill,
    }
  },
  {
    id: 2,
    title: 'Github',
    url: 'https://github.com/luuizz',
    icons: {
      default: PiGithubLogo,
      filled: PiGithubLogoFill,
    }
  },
  {
    id: 3,
    title: 'Curriculum',
    url: 'https://docs.google.com/document/d/1uU7Zgpa1lPKDcNrMbjorFQvSqHIniF8m/edit?usp=sharing&ouid=109315793633850983973&rtpof=true&sd=true',
    icons: {
      default: PiMicrosoftWordLogo,
      filled: PiMicrosoftWordLogoFill,
    }
  },
  {
    id: 4,
    title: 'Whatsapp',
    url: 'https://wa.me/5511960752785',
    icons: {
      default: PiWhatsappLogo,
      filled: PiWhatsappLogoFill,
    },
    visibleInNav: false,
  },
]
