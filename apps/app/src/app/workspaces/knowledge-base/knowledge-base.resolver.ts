import { Injectable } from "@angular/core";
import { IKnowledge } from "@cognum/interfaces";
import { Observable } from "rxjs";
import { WorkspacesService } from "../workspaces.service";
import { KnowledgeBaseService } from "./knowledge-base.service";


@Injectable({
    providedIn: 'root',
})
export class KnowledgeBaseResolver {
    constructor(
        private workspacesService: WorkspacesService,
        private knowledgeBaseService: KnowledgeBaseService,
    ) { }

    resolve(): Observable<IKnowledge[]> {
        return this.knowledgeBaseService.load(this.workspacesService.selectedWorkspace)
    }
}