import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ListarCategoriaViewModel } from '../../categorias/models/listar-categoria.view-model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoriasService } from '../../categorias/services/categorias.service';
import { DespesasService } from '../services/despesas.service';
import { FormsDespesaViewModel } from '../models/forms-despesa.view-model';

@Component({
  selector: 'app-inserir-despesa',
  templateUrl: './inserir-despesa.component.html',
  styleUrls: ['./inserir-despesa.component.css'],
})
export class InserirDespesaComponent implements OnInit {
  form?: FormGroup;

  categorias: ListarCategoriaViewModel[] = [];

  constructor(
    private despesasService: DespesasService,
    private categoriasService: CategoriasService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descricao: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      valor: new FormControl(0, [Validators.required, Validators.min(0.1)]),
      data: new FormControl(new Date().toString().substring(0, 10), [
        Validators.required,
      ]),
      formaPagamento: new FormControl(0, [Validators.required]),
      categoriasSelecionadas: new FormControl([], [Validators.required]),
    });

    this.categoriasService
      .selecionarTodos()
      .subscribe((res) => (this.categorias = res));
  }

  gravar() {
    if (this.form?.invalid) {
      for (let erro of this.form.validate()) {
        this.toastrService.warning(erro);
      }

      return;
    }

    this.despesasService.inserir(this.form?.value).subscribe({
      next: (despesaInserida) => this.processarSucesso(despesaInserida),
      error: (err) => this.processarFalha(err),
    });
  }

  processarSucesso(despesa: FormsDespesaViewModel) {
    this.toastrService.success(
      `A despesa "${despesa.descricao}" foi cadastrada com sucesso!`,
      'Sucesso'
    );

    this.router.navigate(['/despesas/listar']);
  }

  processarFalha(erro: Error) {
    this.toastrService.error(erro.message, 'Error');
  }
}
