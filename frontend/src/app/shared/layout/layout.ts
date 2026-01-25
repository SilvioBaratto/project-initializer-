import { Component, signal, computed, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit, OnDestroy {
  // Application title
  title = 'My Application';

  // Sidebar state management using Angular 19 signals
  isSidebarOpen = signal(false);
  isMobile = signal(false);
  currentPage = signal('Dashboard');

  // Computed property for responsive sidebar behavior
  showSidebar = computed(() => !this.isMobile() || this.isSidebarOpen());

  // Resize observer for better mobile detection
  private resizeObserver?: ResizeObserver;

  ngOnInit() {
    this.checkScreenSize();
    this.initializeResizeObserver();
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update((value) => !value);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  onItemSelected(itemName: string) {
    this.currentPage.set(itemName);
    // Close sidebar on mobile after selection
    if (this.isMobile()) {
      this.closeSidebar();
    }
  }

  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      const isMobileSize = window.innerWidth < 768;
      this.isMobile.set(isMobileSize);

      // Auto-close sidebar on mobile when screen size changes to mobile
      if (isMobileSize) {
        this.isSidebarOpen.set(false);
      }
    }
  }

  private initializeResizeObserver() {
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width } = entry.contentRect;
          const isMobileSize = width < 768;
          this.isMobile.set(isMobileSize);

          // Auto-close sidebar when switching to mobile
          if (isMobileSize && this.isSidebarOpen()) {
            this.isSidebarOpen.set(false);
          }
        }
      });

      this.resizeObserver.observe(document.body);
    } else {
      // Fallback to window resize event
      this.setupResizeListener();
    }
  }

  private setupResizeListener() {
    if (typeof window !== 'undefined') {
      const handleResize = () => this.checkScreenSize();
      window.addEventListener('resize', handleResize);
    }
  }
}
