const IP_ADDRESS = import.meta.env.VITE_BACKEND_IP_ADDRESS;
const PORT = import.meta.env.VITE_BACKEND_PORT;

export const BACKEND_URL = `http://${IP_ADDRESS}:${PORT}`;
