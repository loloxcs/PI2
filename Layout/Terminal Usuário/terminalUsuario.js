
function exibirPaginaCorreta(pagina) {
    // Ocultar todas as páginas
    var pages = document.getElementsByClassName('conteudo');
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove('visible');
    }
  
    // Exibir a página desejada
    var exibir = document.getElementById(pagina);
    if (exibir) {
      exibir.classList.add('visible');
    }
  }

function validarNumeros(campo){
  var numeroCartao = campo.value;
  var valoresAceitos =  /^[0-9]+$/;
  if(!valoresAceitos.test(numeroCartao))
  {
      campo.value = numeroCartao.slice(0, -1);
      alert("Digite apenas números");
  }
}


function gerarCartao(pagina) //terminar de testar depois de conectar o banco
{
    let existeId;
    let podeGerar = false;

    do{
      var idGerado = geraCodigo();
      if(existeCartaoNoBanco(idGerado))
      {
        existeId = true;
      }
      else{
        podeGerar = true;
        existeId = false;
      }
    }while(existeId == true);

    if(podeGerar == true)
    {
        let objCartao = { idCartao: idGerado };
        let url = `http://localhost:3000/cadastrarCartao/`;

        let res = axios.post(url, objCartao)
        .then(response => {
          if (response.data) {
            const msg = new Comunicado (response.data.codigo, 
                                        response.data.mensagem, 
                          response.data.descricao);
          }
        })
        .catch(error  =>  {
          
          if (error.response) {
            const msg = new Comunicado (error.response.data.codigo, 
                                        error.response.data.mensagem, 
                          error.response.data.descricao);
            alert(msg.get());
          }
        })

      var pages = document.getElementsByClassName('conteudo');
      for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('visible');
      }

      //inserir logica de gerar cartao
      var exibir = document.getElementById(pagina);
        if (exibir) {
          exibir.classList.add('visible');
        }

      var divNumeroCartao = document.getElementById('numeroCartao');
      divNumeroCartao.textContent = idGerado;
    }
  }

  function existeCartaoNoBanco(idCartao)
  {
    console.log(idCartao);
    let url = `http://localhost:3000/getCartao/${idCartao}`

    axios.get(url)
    .then(response => {
      console.log(' response da request : ', response.data);
      if (response.data == null || response.data === '') {
        return false;
      } else {
        return true;
      }
    })
    .catch(error  =>  {
      if (error.response) {
        const msg = new Comunicado (error.response.data.codigo, 
                      error.response.data.mensagem, 
                      error.response.data.descricao);
        alert(msg.get());
      }	
      throw error;
    })
  }

  function geraCodigo(){ //terminar de testar depois de conectar o banco
    const charset = '0123456789'; 
    let id = ' ';

    for (let i=0; i<5; i++) 
    { 
        //gera um número aleátorio de até 5 números
        const indiceAleatorio = Math.floor(Math.random() * charset.length);
        id += charset.charAt(indiceAleatorio);
    }
    return id;
  }
/*
  function buscarCartao(campoNumeroCartao) {
    var numeroCartao = document.getElementById(campoNumeroCartao).value;
    var divExisteCartao = document.getElementById('cartaoExiste');

    console.log(numeroCartao);
     const existe = existeCartaoNoBanco(numeroCartao);
     if(existe)
       {
        divExisteCartao.textContent = 'OK! Boas compras!';
      }
    else{
      divExisteCartao.textContent = 'Este cartão não existe! Gere um na página de gerar cartão.';
    }
  }
*/
/*
function adquirirServico() {
  var campoNumeroCartao = document.getElementById("campoNumeroCartao");
  var numeroCartao = campoNumeroCartao.value;
  if(campoNumeroCartao.required && (numeroCartao == null || numeroCartao == ''))
  {
      alert("Preencha o número do cartão antes de comprar um serviço!");
  }
  else{
    /*
    let objServico = { codigo: numeroCartao};
    let url = `http://localhost:3000/compra/${numeroCartao}` //post

    let res = axios.post(url, objServico)
    .then(response => {
      if (response.data) {
        const msg = new Comunicado (response.data.codigo, 
                                    response.data.mensagem, 
                      response.data.descricao);
        alert(msg.get());
      }
    })
    .catch(error  =>  {
      
      if (error.response) {
        const msg = new Comunicado (error.response.data.codigo, 
                                    error.response.data.mensagem, 
                      error.response.data.descricao);
        alert(msg.get());
      }
    })
  }
}
*/

function Comunicado (codigo,mensagem,descricao)
{
	this.codigo    = codigo;
	this.mensagem  = mensagem;
	this.descricao = descricao;
	
	this.get = function ()
	{
		return (this.codigo   + " - " + 
		        this.mensagem + " - " +
			    this.descricao);

	}
}


document.addEventListener('DOMContentLoaded', function () {
  const listaDeServicos = []; 
  
  document.querySelectorAll('#listaServicos button').forEach(function(button) {
    button.addEventListener('click', function() {
      var campoNumeroCartao = document.getElementById("campoNumeroCartao");
      var numeroCartao = campoNumeroCartao.value;
      if(campoNumeroCartao.required && (numeroCartao == null || numeroCartao == ''))
      {
          alert("Preencha o número do cartão antes de comprar um serviço!");
      }else
      {
        const idServico = button.getAttribute('idDoServico');
        inserirServicoNaLista(idServico);
      }
    });
  });

  function inserirServicoNaLista(idServico) {
    listaDeServicos.push(idServico);
    console.log('Serviços selecionados:', listaDeServicos);
  }


  

  function finalizarCompra(listaServicos) {

    var numeroCartao = document.getElementById("campoNumeroCartao").value;
    //fazer um for each e pra cada elemento, inserir no banco como id do cartao e id do servico
    
    /*
      let objServico = { codigo: numeroCartao};
      let url = `http://localhost:3000/compra/` //post
  
      let res = axios.post(url, objServico)
      .then(response => {
        if (response.data) {
          const msg = new Comunicado (response.data.codigo, 
                                      response.data.mensagem, 
                        response.data.descricao);
          alert(msg.get());
        }
      })
      .catch(error  =>  {
        
        if (error.response) {
          const msg = new Comunicado (error.response.data.codigo, 
                                      error.response.data.mensagem, 
                        error.response.data.descricao);
          alert(msg.get());
        }
      })
      */
    console.log('Compra finalizada com os seguintes serviços:', listaServicos);
  }

  const btnFinalizar = document.getElementById('bntFinalizar');
  btnFinalizar.addEventListener('click', function() {
    finalizarCompra(listaDeServicos);
  });
});