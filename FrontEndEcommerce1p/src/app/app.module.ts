//src\app\app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminAuthInterceptor } from './core/interceptors/admin-auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AdminLayoutModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminAuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }