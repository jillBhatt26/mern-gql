cd client
touch .env
echo VITE_PORT = $VITE_PORT >> .env
echo VITE_NODE_ENV = $VITE_NODE_ENV >> .env
echo VITE_BE_URL = $RENDER_EXTERNAL_HOSTNAME >> .env
echo ".env generated"
ls
yarn install --frozen-lockfile
yarn build