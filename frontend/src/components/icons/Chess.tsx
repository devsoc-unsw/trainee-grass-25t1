import * as React from "react";
import type { SVGProps } from "react";

const Chess = (props: SVGProps<SVGSVGElement>) => (
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
      d="M2 2h20v20H2zm2 2v4h4v4H4v4h4v4h4v-4h4v4h4v-4h-4v-4h4V8h-4V4h-4v4H8V4zm8 8H8v4h4zm0-4v4h4V8z"
    />
  </svg>
);
export default Chess;
