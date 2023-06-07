import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { doc, getDoc, getFirestore } from '@angular/fire/firestore';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { delay } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    auth: Auth;
    firestore: Firestore;
    constructor(private router: Router) {
        this.auth = getAuth();
        this.firestore = getFirestore();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return new Observable(subscriber => {
            onAuthStateChanged(this.auth, async (user) => {
                if (user) {
                    const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
                    if (userDoc.exists() && userDoc.data()?.['rol'] === route.data['role']) {
                        subscriber.next(true);
                    } else {
                        this.router.navigate(['/auth']);
                        subscriber.next(false);
                    }
                } else {
                    delay(1000);
                    this.router.navigate(['/auth']);
                    subscriber.next(false);
                }
            });
        });
    }
}
