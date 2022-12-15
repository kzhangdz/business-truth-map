import { useContext, useEffect, useState } from "react";
import MapContext from "./MapContext";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const slugList = {
    'restaurant_data': 'DHD Restaurant Establishments',
    'fire_inspections_data': 'DFD Fire Inspections',
};

const apiLinks = {
    'restaurant_data': 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Restaurant_Establishments/FeatureServer/0',
    'fire_inspections_data': 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Fire_Inspections/FeatureServer/0',
};

const CalculateDatasetLabel = (datasetSlug) => {
    
    for (const slug in slugList) {
        if (datasetSlug === slug) {
            return slugList[slug];
        }
    }

};

const GetApiLink = (datasetSlug) => {
    
    for (const slug in apiLinks) {
        if (datasetSlug === slug) {
            return apiLinks[slug];
        }
    }

};


export const DatasetResultsHeader = () => {
    const { label } = useContext(MapContext);

    if (label === ''){
        return <div id="dataset-results-header">Click on the map to show available datasets for an address.</div>;
    } else {
        return <div id="dataset-results-header">{label}</div>;
    };
};


export const DatasetList = () => {
    const { availableDatasets, setSelectedDataset } = useContext(MapContext);
    const handleClick = (event) => {
        setSelectedDataset(event.target.id);
    };
    const datasetListDivs = availableDatasets.map(dataset => <div className="dataset-list-item" value={dataset} id={dataset} onClick={handleClick}> {CalculateDatasetLabel(dataset)} </div>);
    return (
        datasetListDivs
    );
};

const Table = () => {
    const { datasetResponse } = useContext(MapContext);
    return (
    <div className="table">
      <table className="table table-hover">
        <tbody>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
          {Object.keys(datasetResponse).map(( key, index ) => (
            <tr className="table-row">
              <td key={`tablevalue-${key}`}>{key}</td>
              <td key={`tablevalue-${index}`}>{datasetResponse[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
};

export const RecordResponse = () => {
    const { addressId, selectedDataset, datasetResponse, setDatasetResponse} = useContext(MapContext);

    useEffect(() => {
        if (selectedDataset !== '') {
            const featureLayer = new FeatureLayer({
                url: GetApiLink(selectedDataset)
            });
            const query = featureLayer.createQuery();
            query.where = "address_id =" + addressId; //TODO: Create GetAddressIdentifier for each dataset type
            query.outFields = ["*"]; // TODO: Create GetOutFields for each Dataset Type
            featureLayer.queryFeatures(query)
            .then(function(response) {
                setDatasetResponse(response.features[0].attributes);
        });
        }
    }, [selectedDataset]) 
    if (Object.keys(datasetResponse).length) {
        return (
            <div>
            <h3>
            {CalculateDatasetLabel(selectedDataset)}
            </h3>
            <Table />
            </div>
        );
    } else {
        return (
            <div>Please select an address and a dataset.</div>
        );
    }
    
}
