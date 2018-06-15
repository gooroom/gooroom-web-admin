import axios from 'axios';
import qs from 'qs';

export function requestPostAPI(url, param) {

    return axios({
        method: "post",
        url: "https://gpms.gooroom.kr/gpms/" + url,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        transformRequest: [
          function(data, headers) {
            return qs.stringify(data);
          }
        ],
        data: param,
        withCredentials: true
      });
}

