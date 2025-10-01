import * as React from "react";

const ArrowCta: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="13"
    fill="none"
    viewBox="0 0 14 13"
    {...props}
  >
    <path
      fill="#F7F7F7"
      d="M13.719 7.666q.28-.313.281-.719 0-.405-.281-.719l-5-5A1.04 1.04 0 0 0 8 .947q-.405 0-.719.281A1.04 1.04 0 0 0 7 1.947q0 .405.281.719l3.313 3.281H1a.97.97 0 0 0-.719.281.97.97 0 0 0-.281.719q0 .438.281.719A.97.97 0 0 0 1 7.947h9.594L7.28 11.228a1.04 1.04 0 0 0-.281.719q0 .405.281.719.313.28.719.281.405 0 .719-.281z"
    ></path>
  </svg>
);

export default ArrowCta;
