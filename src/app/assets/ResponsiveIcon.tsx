import * as React from "react";

const ResponsiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    { ...props }
  >
    <path
      stroke="#636363"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m8.928 16-.5 4M20 8V5.428A2.43 2.43 0 0 0 17.572 3H5.428A2.43 2.43 0 0 0 3 5.428v8.144A2.43 2.43 0 0 0 5.428 16H13M6.928 20H11"
    ></path>
    <path
      stroke="#636363"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M15 20.5v-.406A2.1 2.1 0 0 1 17.094 18h2.812A2.1 2.1 0 0 1 22 20.094v.406a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5"
      clipRule="evenodd"
    ></path>
    <circle
      cx="18.5"
      cy="13.5"
      r="2"
      stroke="#636363"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></circle>
    <path
      stroke="#636363"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m7 7 1.491 1.491L7 9.982M10.5 11H12"
    ></path>
  </svg>
);

export default ResponsiveIcon;
