import axios from "axios";
import { API_BASE_URL } from '../types';
import {getToken} from "../util/storage";

export const jsonClient = (responseType='json') => {
    return {
        _client: axios.create({
                                  responseType,
                                  baseURL: API_BASE_URL,
                                  "routes": {
                                      "cors": true
                                  },
                                  headers: {
                                      'Authorization': `Token ${getToken()}`,
                                      'Content-Type': 'application/json',
                                  }
                              }),

        _handleError: function(error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
            } else {
                throw error;
            }
        },

        get: function(url) {
            return this._client.get(url).catch(this._handleError);
        },

        post: function(url, data) {
            return this._client.post(url, data).catch(this._handleError);
        }
    }
};

export const graphqlClient = () => {
	return {
		_client: axios.create({
                                  baseURL: API_BASE_URL,
                                  "routes": {
                                      "cors": true
                                  },
                                  headers: {
                                      'Authorization': `Token ${getToken()}`,
                                      'Content-Type': 'application/json',
                                  }
                              }),

		post: function(url, data) {
			return this._client.post(url, data)
					.then(res => {
						if (res.data.errors) {
							throw new Error(res.data.errors.map(error => error.message).join(' | '));
                        }
                        return res;
                    })
		}
    }
};
