import "https://unpkg.com/@eox/map";
import "https://unpkg.com/@eox/map/dist/eox-map-advanced-layers-and-sources.js";
import "https://unpkg.com/@eox/timecontrol";
import "https://unpkg.com/@eox/layercontrol";

const eoxMap = document.querySelector("eox-map");

eoxMap.layers = [
  {
    type: "STAC",
    displayPreview: true,
    url: "https://tamn.snapplanet.io/search?bbox=125.727770,-29.514858,133.412707,-23.673395&collections=S2",
    properties: {
      id: "stac",
      title: "STAC",
    },
  },
  {
    type: "Tile",
    source: {
      type: "OSM",
    },
    properties: {
      id: "osm",
      title: "OSM",
    },
  },
];

let stacInfo;

// eoxMap.map.once("loadend", () => {
//   const stacGroup = eoxMap.map.getLayers().getArray()[1];
//   const wmsLayer = stacGroup.getLayers().getArray()[1];
//   stacGroup.setVisible(false);
//   stacInfo = wmsLayer.get("stac");
//   wmsLayer.set("id", stacInfo.title);
//   wmsLayer.set("title", stacInfo.title);
//   stacGroup.getLayers().remove(wmsLayer);
//   eoxMap.map.addLayer(wmsLayer);
// });

// const eoxTimeControl = document.createElement("eox-timecontrol");
// eoxTimeControl.for = "eox-map";
// eoxTimeControl.layer = "NO2";

// eoxTimeControl.animationProperty = "TIME";
// eoxTimeControl.animationValues = ["2023-10-30", "2023-11-06", "2023-11-13"];

// document.body.appendChild(eoxTimeControl);
