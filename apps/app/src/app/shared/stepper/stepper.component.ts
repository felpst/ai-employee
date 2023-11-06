import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';

export interface Step {
  title: string;
  routerLink: string;
}

@Component({
  selector: 'cognum-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnChanges {
  @Input() _id = 'stepper';
  @Input() steps: Step[] = [
    { title: 'Step 1', routerLink: '' },
    { title: 'Step 2', routerLink: '' },
    { title: 'Step 3', routerLink: '' },
  ];
  @Input() selected: Step = this.steps[0];
  @Input() selectedIndex = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscribeToSelectByRoute()
  }

  subscribeToSelectByRoute() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe((data) => {
      if (data['stepper']?.select) {
        this.select(data['stepper'].select)
      }
    });
  }

  select(index: number) {
    this.selectedIndex = index;
    this.selected = this.steps[index];
  }

  ngOnChanges() {
    this.select(this.selectedIndex);
  }

  onSelectStep(index: number) {
    this.select(index);
  }

}
