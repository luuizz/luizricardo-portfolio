import { Diferencial } from "../types/types";
import FrontEndIcon from "@/app/assets/FrontEndIcon";
import FrameworksIcon from "@/app/assets/FrameworksIcon";
import CodeIcon from "@/app/assets/CodeIcon";
import { PiDevices, PiSpeedometer, PiLightning } from "react-icons/pi";


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