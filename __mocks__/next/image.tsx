import * as React from "react";

import { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & { src: string };

export default function Image({ src, alt, width, height, fill, style, className }: Props) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ objectFit: "cover", width: "100%", height: "100%", ...style }}
        className={className}
      />
    );
  }
  return (
    <img src={src} alt={alt} width={width as number} height={height as number} style={style} className={className} />
  );
}
