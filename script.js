// const que vao ser manipuladas pelo js
const cepInput = document.getElementById('cepInput');
const buscarBtn = document.getElementById('buscarBtn');
const limparBtn = document.getElementById('limparBtn');
const resultado = document.getElementById('resultado');
const lista = document.getElementById('lista');

// puxando da api
async function buscarCEP() {
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('Digite um CEP válido com 8 números!');
        return;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        
        if (dados.erro) {
            alert('CEP não encontrado!');
            return;
        }
        
        mostrarResultado(dados);
        salvarNoHistorico(dados);
        
    } catch (erro) {
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

// formatando o html para mostrar os dados da api
function mostrarResultado(dados) {
    resultado.innerHTML = `
        <p><strong>CEP:</strong> ${dados.cep}</p>
        <p><strong>Rua:</strong> ${dados.logradouro || '-'}</p>
        <p><strong>Bairro:</strong> ${dados.bairro || '-'}</p>
        <p><strong>Cidade:</strong> ${dados.localidade}</p>
        <p><strong>Estado:</strong> ${dados.uf}</p>
    `;
    resultado.classList.remove('hidden');
}

