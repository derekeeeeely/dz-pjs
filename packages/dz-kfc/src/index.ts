import * as ip from 'ip'
import fetch from 'node-fetch'
import { IRoute, IRouteResponse, IService, IServiceResponse, ITarget, ITargetResponse, IUpstream, IUpstreamResponse } from './interfaces'

export default class Client {
  private proxy: (path: string, method: string, body?: any) => any
  private route: IRoute
  private service: IService
  private upstream: IUpstream
  private ipAddress: string
  private kongUrl: string[]
  private logger: any
  constructor(config: {
    kong_url: string | string[],
    route: IRoute
    service: IService,
    upstream: IUpstream,
    logger?: any
  }) {
    this.kongUrl = Array.isArray(config.kong_url) ? config.kong_url : [config.kong_url]
    this.ipAddress = `${ip.address()}:${config.service.port}`
    this.route = config.route
    this.service = config.service
    this.upstream = config.upstream
    this.logger = config.logger || console
    this.proxy = async (path: string, method: string, body?: any) => {
      const node = await this.getAvailableNode()
      if (!node) {
        throw new Error('no available kong node')
      }
      const reqUrl = `${node}${path}`
      try {
        const res = await fetch(reqUrl, {
          body: body && JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
          method,
        })
        if (res.status === 204) {
          return {}
        }
        this.logger.info(`[FETCH KONG SUCCESS]: ${reqUrl} success`)
        return res.json()
      } catch (error) {
        this.logger.error(`[FETCH KONG ERROR]: ${reqUrl} failed with error: ${error}`)
      }

    }
  }

  /**
   * register to kong
   */
  public async register() {
    const { name: serviceName } = this.service
    const { name: upstreamName } = this.upstream

    // check upstream exists
    const upstreams = await this.getUpstreams()
    if (upstreams.data) {
      const choosen = upstreams.data.find(upstream => upstream.name === upstreamName)
      if (choosen && choosen.id) {
        this.upstream.id = choosen.id
        await this.updateUpstream(this.upstream)
      } else {
        await this.addUpstream(this.upstream)
      }
    }

    // check target exists
    const targets = await this.getTargetsByUpstream(upstreamName)
    if (targets.data) {
      const list = targets.data.map(target => target.target)
      if (list.indexOf(this.ipAddress) === -1) {
        await this.addTarget(upstreamName, { target: this.ipAddress })
      }
    }

    // check service exists
    const services = await this.getServices()
    if (services.data) {
      const choosen = services.data.find(service => service.name === serviceName)
      if (choosen && choosen.id) {
        await this.updateService(this.service, choosen.id)
      } else {
        await this.addService(this.service)
      }
    }


    // check route exists
    const routes = await this.getRoutesByService(serviceName)
    if (routes.data && routes.data.length) {
      this.route.id = routes.data[0].id
      await this.updateRoute(this.route)
    } else {
      const currentService = await this.getService(serviceName)
      this.route.service = {
        id: currentService.id || ''
      }
      await this.addRoute(this.route)
    }

    this.logger.info(`[REGISTER KONG SUCCESS]: target ${this.ipAddress} success`)

  }

  /**
   * unregister -> mark target as unhealthy
   */
  public async unregister() {
    const { name: upstreamName } = this.upstream
    const targets = await this.getTargetsByUpstream(upstreamName)
    if (targets.data) {
      const list = targets.data.map(target => target.target)
      if (list.indexOf(this.ipAddress) !== -1) {
        await this.markTargetAsUnhealthy(upstreamName, this.ipAddress)
      }
    }

    this.logger.info(`[UNREGISTER KONG SUCCESS]: target ${this.ipAddress} success`)

  }

  /**
   * add service
   * @param service serviceInfo
   */
  public addService(service: IService) {
    this.proxy('/services', 'POST', service)
  }

  /**
   * update service
   * @param service serviceInfo
   */
  public updateService(service: IService, id: string) {
    this.proxy(`/services/${id}`, 'PATCH', service)
  }

  /**
   * add route
   * @param route routeInfo
   */
  public addRoute(route: IRoute) {
    this.proxy('/routes', 'POST', route)
  }

  /**
   * update route
   * @param route routeInfo
   */
  public updateRoute(route: IRoute) {
    this.proxy(`/routes/${route.id}`, 'PATCH', route)
  }

  /**
   * add upstream
   */
  public addUpstream(upstream: IUpstream) {
    this.proxy('/upstreams', 'POST', upstream)
  }

  /**
   * update upstream
   */
  public updateUpstream(upstream: IUpstream) {
    this.proxy(`/upstreams/${upstream.id}`, 'PATCH', upstream)
  }

  /**
   * add target
   */
  public addTarget(upstream: string, target: ITarget) {
    this.proxy(`/upstreams/${upstream}/targets`, 'POST', target)
  }

  /**
   * getService by name or id
   * @param service name | id
   */
  public getService(service: string): IService {
    const res = this.proxy(`/services/${service}`, 'GET')
    return res
  }

  /**
   * get all services
   */
  public getServices(): IServiceResponse {
    const res = this.proxy('/services', 'GET')
    return res
  }

  /**
   * get routes by serviceName or serviceId
   * @param service name | id
   */
  public getRoutesByService(service: string): IRouteResponse {
    const res = this.proxy(`/services/${service}/routes`, 'GET')
    return res
  }

  /**
   * get all routes
   */
  public getRoutes() {
    const res = this.proxy('/routes', 'GET')
    return res
  }


  /**
   * get all upstreams
   */
  public getUpstreams(): IUpstreamResponse {
    const res = this.proxy('/upstreams', 'GET')
    return res
  }

  /**
   * get single upstream by name or id
   * @param upstream name | id
   */
  public getUpstream(upstream: string): IUpstream {
    const res = this.proxy(`/upstreams/${upstream}`, 'GET')
    return res
  }

  /**
   * get all targets
   */
  public getTargets() {
    const res = this.proxy('/targets', 'GET')
    return res
  }

  /**
   * delete target
   * @param upstream name | id
   * @param target name | id
   */
  public deleteTarget(upstream: string, target: string) {
    const res = this.proxy(`/upstreams/${upstream}/targets/${target}`, 'DELETE', {})
    return res
  }

  /**
   * mark target as unhealthy
   * which will be marked as healthy again after next time's health check
   * @param upstream name | id
   * @param target name | id
   */
  public markTargetAsUnhealthy(upstream: string, target: string) {
    this.proxy(`/upstreams/${upstream}/targets/${target}/unhealthy`, 'POST', {})
  }

  /**
   * mark target as healthy manually
   * @param upstream name | id
   * @param target name | id
   */
  public markTargetAsHealthy(upstream: string, target: string) {
    this.proxy(`/upstreams/${upstream}/targets/${target}/healthy`, 'POST', {})
  }


  /**
   * get targets by upstream name or id
   * @param upstream name | id
   */
  public getTargetsByUpstream(upstream: string): ITargetResponse {
    const res = this.proxy(`/upstreams/${upstream}/targets`, 'GET')
    return res
  }

  /**
   * hello world test
   */
  public hello() {
    return 'hello world'
  }

  private async getAvailableNode() {
    let availableNode
    for (const node of this.kongUrl) {
      const res = await fetch(`${node}/status`)
      if (res.status === 200) {
        availableNode = node
        break
      }
    }
    return availableNode
  }
}
