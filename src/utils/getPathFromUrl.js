
function getPathFromUrl(url) {
  const eventUrl = url?.split("?")[0];
    return eventUrl?.split("/");
  }
export default getPathFromUrl