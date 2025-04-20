// admin-layout.module.ts
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,  // Agrega este import
    // otros imports...
  ]
})
export class AdminLayoutModule { 