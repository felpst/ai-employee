export interface SQLToolSettings {
  database: string
  name: string
  port: string
  host: string
  auth: {
    username: string
    password: string
  }
}
