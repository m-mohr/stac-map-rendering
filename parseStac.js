export const parseStacToEOxJson = async (stacUrl, date = new Date()) => {
  return new Promise(async (resolve) => {
    const json = [];
    const indicator = await fetchStac(stacUrl);

    for (const g of indicator.links.filter((link) => link.rel === "child")) {
      const layerGroup = await fetchStac(g.href, stacUrl);
      json.push({
        type: "Group",
        properties: {
          id: layerGroup.id,
          title: layerGroup.id,
        },
        layers: [],
      });

      for (const l of layerGroup.links.filter((link) => link.rel === "child")) {
        const layer = await fetchStac(l.href, layerGroup._fetchUrl);
        if (layer.links.find((link) => link.rel === "wms")) {
          // collection-no-items
          json
            .find((lG) => lG.properties.id === layerGroup.id)
            .layers.push({
              type: "STAC",
              url: layer._fetchUrl,
              displayWebMapLink: true,
              properties: {
                id: layer.id,
                title: layer.id,
              },
            });
        }
        if (layer.links.some((link) => link.rel === "item")) {
          // collection-multiple-items
          const sorted = layer.links
            .filter((link) => link.rel === "item")
            .sort((a, b) => {
              const distancea = Math.abs(date - new Date(a.datetime));
              const distanceb = Math.abs(date - new Date(b.datetime));
              return distancea - distanceb; // sort a before b when the distance is smaller
            });
          const layerItem = await fetchStac(sorted[0].href, layer._fetchUrl);
          json
            .find((lG) => lG.properties.id === layerGroup.id)
            .layers.push({
              type: "STAC",
              url: layerItem._fetchUrl,
              displayWebMapLink: true,
              properties: {
                id: layerItem.id,
                title: layerItem.id,
              },
            });
        }
        if (layer.links.some((link) => link.rel === "child")) {
          // collection-multiple-collections
          const sorted = layer.links
            .filter((link) => link.rel === "child")
            .sort((a, b) => {
              const distancea = Math.abs(date - new Date(a.datetime));
              const distanceb = Math.abs(date - new Date(b.datetime));
              return distancea - distanceb; // sort a before b when the distance is smaller
            });
          const layerCollection = await fetchStac(
            sorted[0].href,
            layer._fetchUrl
          );
          for (const i of layerCollection.links.filter(
            (link) => link.rel === "item"
          )) {
            const layerItem = await fetchStac(
              i.href,
              layerCollection._fetchUrl
            );
            json
              .find((lG) => lG.properties.id === layerGroup.id)
              .layers.push({
                type: "STAC",
                url: layerItem._fetchUrl,
                displayWebMapLink: true,
                properties: {
                  id: layerItem.id,
                  title: layerItem.id,
                },
              });
          }
        }
      }
    }

    resolve(json);
  });
};

const buildPath = (path, prefix) => {
  let builtPath = path;
  if (path.startsWith("./")) {
    // convert relative child link into
    // link that is relative to root
    builtPath = `${prefix.substring(
      0,
      prefix.lastIndexOf("/")
    )}/${path.substring(2)}`;
  }
  return builtPath;
};

const fetchStac = async (stacUrl, prefix = "./") => {
  return new Promise(async (resolve) => {
    let fetchUrl = buildPath(stacUrl, prefix);
    const response = await fetch(fetchUrl);
    const stac = await response.json();
    stac._fetchUrl = fetchUrl;
    resolve(stac);
  });
};
