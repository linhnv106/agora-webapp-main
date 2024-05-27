import React, { useState } from 'react';
import { StreamStatusEnum } from '@/utils/enums';
import { IStream } from '@/utils/interfaces/stream';
import classNames from 'classnames';
import FlvPlayer from './FlvPlayer';

interface Props {
  data: IStream;
}

const StreamCard = ({ data }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="card w-full aspect-video select-none">
      {isPlaying && data.flvUrl ? (
        <FlvPlayer url={data.flvUrl} showControls={true} isMuted={true} />
      ) : (
        <div
          className={classNames('card-body border', {
            'cursor-pointer': data.status === StreamStatusEnum.Live,
          })}
          onClick={() => {
            if (data.status === StreamStatusEnum.Live) {
              setIsPlaying(true);
            }
          }}
        >
          <div className="card-actions justify-end">
            <div className="badge badge-accent">{data.status}</div>
          </div>
          <h2 className="card-title">{data.name}</h2>
          <p>{data.address}</p>
        </div>
      )}
    </div>
  );
};

export default StreamCard;
