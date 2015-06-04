'use strict';

/**
 * @author Kenneth van der Werf
 * @class Loader
 * @version 0.1
 * @description Module for loading XHR requests with promise structure
 */
export default class Loader {
  constructor(strFile, strResponseType = 'arraybuffer', strSendType = 'GET') {
    return new Promise((resolve, reject) => {
      let objLoader = new XMLHttpRequest();
      objLoader.open(strSendType, strFile, true);
      objLoader.responseType = strResponseType;
      objLoader.onload = () => {
        if (objLoader.response) {
          resolve(objLoader.response);
        } else {
          reject();
        }
      };
      objLoader.onerror = () => {
        reject();
      };
      objLoader.send();
    });
  }
};
