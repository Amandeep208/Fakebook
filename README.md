# Fakebook

## About

1. This is **Fakebook**, A one-on-one chatting app built using **MERN stack**.
2. This app works on devices on the same LAN.
3. The Frontend of this app is located in `./fakebook`.
4. The Backend of this app is located in `./Backend`.
5. `./Backend` contains `fakebook-v3.postman_collection.json` which is a postman collection for testing the backend.


## Configuration

> **Note 1:** Put the relevant environment variables in place of the respective `<......>`.
> **Note 2:** The paranthesis contain examples of the respective variables formats.

1. Create `.env` inside `./Backend` and add the following lines:

```env
DB_LINK1=<Primary MongoDB Link (mongodb:.........27017/)>
DB_LINK2=<Secondary MongoDB Link. Same as primary if not available (mongodb+srv:........mongodb.net/)>
SECRET_KEY=<Sessions siging key (yourSecretKey12345)>
FRONTEND_IP_ADDRESS=<IPv4 Address of frontend (192.168.1.100)>
FRONTEND_PORT=<4 digit port of the frontend (5713)>
```

2. Create `.env` inside `./fakebook` and add the following lines:

```env
VITE_BACKEND_IP_ADDRESS=<IPv4 address of the backend (192.168.1.100)>
VITE_BACKEND_PORT=<4 digit port of the backend (8081)>
```

3. Install backend dependencies:

```bash
cd ./Backend
npm install
```

4. Install frontend dependencies:

```bash
cd ./fakebook
npm install
```


## Running the App

1. Start the backend server:

```bash
cd ./Backend
nodemon app.js
```

2. Start the frontend dev server:

```bash
cd ./fakebook
npm run dev
```

3. Visit the frontend URL (displayed on the frontend terminal) on a browser with any device on the same LAN.