import './App.css';
import BusinessTruthMap from './components/BusinessTruthMap';
import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from "./components/SplitPane";
import { DatasetResultsHeader, DatasetList, RecordResponse } from './components/Results';
import MapContext from "./components/MapContext";
import { useState } from "react";

function App() {
  const [addressId, setAddressID] = useState(0);
  const [availableDatasets, setAvailableDatasets] = useState([])
  const [label, setLabel] = useState('')
  const [selectedDataset, setSelectedDataset] = useState('')
  const [recordsToView, setRecordsToView] = useState([])
  const [datasetResponse, setDatasetResponse] = useState({})
  return (
    <div className="App">
      <MapContext.Provider value={{ datasetResponse, setDatasetResponse, addressId, setAddressID, availableDatasets, setAvailableDatasets, label, setLabel, selectedDataset, setSelectedDataset, recordsToView, setRecordsToView }}>
        <SplitPane className="split-pane-row">
            <SplitPaneLeft>
              <SplitPane className="split-pane-col">
                <SplitPaneTop>
                  <DatasetResultsHeader />
                  <DatasetList />
                </SplitPaneTop>
                <Divider className="separator-row" />
                <SplitPaneBottom>
                  <RecordResponse />
                </SplitPaneBottom>
              </SplitPane>
            </SplitPaneLeft>
          <Divider className="separator-col" />
          <SplitPaneRight>
            <BusinessTruthMap />
          </SplitPaneRight>
        </SplitPane>
      </MapContext.Provider>
    </div>
  );
}

export default App;
