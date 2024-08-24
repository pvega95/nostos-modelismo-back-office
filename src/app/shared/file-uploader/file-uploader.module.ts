import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from './lib/ngx-dropzone.module';
import { FileUploaderComponent } from './file-uploader.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        NgxDropzoneModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule
    ],
    exports: [
        CommonModule,
        FileUploaderComponent
    ],
    declarations: [
        FileUploaderComponent,
    ]
})
export class FileUploaderModule
{
}
