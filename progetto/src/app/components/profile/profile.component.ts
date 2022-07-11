import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

//questa pagina permette all'utente di cambiare i propri dati, guardare modules/user.ts per vedere il profilo dell'utente

@UntilDestroy() //until destroy di ng neat permette di disiscriversi dall'observable in modo efficace
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });

  constructor(
    private toast: HotToastService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this), tap(console.log))
      .subscribe((user) => {
        this.profileForm.patchValue({ ...user });
      });
  }

  saveProfile() {
    const profileData = this.profileForm.value;
    this.usersService
      .updateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'Salvando modifiche profilo...',
          success: 'Profilo modificato con successo',
          error: 'Errore nella modifica',
        })
      )
      .subscribe();
  }
}
