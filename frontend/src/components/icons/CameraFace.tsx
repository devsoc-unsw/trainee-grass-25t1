import * as React from "react";
import type { SVGProps } from "react";

const CameraFace = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="currentColor"
      d="M7 3h10v2h5v16H2V7h2v12h16V7h-5V5H9v2H2V5h5zm7 12h-4v2h4zm-4-2v2H8v-2zm0-2V9H8v2zm6 2v2h-2v-2zm0-2V9h-2v2z"
    />
  </svg>
);
export default CameraFace;
