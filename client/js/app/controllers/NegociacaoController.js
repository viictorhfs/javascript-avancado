class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);

        this._inputData = $("#data")
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
        this._form = $("form");
        this._ordemAtual = '';

        this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

        this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');


        /*ConnectionFactory
            .getConnection()
            .then(connection => {

                new NegociacaoDao(connection)
                    .listaTodos()
                    .then(negociacoes => {
                        negociacoes.forEach(negociacao => {
                            this._listaNegociacoes.adiciona(negociacao);
                        });
                    });
            })*/

        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
            })
            .catch(erro => {
                this._mensagem.texto = erro;
              });
    }

    adiciona(event) {
        event.preventDefault();

        ConnectionFactory
            .getConnection()
            .then(conexao => {
                let negociacao = this._criaNegociacao();
                new NegociacaoDao(conexao)
                    .adiciona(negociacao)
                    .then(() => {
                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = 'Negociação adicionada com sucesso!';
                        this._limpaForm();
                    });
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    importaNegociacoes() {

        let service = new NegociacaoService();

        service
            .obterNegociacoes()
            .then(negociacoes => 
                negociacoes.filter(negociacao => 
                    !this._listaNegociacoes.negociacoes.some(negociacaoExistente =>
                        JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))
            )
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas'   
            }))
            .catch(erro => this._mensagem.texto = erro);  

    }

    _criaNegociacao() {
        return new Negociacao(
            DataHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    apaga() {

        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })

        
    }


    _limpaForm() {
        this._form.reset();
        this._inputData.focus();
    }

    ordena(coluna) {
        if (this._ordemAtual == coluna) {
            //inverte a ordem da lista
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }
}