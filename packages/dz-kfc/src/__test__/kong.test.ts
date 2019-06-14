import * as http from 'http'
import * as ip from 'ip'
import fetch from 'node-fetch'
import Client from '../index'
import { ITargetResponse, IUpstream } from '../interfaces'

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end()
  }
  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ data: `hello world` }))
    res.end()
  }
})

interface IUpstreamHealthResponse {
  data: [{
    health: string
    target: string
  }]
  total: number
}


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
  }
}

const getService = async () => {
  const res = await fetch(`${config.kong_url[0]}/services/${config.service.name}`)
  return res.json()
}

const getUpstream = async () => {
  const res = await fetch(`${config.kong_url[0]}/upstreams/${config.upstream.name}`)
  return res.json()
}

const getRoute = async () => {
  const res = await fetch(`${config.kong_url[0]}/services/${config.service.name}/routes`)
  return res.json()
}

const getTarget: () => Promise<ITargetResponse> = async () => {
  const res = await fetch(`${config.kong_url[0]}/upstreams/${config.upstream.name}/targets`)
  return res.json()
}

const getTargetHealth: () => Promise<IUpstreamHealthResponse> = async () => {
  const res = await fetch(`${config.kong_url[0]}/upstreams/${config.upstream.name}/health/`)
  return res.json()
}

const address = `${ip.address()}:${config.service.port}`

const kong = new Client(config);

describe('test kong', () => {
  test("kong init", async () => {
    expect(kong.hello()).toBe("hello world");
  });

  // register
  test("app register", async () => {
    await kong.register()
    server.listen(config.service.port)

    setTimeout(async () => {
      expect(getService()).resolves.toMatchObject(config.service)
      expect(getUpstream()).resolves.toMatchObject(config.upstream)
      expect(getRoute()).resolves.toHaveProperty(['data', 0, 'paths', 0], config.route.paths[0])
      const targets = await getTarget()
      const addressList = targets.data.map(target => target.target)
      expect(addressList).toEqual(
        expect.arrayContaining([address]),
      );

      server.close()
    }, 1000);

  })

  // unregister check target health
  test("app unregister", async () => {
    await kong.unregister()
    server.close()
    setTimeout(async () => {
      const upstreamHealth = await getTargetHealth()
      const targetInfo = upstreamHealth.data.find(target => target.target === address)
      const health = targetInfo && targetInfo.health
      expect(health).toBe('UNHEALTHY')
    }, 1000);

  })

  // app publish
  test("app publish", async () => {
    server.listen(config.service.port)
    await kong.unregister()
    server.close()
    setTimeout(async () => {
      let health
      let upstreamHealth = await getTargetHealth()
      let targetInfo = upstreamHealth.data.find(target => target.target === address)
      health = targetInfo && targetInfo.health
      expect(health).toBe('UNHEALTHY')

      await kong.register()
      server.listen(config.service.port)

      expect(getService()).resolves.toMatchObject(config.service)
      expect(getUpstream()).resolves.toMatchObject(config.upstream)
      expect(getRoute()).resolves.toHaveProperty(['data', 0, 'paths', 0], config.route.paths[0])

      setTimeout(async () => {
        upstreamHealth = await getTargetHealth()
        targetInfo = upstreamHealth.data.find(target => target.target === address)
        health = targetInfo && targetInfo.health
        expect(health).toBe('HEALTHY')
        server.close()
      }, 1000);
    }, 1000);

  })

})



