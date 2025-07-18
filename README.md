# Fakebook

## About

1. This is **Fakebook**, a one-on-one chatting app built using the **MERN stack**.
2. This app works on devices connected to the same LAN.
3. The frontend of this app is located in `./fakebook`.
4. The backend of this app is located in `./Backend`.
5. `./Backend` contains `fakebook-v3.postman_collection.json`, which is a Postman collection for testing the backend.


## Configuration

> **Note 1:** Put the relevant environment variables in place of the respective `<......>`.  
> **Note 2:** The parentheses contain examples of the respective variables' formats.

1. Create a `.env` file inside `./Backend` and add the following lines:

```env
DB_LINK1=<Primary MongoDB link (mongodb:.........27017/)>
DB_LINK2=<Secondary MongoDB link. Same as primary if NA (mongodb........mongodb.net/)>
SECRET_KEY=<Session signing key (yourSecretKey12345)>
FRONTEND_IP_ADDRESS=<IPv4 address of the frontend (192.168.1.100)>
FRONTEND_PORT=<4-digit port of the frontend (5713)>
CLOUD_NAME=<Cloudinary Name>
API_KEY=<Cloudinary API Key>
API_SECRET=<Cloudinary API Secret>
```

2. Create a `.env` file inside `./fakebook` and add the following lines:

```env
VITE_BACKEND_IP_ADDRESS=<IPv4 address of the backend (192.168.1.100)>
VITE_BACKEND_PORT=<4-digit port of the backend (8081)>
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

3. Visit the frontend URL (displayed on the frontend terminal) using a browser on any device connected to the same LAN.