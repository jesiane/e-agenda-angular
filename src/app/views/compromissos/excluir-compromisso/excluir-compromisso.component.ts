import { Component, OnInit } from '@angular/core';
import { CompromissosService } from '../services/compromissos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VisualizarCompromissoViewModel } from '../models/visualizar-compromisso.view-model';
import { map } from 'rxjs';

@Component({
  selector: 'app-excluir-compromisso',
  templateUrl: './excluir-compromisso.component.html',
  styleUrls: ['./excluir-compromisso.component.css'],
})
export class ExcluirCompromissoComponent implements OnInit {
  compromissoVM?: VisualizarCompromissoViewModel;

  constructor(
    private compromissosService: CompromissosService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(map((dados) => dados['compromisso'])).subscribe({
      next: (compromisso) => this.obterCompromisso(compromisso),
      error: (erro) => this.processarFalha(erro),
    });
  }

  gravar() {
    this.compromissosService.excluir(this.compromissoVM!.id).subscribe({
      next: () => this.processarSucesso(),
      error: (err) => this.processarFalha(err),
    });
  }

  obterCompromisso(compromisso: VisualizarCompromissoViewModel) {
    this.compromissoVM = compromisso;
  }

  processarSucesso() {
    this.toastrService.success(
      `O compromisso foi excluído com sucesso!`,
      'Sucesso'
    );

    this.router.navigate(['/compromissos', 'listar']);
  }

  processarFalha(erro: Error) {
    this.toastrService.error(erro.message, 'Erro');
  }
}
