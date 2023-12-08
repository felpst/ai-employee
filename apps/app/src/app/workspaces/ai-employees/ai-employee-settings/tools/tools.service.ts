import { EventEmitter, Injectable } from '@angular/core';
import { ITool } from '@cognum/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ToolsService {
    toolSelected = new EventEmitter<{ tool: ITool, index: number }>();
}