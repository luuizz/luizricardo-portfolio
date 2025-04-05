import { PiGithubLogo, PiLinkedinLogo, PiMicrosoftWordLogo } from "react-icons/pi"
import type { MenuLink, SocialLink } from "../types/types"

export const menuLinks: MenuLink[] = [
  {
    id: 1,
    title: 'Quem sou',
    url: '#quem-sou',
  },
  {
    id: 2,
    title: 'Projetos',
    url: '#projetos',
  },
  {
    id: 3,
    title: 'Contato',
    url: '#contato',
  }
]

export const socialLinks: SocialLink[] = [
  {
    id: 1,
    title: 'Linkedin',
    url: 'https://www.linkedin.com/in/luiz-ricardo-da-silva-tezoto-66807567/',
    icon: PiLinkedinLogo,
  },
  {
    id: 2,
    title: 'Github',
    url: 'https://github.com/luuizz',
    icon: PiGithubLogo,
  },
  {
    id: 3,
    title: 'Curriculum',
    url: 'https://docs.google.com/document/d/1uU7Zgpa1lPKDcNrMbjorFQvSqHIniF8m/edit?usp=sharing&ouid=109315793633850983973&rtpof=true&sd=true',
    icon: PiMicrosoftWordLogo,
  }
]