import { Component, OnInit } from '@angular/core';
import { CompromissosService } from '../services/compromissos.service';
import { ListarCompromissoViewModel } from '../models/listar-compromisso.view-model';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { ListarContatoViewModel } from '../../contatos/models/listar-contato.view-model';

@Component({
  selector: 'app-listar-compromissos',
  templateUrl: './listar-compromissos.component.html',
  styleUrls: ['./listar-compromissos.component.css'],
})
export class ListarCompromissosComponent implements OnInit {
  compromissos: ListarCompromissoViewModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(map((dados) => dados['compromissos'])).subscribe({
      next: (compromissos) => this.obterCompromissos(compromissos),
      error: (erro) => this.processarFalha(erro),
    });
  }

  obterCompromissos(compromissos: ListarCompromissoViewModel[]) {
    this.compromissos = compromissos;
  }

  processarFalha(erro: Error) {
    this.toastrService.error(erro.message, 'Erro');
  }
}
