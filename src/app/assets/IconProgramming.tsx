import * as React from "react";

const IconProgramming: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
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
      d="M18.003 17.002H5.997a3 3 0 0 1-3-3.001V5.997a3 3 0 0 1 3-3h12.006a3 3 0 0 1 3 3v8.004a3 3 0 0 1-3 3.001"
      clipRule="evenodd"
    ></path>
    <path
      stroke="#636363"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m14 17.002.501 4.002M10 17.002l-.501 4.002M7.198 21.004h9.604M16.798 9.98l-1.504 1.504M15.311 8.493l1.487 1.487M8.706 11.495 7.202 9.991M8.689 8.504 7.202 9.991M12.758 7.498 11.254 12.5"
    ></path>
  </svg>
);

export default IconProgramming;
