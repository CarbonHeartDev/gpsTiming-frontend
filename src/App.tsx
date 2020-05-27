import React from 'react';
import { TracksManager } from './TracksManager';
import { parse, validate } from 'fast-xml-parser';
import { TracksMap } from './TracksMap';
import { CheckpointManager } from './CheckpointManager';
import { Segment, Track, Coordinate } from './PathRoutePointUtils';
import { SidebarSection } from './SidebarSection';
import { LoadSaveRoutes } from './LoadSaveRoutes';

export interface MapState {
  state: 'IDLE' | 'DRAWING';
  tempCoordinate?: Coordinate;
}

const App: React.FC = () => {

  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [checkpoints, setCheckpoints] = React.useState<Segment[]>([]);
  const [mapState, setMapState] = React.useState<MapState>({ state: 'IDLE' })

  const uploadFileCallback = (files: (FileList | null)) => {
    if (files?.item(0)) {

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (validate(e.target?.result as string) === true) {
          const parsedGPX = parse(e.target?.result as string, { ignoreAttributes: false });
          console.log(parsedGPX)
          if (parsedGPX?.gpx?.trk) {
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
          } else {
            if (parsedGPX.gpx) {
              alert("The provided GPX doesn't have any track (trk) tag")
            } else {
              alert("Invalid XML schema, are you using a valid GPX or another XML format?")
            }
          }
        } else {
          alert("Invalid file, please check the format and the integrity of the file");
        }
      }

      const file: File = (files.item(0) as File);

      fileReader.readAsText(file);
    }
  }
  
  return (
    <>
      <div className="app-topbar">
        <h1>Cronometroty</h1>
        <span>Pre-release (Version 0.7.3)</span>
      </div>
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
              <CheckpointManager triggerDrawing={() => setMapState({ state: 'DRAWING' })} checkpointList={checkpoints} removeCheckpointCallback={(id) => setCheckpoints(checkpoints => [...checkpoints.slice(0, id), ...checkpoints.slice(id + 1)])} />
            </SidebarSection>
            <SidebarSection title="ROUTES">
              <LoadSaveRoutes currentRouteCheckpoints={checkpoints} setCurrentRouteCheckpoints={setCheckpoints}></LoadSaveRoutes>
            </SidebarSection>
          </div>
        </div>
        <div className="app-map-area">
          <TracksMap mapState={mapState} setMapState={setMapState} tracksToRender={tracks} checkpointsToRender={checkpoints} onNewCheckpoint={(checkpoint: Segment) => setCheckpoints(checkpoints => [...checkpoints, checkpoint])}></TracksMap>
        </div>
      </div>
    </>
  );
}

export default App;
