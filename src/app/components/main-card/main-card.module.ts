import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MainCardComponent } from '@components/main-card/main-card.component';

@NgModule({
    declarations: [MainCardComponent],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [MainCardComponent],
})
export class MainCardComponentModule { }
