export interface SQLConnectorToolSettings {
  database: string
  name: string
  port: string
  host: string
  auth: {
    user: string
    pass: string
  }
}
