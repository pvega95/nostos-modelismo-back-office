/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Auth } from 'aws-amplify';
@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            agreements: ['', Validators.requiredTrue],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    // signUp(): void
    // {
    //     // Do nothing if the form is invalid
    //     if ( this.signUpForm.invalid )
    //     {
    //         return;
    //     }

    //     // Disable the form
    //     this.signUpForm.disable();

    //     // Hide the alert
    //     this.showAlert = false;

    //     // Sign up
    //     this._authService.signUp(this.signUpForm.value)
    //         .subscribe(
    //             (response) => {

    //                 // Navigate to the confirmation required page
    //                 this._router.navigateByUrl('/confirmation-required');
    //             },
    //             (response) => {

    //                 // Re-enable the form
    //                 this.signUpForm.enable();

    //                 // Reset the form
    //                 this.signUpNgForm.resetForm();

    //                 // Set the alert
    //                 this.alert = {
    //                     type   : 'error',
    //                     message: 'Something went wrong, please try again.'
    //                 };

    //                 // Show the alert
    //                 this.showAlert = true;
    //             }
    //         );
    // }

    async signUp(): Promise<void> {
        try {
            const user = await Auth.signUp({
                username: this.signUpForm.get('email').value,
                password: this.signUpForm.get('password').value,
                attributes: {
                    email: this.signUpForm.get('email').value,
                    given_name: this.signUpForm.get('name').value,
                },
            });
            if (user) {
                console.log(user);
                this._router.navigateByUrl('/confirmation-required');
            }
        } catch (error) {
            // Re-enable the form
            this.signUpForm.enable();

            // Reset the form
            this.signUpNgForm.resetForm();

            // Set the alert
            this.alert = {
                type: 'error',
                message: 'Something went wrong, please try again.',
            };

            // Show the alert
            this.showAlert = true;
        }
    }
}
