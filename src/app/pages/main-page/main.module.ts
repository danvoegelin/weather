import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainPage } from '@pages/main-page/main.page';
import { MainCardComponentModule } from '@components/main-card/main-card.module';
import { MinutelyCardComponentModule } from '@components/minutely-card/minutely-card.module';
import { HourlyCardComponentModule } from '@components/hourly-card/hourly-card.module';
import { DailyCardComponentModule } from '@components/daily-card/daily-card.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MainCardComponentModule,
    MinutelyCardComponentModule,
    HourlyCardComponentModule,
    DailyCardComponentModule,
    RouterModule.forChild([
        {
            path: '',
            component: MainPage
        }
    ])
  ],
  declarations: [
    MainPage
  ]
})
export class MainPageModule {}
