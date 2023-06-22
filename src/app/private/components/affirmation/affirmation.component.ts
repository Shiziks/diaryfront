import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
} from '@angular/core';

import { IAffirmations } from '../../interfaces/i-affirmations';
import { AffirmationsService } from '../../services/affirmations.service';
import { createPopper, Instance } from '@popperjs/core'
import { DisableProfileSettingsService } from '../../services/disable-profile-settings.service';
import { EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-affirmation',
  templateUrl: './affirmation.component.html',
  styleUrls: ['./affirmation.component.css']
})
export class AffirmationComponent implements OnInit, OnDestroy {

  @ViewChild("textElement") textElement?: ElementRef;
  @ViewChild("tooltipElement") tooltipElement!: ElementRef;
  @ViewChild('tooltip') tooltip!: ElementRef;
  popperInstance!: Instance;
  @Output() newItemEvent = new EventEmitter<any>();
  sub: Subscription[] = [];


  textColor = "slategray";
  fontSize = "50px";
  linkWidth = "1px";
  blinkWidth = '2px';
  typingSpeedMilliseconds = 180;

  affirmations?: IAffirmations[];
  affirmation: string = "";

  interval: any;

  status: boolean = true;
  user_id: number = 0;


  constructor(private renderer: Renderer2,
    private affirmationsService: AffirmationsService,
    private disableSettings: DisableProfileSettingsService
  ) { }

  ngOnInit(): void {

    let sub1 = this.affirmationsService.getAffirmations().subscribe({
      next: result => {
        let arr = this.pluck(result, 'affirmation');
        this.affirmations = arr;
        this.typingEffect();


      },
      error: er => {
        console.log(er);
      }
    });
    this.sub.push(sub1);
    this.user_id = Number(localStorage.getItem('user_id'));
  }


  pluck(array: any, key: any) {
    return array.map(function (obj: any) {
      return obj[key];
    });
  }



  typingEffect(): void {
    this.status = false;
    if (this.interval) clearTimeout(this.interval);
    this.textElement!.nativeElement.innerHTML = "";
    let randAffirmation = String(this.affirmations![Math.floor(Math.random() * this.affirmations!.length)]);
    let affirmation = randAffirmation.split("");

    const loopTyping = () => {
      if (affirmation.length > 0) {
        this.textElement!.nativeElement.innerHTML += affirmation.shift();
      } else {
        this.status = true;
        return;
      }
      setTimeout(loopTyping, this.typingSpeedMilliseconds);
    };
    loopTyping();
  }


  showTooltip() {
    this.tooltip.nativeElement.setAttribute('data-show', '');
  }

  hideTooltip() {
    this.tooltip.nativeElement.removeAttribute('data-show');
  }

  ngAfterViewInit(): void {
    this.popperInstance = createPopper(this.tooltipElement.nativeElement, this.tooltip.nativeElement, {
      modifiers: [{ name: 'offset', options: { offset: [0, 8], } }],
      placement: 'top'
    },

    );

  }

  disableIt(data: HTMLElement) {
    let name = data.id;
    let dataToSend = {
      'user_id': this.user_id,
      'name': name
    };

    let sub2 = this.disableSettings.disableTheSetting(dataToSend).subscribe({
      next: result => {
        this.newItemEvent.emit(result);
      },
      error: er => {
        console.log(er.message);
      }
    });
    this.sub.push(sub2);
  }

  ngOnDestroy() {
    if (this.sub.length > 0) {
      this.sub.forEach((subscription) => subscription.unsubscribe());
    }
  }
}
