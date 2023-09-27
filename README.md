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

## Usage

1. Import the package to your project

```bash
const BlockscanChat = require('blockscanchat-sdk');
let blockscanchat = new BlockscanChat();
```

2. Initalize the SDK by passing in the Blockscan API_KEY and API_URL parameters specified as your environment variables

```bash
blockscanchat.init('YOUR_API_KEY');
```

3. Generally, for all methods, the calling convention is

```bash
blockscanchat.<METHOD_NAME>(PARAMETERS)
```

Example (if method does not require parameters):

```bash
blockscanchat.<METHOD_NAME>()
```

<br>

Example (if method requires parameters):

```bash
blockscanchat.getExternalMsgCount('EXTERNAL_WALLET_ADDRESS')
```

## `MESSAGE ENDPOINT`

### `getLocalMsgCount`

#### `Retrieves the unread message count associated with your API key address.`

Parameters: None <br>
Usage:

```bash
blockscanchat.getLocalMsgCount().then((response) => {
  console.log(response);
});
```

### `getExternalMsgCount`

#### `Retrieves the unread message count of an external address. (you must have additional apikey permissions)`

Parameters:

- address (REQUIRED) - The external wallet address. <br>

Usage:

```bash
blockscanchat.getExternalMsgCount('WALLET_ADDRESS').then((response) => {
  console.log(response);
});
```

### `getFirstMsgId`

#### `Fetches the ID of the first message.`

Parameters: None <br>
Usage:

```bash
blockscanchat.getFirstMsgId().then((response) => {
  console.log(response);
});
```

### `getLastMsgId`

#### `Fetches the ID of the last message.`

Parameters: None <br>
Usage:

```bash
blockscanchat.getLastMsgId().then((response) => {
  console.log(response);
});
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
blockscanchat.getAllMsg().then((response) => {
  console.log(response);
});
```

With parameters

```bash
blockscanchat.getAllMsg({startID: 539070, offset: 99, cType: 2}).then((response) => {
  console.log(response);
});
```

### `sendMsg`

#### `Sends a message to a wallet address`

Parameters:

- address (REQUIRED) -> Address you want to send the message to
- message (REQUIRED) -> Message you want to sent to that address <br>

Usage:

```bash
blockscanchat.sendMsg('TARGET_ADDRESS', 'YOUR_MESSAGE').then((response) => {
  console.log(response);
});
```

#### `markAllMsgAsRead`

#### `All messages with a particular address will be marked as read`

Parameters:

- address (REQUIRED) -> The address with which you want to mark the messages as read <br>
  Usage:

```bash
blockscanchat.markAllMsgAsRead('WALLET_ADDRESS').then((response) => {
  console.log(response);
});
```
