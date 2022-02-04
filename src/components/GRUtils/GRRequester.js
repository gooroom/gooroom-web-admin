import axios  from "axios";
import qs from "qs";

export const GPMS_URL = '/gpms/';

function collection() {
    let data = {};
    function getData(key) {
        return data[key];
    }
    function setData(key, value) {
        data[key] = value;
    }
    return {
        getData: getData,
        setData: setData
    };
};

export function grRequestPromise(url, param) {

  return new Promise((resolve, reject) => {
    axios({
      method: (param.method) ? param.method : "post",
      url: GPMS_URL + url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      transformRequest: [
        function(data, headers) {
          return qs.stringify(data, {arrayFormat:'brackets'});
        }
      ],
      data: param,
      withCredentials: false
    }).then(function(response) {

      if (response.data !== undefined) {
        
        if (response.data.status && response.data.status.result === "success" && response.data.data && response.data.data.length > 0) {
            resolve(response.data);
        } else {
          resolve(response.data);
        }

      } else {
        reject(response);
      }

    }).catch(function(error) {
      reject(error);
    });
  });
};


export function requestPostAPI(url, param, headers) {

  return axios({
    method: "post",
    url: GPMS_URL + url,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    transformRequest: [
      function(data, headers) {
        return qs.stringify(data, {arrayFormat:'brackets'});
      }
    ],
    data: param,
    withCredentials: false
  });
};

// download
export function requestFilePostAPI(url, param, headers) {
  return axios({
    method: "post",
    url: GPMS_URL + url, 
    responseType: 'arraybuffer',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: param,
    withCredentials: false
  });
};

// multipartform
export function requestMultipartFormAPI(url, param, headers) {
  return axios({
      method: "post",
      url: GPMS_URL + url,
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: [
        function(data, headers) {

          // const formData = new FormData();
          // formData.append('wallpaperFile','file');
          // formData.append('wallpaperNm', 'FILENAME_777');

          let formData = new FormData();
          for( let key in data ) {
            formData.append(key, data[key]);
          }


          return formData;
        }
      ],
      data: param,
      withCredentials: false
    });
};

// const instanceOfCollection = collection();

export function grRequestGetAPI(url, data) {

  return axios({
    method: 'GET',
    url: GPMS_URL + url,
    withCredentials: false,
    data: data,
  });
}