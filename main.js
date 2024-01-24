import "https://unpkg.com/@eox/map";
import "https://unpkg.com/@eox/map/dist/eox-map-advanced-layers-and-sources.js";
import "https://unpkg.com/@eox/timecontrol";
import "https://unpkg.com/@eox/layercontrol";
import { parseStacToEOxJson } from "./parseStac.js";

const eoxMap = document.querySelector("eox-map");

const setup = async () => {
  const json = await parseStacToEOxJson("./example/catalog.json");
  eoxMap.layers = json;
};

setup();

// let stacInfo;

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
