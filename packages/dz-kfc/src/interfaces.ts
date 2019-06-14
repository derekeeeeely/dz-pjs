export interface IRoute {
  id?: string
  protocols?: string[]
  methods?: string[]
  hosts?: string[]
  service?: {
    id: string
  }
  paths: string[]
  strip_path?: boolean
  preserve_host?: boolean
}

export interface ITarget {
  id?: string
  target: string
  weight?: number
}

export interface IService {
  id?: string
  name: string
  url?: string
  protocol?: string
  host: string
  port: number
  path?: string
  retries?: number
  connect_timeout?: number
  read_timeout?: number
  write_timeout?: number
}

export interface IUpstream {
  id?: string
  name: string
  slots?: number
  healthchecks?: {
    active?: {
      timeout?: number
      concurrency?: number
      // Path to use in GET HTTP request to run as a probe on active health checks
      http_path?: string
      healthy?: {
        // in seconds
        // zero indicates that active probes for healthy targets should not be performed.
        interval?: number
        http_statuses?: number[]
        successes?: number
      }
      unhealthy?: {
        interval?: number
        http_statuses?: number[]
        http_failures?: number
        tcp_failures?: number
        timeouts?: number
      }
    }
    passive?: {
      healthy?: {
        http_statuses?: []
        successes?: number
      }
      unhealthy?: {
        http_statuses?: []
        http_failures?: number
        tcp_failures?: number
        timeouts?: number
      }
    }
  }
}


export interface IUpstreamResponse {
  data: IUpstream[]
  total: number
}

export interface IRouteResponse {
  data: IRoute[]
}
export interface ITargetResponse {
  data: ITarget[]
  total: number
}

export interface IServiceResponse {
  data: IService[]
}

