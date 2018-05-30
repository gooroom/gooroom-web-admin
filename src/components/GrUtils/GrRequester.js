import axios from "axios";
import qs from "qs";

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
}

export function grRequestPromise(url, param) {

  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: "http://localhost:8080" + url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      transformRequest: [
        function(data, headers) {
          return qs.stringify(data);
        }
      ],
      data: param,
      withCredentials: true
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
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}


const instanceOfCollection = collection();



