import type { MenuLink, SocialLink } from "../types/types"
import { baseSocialLinks } from "./socialBase"

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
    title: 'Porque me contratar',
    url: '#diferenciais',
  },
  {
    id: 4,
    title: 'Contato',
    url: '#contato',
  }
]

export const socialLinks: SocialLink[] = baseSocialLinks
  .filter(link => link.visibleInNav !== false)
  .map(({ id, title, url, icons }) => ({
  id,
  title,
  url,
  icon: icons.default
}))

export const socialLinksFooter: SocialLink[] = baseSocialLinks
  .filter(link => link.visibleInNav !== false)
  .map(({ id, title, url, icons }) => ({
  id,
  title,
  url,
  icon: icons.filled
}))