import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

@Injectable()
export class CustomGestureConfig extends HammerGestureConfig {
  // public overrides = {
  //   'swipe': { direction: Hammer.DIRECTION_ALL }
  // }

  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element);

    for (const eventName in this.overrides) {
      if (eventName) {
        mc.get(eventName).set(this.overrides[eventName]);
      }
    }

    return mc;
  }
}
