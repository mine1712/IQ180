import { io } from 'socket.io-client';

// for development
const URL = "http://localhost:5172";
// for deployment
// iq-180-backend-931f7e21583d.herokuapp.com

export const server = io(URL);