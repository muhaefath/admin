import { useEffect, useState } from "react";
import Image from "next/image";

export const FallbackImage = ({
  src,
  onErrorImage = "/images/no_image.png",
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc ? imgSrc : onErrorImage}
      onError={() => {
        setImgSrc(onErrorImage);
      }}
    />
  );
};
