import React, { useEffect, useState, useRef } from "react";
import esriConfig from "@arcgis/core/config";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Query from "@arcgis/core/rest/support/Query";
//import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';

const BusinessTruthMap = () => {

    const mapRef = useRef(); // id for the map

    useEffect(() => {
        esriConfig.apiKey = "AAPK62daac607e3a40e58c9cb76c8412103bLVg4fLW_SF3o2d5z95L5PNemEaRIz6Kxk1K8GNpmykKl84zBrSADiPaiT0LRKbLK";

        // Underlying base units address points feature layer
        const featureLayer = new FeatureLayer({
          url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Base_Unit_Address_Points/FeatureServer/4",
          outFields: ["*"],
          title: "Base Units Address Points"
        });

        // create map and view
        const map = new Map({
            basemap: "streets-vector", // Basemap layer
            layers: [featureLayer]
          });
    
        const view = new MapView({
          map: map,
          center: [-83.0458, 42.3314],
          zoom: 13, // scale: 72223.819286
          container: mapRef.current,
          constraints: {
            snapToZoom: false
          },
          ui: {
            components: ['attribution', 'zoom', 'compass'],
          },
        });

        /*
        Data held in event.graphic.attributes
        {
            "OBJECTID": 285328,
            "addr_id": 541784,
            "unit_id": null,
            "bldg_id": 403360,
            "parcel_id": "02001873.003",
            "street_id": 33757,
            "street_number": 1247,
            "street_prefix": null,
            "street_name": "Woodward",
            "street_type": "Ave",
            "unit_type": null,
            "unit_number": null,
            "zip_code": "48226",
            "zip_four": "2025",
            "geo_source": "building"
        }
        */

        // once the view is set up, add the widgets to the page
        view.when(() => {
          // widget that queries for address = data
          const addressPointsWidget = new CustomContent({
            outFields: ["*"],
            creator: (event) => {
              console.log(event)

              /*
              const queryObject = new Query({
                outFields: ["*"],
                where: "1=1"
              });

              featureLayer.queryFeatures(queryObject)
              .then(function(response){
                // process the results
                console.log(response)

                const featureAttributes = result.features.map((item, i) => {
                    return item.attributes;
                  });
              });
              */
            }
          })

          // Create the PopupTemplate and place the panel inside
          const template = new PopupTemplate({
            outFields: ["*"],
            title: "State: {state_name}", // "state_name is one of the field names. try one of yours"
            content: [addressPointsWidget]
          });

          featureLayer.popupTemplate = template;
        });

        // clean up
        return () => { view && view.destroy()}
    }, []) // only run after initial render


    return (
        <div style={
          {
            height: 600
          }
        } ref={mapRef} />
    );
};

export default BusinessTruthMap;
