'use client';

import { FC, Fragment, useEffect, useRef } from 'react';

export interface ReactFlvPlayerProps {
  isLive?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  showControls?: boolean;
  enableStashBuffer?: boolean;
  stashInitialSize?: number | undefined;
  height?: number;
  width?: number;
  isMuted?: boolean;
  url: string;
  videoProps?: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >;
}

export const FlvPlayer: FC<ReactFlvPlayerProps> = (props) => {
  const {
    height,
    width,
    isLive,
    hasAudio,
    hasVideo,
    showControls,
    enableStashBuffer,
    stashInitialSize,
    isMuted,
    url,
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const importFlv = async () => {
      const flv = (await import('flv.js')).default;
      const player = flv.createPlayer(
        {
          type: 'flv',
          isLive: isLive,
          hasAudio: hasAudio,
          hasVideo: hasVideo,
          url: url,
        },
        {
          stashInitialSize: stashInitialSize,
          enableStashBuffer: enableStashBuffer,
        },
      );

      player.attachMediaElement(videoRef.current!);
      player.load();
      player.play();
    };

    importFlv();
  }, [enableStashBuffer, hasAudio, hasVideo, isLive, stashInitialSize, url]);

  return (
    <Fragment>
      <video
        controls={showControls}
        muted={isMuted}
        ref={videoRef}
        style={{ height, width }}
        {...props.videoProps}
      />
    </Fragment>
  );
};

export default FlvPlayer;
