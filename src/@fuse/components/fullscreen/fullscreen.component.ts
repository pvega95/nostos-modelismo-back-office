import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    TemplateRef,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';

@Component({
    selector: 'fuse-fullscreen',
    templateUrl: './fullscreen.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'fuseFullscreen',
    standalone: true,
    imports: [
        MatButtonModule,
        MatTooltipModule,
        NgTemplateOutlet,
        MatIconModule,
    ],
})
export class FuseFullscreenComponent implements OnInit {
    private _document = inject(DOCUMENT);

    @Input() iconTpl: TemplateRef<any>;
    @Input() tooltip: string;

    constructor(private _translocoService: TranslocoService) {
        //
    }
    ngOnInit(): void {
        this._translocoService
        .selectTranslate('toggle-fullscreen')
        .pipe()
        .subscribe((translation) => {
            this.tooltip = translation;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the fullscreen mode
     */
    toggleFullscreen(): void {
        if (!this._document.fullscreenEnabled) {
            console.log('Fullscreen is not available in this browser.');
            return;
        }

        // Check if the fullscreen is already open
        const fullScreen = this._document.fullscreenElement;

        // Toggle the fullscreen
        if (fullScreen) {
            this._document.exitFullscreen();
        } else {
            this._document.documentElement.requestFullscreen().catch(() => {
                console.error('Entering fullscreen mode failed.');
            });
        }
    }
}
