import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { DataService } from '@services/data-service/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  loadSetLocationSubscription: Subscription;
  reloadSubscription: Subscription;
  dataLoaded: boolean;
  minSplashDisplayTime = 2500;

  constructor(
    private dataService: DataService,
    private splashScreen: SplashScreen,
    private router: Router
  ) { }

  ngOnInit(): void {
    const timestamp = new Date().getTime();
    this.splashScreen.hide();
    setTimeout(this.staggerSlideIn(), 500);
    if (!!this.dataService.data) {
      this.loadMainPage(this.minSplashDisplayTime);
    } else {
      this.loadSetLocationSubscription = this.dataService.loadSetLocation.subscribe(() => {
        this.loadMainPage(this.getDelay(timestamp));
        this.unsubscribeAll();
      });
      this.reloadSubscription = this.dataService.reload.subscribe(() => {
        this.loadMainPage(this.getDelay(timestamp));
        this.unsubscribeAll();
      });
    }
  }

  getDelay(timestamp: number): number {
    return new Date().getTime() - timestamp > this.minSplashDisplayTime ? 0 : this.minSplashDisplayTime;
  }

  unsubscribeAll(): void {
    this.loadSetLocationSubscription.unsubscribe();
    this.reloadSubscription.unsubscribe();
  }

  loadMainPage(delay: number): void {
    this.dataLoaded = true;
    setTimeout(() => {
      this.router.navigate(['main'], { replaceUrl: true });
      this.dataService.hideMainPageSplash(true);
    }, delay);
  }

  staggerSlideIn(): any {
    return () => {
      const delay = 75;
      const blinds = document.querySelectorAll('img.blind');
      const glow = document.querySelectorAll('img.glow')[0];
      for (let i = 0; i < blinds.length; i++) {
        setTimeout(() => { blinds[i].classList.toggle('slide-in'); }, i * delay);
        setTimeout(() => { blinds[i].classList.toggle('hide'); }, i * delay);
      }
      setTimeout(() => { glow.classList.toggle('appear'); }, blinds.length * delay + 500);
      setTimeout(() => { glow.classList.toggle('hide'); }, blinds.length * delay + 500);
    };
  }
}
