import { triggers } from '@cognum/models';
import { Schema, model, models } from 'mongoose';
import { IWebBrowserElement } from '../interfaces/web-browser.interfaces';

const schema = new Schema<IWebBrowserElement>(
  {
    pageURL: { type: String, required: true },
    context: { type: String, required: true },
    selector: { type: String, required: true },
    selectorType: { type: String, required: true },
  },
  {
    collection: 'web-browser-elements',
  }
);
triggers(schema);

const WebBrowserElement = models['WebBrowserElement'] || model<IWebBrowserElement>('WebBrowserElement', schema);
export { WebBrowserElement };

