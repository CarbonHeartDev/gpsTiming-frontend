import React from 'react';
import { TracksManager } from './TracksManager';
import { parse } from 'fast-xml-parser';
import { TracksMap } from './TracksMap';
import { CheckpointManager } from './CheckpointManager';
import { Segment, Route } from './PathRoutePointUtils';
import { SidebarSection } from './SidebarSection';

const App: React.FC = () => {

  const [tracks, setTracks] = React.useState<Route[]>([]);
  const [checkpoints, setCheckpoints] = React.useState<Segment[]>([]);

  const uploadFileCallback = (files: (FileList | null)) => {
    if (files?.item(0)?.type === 'application/gpx+xml') {

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const parsedGPX = parse(e.target?.result as string, { ignoreAttributes: false });

        const path = parsedGPX.gpx.trk.trkseg.trkpt.map((e: any) => {
          return {
            position: {
              latitude: Number(e['@_lat']),
              longitude: Number(e['@_lon'])
            },
            altitude: Number(e['ele']),
            time: new Date(e['time'])
          }
        });

        setTracks(tracks => [...tracks, { name: (files.item(0)?.name as string), path }]);

      }

      const file: File = (files.item(0) as File);

      fileReader.readAsText(file);
    }
  }

  return (
    <>
      <h1>Cronometroty</h1>
      <div className="app-main-view">
        <div className="app-sidebar">
          <div>
            <SidebarSection title="TRACKS">
              <TracksManager tracksList={tracks}
                uploadFileCallback={uploadFileCallback}
                removeFileCallback={(id) => setTracks(tracks => [...tracks.slice(0, id), ...tracks.slice(id + 1)])}
                checkpoints={checkpoints}
              />
            </SidebarSection>
            <SidebarSection title="CHECKPOINTS MANAGEMENT">
              <CheckpointManager checkpointList={checkpoints} removeCheckpointCallback={(id) => setCheckpoints(checkpoints => [...checkpoints.slice(0, id), ...checkpoints.slice(id + 1)])} />
            </SidebarSection>
          </div>
        </div>
        <div className="app-map-area">
          <TracksMap tracksToRender={tracks} checkpointsToRender={checkpoints} onNewCheckpoint={(checkpoint: Segment) => setCheckpoints(checkpoints => [...checkpoints, checkpoint])}></TracksMap>
        </div>
      </div>
      <div>
        v0.6.2 (Uncle Frankie)
      </div>
    </>
  );
}

export default App;
