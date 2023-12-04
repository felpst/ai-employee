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

interface CreateJobParams {
  request: JobRequest,
  cronTab: string,
  timeZone?: string;
}

export default class SchedulerService {
  private client: CloudSchedulerClient;
  constructor() {
    this.client = new CloudSchedulerClient();
  }

  async createCron(params: CreateJobParams) {
    return this.client.createJob({
      job: {
        httpTarget: params.request,
        schedule: params.cronTab,
        timeZone: params.timeZone
      },
    });
  }
}