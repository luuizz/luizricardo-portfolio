import * as React from "react";

const AvatarLogo: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="56"
    height="56"
    fill="none"
    viewBox="0 0 56 56"
    {...props}
  >
    <circle
      cx="28"
      cy="28"
      r="27"
      fill="#151203"
      stroke="#00010B"
      strokeWidth="2"
    ></circle>
    <path
      fill="#F7F7F7"
      d="M17.881 37.185H13L16.383 18h4.88zM24.538 32.304H21.7c-.564 0-1.022.457-1.022 1.021v2.839c0 .564.458 1.02 1.021 1.02h2.839c.564 0 1.021-.456 1.021-1.02v-2.839c0-.564-.457-1.021-1.021-1.021M36.264 18h-4.88L28 37.185h4.881zM41.979 18H39.14c-.564 0-1.022.457-1.022 1.021v2.839c0 .564.458 1.02 1.022 1.02h2.838c.564 0 1.021-.456 1.021-1.02V19.02C43 18.457 42.543 18 41.98 18"
    ></path>
  </svg>
);

export default AvatarLogo;
