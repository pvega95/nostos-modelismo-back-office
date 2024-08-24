import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { WindowModalComponent } from './window-modal/window-modal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SelectSearchComponent } from './select-search/select-search.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { StatusComponent } from './status/status.component';

const COMPONENTS = [WindowModalComponent, SelectSearchComponent, StatusComponent]

@NgModule({
    imports: [
        CommonModule,
        MatSelectModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatInputModule,
        MatTableModule,
        ScrollingModule,
        NgxMatSelectSearchModule,
        FormsModule,
        MatProgressBarModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        FileUploaderModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploaderModule,
        ...COMPONENTS
    ],
    declarations: [
      ...COMPONENTS,
      
      
    ]
})
export class SharedModule
{
}
