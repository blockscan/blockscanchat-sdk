import { Keccak } from "sha3";
import axios from "axios";
import FormData from "form-data";

class BlockscanChat {
  constructor() {
    this.apiKey = "";
    this.apiUrl = "https://chatapi.blockscan.com/v1/api";
  }

  init(apiKey) {
    if (this.apiKey) {
      throw new Error("Please only call init() once.");
    }

    if (!apiKey) {
      throw new Error(
        "BLOCKSCAN_CHAT_API_KEY environment variables must be set"
      );
    } else if (!apiKey) {
      throw new Error(
        "BLOCKSCAN_CHAT_API_KEY environment variable must be set"
      );
    } else {
      this.apiKey = apiKey;

      const formData = new FormData();
      formData.append("method", "ping");
      formData.append("apikey", this.apiKey);

      axios.post(`${this.apiUrl}`, formData).then((response) => {
        if (response.data.status != "1") {
          throw new Error(
            "Invalid API key provided in BLOCKSCAN_CHAT_API_KEY environment variable"
          );
        }
      });
    }
  }

  getLocalMsgCount() {
    return this.request({
      method: "POST",
      body: {
        method: "unreadmsgcount",
        apikey: this.apiKey,
      },
    });
  }

  getExternalMsgCount(address) {
    if (!address) {
      throw new Error("Please provide an address.");
    }
    if (typeof address !== "string") {
      throw new Error("The address parameter must be a string.");
    }
    if (!this.isAddress(address)) {
      throw new Error("The address parameter must be a valid address.");
    }

    return this.request({
      method: "POST",
      body: {
        method: "unreadmsgcount",
        apikey: this.apiKey,
        address: address,
      },
    });
  }

  getFirstMsgId() {
    return this.request({
      method: "POST",
      body: {
        method: "getfirstmsgid",
        apikey: this.apiKey,
      },
    });
  }

  getLastMsgId() {
    return this.request({
      method: "POST",
      body: {
        method: "getlastmsgid",
        apikey: this.apiKey,
      },
    });
  }

  getAllMsg(params = {}) {
    if (Object.keys(params).length > 3) {
      throw new Error("Invalid parameters passed to getAllMsg method");
    }

    const methodParams = ["startId", "offset", "cType"];
    const userParams = Object.keys(params);

    if (userParams.length > 0) {
      for (let i = 0; i < userParams.length; i++) {
        if (!methodParams.includes(userParams[i])) {
          throw new Error(
            `Invalid parameter passed to getAllMsg method: ${
              userParams[i]
            }, please use one of the following: ${methodParams.join(", ")}`
          );
        } else if (
          userParams[i] == "startId" &&
          typeof params[userParams[i]] != "number"
        ) {
          throw new Error(
            `Invalid parameter type passed to getAllMsg method: ${userParams[i]}, please provide an Integer`
          );
        } else if (
          userParams[i] == "offset" &&
          (typeof params[userParams[i]] != "number" ||
            params[userParams[i]] > 100 ||
            params[userParams[i]] < 0)
        ) {
          throw new Error(
            `Invalid parameter type passed to getAllMsg method: ${userParams[i]}, please provide an Integer between 0 and 100`
          );
        } else if (
          userParams[i] == "cType" &&
          (typeof params[userParams[i]] != "number" ||
            params[userParams[i]] > 2 ||
            params[userParams[i]] < 0)
        ) {
          throw new Error(
            `Invalid parameter type passed to getAllMsg method: ${userParams[i]}, please provide an Integer between 0 and 2`
          );
        }
      }
    }

    return this.request({
      method: "POST",
      body: {
        method: "getchat",
        apikey: this.apiKey,
        startid: params?.startid ? params.startid : 0,
        offset: params?.offset ? params.offset : 0,
        ctype: params?.ctype ? params.ctype : 0,
      },
    });
  }

  sendMsg(address, message) {
    if (!address || !message) {
      throw new Error("Please provide both an address and a message.");
    }
    if (typeof address !== "string" || typeof message !== "string") {
      throw new Error("Both address and message parameters must be strings.");
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

  markAllMsgAsRead(address) {
    if (!address) {
      throw new Error("Please provide an address.");
    }
    if (typeof address !== "string") {
      throw new Error("The address parameter must be a string.");
    }
    if (!this.isAddress(address)) {
      throw new Error("The address parameter must be a valid address.");
    }

    return this.request({
      method: "POST",
      body: {
        method: "markmsgread",
        apikey: this.apiKey,
        address: address,
      },
    });
  }

  request(endpoint = {}) {
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

    return axios
      .post(`${this.apiUrl}`, formData)
      .then((response) => {
        return response.data.result;
      })
      .catch((error) => {
        return error;
      });
  }

  isAddress(address) {
    try {
      this.toChecksumAddress(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  toChecksumAddress(address) {
    if (typeof address !== "string") {
      throw new Error("invalid address");
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

export default new BlockscanChat();
