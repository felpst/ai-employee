import { Injectable } from '@angular/core';
import { IChatMessage } from '@cognum/interfaces';
import { Observable } from 'rxjs';
import { CoreApiService } from '../apis/core-api.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private route = 'messages';
  constructor(private coreApiService: CoreApiService) { }

  update(item: Partial<IChatMessage>): Observable<IChatMessage> {
    return this.coreApiService.put(
      `${this.route}/${item._id}`,
      item
    ) as Observable<IChatMessage>;
  }

  addFeedback({ _id, ...rest }: any): Observable<IChatMessage> {
    return this.coreApiService.patch(`${this.route}/${_id}`, {
      feedbacks: rest,
    }) as Observable<IChatMessage>;
  }

  updateFeedback({ messageId, _id, ...rest }: any): Observable<IChatMessage> {
    return this.coreApiService.put(
      `${this.route}/${messageId}/feedback/${_id}`,
      { ...rest }
    ) as Observable<IChatMessage>;
  }
}
