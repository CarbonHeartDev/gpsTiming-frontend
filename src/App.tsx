import React from 'react';
import { TracksManager, Track } from './TracksManager';
import { parse } from 'fast-xml-parser';
import { TracksMap } from './TracksMap';
import { Checkpoint, CheckpointManager } from './CheckpointManager';

const App: React.FC = () => {

  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [checkpoints, setCheckpoints] = React.useState<Checkpoint[]>([]);

  return (
    <>
    <h1>Cronometroty</h1>
      <div style={{ width: "50%" }}>
        <TracksManager tracksList={tracks} 
        uploadFileCallback={(files => {
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
        })}
        removeFileCallback={(id) => setTracks(tracks => [...tracks.slice(0, id),...tracks.slice(id+1)])}
        />
        <CheckpointManager checkpointList={checkpoints} removeCheckpointCallback={(id) => setCheckpoints(checkpoints => [...checkpoints.slice(0, id),...checkpoints.slice(id+1)])} />
      </div>
      <div style={{ width: "50%" }}>
        <TracksMap tracksToRender={tracks} checkpointsToRender={checkpoints} onNewCheckpoint={(checkpoint: Checkpoint) => setCheckpoints(checkpoints => [...checkpoints, checkpoint])}></TracksMap>
      </div>
      <div>
        v0.3.0
      </div>
    </>
  );
}

export default App;
