import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated) {
      this.router.navigateByUrl('/tabs/tab1');
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const { email, password } = this.form.value;
    const ok = this.auth.login(email, password);
    if (ok) {
      this.router.navigateByUrl('/tabs/tab1');
    } else {
      alert('Credenciais inválidas');
    }
  }
}

