/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";

export interface ImagePlayerProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  images: string[];
  interval?: number;
  loop?: boolean;
  onComplete?: () => void;
  renderImage?: (src: string, index: number) => React.ReactNode;
}

export function ImagePlayer({
  images,
  interval = 500,
  loop = true,
  onComplete,
  renderImage,
  ...props
}: ImagePlayerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  const currentImage = React.useMemo(
    () => images[currentIndex],
    [images, currentIndex],
  );

  React.useEffect(() => {
    if (images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= images.length) {
          if (loop) {
            return 0;
          }
          onCompleteRef.current?.();
          return prevIndex;
        }

        return nextIndex;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, interval, loop]);

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="text-destructive text-sm">No images</div>;
  }

  return (
    <>
      {renderImage ? (
        renderImage(currentImage, currentIndex)
      ) : (
        <img src={currentImage} alt={props.alt ?? ""} {...props} />
      )}
    </>
  );
}
