import { ListarDespesaViewModel } from '../models/listar-despesa.view-model';
import { DespesasModule } from './../despesas.module';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-despesa',
  templateUrl: './card-despesa.component.html',
  styleUrls: ['./card-despesa.component.css'],
})
export class CardDespesaComponent {
  @Input({ required: true }) despesa!: ListarDespesaViewModel;
}
