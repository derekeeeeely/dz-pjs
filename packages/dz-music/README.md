# dz-music

  A simple music SPA using `react`, `mobx`, `parcel`

  ![](http://opo02jcsr.bkt.clouddn.com/ccfb4be4956b81a6da45111d3e609c18.png)


### About [Parcel](https://github.com/parcel-bundler/parcel)

  As is said, it's a blazing fast, zero configuration web application bundler.

  It's easy to get startted like this:

  ```js
  // package.json
  "scripts": {
    "start": "parcel ./src/index.html",
    "build": "parcel build ./src/index.js -d ./build"
  }
  ```

### start

  - dev

    `yarn install`

    `yarn start`

    Open `http://127.0.0.1:1234`, u'll see the page above


  - build

    `yarn install`

    `yarn build`

    Here we use the old-fast way:

      - upload the `build/*` to github

      - `git pull` from your server

    For the latest look, click [here](http://music.derekz.cn:8088)

### list

  - [x] basic audio player
  - [x] store with mobx
  - [x] netease api - search
  - [ ] netease api - others
  - [x] music list
  - [ ] play list
  - [x] lyric flow
  - [ ] optimize
