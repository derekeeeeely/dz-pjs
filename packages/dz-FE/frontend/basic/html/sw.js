
self.addEventListener('install', (event) => {
  console.log('sw installed')
  // self.skipWaiting(); 加上这个后每次更改文件刷新页面都自动更新
  // add cacheStorage
  event.waitUntil(
    // 创建一个cache
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/html/test.js',
        '/html/default.html'
      ])
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName != 'v1';
        }).map(function (cacheName) {
          // 清除旧的缓存
          return caches.delete(cacheName);
        })
      )
    })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('v1').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        // match到则返回否则直接请求
        return response || fetch(event.request).then(function (response) {
          // 404抛错到catch处理
          if (response.status === 404) {
            throw new Error('nothing')
          }
          // 将response作为value存入cache
          cache.put(event.request, response.clone());
          return response;
        }).catch((err) => {
          // 返回cache storage里存的默认页面
          return caches.match('/html/default.html');
        });
      });
    })
  );
});