const port = import.meta.env.VITE_PORT || 3000;
const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';
const BE_URL = import.meta.env.VITE_BE_URL || 'http://localhost:5000/graphql';

export { port, NODE_ENV, BE_URL };
