import axios, { post }  from "axios";
import qs from "qs";

//export const GPMS_URL = 'http://ain.gooroom.kr:8080/gpms/';
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

      if (response.data) {
        if (response.data.status && response.data.status.result === "success" && response.data.data && response.data.data.length > 0) {

            // const listData = [];
            // response.data.data.forEach(d => {
            //   const obj = {
            //     clientStatus: d.clientStatus,
            //     clientId: d.clientId,
            //     clientName: d.clientName,
            //     loginId: d.loginId,
            //     clientGroupName: d.clientGroupName,
            //     regDate: d.regDate
            //   };
            //   listData.push(obj);
            // });

            // const res = {
            //   rows: listData,
            //   rowsTotal: response.data.recordsTotal,
            //   rowsFiltered: response.data.recordsFiltered,
            //   page: response.data.draw,
            // };
            // resolve(res);

            resolve(response.data);
        } else {
          resolve(response.data);
        }
      } else {
          reject(response);
      }

    }).catch(function(error) {

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



