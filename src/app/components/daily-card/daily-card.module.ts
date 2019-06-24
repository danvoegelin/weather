import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DailyCardComponent } from '@components/daily-card/daily-card.component';
import { ExpandableComponentModule } from '@components/expandable/expandable.module';

@NgModule({
    declarations: [DailyCardComponent],
    imports: [
        CommonModule,
        IonicModule,
        ExpandableComponentModule
    ],
    exports: [DailyCardComponent],
})
export class DailyCardComponentModule { }
