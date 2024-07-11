import { Routes } from '@angular/router';
import { NiveisComponent } from '../pages/niveis/niveis.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { NivelMedioComponent } from '../pages/nivel-medio/nivel-medio.component';
import { SistemaSolarComponent } from '../pages/nivel-medio/fases/sistema-solar/sistema-solar.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'niveis/:tipo', component: NiveisComponent },
    { path: 'nivelMedio/:tipo', component: NivelMedioComponent },
    { path: 'sistema-solar/:tipo', component: SistemaSolarComponent }
];
