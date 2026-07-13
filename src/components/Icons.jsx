import React from "react";

const Icon = ({ children, size = 16, color = "currentColor", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

export const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </Icon>
);
export const BookIcon = (p) => (
  <Icon {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Icon>
);
export const ListIcon = (p) => (
  <Icon {...p}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4 6h.01M4 12h.01M4 18h.01" />
  </Icon>
);
export const LogoutIcon = (p) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </Icon>
);
export const MapPinIcon = (p) => (
  <Icon {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
export const CalendarIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Icon>
);
export const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const CameraIcon = (p) => (
  <Icon {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </Icon>
);
export const CircleIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
  </Icon>
);
export const CheckCircleIcon = (p) => (
  <Icon {...p}>
    <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
    <path d="M22 4L12 14.01l-3-3" />
  </Icon>
);
export const PlaneIcon = (p) => (
  <Icon {...p}>
    <path d="M17.8 19.2L16 11l3.5-3.5c.8-.8.8-2.2 0-3s-2.2-.8-3 0L13 8l-8.2-1.8-1.3 1.3L9 11l-3 3H3.5L2 15.5 6 17l1.5 4 1.5-1.5V17l3-3 3.5 5.5 1.3-1.3z" />
  </Icon>
);
export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </Icon>
);
export const ArrowLeftIcon = (p) => (
  <Icon {...p}>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </Icon>
);
export const RefreshIcon = (p) => (
  <Icon {...p}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.65 4.36A9 9 0 0 0 20.5 15" />
  </Icon>
);
export const SwapIcon = (p) => (
  <Icon {...p}>
    <path d="M7 3v14M7 17l-4-4M7 17l4-4" />
    <path d="M17 21V7M17 7l4 4M17 7l-4 4" />
  </Icon>
);