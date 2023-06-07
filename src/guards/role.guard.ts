import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

    constructor(private afAuth: AngularFireAuth, private router: Router, private db: AngularFirestore) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.afAuth.authState.pipe(
            take(1),
            map((user: any) => user && user.uid ? user.uid : null),
            switchMap(uid => {
                if (!uid) {
                    this.router.navigate(['/auth']);
                    return of(false);
                } else {
                    return this.db.doc(`users/${uid}`).valueChanges().pipe(
                        map((doc: any) => {
                            if (doc && 'role' in doc && doc['role'] == route.data['role']) {
                                return true;
                            } else {
                                this.router.navigate(['/auth']);
                                return false;
                            }
                        })
                    );
                }
            })
        );
    }
}
