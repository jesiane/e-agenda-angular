import { Component, OnInit } from '@angular/core';
import { VisualizarDespesaViewModel } from '../models/visualizar-despesa.view-model';
import { DespesasService } from '../services/despesas.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-excluir-despesa',
  templateUrl: './excluir-despesa.component.html',
  styleUrls: ['./excluir-despesa.component.css'],
})
export class ExcluirDespesaComponent implements OnInit {
  despesaVM?: VisualizarDespesaViewModel;

  constructor(
    private despesasService: DespesasService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(map((dados) => dados['despesa'])).subscribe({
      next: (despesa) => this.obterDespesa(despesa),
      error: (err) => this.processarFalha(err),
    });
  }

  gravar() {
    this.despesasService.excluir(this.despesaVM!.id).subscribe({
      next: () => this.processarSucesso(),
      error: (err) => this.processarFalha(err),
    });
  }

  obterDespesa(despesa: VisualizarDespesaViewModel) {
    this.despesaVM = despesa;
  }

  processarSucesso() {
    this.toastrService.success(
      `A despesa foi excluída com sucesso!`,
      'Sucesso'
    );

    this.router.navigate(['/despesas', 'listar']);
  }

  processarFalha(erro: Error) {
    this.toastrService.error(erro.message, 'Error');
  }
}
