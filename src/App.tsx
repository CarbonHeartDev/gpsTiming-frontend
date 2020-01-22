import React from 'react';
import { TracksManager, Track } from './TracksManager';

const App: React.FC = () => {

  const [tracks, setTracks] = React.useState<Track[]>([]);

  return (
    <TracksManager tracksList={tracks} uploadFileCallback={(files => {
      for(let i=0; i < (files as FileList)?.length;i++){
        setTracks([
          ...tracks,
          {name: (files as FileList)[i].name, rawContent: (files as FileList)[i].toString()}
        ]);
      }
    })}/>
  );
}

export default App;
