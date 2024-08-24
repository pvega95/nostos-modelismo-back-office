import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Auth } from 'aws-amplify';
@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(user: any, newPassword: string): Observable<any>
    {
        // return this._httpClient.post('api/auth/reset-password', password);
        return from(Auth.completeNewPassword(user,newPassword));
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        const { email , password } = credentials;
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return from(Auth.signIn(email, password)).pipe(
            switchMap((response: any) => {
                console.log('response', response);

                const { attributes, signInUserSession, challengeName } = response;
                if(challengeName && challengeName === 'NEW_PASSWORD_REQUIRED') {
                    this._userService.user = response;
                    return throwError('NEW_PASSWORD_REQUIRED');
                }
                // Store the access token in the local storage
                this.accessToken = signInUserSession.accessToken.jwtToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = attributes;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
     signInUsingToken(): Observable<any>
     {

         // Renew token
         return from(Auth.currentSession()).pipe(
             catchError(() =>
 
                 // Return false
                 of(false)
             ),
             switchMap((response: any) => {
                const { idToken, accessToken } = response;
                 // Store the access token in the local storage
                 this.accessToken = accessToken.jwtToken;
 
                 // Set the authenticated flag to true
                 this._authenticated = true;
 
                 // Store the user on the user service
                 this._userService.user = {
                    id: idToken.payload.sub,
                    name: idToken.payload.given_name,
                    email: idToken.payload.email,
                 };
 
                 // Return true
                 return of(true);
             })
         );
     }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        Auth.signOut();
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
