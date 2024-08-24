import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-product-choose-option',
    templateUrl: './product-choose-option.component.html',
    styleUrls: ['./product-choose-option.component.scss'],
})
export class ProductChooseOptionComponent implements OnInit {

    constructor(
        private router: Router,
    ) {
        
    }

    ngOnInit(): void {
    }    
}