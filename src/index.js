import ethers from 'ethers';
import axios from 'axios';
import FormData from 'form-data';

class BlockscanChat {
  constructor() {
    this.endpoints = {
      /**
              * @name message
              * @description Get unread message count for the wallet address tied to API key
              */
      message: {
        /**
                  *
                  * @param {*} params
                  * @returns
                  */
        getLocalMsgCount: (params = {}) => {
          // Ensure no extra parameters are passed
          if (Object.keys(params).length > 0) {
            throw new Error('Invalid parameters passed to getLocalMsgCount method');
          }
          return {
            method: 'POST',
            body: {
              'method': 'unreadmsgcount',
              'apikey': this.apiKey,
            },
          };
        },
        /**
                  *
                  * @param {string} address - The address to get the unread message count for
                  * @return The number of unread messages for the address provided
                  */
        getExternalMsgCount: (params = {}) => {
          if (params.address == undefined) {
            throw new Error('Please provide an address to use the message.getExternalMsgCount method.');
          } else if (Object.keys(params).length > 1) {
            throw new Error('Only the address parameter is allowed for the message.getExternalMsgCount method.');
          } else if (typeof params.address != 'string') {
            throw new Error('The address parameter must be a string.');
          } else if (!ethers.utils.isAddress(params.address)) {
            throw new Error('The address parameter must be a valid address.');
          }
          return {
            method: 'POST',
            body: {
              'method': 'unreadmsgcount',
              'apikey': this.apiKey,
              'address': params.address,
            },
          };
        },
        /**
                  *
                  * @param {*} params
                  * @returns
                  */
        getFirstMsgId: (params = {}) => {
          // Ensure no extra parameters are passed
          if (Object.keys(params).length > 0) {
            throw new Error('Invalid parameters passed to getFirstMsgId method');
          }
          return {
            method: 'POST',
            body: {
              'method': 'getfirstmsgid',
              'apikey': this.apiKey,
            },
          };
        },
        /**
                  *
                  * @param {*} params
                  * @returns
                  */
        getLastMsgId: (params = {}) => {
          // Ensure no extra parameters are passed
          if (Object.keys(params).length > 0) {
            throw new Error('Invalid parameters passed to getLastMsgId method');
          }
          return {
            method: 'POST',
            body: {
              'method': 'getlastmsgid',
              'apikey': this.apiKey,
            },
          };
        },
        /**
                  *
                  * @param {*} params
                  * @returns
                  */
        getAllMsg: (params = {}) => {
          const methodParams = ['startId', 'offset', 'cType'];
          const userParams = Object.keys(params);

          // Ensure no extra parameters are passed
          if (Object.keys(params).length > 3) {
            throw new Error('Invalid parameters passed to getAllMsg method');
          } // ensure that the parameters passed are valid
          else if (userParams.length > 0) {
            for (let i = 0; i < userParams.length; i++) {
              if (!methodParams.includes(userParams[i])) {
                throw new Error(`Invalid parameter passed to getAllMsg method: ${userParams[i]}, please use one of the following: ${methodParams.join(', ')}`);
              } // for the valid parameters, check that the values are valid
              else {
                if (userParams[i] == 'startId' && typeof params[userParams[i]] != 'number') {
                  throw new Error(`Invalid parameter type passed to getAllMsg method: ${userParams[i]}, please provide an Integer`);
                  // offset must be a number that does not exceed 100 and is greater than or equal to 0
                } else if (userParams[i] == 'offset' && (typeof params[userParams[i]] != 'number' || params[userParams[i]] > 100 || params[userParams[i]] < 0)) {
                  throw new Error(`Invalid parameter type passed to getAllMsg method: ${userParams[i]}, please provide an Integer between 0 and 100`);
                  // cType must be a number that does not exceed 2 and is greater than or equal to 0
                } else if (userParams[i] == 'cType' && (typeof params[userParams[i]] != 'number' || params[userParams[i]] > 2 || params[userParams[i]] < 0)) {
                  throw new Error(`Invalid parameter type passed to getAllMsg method: ${userParams[i]}, please provide an Integer between 0 and 2`);
                }
              }
            }
          }
          return {
            method: 'POST',
            body: {
              'method': 'getchat',
              'apikey': this.apiKey,
              'startid': params?.startid ? params.startid : 0,
              'offset': params?.offset ? params.offset : 0,
              'ctype': params?.ctype ? params.ctype : 0,
            },
          };
        },
        /**
                  *
                  * @param {*} params
                  * @returns
                  */
        sendMsg: (params = {}) => {
          // Ensure that there are two parameters passed in the {} object
          if (params.address == undefined || params.message == undefined) {
            throw new Error('Please provide an address and message to use the message.sendMsg method.');
          }

          // Check if the parameters are in the correct order.
          if (!ethers.utils.isAddress(params.address) && typeof params.message == 'string') {
            throw new Error('Ensure that the first parameter is the address and the second parameter is the message.');
          }

          if (Object.keys(params).length > 2) {
            throw new Error('Please only provide an address and message to use the message.sendMsg method.');
          }

          return {
            method: 'POST',
            body: {
              'method': 'sendchat',
              'apikey': this.apiKey,
              'to': params.address,
              'msg': params.message,
            },
          };
        },
        /**
                  *
                  * @param {*} params
                  * @returns
                  */
        markAllMsgAsRead: (params = {}) => {
          // Ensure that no other parameters are passed in the {} object, only the address
          if (params.address == undefined) {
            throw new Error('Please provide an address to use the message.markAllMsgAsRead method.');
          } else if (Object.keys(params).length > 1) {
            throw new Error('Please only provide an address to use the message.markAllMsgAsRead method.');
          } else if (typeof params.address != 'string') {
            throw new Error('The address parameter must be a string.');
          } else if (!ethers.utils.isAddress(params.address)) {
            throw new Error('The address parameter must be a valid address.');
          }

          return {
            method: 'POST',
            body: {
              method: 'markmsgread',
              apikey: this.apiKey,
              address: params.address,
            },
          };
        },
      },
    };
  }

  init(apiKey, apiUrl) {
    // Ensure that this method is only called once and before any other method
    if (this.apiKey) {
      throw new Error('Please only call init() once.');
    }

    // First check if the 2 environment variables are set. If only api key set but not the api url, throw an error asking to set the api url. If only api url set but not the api key, throw an error asking to set the api key. If both are not set, throw an error asking to set both.
    if (!apiKey && !apiUrl) {
      throw new Error('BLOCKSCAN_CHAT_API_KEY and BLOCKSCAN_CHAT_API_URL environment variables must be set');
    } else if (!apiKey) {
      throw new Error('BLOCKSCAN_CHAT_API_KEY environment variable must be set');
    } else if (!apiUrl) {
      throw new Error('BLOCKSCAN_CHAT_API_URL environment variable must be set');
    } else {
      // Check if the API key is valid
      this.apiKey = apiKey;
      this.apiUrl = apiUrl;

      const formData = new FormData();
      formData.append('method', 'ping');
      formData.append('apikey', this.apiKey);

      axios.post(`${this.apiUrl}`, formData)
          .then((response) => {
            if (response.data.status != '1') {
              throw new Error('Invalid API key provided in BLOCKSCAN_CHAT_API_KEY environment variable');
            }
          });
    }
  }

  message(method = '', params = {}) {
    if (this.endpoints.message[method] == undefined) {
      throw new Error('Please provide a valid method for the message method.');
    } else {
      return this.request(this.endpoints.message[method](params));
    }
  }

  request(endpoint = {}) {
    // this should be called by the message method only and not directly
    if (endpoint.method == undefined || endpoint.body == undefined) {
      throw new Error('Please provide a valid endpoint object to use the request method.');
    }

    if (!this.apiKey) {
      throw new Error('Please call init() before calling any other method.');
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(endpoint.body)) {
      formData.append(key, value);
    }

    // If there is no api key, throw an error asking to call init() first
    return axios.post(`${this.apiUrl}`, formData)
        .then((response) => {
          return response.data.result;
        })
        .catch((error) => {
          return error;
        });
  }
}

export default new BlockscanChat;
