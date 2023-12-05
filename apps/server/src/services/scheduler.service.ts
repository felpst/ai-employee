import { CloudSchedulerClient } from '@google-cloud/scheduler';

enum HttpMethods {
  HTTP_METHOD_UNSPECIFIED = 0,
  POST = 1,
  GET = 2,
  HEAD = 3,
  PUT = 4,
  DELETE = 5,
  PATCH = 6,
  OPTIONS = 7
}

interface JobRequest {
  uri: string;
  httpMethod: keyof typeof HttpMethods;
  headers?: { [k: string]: string; };
  body?: Uint8Array | string;
}

interface JobParams {
  name: string,
  request: JobRequest,
  cronTab: string,
  timeZone?: string;
}

export default class SchedulerService {
  private _client: CloudSchedulerClient;
  private _parent = 'projects/cognum/locations/us-central1';
  constructor() {
    this._client = new CloudSchedulerClient({
      keyFilename: 'cognum.secrets.json'
    });
  }

  async createJob(params: JobParams) {
    return await this._client.createJob({
      job: {
        name: `${this._parent}/jobs/${params.name}`,
        httpTarget: params.request,
        schedule: params.cronTab,
        timeZone: params.timeZone
      },
      parent: this._parent
    });
  }

  async updateJob(params: JobParams) {
    return this._client.updateJob({
      job: {
        name: `${this._parent}/jobs/${params.name}`,
        httpTarget: params.request,
        schedule: params.cronTab,
        timeZone: params.timeZone
      },
    });
  }

  async deleteJob(name: string) {
    return this._client.deleteJob({
      name: `${this._parent}/jobs/${name}`
    });
  }
}