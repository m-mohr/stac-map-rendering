import "https://unpkg.com/@eox/map";
import "https://unpkg.com/@eox/map/dist/eox-map-advanced-layers-and-sources.js";
import "https://unpkg.com/@eox/timecontrol";
import "https://unpkg.com/@eox/layercontrol";
import { parseStacToEOxJson } from "./parseStac.js";

const eoxMap = document.querySelector("eox-map");

const setup = async () => {
  const json = await parseStacToEOxJson("./example/catalog.json");
  eoxMap.zoom = 8;
  eoxMap.config = {
    view: {
      zoom: 7,
      center: [15, 40.5],
    },
    layers: [...json, { type: "Tile", source: { type: "OSM" } }],
  };

  /**
   * de-group layer groups created by ol-stac
   */

  const deGroupify = (collection, parentCollection) => {
    collection.forEach((l) => {
      if (!l) return;
      if (l.getLayers) {
        deGroupify(l.getLayers(), collection);
      } else {
        if (!l.get("stac")) return;
        if (l.declutter_ === undefined) {
          // raster layer
          l.set("title", l.get("stac")._context.id);
          parentCollection.push(l);
          setTimeout(() => {
            parentCollection.removeAt(0);
          });
        } else {
          // vector layer
        }
      }
    });
  };

  let counter = 0;
  const countStacLayers = (layerJsonArray) => {
    layerJsonArray.forEach((l) => {
      if (l.type === "STAC") {
        counter++;
      } else if (l.type === "Group") {
        countStacLayers(l.layers);
      }
    });
  };
  countStacLayers(json);

  eoxMap.map.on("postcompose", () => {
    counter--;
    if (counter === 0) {
      deGroupify(eoxMap.map.getLayers());
    }
  });

  /**
   * de-group end
   */
};

setup();

// const eoxTimeControl = document.createElement("eox-timecontrol");
// eoxTimeControl.for = "eox-map";
// eoxTimeControl.layer = "NO2";

// eoxTimeControl.animationProperty = "TIME";
// eoxTimeControl.animationValues = ["2023-10-30", "2023-11-06", "2023-11-13"];

// document.body.appendChild(eoxTimeControl);
