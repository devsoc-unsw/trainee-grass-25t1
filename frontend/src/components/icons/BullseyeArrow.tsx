import * as React from "react";
import type { SVGProps } from "react";

const BullseyeArrow = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6 2h10v2H6zM4 6V4h2v2zm0 12H2V6h2zm2 2H4v-2h2zm12 0H6v2h12zm2-2v2h-2v-2zm0 0h2V8h-2zM12 6H8v2H6v8h2v2h8v-2h2v-4h-2v4H8V8h4zm2 8v-4h2V8h2V6h4V4h-2V2h-2v4h-2v2h-2v2h-4v4z"
    />
  </svg>
);
export default BullseyeArrow;
