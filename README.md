# Install

`
git submodule update --init --recursive
git checkout develop
cd api
git checkout develop
cd ..
bower install
npm install
`
check install by run command
`
webpack
`

troubleshooting:
1. throw er; // Unhandled 'error' event.
You're trying to start the server on a port that is already in use. Try changing the default port in config\webpack.dev.config.js to something other than 8080.
1. errors with /node_nodules/@types/leaflet...
Only version 1.0.50 works, `npm install @types/leaflet@=1.0.50`
1. Cant find 'object' in file @uirouter...
You need manual change file and edit object to Object


# Build

1. check file pass.js in root folder, if don`t have it please response for mail: chernykh@me.com

Commands:
`
npm run build
open http://localhost:8080
`
check errors in browser console

# Deploy

Commands:
`
npm run dev1 | dev2 | dev3 | prd
`

