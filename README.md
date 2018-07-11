# prepare
1. `git submodule update --init --recursive`

# build
1. `npm install`
1. `npm run build`

# deploy
1. `npm run dev1` - test server with test backend
1. `npm run dev2` - test server with test backend for contributors
1. `npm run dev3` - pre production with prd backend
1. `npm run prd` + manual ftp upload
