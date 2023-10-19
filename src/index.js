const { Keccak } = require("sha3");
const axios = require("axios");
const FormData = require("form-data");

/**
 * Represents the BlockscanChat class for interacting with the Blockscan Chat API.
 *
 * @class
 * @example
 * const { BlockscanChat } = require("blockscanchat-sdk");
 * const bc = new BlockscanChat(
 * "TEST_API_KEY"
 * );
 *
 */
class BlockscanChat {
  /**
   * Initializes the BlockscanChat class.
   *
   * Sets the `apiKey` property to an empty string and the `apiUrl` property to "https://chatapi.blockscan.com/v1/api".
   * Defines the `request` method for making API requests.
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error(
        "Please provide an API key when initializing the BlockscanChat class."
      );
    }

    /**
     * The API key to be used for authentication.
     * @type {string}
     * @private
     * @readonly
     */
    this._apiKey = apiKey;

    /**
     * The URL of the Blockscan Chat API.
     * @type {string}
     * @private
     * @readonly
     */
    this._apiUrl = "https://chatapi.blockscan.com/v1/api";

    /**
     * The request method for making API requests.
     * @type {Function}
     * @private
     * @readonly
     */
    this._request = async (endpoint = {}) => {
      if (!endpoint.method || !endpoint.body) {
        throw new Error("Please provide a valid endpoint object.");
      }

      const formData = new FormData();
      for (const [key, value] of Object.entries(endpoint.body)) {
        formData.append(key, value);
      }

      try {
        const response = await axios.post(`${this._apiUrl}`, formData);
        return response.data.result;
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // throw new Error(error.response.data);
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //jsut console log the error line that starts with "AxiosError"
          throw new Error(error.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log(error.message);
        }
        // console.log(error.config);
      }
    };

    this._init(apiKey);
  }

  /**
   * Initializes the BlockscanChat class with an API key.
   *
   * @private
   *
   * @param {string} apiKey - The API key to be used for authentication.
   * @returns {Promise} A promise that resolves when the initialization is successful.
   * @throws {Error} If `init` is called more than once.
   * @throws {Error} If `apiKey` is not provided.
   * @throws {Error} If the provided API key is invalid.
   */

  async _init(apiKey) {
    const response = await this._request({
      method: "POST",
      body: {
        method: "ping",
        apikey: apiKey,
      },
    });

    const regex = /pong-0x[0-9a-fA-F]{40}/g;

    if (response != undefined && !regex.test(response)) {
      throw new Error(
        "Invalid API key provided in the constructor. Please provide a valid API key."
      );
    }
  }

  /**
   * Retrieves the count of unread local messages.
   *
   * @returns {Promise<number>} The count of unread local messages.
   *
   * @example
   * getLocalMsgCount()
   *   .then((msgCount) => {
   *     console.log(msgCount);
   *   })
   *   .catch((error) => {
   *     console.error("Failed to retrieve the count of unread local messages:", error);
   *   });
   */
  getLocalMsgCount() {
    return this._request({
      method: "POST",
      body: {
        method: "unreadmsgcount",
        apikey: this._apiKey,
      },
    });
  }

  /**
   * Retrieves the count of unread messages for a specific address.
   *
   * @param {string} address - The address for which to retrieve the message count.
   * @returns {Promise<number>} The count of unread messages for the address.
   * @throws {Error} If the address is not provided or is not of type string.
   * @throws {Error} If the address is not a valid address.
   *
   * @example
   * getExternalMsgCount("0x1234567890123456789012345678901234567890")
   *   .then((msgCount) => {
   *     console.log(msgCount);
   *   })
   *   .catch((error) => {
   *     console.error("Failed to retrieve the count of unread messages:", error);
   *   });
   */

  getExternalMsgCount(address) {
    if (!address || typeof address !== "string") {
      throw new Error("Please provide a valid address.");
    }
    if (!this._isAddress(address)) {
      throw new Error("The address parameter must be a valid address.");
    }

    return this._request({
      method: "POST",
      body: {
        method: "unreadmsgcount",
        apikey: this._apiKey,
        address,
      },
    });
  }

  /**
   * Retrieves the ID of the first chat message.
   *
   * @returns {Promise<number>} The ID of the first chat message.
   *
   * @example
   * getFirstMsgId()
   *   .then((firstMsgId) => {
   *     console.log(firstMsgId);
   *   })
   *   .catch((error) => {
   *     console.error("Failed to retrieve the ID of the first chat message:", error);
   *   });
   */

  getFirstMsgId() {
    return this._request({
      method: "POST",
      body: {
        method: "getfirstmsgid",
        apikey: this._apiKey,
      },
    });
  }

  /**
   * Retrieves the ID of the last chat message.
   *
   * @returns {Promise<number>} The ID of the last chat message.
   *
   * @example
   * getLastMsgId()
   *   .then((lastMsgId) => {
   *     console.log(lastMsgId);
   *   })
   *   .catch((error) => {
   *     console.error("Failed to retrieve the ID of the last chat message:", error);
   *   });
   */

  getLastMsgId() {
    return this._request({
      method: "POST",
      body: {
        method: "getlastmsgid",
        apikey: this._apiKey,
      },
    });
  }

  /**
   * Retrieves chat messages based on the provided parameters.
   *
   * @param {Object} [params={}] - The parameters for retrieving chat messages.
   * @param {number} [params.startId=0] - The ID of the starting message.
   * @param {number} [params.offset=0] - The number of messages to offset from the starting message.
   * @param {number} [params.cType=0] - The type of chat messages to retrieve.
   * @returns {Promise} A promise that resolves with the retrieved chat messages.
   * @throws {Error} If invalid parameters are passed to the getAllMsg method.
   * @throws {Error} If the parameter types are invalid or out of range.
   *
   * @example
   * getAllMsg({ startId: 1, offset: 10, cType: 1 })
   *   .then((messages) => {
   *     console.log(messages);
   *   })
   *   .catch((error) => {
   *     console.error("Failed to retrieve chat messages:", error);
   *   });
   */

  getAllMsg(params = {}) {
    const methodParams = ["startId", "offset", "cType"];
    const userParams = Object.keys(params);

    if (userParams.length > 3) {
      throw new Error("Invalid parameters passed to getAllMsg method");
    }

    for (const param of userParams) {
      if (!methodParams.includes(param)) {
        throw new Error(
          `Invalid parameter passed to getAllMsg method: ${param}, please use one of the following: ${methodParams.join(
            ", "
          )}`
        );
      }

      if (param === "startId" && typeof params[param] !== "number") {
        throw new Error(
          `Invalid parameter type passed to getAllMsg method: ${param}, please provide an Integer`
        );
      }

      if (
        param === "offset" &&
        (typeof params[param] !== "number" ||
          params[param] > 100 ||
          params[param] < 0)
      ) {
        throw new Error(
          `Invalid parameter type passed to getAllMsg method: ${param}, please provide an Integer between 0 and 100`
        );
      }

      if (
        param === "cType" &&
        (typeof params[param] !== "number" ||
          params[param] > 2 ||
          params[param] < 0)
      ) {
        throw new Error(
          `Invalid parameter type passed to getAllMsg method: ${param}, please provide an Integer between 0 and 2`
        );
      }
    }

    return this._request({
      method: "POST",
      body: {
        method: "getchat",
        apikey: this._apiKey,
        startid: params.startId || 0,
        offset: params.offset || 0,
        ctype: params.cType || 0,
      },
    });
  }

  /**
   * Sends a chat message to the specified address.
   *
   * @param {string} address - The address to send the message to.
   * @param {string} message - The message to be sent.
   * @returns {Promise} A promise that resolves when the message is successfully sent.
   * @throws {Error} If either the address or message is not provided, or if they are not of type string.
   * @throws {Error} If the address is not a valid address.
   *
   * @example
   * sendMsg("0x1234567890123456789012345678901234567890", "Hello, how are you?")
   *   .then(() => {
   *     console.log("Message sent successfully");
   *   })
   *   .catch((error) => {
   *     console.error("Failed to send message:", error);
   *   });
   */

  async sendMsg(address, message) {
    if (
      !address ||
      !message ||
      typeof address !== "string" ||
      typeof message !== "string"
    ) {
      throw new Error("Please provide both a valid address and message.");
    }
    if (!this._isAddress(address)) {
      throw new Error("The address parameter must be a valid address.");
    }

    const response = await this._request({
      method: "POST",
      body: {
        method: "sendchat",
        apikey: this._apiKey,
        to: address,
        msg: message,
      },
    });

    if (!response) {
      throw new Error("No response from API.");
    }

    let res = {};

    // Check if the response is a string and is numeric
    if (typeof response === "string" && /^[0-9]+$/.test(response)) {
      res = {
        address: address,
        status: 1,
        message: "OK",
        result: response,
      };
    } else {
      res = {
        address: address,
        status: 0,
        message: `NOTOK - ${response}`,
        result: "",
      };
    }

    return res;
  }

  /**
   * Sends a bulk message to a list of addresses while respecting a rate limit.
   *
   * @param {string} message - The message to be sent.
   * @param {string[]} addresses - Array of Ethereum addresses to send the message to.
   * @returns {Promise[]} An array of promises representing each message sending operation.
 
   * @example
   * sendBulkMsg("Hello", ["0xAddress1", "0xAddress2"])
   *   .then((results) => {
   *     console.log(results);
   *   })
   *   .catch((error) => {
   *     console.error("Failed to send bulk messages:", error);
   *   });
   */
  async sendBulkMsg(message, addresses) {
    if (!Array.isArray(addresses)) {
      throw new Error("Please provide a valid array of addresses.");
    }
    if (typeof message !== "string") {
      throw new Error("Please provide a valid message string.");
    }

    const results = [];

    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      const response = await this.sendMsg(address, message);
      results.push(response);

      // Introduce a 1-second delay before sending the next message
      if (i < addresses.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms = 1 second
      }
    }

    return results;
  }

  /**
   * Marks all messages as read for the specified address.
   *
   * @param {string} address - The address for which to mark messages as read.
   * @returns {Promise} A promise that resolves when the messages are successfully marked as read.
   * @throws {Error} If the address is not provided or is not of type string.
   * @throws {Error} If the address is not a valid address.
   *
   * @example
   * markAllMsgAsRead("0x1234567890123456789012345678901234567890")
   *   .then(() => {
   *     console.log("Messages marked as read");
   *   })
   *   .catch((error) => {
   *     console.error("Failed to mark messages as read:", error);
   *   });
   */

  markAllMsgAsRead(address) {
    if (!address || typeof address !== "string") {
      throw new Error("Please provide a valid address.");
    }
    if (!this._isAddress(address)) {
      throw new Error("The address parameter must be a valid address.");
    }

    return this._request({
      method: "POST",
      body: {
        method: "markmsgread",
        apikey: this._apiKey,
        address,
      },
    });
  }

  /**
   * Converts the given Ethereum address to its checksum address format.
   *
   * @private
   *
   * @param {string} address - The Ethereum address to be converted.
   * @returns {string} The checksum address.
   * @throws {Error} If the address is not a string or is not a valid Ethereum address.
   * @throws {Error} If the checksum address is invalid.
   *
   * @example
   * const checksumAddress = toChecksumAddress("0x1234567890123456789012345678901234567890");
   * console.log(checksumAddress); // Output: "0x1234567890123456789012345678901234567890"
   */

  _toChecksumAddress(address) {
    if (typeof address !== "string") {
      throw new Error("Invalid address");
    }

    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      throw new Error(`Invalid Ethereum address "${address}"`);
    }

    const _address = address.toLowerCase().replace(/^0x/i, "");
    const keccak = new Keccak(256);
    const addressHash = keccak
      .update(_address)
      .digest("hex")
      .replace(/^0x/i, "");
    let checksumAddress = "0x";

    for (let i = 0; i < _address.length; i++) {
      if (parseInt(addressHash[i], 16) > 7) {
        checksumAddress += _address[i].toUpperCase();
      } else {
        checksumAddress += _address[i];
      }
    }

    if (
      address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) &&
      checksumAddress !== address
    ) {
      throw new Error(`Invalid Checksum address for "${address}"`);
    }

    return checksumAddress;
  }

  /**
   * Checks if the given address is a valid Ethereum address.
   *
   * @private
   *
   * @param {string} address - The address to be checked.
   * @returns {boolean} True if the address is valid, false otherwise.
   *
   * @example
   * const isValid = isAddress("0x1234567890123456789012345678901234567890");
   * console.log(isValid); // Output: true
   */

  _isAddress(address) {
    try {
      this._toChecksumAddress(address);
      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = { BlockscanChat };
