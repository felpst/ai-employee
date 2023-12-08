import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolsHelper } from '@cognum/helpers';
import { IChatRoom } from '@cognum/interfaces';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { AIEmployeesService } from '../../ai-employees.service';
import { ChatComponent } from '../../chats/chat/chat.component';
import { ChatService } from '../../chats/chat/chat.service';
import { ChatsService } from '../../chats/chats.service';
import { AIToolAddComponent } from './tool-add/tool-add.component';
import { AIToolSettingsGoogleCalendarComponent } from './tool-settings/google-calendar/tool-settings-google-calendar.component';
import { AIToolSettingsLinkedInLeadScraperComponent } from './tool-settings/linkedin-lead-scraper/tool-settings-linkedin-lead-scraper.component';
import { AIToolSettingsMailSenderComponent } from './tool-settings/mail-sender/tool-settings-mail-sender.component';
import { AIToolSettingsSQLConnectorComponent } from './tool-settings/sql-connector/tool-settings-sql-connector.component';
import { ToolsService } from './tools.service';

@Component({
  selector: 'cognum-ai-employee-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class AIEmployeeToolsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private aiEmployeeService: AIEmployeesService,
    private toolsService: ToolsService,
    private chatsService: ChatsService,
    private chatService: ChatService
  ) { }

  get tools() {
    return this.aiEmployeeService.aiEmployee.tools.map(tool => ({
      id: tool.id,
      name: ToolsHelper.get(tool.id)?.name,
      icon: ToolsHelper.get(tool.id)?.icon,
      description: ToolsHelper.get(tool.id)?.description,
    }));
  }

  ngOnInit() {
    this.toolsService.toolSelected.subscribe(({ tool, index }) => {
      this.onSelect(index);
    });
  }

  addTool() {
    this.dialog.open(AIToolAddComponent, { width: '400px' });
  }

  async onSelect(index: number) {
    const toolSettings = this.aiEmployeeService.aiEmployee.tools[index];
    const tool = ToolsHelper.get(toolSettings.id);
    let component: any;

    switch (toolSettings.id) {
      case 'sql-connector':
        component = AIToolSettingsSQLConnectorComponent;
        break;
      case 'mail-sender':
        component = AIToolSettingsMailSenderComponent;
        break;
      case 'linkedin-lead-scraper':
        component = AIToolSettingsLinkedInLeadScraperComponent;
        break;
      case 'google-calendar':
        if (!toolSettings.options?.token) {
          try {
            await new Promise(async (resolve, reject) => {
              try {
                const accessToken = await this.toolsService.googleOAuth2(tool)

                if (!toolSettings.options) toolSettings.options = {};
                toolSettings.options.tools = { list: true, create: true, update: true, delete: true };
                toolSettings.options.token = accessToken;
                this.aiEmployeeService.aiEmployee.tools[index].options = toolSettings.options;
                this.aiEmployeeService.update({
                  _id: this.aiEmployeeService.aiEmployee._id,
                  tools: this.aiEmployeeService.aiEmployee.tools
                }).subscribe(updatedEmployee => {
                  this.aiEmployeeService.aiEmployee = updatedEmployee;
                  resolve(updatedEmployee)
                });
              } catch (error) { return reject(); }
            });
          } catch (error) { return; }
        }
        component = AIToolSettingsGoogleCalendarComponent;
        break;
    }

    if (component) {
      const dialogRef = this.dialog.open(component, { width: '400px', data: { tool: toolSettings } });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.aiEmployeeService.aiEmployee.tools[index].options = data;
          this.aiEmployeeService.update({
            _id: this.aiEmployeeService.aiEmployee._id,
            tools: this.aiEmployeeService.aiEmployee.tools
          }).subscribe(updatedEmployee => {
            this.aiEmployeeService.aiEmployee = updatedEmployee;
          });
        }
      });
    }
  }

  onTestTool(index: number) {
    const tool = this.aiEmployeeService.aiEmployee.tools[index];
    const chat: Partial<IChatRoom> = {
      aiEmployee: this.aiEmployeeService.aiEmployee
    }
    const testMessage = this.testMessage(tool);

    this.chatsService.create(chat).subscribe({
      next: (newChat) => {
        this.openChatModal(newChat, tool, testMessage);
      },
    });
  }

  openChatModal(chat: IChatRoom, tool: any, testMessage: string) {
    const chatId = chat._id as string;
    const dialogRef = this.dialog.open(ChatComponent, {
      width: '800px',
      height: '800px',
      data: { chatId, tool, testMessage },
    });

    this.chatService.load(chatId).subscribe(chat => {
      console.log('Chat loaded:', chat);
    });

    dialogRef.backdropClick().subscribe(() => {
      this.chatsService.delete(chat).subscribe({
        next: () => {
          dialogRef.close();
        },
      });
    });
  }

  testMessage(tool: any) {
    const testMessages: { [key: string]: string } = {
      'calculator': 'Calculate 10 x 10',
      'random-number': 'Generate a random number between 10 and 20',
      'google-search': 'How old is Paul McCartney?',
      'web-browser': "What is the date of John Lennon's death according to this website: https://en.wikipedia.org/wiki/John_Lennon?",
      'mail-sender': 'Send test email to: ',
      'python': 'What is the 5th element of the Fibonacci sequence?',
      'sql-connector': 'Connect to a SQL database',
      'linkedin-lead-scraper': 'Find 5 leads on LinkedIn: Web Developers in Brazil',
    };
    return testMessages[tool.id] || '';
  }

  areToolSettingsFilled(index: number): boolean {
    const tool = this.aiEmployeeService.aiEmployee.tools[index]
    const toolsWithoutSettings = ['calculator', 'random-number', 'google-search', 'web-browser', 'python'];

    if (toolsWithoutSettings.includes(tool.id)) {
      return true;
    }
    return tool && tool.options && Object.keys(tool.options).length > 0;
  }

  onDelete(index: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this tool?',
        confirmText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.aiEmployeeService.aiEmployee.tools.splice(index, 1);
        this.aiEmployeeService.update({
          _id: this.aiEmployeeService.aiEmployee._id,
          tools: this.aiEmployeeService.aiEmployee.tools
        }).subscribe(updatedEmployee => {
          this.aiEmployeeService.aiEmployee = updatedEmployee;
        });
      }
    });
  }
}
