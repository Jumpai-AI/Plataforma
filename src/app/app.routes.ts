import { Routes } from '@angular/router';
import { NiveisComponent } from '../pages/niveis/niveis.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { NivelMedioComponent } from '../pages/nivel-medio/nivel-medio.component';
import { SistemaSolarComponent } from '../pages/nivel-medio/fases/sistema-solar/sistema-solar.component';
import { NivelFacilComponent } from '../pages/nivel-facil/nivel-facil.component';
import { NumerosComponent } from '../pages/nivel-facil/fases/numeros/numeros.component';
import { CalibragemComponent } from '../pages/calibragem/calibragem.component';
import { FaceMeshComponent } from '../pages/face-mesh/face-mesh.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'fesh', component: FaceMeshComponent },
    { path: 'niveis/:tipo', component: NiveisComponent },
    { path: 'nivelMedio/:tipo', component: NivelMedioComponent },
    { path: 'nivelFacil/:tipo', component: NivelFacilComponent },
    { path: 'sistema-solar/:tipo', component: SistemaSolarComponent },
    { path: 'numeros/:tipo', component: NumerosComponent },
    { path: 'calibragem', component: CalibragemComponent },
];
