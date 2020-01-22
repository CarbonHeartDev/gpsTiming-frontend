import React from 'react';
import { TracksManager, Track } from './TracksManager';
import { parse } from 'fast-xml-parser';

const App: React.FC = () => {

  const [tracks, setTracks] = React.useState<Track[]>([]);

  return (
    <TracksManager tracksList={tracks} uploadFileCallback={(files => {
        if (files?.item(0)?.type === 'application/gpx+xml') {
        
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            console.dir(e.target?.result);
          }
          
          const file: File = (files.item(0) as File);

          fileReader.readAsText(file);
        }
    })} />
  );
}

export default App;
