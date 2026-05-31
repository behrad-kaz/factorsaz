"use client";

import Image from "next/image";

export default function SmartLogo({
  src,
  alt,
  className = "",
  width = 160,
  height = 90,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`screen-only object-contain ${className}`}
        priority={priority}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`print-only object-contain ${className}`}
      />
    </>
  );
}
