import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { Step } from '../stepper/stepper.component';

@Component({
  selector: 'cognum-tab-navigator',
  templateUrl: './tab-navigator.component.html',
  styleUrls: ['./tab-navigator.component.scss'],
})
export class TabNavigatorComponent implements OnInit, OnChanges {
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
    this.subscribeToSelectByRoute();
  }

  ngOnInit(): void {
    this.selectByRoute();
    this.subscribeToSelectByRoute();
  }

  // To ensure it stays on the correct tab if the page reloads
  selectByRoute() {
    const urlSegments = this.router.url.split('/');
    const tabName = urlSegments[urlSegments.length - 1];
    const tabIndex = this.navs.findIndex(nav => nav.routerLink === `./${tabName}`);
    if (tabIndex !== -1) {
      this.select(tabIndex);
    }
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
      const selectedTab = this.navs.findIndex(nav => nav.routerLink === data['nav'].select);
      if (selectedTab !== -1) {
        this.select(selectedTab);
        if (data['nav']?.select) {
          this.select(data['nav'].select)
        }
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
