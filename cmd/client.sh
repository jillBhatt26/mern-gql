cd client
echo "Start print variables"
echo "VITE_PORT = $VITE_PORT"
echo "VITE_NODE_ENV = $VITE_NODE_ENV"
echo "VITE_BE_URL = $RENDER_EXTERNAL_HOSTNAME"
echo "End print variables"
echo "VITE_PORT = $VITE_PORT" >> .env
echo "VITE_NODE_ENV = $VITE_NODE_ENV" >> .env
echo "VITE_BE_URL = $RENDER_EXTERNAL_HOSTNAME" >> .env
ls
yarn install --frozen-lockfile
yarn build