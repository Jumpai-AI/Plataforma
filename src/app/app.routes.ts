import { Routes } from '@angular/router';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { SistemaSolarComponent } from '../pages/nivel-medio/sistema-solar/sistema-solar.component';
import { CalibragemOlhoComponent } from '../pages/calibragem-olho/calibragem-olho.component';
import { CalibragemLuvaComponent } from '../pages/calibragem-luva/calibragem-luva.component';
import { FasesComponent } from '../pages/fases/fases.component';
import { DificuldadeComponent } from '../pages/dificuldade/dificuldade.component';


export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'medio/sistema-solar/:tipo', component: SistemaSolarComponent },
    { path: 'calibragem-olho', component: CalibragemOlhoComponent },
    { path: 'calibragem-luva', component: CalibragemLuvaComponent },
    { path: 'fases/:tipo', component: FasesComponent },
    { path: 'dificuldade/:tipo', component: DificuldadeComponent }
];
