import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IKnowledge, IWorkspace } from '@cognum/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { WorkspacesService } from '../../workspaces.service';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { KnowledgeFormComponent } from '../knowledge-form/knowledge-form.component';

@Component({
    selector: 'knowledge-actions',
    templateUrl: './knowledge-actions.component.html',
    styleUrls: ['./knowledge-actions.component.scss']
})
export class KnowledgeActionsComponent {
    @Input() knowledge!: IKnowledge;
    @Output() knowledgeUpdated = new EventEmitter<void>();
    @Output() knowledgeDeleted = new EventEmitter<void>();
    workspace!: IWorkspace;

    constructor(
        private dialog: MatDialog,
        private knowledgeBaseService: KnowledgeBaseService,
        private workspacesService: WorkspacesService,
        private authService: AuthService
    ) {
        this.workspace = this.workspacesService.selectedWorkspace;
    }

    onForm(knowledge?: IKnowledge) {
        const dialogRef = this.dialog.open(KnowledgeFormComponent, {
            width: '640px',
            data: { knowledge, workspace: this.workspace },
        });
        dialogRef.afterClosed().subscribe((res) => {
            this.knowledgeBaseService.getAllFromWorkspace(this.workspace._id);
        });
    }

    editKnowledge(knowledge: IKnowledge) {
        this.onForm(knowledge);
        this.knowledgeUpdated.emit();
    }

    openDeleteConfirmationDialog(knowledge: IKnowledge) {
        const dialogRef = this.dialog.open(DialogComponent, {
            data: {
                title: 'Delete Confirmation',
                content: 'Are you sure you want to delete this knowledge?',
                confirmText: 'Delete',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.deleteKnowledge(knowledge);
            }
        });
    }

    deleteKnowledge(knowledge: IKnowledge) {
        this.knowledgeBaseService
            .delete(knowledge)
            .subscribe(() => this.knowledgeDeleted.emit());
    }

    userHasEditorPermission(knowledge: IKnowledge): boolean {
        return this.knowledgeBaseService.userPermission(
            knowledge,
            this.authService.user?._id
        );
    }
}