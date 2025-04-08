import * as React from "react";

const BadgeIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="88"
    height="88"
    fill="none"
    viewBox="0 0 88 88"
    {...props}
  >
    <path fill="#FFD300" d="M0 0h88v88H0z"></path>
    <path
      fill="#0B0A04"
      d="M23.762 63.006H14l6.766-38.37h9.762zM37.076 53.244h-5.677a2.04 2.04 0 0 0-2.042 2.042v5.677c0 1.128.914 2.042 2.042 2.042h5.677a2.04 2.04 0 0 0 2.042-2.042v-5.677a2.04 2.04 0 0 0-2.042-2.042M60.528 24.636h-9.762l-6.765 38.37h9.761zM71.958 24.636H66.28a2.04 2.04 0 0 0-2.043 2.042v5.677c0 1.128.915 2.043 2.043 2.043h5.677A2.04 2.04 0 0 0 74 32.355v-5.677a2.04 2.04 0 0 0-2.042-2.042"
    ></path>
  </svg>
);

export default BadgeIcon;