import { Diferencial, Bullet, MarqueeItem } from "../types/types";
import FrontEndIcon from "@/app/assets/FrontEndIcon";
import FrameworksIcon from "@/app/assets/FrameworksIcon";
import CodeIcon from "@/app/assets/CodeIcon";
import { PiDevices, PiSpeedometer, PiLightning, PiAngularLogoFill, PiCodeBlockFill, PiAtomFill } from "react-icons/pi";
import IconProgramming from "@/app/assets/IconProgramming";
import IconRocket from "@/app/assets/IconRocket";
import ResponsiveIcon from "@/app/assets/ResponsiveIcon";
import LanguageIcon from "@/app/assets/LanguageIcon";
import { RiNextjsFill, RiPhpFill, RiWordpressFill, RiNodejsFill } from "react-icons/ri";

export const dadosDiferencial: Diferencial[] = [
  {
    id: 1,
    icon: FrontEndIcon,
    title: 'Além do front-end',
    description: 'Participo ativamente das decisões de design e experiência do usuário, indo além do código para agregar valor ao projeto.'
  },
  {
    id: 2,
    icon: FrameworksIcon,
    title: 'Frameworks',
    description: 'Utilizo as tecnologias mais atuais como Next.js, React e Angular para garantir escalabilidade, desempenho e manutenibilidade.'
  },
  {
    id: 3,
    icon: CodeIcon,
    title: 'Clean Code',
    description: 'Escrevo código legível, organizado e fácil de manter — pensando sempre em performance e na equipe que irá dar continuidade.'
  },
  {
    id: 4,
    icon: PiDevices,
    title: 'Design Responsivo',
    description: 'Crio interfaces adaptáveis a qualquer dispositivo, mantendo consistência visual e usabilidade.'
  },
  {
    id: 5,
    icon: PiSpeedometer,
    title: 'Otimização',
    description: 'Aplicações leves e rápidas, com atenção a SEO técnico, acessibilidade e boas práticas de performance.'
  },
  {
    id: 6,
    icon: PiLightning,
    title: 'Usabilidade',
    description: 'Experiências pensadas para o usuário, com foco em navegação intuitiva, acessível e com propósito claro.'
  },
]

export const dadosBullets: Bullet[] = [
  {
    id: 1,
    icon: IconRocket,
    title: '+5 anos de experiência'
  },
  {
    id: 2,
    icon: LanguageIcon,
    title: 'Desenvolvedor Front-end'
  },
  {
    id: 3,
    icon: IconProgramming,
    title: 'Profissional Dedicado'
  },
  {
    id: 4,
    icon: ResponsiveIcon,
    title: 'Design responsivo e acessível'
  }
]

export const dadosMarquee: MarqueeItem[] = [
  {
    id: 1,
    title: 'Front-end',
    icon: PiCodeBlockFill
  },
  {
    id: 2,
    title: 'Angular',
    icon: PiAngularLogoFill
  },
  {
    id: 3,
    title: 'Next.js',
    icon: RiNextjsFill
  },
  {
    id: 4,
    title: 'React',
    icon: PiAtomFill
  },
  {
    id: 5,
    title: 'PHP',
    icon: RiPhpFill
  },
  {
    id: 6,
    title: 'Wordpress',
    icon: RiWordpressFill
  },
  {
    id: 7,
    title: 'Node.js',
    icon: RiNodejsFill
  },
]