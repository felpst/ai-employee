import { CloudSchedulerClient } from '@google-cloud/scheduler';
import { google } from '@google-cloud/scheduler/build/protos/protos';

export class SchedulerService {
  private _client: CloudSchedulerClient;
  private _parent = 'projects/cognum/locations/us-central1';

  constructor() {
    this._client = new CloudSchedulerClient({
      keyFilename: process.env.PROD === 'true' ? undefined : 'cognum.secrets.json',
      projectId: 'cognum',
    });
  }

  async createJob({ name, ...rest }: google.cloud.scheduler.v1.IJob) {
    return await this._client.createJob({
      job: {
        name: `${this._parent}/jobs/${name}`,
        ...rest
      },
      parent: this._parent
    });
  }

  async updateJob({ name, ...rest }: google.cloud.scheduler.v1.IJob) {
    return this._client.updateJob({
      job: {
        name: `${this._parent}/jobs/${name}`,
        ...rest
      },
    });
  }

  async deleteJob(name: string) {
    return this._client.deleteJob({
      name: `${this._parent}/jobs/${name}`
    });
  }
}
