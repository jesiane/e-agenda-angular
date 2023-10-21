import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormsCompromissoViewModel } from '../models/forms-compromisso.view-model';
import { Observable, catchError, map, pipe, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListarCompromissoViewModel } from '../models/listar-compromisso.view-model';
import { VisualizarCompromissoViewModel } from '../models/visualizar-compromisso.view-model';
import { LocalStorageService } from 'src/app/core/auth/services/local-storage.service';

@Injectable()
export class CompromissosService {
  private endpoint: string =
    'https://e-agenda-web-api.onrender.com/api/compromissos/';

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  public inserir(
    compromissso: FormsCompromissoViewModel
  ): Observable<FormsCompromissoViewModel> {
    return this.http
      .post<any>(this.endpoint, compromissso, this.obterHeadersAutorizacao())
      .pipe(
        map((res) => res.dados),
        catchError((err) => this.processarErroHttp(err))
      );
  }

  public editar(
    id: string,
    compromisso: FormsCompromissoViewModel
  ): Observable<FormsCompromissoViewModel> {
    return this.http
      .put<any>(this.endpoint + id, compromisso, this.obterHeadersAutorizacao())
      .pipe(
        map((res) => res.dados),
        catchError((err) => this.processarErroHttp(err))
      );
  }

  public excluir(id: string): Observable<any> {
    return this.http
      .delete(this.endpoint + id, this.obterHeadersAutorizacao())
      .pipe(catchError((err) => this.processarErroHttp(err)));
  }

  public selecionarTodos(): Observable<ListarCompromissoViewModel[]> {
    return this.http
      .get<any>(this.endpoint, this.obterHeadersAutorizacao())
      .pipe(
        map((res) => res.dados),
        catchError((err) => this.processarErroHttp(err))
      );
  }

  public selecionarPorId(id: string): Observable<FormsCompromissoViewModel> {
    return this.http
      .get<any>(this.endpoint + id, this.obterHeadersAutorizacao())
      .pipe(
        map((res) => res.dados),
        catchError((err) => this.processarErroHttp(err))
      );
  }

  public selecionarCompromissoCompletoPorId(
    id: string
  ): Observable<VisualizarCompromissoViewModel> {
    return this.http
      .get<any>(
        this.endpoint + 'visualizacao-completa/' + id,
        this.obterHeadersAutorizacao()
      )
      .pipe(
        map((res) => res.dados),
        catchError((err) => this.processarErroHttp(err))
      );
  }

  private obterHeadersAutorizacao() {
    const token = this.localStorage.obterDadosLocaisSalvos()?.chave;

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  private processarErroHttp(erro: HttpErrorResponse) {
    let mensagemErro = '';

    if (erro.status == 0)
      mensagemErro = 'Ocorreu um erro ao processar a requisição.';
    if (erro.status == 401)
      mensagemErro =
        'O usuário não está autorizado. Efetue login e tente novamente.';
    else mensagemErro = erro.error?.erros[0];

    return throwError(() => new Error(mensagemErro));
  }
}
