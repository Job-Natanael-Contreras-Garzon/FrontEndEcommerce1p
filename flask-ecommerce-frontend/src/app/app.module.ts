// src/app/app.module.ts
import { NgModule }               from '@angular/core';
import { BrowserModule }          from '@angular/platform-browser';
import { RouterModule }           from '@angular/router';

import { AppComponent }           from './app.component';
import { AppRoutes }              from './app.routes';

import { CoreModule }             from './core/core.module';
import { SharedModule }           from './shared/shared.module';

import { AuthLayoutComponent }    from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent }    from './layouts/main-layout/main-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
