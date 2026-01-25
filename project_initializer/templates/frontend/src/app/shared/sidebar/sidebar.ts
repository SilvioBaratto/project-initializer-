import { Component, signal, computed, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface NavigationItem {
  name: string;
  icon: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Inputs from parent
  isOpen = input<boolean>(false);
  isMobile = input<boolean>(false);
  title = input<string>('Logo');

  // Outputs to parent
  closeSidebar = output<void>();
  itemSelected = output<string>();

  // Navigation items
  navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      route: '/',
      active: true,
    },
    {
      name: 'Analytics',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      route: '/analytics',
      active: false,
    },
    {
      name: 'Settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      route: '/settings',
      active: false,
    },
  ];

  // Computed property for sidebar visibility
  showSidebar = computed(() => !this.isMobile() || this.isOpen());

  onItemClick(itemName: string, route: string) {
    this.setActiveItem(itemName);
    this.itemSelected.emit(itemName);
    this.closeSidebar.emit();
  }

  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  /**
   * Handle user logout
   */
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
    this.closeSidebar.emit(); // Close sidebar on mobile
  }

  private setActiveItem(itemName: string) {
    this.navigationItems = this.navigationItems.map((item) => ({
      ...item,
      active: item.name === itemName,
    }));
  }
}
