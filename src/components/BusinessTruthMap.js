import React, { useEffect, useState, useRef, useContext } from "react";
import esriConfig from "@arcgis/core/config";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Basemap from "@arcgis/core/Basemap";
import MapContext from "./MapContext";
//import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';

const BusinessTruthMap = () => {

    const mapRef = useRef(); // id for the map
    const {setAddressID, setAvailableDatasets, setLabel, setSelectedDataset, setDatasetResponse} = useContext(MapContext);

    useEffect(() => {
        esriConfig.apiKey = "AAPK62daac607e3a40e58c9cb76c8412103bLVg4fLW_SF3o2d5z95L5PNemEaRIz6Kxk1K8GNpmykKl84zBrSADiPaiT0LRKbLK";

        // Underlying base units address points feature layer
        const featureLayer = new FeatureLayer({
          url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/BT_Index_Test/FeatureServer/0",
          outFields: ["*"],
          title: "Business Locations"
        });

        let basemap = new Basemap({
          portalItem: {
            id: "33ea4550c8144e66847d902e4766c2f7"  // OpenStreetMap (Light Gray Canvas)
          }
        });

        // create map and view
        const map = new Map({
            basemap: basemap, // Basemap layer
            layers: [featureLayer]
          });
    
        const view = new MapView({
          map: map,
          center: [-83.0458, 42.3314],
          zoom: 13, // scale: 72223.819286
          container: mapRef.current
        });

        // once the view is set up, add the widgets to the page
        view.when(() => {

          // Create the PopupTemplate and place the panel inside
          const template = new PopupTemplate({
            outFields: ["*"],
            title: "{label}"
          });

          featureLayer.popupTemplate = template;
        });
        // Get the screen point from the view's click event
        view.on("click", function (event) {
          // Search for graphics at the clicked location. View events can be used
          // as screen locations as they expose an x,y coordinate that conforms
          // to the ScreenPoint definition.
          view.hitTest(event).then(function (response) {
            // only get the graphics returned from myLayer
            const graphicHits = response.results?.filter(
              (hitResult) => hitResult.type === "graphic" && hitResult.graphic.layer === featureLayer
            );
            if (graphicHits?.length > 0) {
              // do something with the myLayer features returned from hittest
              graphicHits.forEach((graphicHit) => {
                setAddressID(graphicHit.graphic.attributes.address_id);
                setLabel(graphicHit.graphic.attributes.label);
                setAvailableDatasets(graphicHit.graphic.attributes.datasets.split(','));
                setSelectedDataset({});
                setDatasetResponse({});
                return;
              });
            }
          });
        });
        // clean up
        return () => { view && view.destroy()}
    }, []) // only run after initial render


    return (
        <div style={
          {
            height: "100%"
          }
        } ref={mapRef} />
    );
};

export default BusinessTruthMap;
