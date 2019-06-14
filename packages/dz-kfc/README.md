# kfc

## usage

- download

  ```
  npm install dz-kfc
  ```

- register

  ```js
  import Kong from 'dz-kfc'

  const config = {
    kong_url: ['http://localhost:8001'],
    route: {
      paths: ['/derekzhou']
    },
    service: {
      host: 'derekzhouupstream',
      name: 'derekzhou-test',
      path: '/',
      port: 5555,
    },
    upstream: {
      healthchecks: {
        active: {
          healthy: {
            http_statuses: [202, 204, 200],
            interval: 1, // second
            successes: 1,
          },
          http_path: '/',
          timeout: 1, // second
          unhealthy: {
            http_failures: 1,
            http_statuses: [404, 500, 403, 401],
            interval: 1,
            tcp_failures: 1,
          }
        }
      },
      name: 'derekzhouupstream',
    },
    logger: ''
  }
  const KFC = new Kong(config)

  KFC.register().then(() => {
    const server = app.listen(PORT);
    logger.info(`server is up at ${PORT}`, new Date());
  })
  ```

- unregister

  ```js
  KFC.unregister().then(() => {
    logger.info('target removed from kong', new Date());
    server.close(() => {
      logger.info('server is successfully Closed', new Date());
      process.exit()
    })
  })
  ```