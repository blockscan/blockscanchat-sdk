const { Keccak } = require("sha3");
const axios = require("axios");
const FormData = require("form-data");

/**
 * Represents the BlockscanChat class for interacting with the Blockscan Chat API.
 *
 * @class
 * @example
 * const blockscanChat = new BlockscanChat();
 * blockscanChat.init("YOUR_API_KEY")
 *   .then(() => {
 *     // API initialized successfully
 *   })
 *   .catch((error) => {
 *     console.error("Failed to initialize API:", error);
 *   });
 */
class BlockscanChat {
  /**
   * Initializes the BlockscanChat class.
   *
   * Sets the `apiKey` property to an empty string and the `apiUrl` property to "https://chatapi.blockscan.com/v1/api".
   * Defines the `request` method for making API requests.
   */
  constructor() {
    this.apiKey = "";
    this.apiUrl = "https://chatapi.blockscan.com/v1/api";
    this.request = async (endpoint = {}) => {
      if (!endpoint.method || !endpoint.body) {
        throw new Error("Please provide a valid endpoint object.");
      }

      if (!this.apiKey) {
        throw new Error("Please call init() before calling any other method.");
      }

      const formData = new FormData();
      for (const [key, value] of Object.entries(endpoint.body)) {
        formData.append(key, value);
      }

      try {
        const response = await axios.post(`${this.apiUrl}`, formData);
        return response.data.result;
      } catch (error) {
        throw error;
      }
    };
  }

  /**
   * Initializes the BlockscanChat class with an API key.
   *
   * @param {string} apiKey - The API key to be used for authentication.
   * @returns {Promise} A promise that resolves when the initialization is successful.
   * @throws {Error} If `init` is called more than once.
   * @throws {Error} If `apiKey` is not provided.
   * @throws {Error} If the provided API key is invalid.
   */

  async init(apiKey) {
    if (this.apiKey) {
      throw new Error("Please only call init() once.");
    }

    if (!apiKey) {
      throw new Error(
        "BLOCKSCAN_CHAT_API_KEY environment variables must be set"
      );
    }

    this.apiKey = apiKey;

    const formData = new FormData();
    formData.append("method", "ping");
    formData.append("apikey", this.apiKey);

    const response = await axios.post(`${this.apiUrl}`, formData);
    if (response?.data.status !== "1") {
      throw new Error(
        "Invalid API key provided in BLOCKSCAN_CHAT_API_KEY environment variable"
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
    return this.request({
      method: "POST",
      body: {
        method: "unreadmsgcount",
        apikey: this.apiKey,
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
    if (!this.isAddress(address)) {
      throw new Error("The address parameter must be a valid address.");
    }

    return this.request({
      method: "POST",
      body: {
        method: "unreadmsgcount",
        apikey: this.apiKey,
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
    return this.request({
      method: "POST",
      body: {
        method: "getfirstmsgid",
        apikey: this.apiKey,
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
    return this.request({
      method: "POST",
      body: {
        method: "getlastmsgid",
        apikey: this.apiKey,
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

    return this.request({
      method: "POST",
      body: {
        method: "getchat",
        apikey: this.apiKey,
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

  sendMsg(address, message) {
    if (
      !address ||
      !message ||
      typeof address !== "string" ||
      typeof message !== "string"
    ) {
      throw new Error("Please provide both a valid address and message.");
    }
    if (!this.isAddress(address)) {
      throw new Error("The address parameter must be a valid address.");
    }

    return this.request({
      method: "POST",
      body: {
        method: "sendchat",
        apikey: this.apiKey,
        to: address,
        msg: message,
      },
    });
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
    if (!this.isAddress(address)) {
      throw new Error("The address parameter must be a valid address.");
    }

    return this.request({
      method: "POST",
      body: {
        method: "markmsgread",
        apikey: this.apiKey,
        address,
      },
    });
  }

  /**
   * Checks if the given address is a valid Ethereum address.
   *
   * @param {string} address - The address to be checked.
   * @returns {boolean} True if the address is valid, false otherwise.
   *
   * @example
   * const isValid = isAddress("0x1234567890123456789012345678901234567890");
   * console.log(isValid); // Output: true
   */

  isAddress(address) {
    try {
      this.toChecksumAddress(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Converts the given Ethereum address to its checksum address format.
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

  toChecksumAddress(address) {
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
}
module.exports = BlockscanChat;
