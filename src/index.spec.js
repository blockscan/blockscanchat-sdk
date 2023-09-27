import axios from "axios";
import FormData from "form-data";
import { Keccak } from "sha3";
import BlockscanChat from "./index.js";

jest.mock("axios");
jest.mock("form-data");
jest.mock("sha3", () => {
  return {
    Keccak: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn(),
    })),
  };
});

describe("BlockscanChat", () => {
  let blockscanChat;
  const validAPIKey = "FdpZvZGMdhEiyUIajJc9KN7TIxXrCXVjxe8hZBaKfHrNMA2cAtdFwy";

  beforeEach(() => {
    blockscanChat = new BlockscanChat();
    FormData.prototype.append = jest.fn();
  });

  describe("constructor", () => {
    it("should properly initialize properties", () => {
      expect(blockscanChat.apiKey).toBe("");
      expect(blockscanChat.apiUrl).toBe("https://chatapi.blockscan.com/v1/api");
      expect(typeof blockscanChat.request).toBe("function");
    });
  });

  describe("init", () => {
    // it("should throw an error if init is called more than once", async () => {
    //   expect.assertions(1);
    //   blockscanChat.init(validAPIKey);
    //   expect(blockscanChat.init(validAPIKey)).rejects.toThrow(
    //     "Please only call init() once."
    //   );
    // });

    it("should throw an error if no API key is provided", async () => {
      expect.assertions(1);
      await expect(blockscanChat.init()).rejects.toThrow(
        "BLOCKSCAN_CHAT_API_KEY environment variables must be set"
      );
    });

    it("should throw an error if the provided API key is invalid", async () => {
      expect.assertions(1);
      axios.post.mockResolvedValueOnce({ data: { status: "0" } });
      await expect(blockscanChat.init("invalidAPIKey")).rejects.toThrow(
        "Invalid API key provided in BLOCKSCAN_CHAT_API_KEY environment variable"
      );
    });

    it("should initialize with a valid API key", async () => {
      axios.post.mockResolvedValueOnce({ data: { status: "1" } });
      await blockscanChat.init(validAPIKey);
      expect(blockscanChat.apiKey).toBe(validAPIKey);
    });
  });

  describe("getLocalMsgCount", () => {
    it("should get the local message count", async () => {
      blockscanChat.apiKey = validAPIKey;
      axios.post.mockResolvedValueOnce({ data: { result: 5 } });
      const count = await blockscanChat.getLocalMsgCount();
      console.log(count);
      expect(count).toBe(5);
    });

    it("should throw an error if init is not called before", async () => {
      expect.assertions(1);
      await expect(blockscanChat.getLocalMsgCount()).rejects.toThrow(
        "Please call init() before calling any other method."
      );
    });
  });

  describe("getExternalMsgCount", () => {
    it("should get the external message count", async () => {
      blockscanChat.apiKey = validAPIKey;
      axios.post.mockResolvedValueOnce({ data: { result: 3 } });
      const count = await blockscanChat.getExternalMsgCount(
        "0x66263b35bae43592b4A46F4Fca4D8613987610d4"
      );
      expect(count).toBe(3);
    });

    // it("should throw an error if address is not provided", async () => {
    //   expect.assertions(1);
    //   blockscanChat.apiKey = "test-api-key";
    //   await expect(blockscanChat.getExternalMsgCount()).rejects.toThrow(
    //     "Please provide a valid address."
    //   );
    // });

    // it("should throw an error if address is not valid", async () => {
    //   expect.assertions(1);
    //   blockscanChat.apiKey = "test-api-key";
    //   await expect(
    //     blockscanChat.getExternalMsgCount("invalid-address")
    //   ).rejects.toThrow("The address parameter must be a valid address.");
    // });
  });

  //   describe("getFirstMsgId", () => {
  //     it("should get the ID of the first message", async () => {
  //       blockscanChat.apiKey = "test-api-key";
  //       axios.post.mockResolvedValueOnce({ data: { result: 1 } });
  //       const id = await blockscanChat.getFirstMsgId();
  //       expect(id).toBe(1);
  //     });

  //     it("should throw an error if init is not called before", async () => {
  //       expect.assertions(1);
  //       await expect(blockscanChat.getFirstMsgId()).rejects.toThrow(
  //         "Please call init() before calling any other method."
  //       );
  //     });
  //   });

  //   describe("getLastMsgId", () => {
  //     it("should get the ID of the last message", async () => {
  //       blockscanChat.apiKey = "test-api-key";
  //       axios.post.mockResolvedValueOnce({ data: { result: 10 } });
  //       const id = await blockscanChat.getLastMsgId();
  //       expect(id).toBe(10);
  //     });

  //     it("should throw an error if init is not called before", async () => {
  //       expect.assertions(1);
  //       await expect(blockscanChat.getLastMsgId()).rejects.toThrow(
  //         "Please call init() before calling any other method."
  //       );
  //     });
  //   });

  //   describe("getAllMsg", () => {
  //     it("should get all messages with valid parameters", async () => {
  //       blockscanChat.apiKey = "test-api-key";
  //       axios.post.mockResolvedValueOnce({
  //         data: { result: [{ id: 1, message: "test" }] },
  //       });
  //       const messages = await blockscanChat.getAllMsg({
  //         startId: 1,
  //         offset: 1,
  //         cType: 1,
  //       });
  //       expect(messages).toEqual([{ id: 1, message: "test" }]);
  //     });

  //     it("should throw an error for invalid parameters", async () => {
  //       expect.assertions(1);
  //       blockscanChat.apiKey = "test-api-key";
  //       await expect(
  //         blockscanChat.getAllMsg({ invalidParam: "invalid" })
  //       ).rejects.toThrow(
  //         "Invalid parameter passed to getAllMsg method: invalidParam, please use one of the following: startId, offset, cType"
  //       );
  //     });
  //   });

  //   describe("sendMsg", () => {
  //     it("should send a message with valid address and message", async () => {
  //       blockscanChat.apiKey = "test-api-key";
  //       axios.post.mockResolvedValueOnce({ data: { result: "Message Sent" } });
  //       const response = await blockscanChat.sendMsg(
  //         "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  //         "Hello"
  //       );
  //       expect(response).toBe("Message Sent");
  //     });

  //     it("should throw an error for invalid address", async () => {
  //       expect.assertions(1);
  //       blockscanChat.apiKey = "test-api-key";
  //       await expect(
  //         blockscanChat.sendMsg("invalid-address", "Hello")
  //       ).rejects.toThrow("The address parameter must be a valid address.");
  //     });

  //     it("should throw an error for invalid message", async () => {
  //       expect.assertions(1);
  //       blockscanChat.apiKey = "test-api-key";
  //       await expect(
  //         blockscanChat.sendMsg("0x742d35Cc6634C0532925a3b844Bc454e4438f44e", 123)
  //       ).rejects.toThrow("Please provide both a valid address and message.");
  //     });
  //   });

  //   describe("markAllMsgAsRead", () => {
  //     it("should mark all messages as read for valid address", async () => {
  //       blockscanChat.apiKey = "test-api-key";
  //       axios.post.mockResolvedValueOnce({ data: { result: "Messages Marked" } });
  //       const response = await blockscanChat.markAllMsgAsRead(
  //         "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  //       );
  //       expect(response).toBe("Messages Marked");
  //     });

  //     it("should throw an error for invalid address", async () => {
  //       expect.assertions(1);
  //       blockscanChat.apiKey = "test-api-key";
  //       await expect(
  //         blockscanChat.markAllMsgAsRead("invalid-address")
  //       ).rejects.toThrow("The address parameter must be a valid address.");
  //     });
  //   });

  //   describe("isAddress", () => {
  //     it("should return true for valid checksum address", () => {
  //       const isAddress = blockscanChat.isAddress(
  //         "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  //       );
  //       expect(isAddress).toBeTruthy();
  //     });

  //     it("should return false for invalid address", () => {
  //       const isAddress = blockscanChat.isAddress("invalid-address");
  //       expect(isAddress).toBeFalsy();
  //     });
  //   });

  //   describe("toChecksumAddress", () => {
  //     it("should convert address to checksum address", () => {
  //       const keccak = new Keccak(256);
  //       keccak.update.mockReturnThis();
  //       keccak.digest.mockReturnValue("5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed");
  //       const checksumAddress = blockscanChat.toChecksumAddress(
  //         "0x742d35cc6634c0532925a3b844bc454e4438f44e"
  //       );
  //       expect(checksumAddress).toBe(
  //         "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  //       );
  //     });

  //     it("should throw error for invalid address", () => {
  //       expect(() => blockscanChat.toChecksumAddress("invalid-address")).toThrow(
  //         'Invalid Ethereum address "invalid-address"'
  //       );
  //     });
  //   });
});
