import "https://unpkg.com/@eox/map";
import "https://unpkg.com/@eox/map/dist/eox-map-advanced-layers-and-sources.js";
import "https://unpkg.com/@eox/timecontrol";
import "https://unpkg.com/@eox/layercontrol";
import { parseStacToEOxJson } from "./parseStac.js";

const eoxMap = document.querySelector("eox-map");
eoxMap.config = {
  view: {
    zoom: 4,
    center: [12, 45],
  },
  layers: [],
};

const setup = async (url, date) => {
  const json = await parseStacToEOxJson(url, date);
  eoxMap.layers = json;

  // undo layer grouping of ol-stac
  postProcess(json);
};

const testUrl = "/examples/indicators/CO/catalog.json";
setup(testUrl, new Date("1989-07-07"));

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (evt) => {
    setup(testUrl, new Date(evt.target.textContent));
  });
});

const postProcess = (json) => {
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
        counter += 2;
      } else if (l.type === "Group") {
        countStacLayers(l.layers);
      }
    });
  };
  countStacLayers(json);
  eoxMap.map.on("postcompose", () => {
    if (counter === 0) {
      deGroupify(eoxMap.map.getLayers());
    }
    counter--;
  });
};
