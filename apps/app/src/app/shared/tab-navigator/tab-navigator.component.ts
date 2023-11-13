import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { Step } from '../stepper/stepper.component';

@Component({
  selector: 'cognum-tab-navigator',
  templateUrl: './tab-navigator.component.html',
  styleUrls: ['./tab-navigator.component.scss'],
})
export class TabNavigatorComponent implements OnChanges {
  @Input() _id = 'nav';
  @Input() navs: Step[] = [
    { title: 'Nav 1', routerLink: '' },
    { title: 'Nav 2', routerLink: '' },
    { title: 'Nav 3', routerLink: '' },
  ];
  @Input() selected: Step = this.navs[0];
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
      if (data['nav']?.select) {
        this.select(data['nav'].select)
      }
    });
  }

  select(index: number) {
    this.selectedIndex = index;
    this.selected = this.navs[index];
  }

  ngOnChanges() {
    this.select(this.selectedIndex);
  }

  onSelectStep(index: number) {
    this.select(index);
  }

}
