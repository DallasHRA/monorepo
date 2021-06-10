mkdir -p ./dhra-webservice/functions/node_modules && \
npm install --prefix ./dhra-webservice/functions/ jsonwebtoken node-fetch hash.js googleapis && \
cd ./dhra-webservice/functions/ && tar -czf node_modules.tar.gz node_modules && cd ../../ && \
rm -r ./dhra-webservice/functions/node_modules
