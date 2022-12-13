import logo from './logo.svg';
import './App.css';
import BusinessTruthMap from './components/BusinessTruthMap';
import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from "./components/SplitPane";
import MapContext from "./components/MapContext";
import { useState } from "react";

function App() {
  const [addressId, setAddressID] = useState(0);
  // default address id is 0
  return (
    <div className="App">
      <MapContext.Provider value={{ addressId, setAddressID }}>
        <SplitPane className="split-pane-row">
          <SplitPaneLeft>
            <SplitPane className="split-pane-col">
              <SplitPaneTop />
              <Divider className="separator-row" />
              <SplitPaneBottom />
            </SplitPane>
          </SplitPaneLeft>
          <Divider className="separator-col" />

          <SplitPaneRight />
        </SplitPane>
      </MapContext.Provider>
    </div>
  );
}

export default App;
