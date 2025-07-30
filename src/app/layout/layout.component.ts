import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  showOrderMenu = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showOrderMenu = event.urlAfterRedirects.startsWith('/dashboard/order');
      });
  }
}
