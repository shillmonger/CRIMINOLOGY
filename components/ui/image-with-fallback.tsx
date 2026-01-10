import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError" | "src"> {
  src: string;
  fallbackSrc: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc = "https://i.postimg.cc/1znspfyB/fall-back.jpg",
  //   fallbackSrc = 'https://i.postimg.cc/dVJYS5ws/fall-back.jpg',
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image {...props} src={imgSrc} onError={handleError} alt={alt || "Image"} />
  );
}
