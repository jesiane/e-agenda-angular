import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ListarCategoriaViewModel } from '../../categorias/models/listar-categoria.view-model';
import { CategoriasService } from '../../categorias/services/categorias.service';
import { DespesasService } from '../services/despesas.service';
import { FormsDespesaViewModel } from '../models/forms-despesa.view-model';
import { map } from 'rxjs';

@Component({
  selector: 'app-editar-despesa',
  templateUrl: './editar-despesa.component.html',
  styleUrls: ['./editar-despesa.component.css'],
})
export class EditarDespesaComponent {
  form?: FormGroup;

  categorias: ListarCategoriaViewModel[] = [];

  constructor(
    private despesasService: DespesasService,
    private categoriasService: CategoriasService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
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

    this.route.data.pipe(map((dados) => dados['despesa'])).subscribe({
      next: (despesa) => this.obterDespesa(despesa),
      error: (err) => this.processarFalha(err),
    });
  }

  gravar() {
    if (this.form?.invalid) {
      for (let erro of this.form.validate()) {
        this.toastrService.warning(erro);
      }

      return;
    }

    const id = this.route.snapshot.paramMap.get('id')!;

    this.despesasService.editar(id, this.form?.value).subscribe({
      next: (despesaInserida) => this.processarSucesso(despesaInserida),
      error: (err) => this.processarFalha(err),
    });
  }

  obterDespesa(despesa: FormsDespesaViewModel) {
    this.form?.patchValue({
      ...despesa,
      data: despesa.data.toString().substring(0, 10),
    });
  }

  processarSucesso(despesa: FormsDespesaViewModel) {
    this.toastrService.success(
      `A despesa "${despesa.descricao}" foi editada com sucesso!`,
      'Sucesso'
    );

    this.router.navigate(['/despesas', 'listar']);
  }

  processarFalha(erro: Error) {
    this.toastrService.error(erro.message, 'Error');
  }
}
