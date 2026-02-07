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

// Salvar no localStorage
function salvarNoHistorico(dados) {
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    
    // add novos itens no historico
    historico.unshift({
        cep: dados.cep,
        endereco: `${dados.logradouro}, ${dados.bairro} - ${dados.localidade}/${dados.uf}`,
        data: new Date().toLocaleString()
    });
    
    // add limite de 10 itens 
    if (historico.length > 10) {
        historico = historico.slice(0, 10);
    }
    
    localStorage.setItem('historico', JSON.stringify(historico));
    mostrarHistorico();
}
// mostrar o historico
function mostrarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    
    if (historico.length === 0) {
        lista.innerHTML = '<p>Nenhuma consulta salva</p>';
        return;
    }
    
    lista.innerHTML = historico.map((item, index) => `
        <div class="item">
            <p class="cep">${item.cep}</p>
            <p>${item.endereco}</p>
            <p style="font-size: 0.8rem; color: #888;">${item.data}</p>
            <button onclick="deletarItem(${index})">Deletar</button>
        </div>
    `).join('');
}
// deletar itens do historico
function deletarItem(index) {
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.splice(index, 1);
    localStorage.setItem('historico', JSON.stringify(historico));
    mostrarHistorico();
}
// limpar tudo do historico
function limparHistorico() {
    if (confirm('Deseja limpar todo o histórico?')) {
        localStorage.removeItem('historico');
        mostrarHistorico();
    }
}
// eventos
buscarBtn.addEventListener('click', buscarCEP);
limparBtn.addEventListener('click', limparHistorico);

cepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarCEP();
    }
});
mostrarHistorico();