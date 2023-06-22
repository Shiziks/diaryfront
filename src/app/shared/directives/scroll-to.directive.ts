import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[scrollTo]'
})
export class ScrollToDirective {

  constructor() { }

  @Input('scrollTo') elm?: HTMLElement;

  @HostListener('click') onClick() {
    if (this.elm) {
      this.elm.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
