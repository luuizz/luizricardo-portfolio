import * as React from "react";

const IconRocket: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    { ...props }
  >
    <g
      stroke="#636363"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      clipPath="url(#a)"
    >
      <path d="M4 13a8 8 0 0 1 7 7 6 6 0 0 0 3-5 9 9 0 0 0 6-8 3 3 0 0 0-3-3 9 9 0 0 0-8 6 6 6 0 0 0-5 3"></path>
      <path d="M7 14a6 6 0 0 0-3 6 6 6 0 0 0 6-3M14 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0"></path>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default IconRocket;
