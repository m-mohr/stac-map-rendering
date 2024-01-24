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

eoxMap.map.once("loadend", () => {
  const deGroupify = (collection, parentCollection) => {
    collection.forEach((l) => {
      if (!l) return;
      if (l.getLayers) {
        deGroupify(l.getLayers(), collection);
      } else {
        if (l.declutter_ === undefined) {
          // raster layer
          l.set("title", l.get("stac")._context.id);
          parentCollection.push(l);
          setTimeout(() => {
            parentCollection.removeAt(0);
          });
        } else {
          // vector layer
          setTimeout(() => {
            collection.remove(l);
          });
        }
      }
    });
  };

  console.time("degroup")
  deGroupify(eoxMap.map.getLayers());
  console.timeEnd("degroup")

  // const stacGroup = eoxMap.map.getLayers().getArray()[1];
  // const wmsLayer = stacGroup.getLayers().getArray()[1];
  // stacGroup.setVisible(false);
  // stacInfo = wmsLayer.get("stac");
  // wmsLayer.set("id", stacInfo.title);
  // wmsLayer.set("title", stacInfo.title);
  // stacGroup.getLayers().remove(wmsLayer);
  // eoxMap.map.addLayer(wmsLayer);
});

// const eoxTimeControl = document.createElement("eox-timecontrol");
// eoxTimeControl.for = "eox-map";
// eoxTimeControl.layer = "NO2";

// eoxTimeControl.animationProperty = "TIME";
// eoxTimeControl.animationValues = ["2023-10-30", "2023-11-06", "2023-11-13"];

// document.body.appendChild(eoxTimeControl);
