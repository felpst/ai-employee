import { Injectable } from '@angular/core';
import { IMessage } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private route = 'messages';
  constructor(private coreApiService: CoreApiService) {}

  update(item: Partial<IMessage>): Observable<IMessage> {
    return this.coreApiService.put(
      `${this.route}/${item._id}`,
      item
    ) as Observable<IMessage>;
  }
}
