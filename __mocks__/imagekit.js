export default class ImageKit {
    upload() {
      return Promise.resolve({
        filePath: "mocked/path",
      });
    }
  
    url({ path }) {
      return `https://mocked.imagekit.io/${path}`;
    }
  }
  