import { Routes } from '@angular/router';
import { NiveisComponent } from '../pages/niveis/niveis.component';
import { NivelFacilComponent } from '../pages/nivel-facil/nivel-facil.component';
import { SistemaSolarComponent } from '../pages/nivel-facil/fases/sistema-solar/sistema-solar.component';
import { InicioComponent } from '../pages/inicio/inicio.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'niveis/:tipo', component: NiveisComponent },
    { path: 'nivelFacil/:tipo', component: NivelFacilComponent },
    { path: 'sistema-solar/:tipo', component: SistemaSolarComponent }
];
