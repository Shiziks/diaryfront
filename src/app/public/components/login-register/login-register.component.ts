import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EmitFromNavigationService } from 'src/app/shared/services/emit-from-navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit, OnDestroy {

  @ViewChild('container', { static: false }) container?: ElementRef;
  login?: boolean;
  loaded?: boolean;
  register: boolean = false;
  containerElement: any;
  setActive: boolean = false;
  leftPanel: boolean = true;
  rightPanel: boolean = false;
  registerClicked: boolean = false;
  sub: Subscription[] = [];

  constructor(private renderer: Renderer2,
    private router: Router,
    private location: Location,
    private emitFromNavigation: EmitFromNavigationService,
    private activatedRoute: ActivatedRoute,
    private element: ElementRef,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.router.url === '/login/login' || this.router.url === '/login/admin') {
      this.login = true
      this.register = false;
    }
    else if (this.router.url === "/register") {
      this.register = true;
      this.login = false;
    }
    else {
      this.router.navigate(['/notfound']);
    }
  }

  ngAfterViewInit() {
    this.containerElement = this.container?.nativeElement;
    let sub1 = this.emitFromNavigation.callShowLogin$.subscribe((result: any) => {
      if (result == true) {
        this.showLogin();
      }
    });

    let sub2 = this.emitFromNavigation.callShowRegister$.subscribe((result: any) => {
      if (result == true) {
        this.showRegister();
      }
    });

    this.sub.push(sub1);
    this.sub.push(sub2);
  }


  showRegister() {
    this.registerClicked = true;

    this.renderer.addClass(this.containerElement, "active");
    this.renderer.removeClass(this.containerElement, "left-panel-active");
    this.renderer.addClass(this.containerElement, "right-panel-active");
    this.login = false;
    this.register = true;
    this.location.replaceState('register', '', { id: 1, name: 'register' });
  }

  showLogin() {
    this.renderer.removeClass(this.containerElement, "active");
    this.renderer.removeClass(this.containerElement, "right-panel-active")
    this.renderer.addClass(this.containerElement, "left-panel-active");
    this.register = false;
    this.location.replaceState('/login/login', '', { id: 1, name: 'login' });
  }

  ngOnDestroy(): void {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
