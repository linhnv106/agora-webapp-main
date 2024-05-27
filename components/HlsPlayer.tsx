'use client';

import Hls from 'hls.js';
import React, { useEffect, useRef } from 'react';

const HlsPlayer = (props: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    let hls: Hls | null = null;

    if (video && props.src.length) {
      video.addEventListener('error', (error) => {
        console.log(error);
      });

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // This will run in safari, where HLS is supported natively
        video.src = props.src;
      } else if (Hls.isSupported()) {
        // This will run in all other modern browsers
        hls = new Hls();
        hls.loadSource(props.src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            console.log('HLS.js fatal error');
          }
        });
      } else {
        console.error(
          // eslint-disable-line no-console
          'This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API',
        );
      }
    }

    return () => {
      if (video) {
        video.removeEventListener('error', (error) => console.log(error));
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, [props.src]);

  return <video ref={videoRef} controls autoPlay />;
};

export default HlsPlayer;
