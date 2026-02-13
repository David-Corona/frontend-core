import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        CoreStack by
        <a href="https://github.com/david-corona" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Corona</a>
    </div>`
})
export class AppFooter {}
