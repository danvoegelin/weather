import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MinutelyCardComponent } from '@components/minutely-card/minutely-card.component';

@NgModule({
    declarations: [MinutelyCardComponent],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [MinutelyCardComponent],
})
export class MinutelyCardComponentModule { }
