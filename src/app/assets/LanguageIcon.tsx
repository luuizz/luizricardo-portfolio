import * as React from "react";

const LanguageIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    fill="none"
    viewBox="0 0 24 25"
    { ...props }
  >
    <path
      stroke="#636363"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M6.998 20.95a2.5 2.5 0 0 1-2.501-2.5v-3.002a2.5 2.5 0 0 0-2.501-2.501 2.5 2.5 0 0 0 2.5-2.501V7.445a2.5 2.5 0 0 1 2.502-2.501M17.002 4.944a2.5 2.5 0 0 1 2.501 2.5v3.002a2.5 2.5 0 0 0 2.501 2.501 2.5 2.5 0 0 0-2.5 2.501v3.001a2.5 2.5 0 0 1-2.502 2.501M8.674 13.029a.05.05 0 1 0-.1 0 .05.05 0 0 0 .1 0M12.05 13.02a.05.05 0 1 0-.1 0 .05.05 0 0 0 .1 0M15.051 13.02a.05.05 0 1 0-.1 0 .05.05 0 0 0 .1 0"
    ></path>
  </svg>
);

export default LanguageIcon;