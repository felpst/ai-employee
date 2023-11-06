import { Component, Input } from '@angular/core';
import { Steps } from '../create-workspace.component';

@Component({
  selector: 'cognum-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  @Input({ required: true }) currentStep!: Steps;

  constructor() {}
}
