import BlockscanChat from './index.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * This part of the test checks the behavior of the BlockscanChat SDK itself
 */
describe('BlockscanChat', () => {
  // check if the constructor is working
  it('should be an object', () => {
    expect(typeof BlockscanChat).toBe('object');
  });

  /**
     * This part of the test checks the behavior of the BlockscanChat SDK when it is initialized
     */
  it('should have a method called init', () => {
    const {init} = BlockscanChat;
    expect(typeof init).toBe('function');
  });

  it('.init should throw an error if no BLOCKSCAN_CHAT_API_KEY is provided', (apiKey) => {
    const {init} = BlockscanChat;
    // If no BLOCKSCAN_CHAT_API_KEY is provided, the init method should throw an error
    if (!apiKey) {
      expect(() => init()).toThrow();
    }
  });

  it('.init should throw an error if BLOCKSCAN_CHAT_API_KEY is declared but no value is provided', (apiKey) => {
    const {init} = BlockscanChat;
    // If no BLOCKSCAN_CHAT_API_KEY is provided, the init method should throw an error
    if (apiKey === '') {
      expect(() => init()).toThrow();
    }
  });

  it('.init should throw an error if no BLOCKSCAN_CHAT_API_URL is provided', (apiUrl) => {
    const {init} = BlockscanChat;
    if (!apiUrl) {
      expect(() => init()).toThrow();
    }
  });

  it('.init should throw an error if BLOCKSCAN_CHAT_API_URL is declared but no value is provided', (apiUrl) => {
    const {init} = BlockscanChat;
    // If no BLOCKSCAN_CHAT_API_KEY is provided, the init method should throw an error
    if (apiUrl === '') {
      expect(() => init()).toThrow();
    }
  });

  BlockscanChat.init();

  /**
     * This part of the test checks the behaviour of the SDK methods
    */

  /**
     * Check the BlockscanChat.message methods
     */
  it('should have a method called message', () => {
    expect(typeof BlockscanChat.message).toBe('function');
  });

  // If no method is provided, the message method should throw an error
  it('.message should throw an error if no method is provided', () => {
    expect(() => BlockscanChat.message()).toThrow();
  });

  // If only params are provided, the message method should throw an error
  it('.message should throw an error if only params are provided', () => {
    expect(() => BlockscanChat.message({})).toThrow();
  });

  it('.message should not throw an error if the "getLocalMsgCount" is provided with the BlockscanChat.message call', () => {
    expect(() => BlockscanChat.message('getLocalMsgCount')).not.toThrow();
  });

  // getLocalMsgCount method should not accept any params
  it('.message should throw an error if the "getLocalMsgCount" is provided with params', () => {
    expect(() => BlockscanChat.message('getLocalMsgCount', {address: 'testaddress'})).toThrow();
  });

  it('.message should throw an error if the "getExternalMsgCount" is not provided with an address parameter', () => {
    expect(() => BlockscanChat.message('getExternalMsgCount')).toThrow();
  });

  // throw error if more than 1 param is provided to getExternalMsgCount
  it('.message should throw an error if the "getExternalMsgCount" is provided with more than 1 param', () => {
    expect(() => BlockscanChat.message('getExternalMsgCount', {address: 'testaddress', address2: 'testaddress'})).toThrow();
  });

  // throw error if the "getExternalMsgCount" is provided with an address parameter that is a string and not a valid address
  it('.message should not throw an error if the "getExternalMsgCount" is provided with an address parameter that is a string', () => {
    expect(() => BlockscanChat.message('getExternalMsgCount', {address: 'testaddress'})).toThrow();
  });

  // throw if the "getExternalMsgCount" is provided with an address parameter that is not a string
  it('.message should throw an error if the "getExternalMsgCount" is provided with an address parameter that is not a string', () => {
    expect(() => BlockscanChat.message('getExternalMsgCount', {address: 123})).toThrow();
  });

  // getFirstMsg method should not accept any params
  it('.message should throw an error if the "getFirstMsg" is provided with params', () => {
    expect(() => BlockscanChat.message('getFirstMsgId', {address: 'testaddress'})).toThrow();
  });

  // do not throw error if the "getFirstMsg" is provided with no params
  it('.message should not throw an error if the "getFirstMsg" is provided with no params', () => {
    expect(() => BlockscanChat.message('getFirstMsgId')).not.toThrow();
  });

  // getLastMsgId method should not accept any params
  it('.message should throw an error if the "getLastMsgId" is provided with params', () => {
    expect(() => BlockscanChat.message('getLastMsgId', {address: 'testaddress'})).toThrow();
  });

  // do not throw error if the "getLastMsgId" is provided with no params
  it('.message should not throw an error if the "getLastMsgId" is provided with no params', () => {
    expect(() => BlockscanChat.message('getLastMsgId')).not.toThrow();
  });

  // getAllMsg method can optionally accept a startId, offset, or cType parameter
  it('.message should not throw an error if the "getAllMsg" is provided with no parameter', () => {
    expect(() => BlockscanChat.message('getAllMsg')).not.toThrow();
  });

  // getAllMsg method can optionally accept a startId parameter, startId should be a number
  it('.message should throw an error if the "getAllMsg" is provided with a startId parameter that is not a number', () => {
    expect(() => BlockscanChat.message('getAllMsg', {startId: 'test'})).toThrow();
  });

  // getAllMsg method can optionally accept a startId parameter, startId should be a number
  it('.message should not throw an error if the "getAllMsg" is provided with a startId parameter that is a number', () => {
    expect(() => BlockscanChat.message('getAllMsg', {startId: 1})).not.toThrow();
  });

  // getAllMsg method can optionally accept a offset parameter, offset should be a number
  it('.message should throw an error if the "getAllMsg" is provided with a offset parameter that is not a number', () => {
    expect(() => BlockscanChat.message('getAllMsg', {offset: 'test'})).toThrow();
  });

  // getAllMsg method can optionally accept a offset parameter, offset should be a number
  it('.message should not throw an error if the "getAllMsg" is provided with a offset parameter that is a number', () => {
    expect(() => BlockscanChat.message('getAllMsg', {offset: 1})).not.toThrow();
  });

  // getAllMsg method can optionally accept a cType parameter, cType should be a number
  it('.message should throw an error if the "getAllMsg" is provided with a cType parameter that is not a number', () => {
    expect(() => BlockscanChat.message('getAllMsg', {cType: 'test'})).toThrow();
  });

  // getAllMsg method can optionally accept a cType parameter, cType should be a number
  it('.message should not throw an error if the "getAllMsg" is provided with a cType parameter that is a number', () => {
    expect(() => BlockscanChat.message('getAllMsg', {cType: 1})).not.toThrow();
  });

  // if a parameter other than startId, offset, or cType is provided, the getAllMsg method should throw an error
  it('.message should throw an error if the "getAllMsg" is provided with a parameter other than startId, offset, or cType', () => {
    expect(() => BlockscanChat.message('getAllMsg', {test: 'test'})).toThrow();
  });

  // if more than 3 parameters are provided, the getAllMsg method should throw an error
  it('.message should throw an error if the "getAllMsg" is provided with more than 3 parameters', () => {
    expect(() => BlockscanChat.message('getAllMsg', {startId: 1, offset: 1, cType: 1, test: 'test'})).toThrow();
  });

  // offset can only be a number between 0 and 100
  it('.message should throw an error if the "getAllMsg" is provided with an offset parameter that is not between 0 and 100', () => {
    expect(() => BlockscanChat.message('getAllMsg', {offset: 101})).toThrow();
  });

  // cType can only be a number between 0 and 2
  it('.message should throw an error if the "getAllMsg" is provided with a cType parameter that is not between 0 and 2', () => {
    expect(() => BlockscanChat.message('getAllMsg', {cType: 3})).toThrow();
  });

  // sendMsg should throw an error if the message parameter is not provided
  it('.message should throw an error if the "sendMsg" is not provided with a message parameter', () => {
    expect(() => BlockscanChat.message('sendMsg')).toThrow();
  });

  // sendMsg should throw an error if the message parameter is not a string
  it('.message should throw an error if the "sendMsg" is provided with a message parameter that is not a string', () => {
    expect(() => BlockscanChat.message('sendMsg', {message: 123})).toThrow();
  });

  // sendMsg should throw an error if the message parameter is an empty string
  it('.message should throw an error if the "sendMsg" is provided with a message parameter that is an empty string', () => {
    expect(() => BlockscanChat.message('sendMsg', {message: ''})).toThrow();
  });

  // sendMsg should throw error if address parameter is not provided
  it('.message should throw an error if the "sendMsg" is not provided with an address parameter', () => {
    expect(() => BlockscanChat.message('sendMsg', {message: 'test'})).toThrow();
  });

  // sendMsg should throw an error if the address parameter is not a valid wallet address
  it('.message should throw an error if the "sendMsg" is provided with an address parameter that is not a valid wallet address', () => {
    expect(() => BlockscanChat.message('sendMsg', {message: 'test', address: 'test'})).toThrow();
  });

  // sendMsg should throw an error if the address parameter is an empty string
  it('.message should throw an error if the "sendMsg" is provided with an address parameter that is an empty string', () => {
    expect(() => BlockscanChat.message('sendMsg', {message: 'test', address: ''})).toThrow();
  });

  // throw error if more than 2 parameters are provided
  it('.message should throw an error if the "sendMsg" is provided with more than 2 parameters', () => {
    expect(() => BlockscanChat.message('sendMsg', {message: 'test', address: 'test', test: 'test'})).toThrow();
  });

  // markAllMsgAsRead should throw an error if the address parameter is not provided
  it('.message should throw an error if the "markAllMsgAsRead" is not provided with an address parameter', () => {
    expect(() => BlockscanChat.message('markAllMsgAsRead')).toThrow();
  });

  // markAllMsgAsRead should throw an error if the address parameter is not a valid wallet address
  it('.message should throw an error if the "markAllMsgAsRead" is provided with an address parameter that is not a valid wallet address', () => {
    expect(() => BlockscanChat.message('markAllMsgAsRead', {address: 'test'})).toThrow();
  });

  // markAllMsgAsRead should throw an error if the address parameter is an empty string
  it('.message should throw an error if the "markAllMsgAsRead" is provided with an address parameter that is an empty string', () => {
    expect(() => BlockscanChat.message('markAllMsgAsRead', {address: ''})).toThrow();
  });

  // markAllMsgAsRead should throw an error if more than 1 parameter is provided
  it('.message should throw an error if the "markAllMsgAsRead" is provided with more than 1 parameter', () => {
    expect(() => BlockscanChat.message('markAllMsgAsRead', {address: 'test', test: 'test'})).toThrow();
  });

  // throw error if address is not string
  it('.message should throw an error if the "markMsgAsRead" is provided with an address parameter that is not a string', () => {
    expect(() => BlockscanChat.message('markMsgAsRead', {address: 123})).toThrow();
  });

  /**
     * This part of the test checks the behaviour of the request method
    */
  // if request is called with a method that is not supported, it should throw an error
  it('.request should throw an error if the method is not supported', () => {
    expect(() => BlockscanChat.request('test')).toThrow();
  });
});
