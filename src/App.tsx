import React from 'react';
import { TracksManager, Track, Point } from './TracksManager';
import { parse } from 'fast-xml-parser';
import { TracksMap } from './TracksMap';

const App: React.FC = () => {

  const [tracks, setTracks] = React.useState<Track[]>([]);

  return (
    <>
      <div style={{ width: "50%" }}>
        <TracksManager tracksList={tracks} uploadFileCallback={(files => {
          if (files?.item(0)?.type === 'application/gpx+xml') {

            const fileReader = new FileReader();
            fileReader.onload = (e) => {
              const parsedGPX = parse(e.target?.result as string, { ignoreAttributes: false });

              const path = parsedGPX.gpx.trk.trkseg.trkpt.map((e: any) => {
                return {
                  position: {
                    latitude: e['@_lat'],
                    longitude: e['@_lon']
                  },
                  altitude: e['ele'],
                  time: new Date(e['time'])
                }
              });

              setTracks(tracks => [...tracks, { name: (files.item(0)?.name as string), path }]);

            }

            const file: File = (files.item(0) as File);

            fileReader.readAsText(file);
          }
        })} />
      </div>
      <div style={{ width: "50%" }}>
        <TracksMap></TracksMap>
      </div>
    </>
  );
}

export default App;
