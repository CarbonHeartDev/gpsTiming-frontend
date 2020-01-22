import React from 'react';
import { TracksManager, Track, Point } from './TracksManager';
import { parse } from 'fast-xml-parser';

const App: React.FC = () => {

  const [tracks, setTracks] = React.useState<Track[]>([]);

  return (
    <TracksManager tracksList={tracks} uploadFileCallback={(files => {
        if (files?.item(0)?.type === 'application/gpx+xml') {
        
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const parsedGPX = parse(e.target?.result as string, {ignoreAttributes : false});
            console.dir(parsedGPX);

            const path = parsedGPX.gpx.trk.trkseg.trkpt.map((e: any) => {
              return {
                position: {
                  lat: e['@_lat'],
                  lon: e['@_lon'],
                  alt: e['ele']
                },
                time: new Date(e['time'])
              }
            });

            setTracks(tracks => [...tracks, {name: (files.item(0)?.name as string),path}]);

          }
          
          const file: File = (files.item(0) as File);

          fileReader.readAsText(file);
        }
    })} />
  );
}

export default App;
