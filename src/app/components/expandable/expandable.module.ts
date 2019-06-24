import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExpandableComponent } from '@components/expandable/expandable.component';

@NgModule({
    declarations: [ExpandableComponent],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [ExpandableComponent],
})
export class ExpandableComponentModule { }
