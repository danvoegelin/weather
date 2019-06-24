import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HourlyCardComponent } from '@components/hourly-card/hourly-card.component';
import { ExpandableComponentModule } from '@components/expandable/expandable.module';

@NgModule({
    declarations: [HourlyCardComponent],
    imports: [
        CommonModule,
        IonicModule,
        ExpandableComponentModule
    ],
    exports: [HourlyCardComponent],
})
export class HourlyCardComponentModule { }
