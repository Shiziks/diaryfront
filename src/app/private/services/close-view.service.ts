import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloseViewService {

  constructor() { }

  emitterClose = new EventEmitter();

  emitClose(data: boolean) {
    this.emitterClose.emit(data);
  }

}
