# Blockscan Chat SDK

A Blockscan Chat API wrapper written in NodeJS

## Prerequisites
- NodeJS
    ### `To verify installation` 
    ```bash
    node -v
    ```
    ### `To install` 
    ```bash
    winget install OpenJS.NodeJS
    ```
- Blockscan Chat API Key and URL (Apply at https://chat.blockscan.com/apis)

## Set Up

1. Install this package in your project directory

```bash
npm i blockscanchat-sdk
```

2. Ensure the "type" parameter in the package.json of your project's root directory is set to "module"

```bash
...
  "type": "module",
...
```

3. Create a .env file in the root of your project directory with these values

```bash
BLOCKSCAN_CHAT_API_URL = 'YOUR_BLOCKSCAN_CHAT_API_URL'
BLOCKSCAN_CHAT_API_KEY = 'YOUR_BLOCKSCAN_CHAT_API_KEY'
```

## Usage

1. Import the package to your project

```bash
import BlockscanChat from 'blockscanchat-sdk'; 
```

2. Initalize the SDK

```bash
BlockscanChat.init()
```

3. Generally, for all methods, the calling convention is

```bash
BlockscanChat.<MODULE_NAME>('METHOD_NAME', {PARAMETERS})
```

Example (if method does not require parameters): 
```bash
BlockscanChat.message('getLocalMsgCount')
```
<br>

Example (if method requires parameters): 
```bash
BlockscanChat.message('getExternalMsgCount', {address: 'EXTERNAL_WALLET_ADDRESS'})
```
## `MESSAGE ENDPOINT`

### `getLocalMsgCount`
#### `Gets unread message count of your apikey address`

Parameters: None <br>
Usage: 
```bash
BlockscanChat.message('getLocalMsgCount')
```

### `getExternalMsgCount`
#### `Gets unread message count of external address (you must have additional apikey permissions)`

Parameters: 
- address (REQUIRED) -> Address you want to check the number of messages for <br>
Usage: 
```bash
BlockscanChat.message('getExternalMsgCount', {address: 'WALLET_ADDRESS'})
```
### `getFirstMsgId`
#### `Gets the First Message ID`

Parameters: None <br>
Usage: 
```bash
BlockscanChat.message('getFirstMsgId')
```

### `getLastMsgId`
#### `Gets the Last Message ID`

Parameters: None <br>
Usage: 
```bash
BlockscanChat.message('getLastMsgId')
```

### `getAllMsg`
#### `Gets unread message count of your apikey address`

Parameters: 
- startID (OPTIONAL) -> Integer message ID to start searching for chats
- offset (OPTIONAL) -> Number of chats displayed per page, maximum is 100
- cType (OPTIONAL) -> Chat Type, 0 = All, 1 = Incoming Messages, 2 = Outgoing Messages

Usage: 
<br>

No parameters
```bash
BlockscanChat.message('getAllMsg')
```

With parameters
```bash
BlockscanChat.message('getAllMsg', {startID: 539070, offset: 99, cType: 2})
```

### `sendMsg`
#### `Sends a message to a wallet address`

Parameters: 
- address (REQUIRED) -> Address you want to send the message to
- message (REQUIRED) -> Message you want to sent to that address 
Usage: 
<br>
```bash
BlockscanChat.message('getLocalMsgCount')
```

#### `markAllMsgAsRead`
#### `All messages with a particular address will be marked as read`

Parameters: 
- address (REQUIRED) -> The address with which you want to mark the messages as read <br>
Usage: 
```bash
BlockscanChat.message('markAllMsgAsRead', {address: 'WALLET_ADDRESS'})
```



