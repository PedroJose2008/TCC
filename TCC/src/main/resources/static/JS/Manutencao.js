const API_OS_LISTAR = 'http://localhost:8000/ordens/listartodos';
const API_OS_LISTAR_PECAS = 'http://localhost:8000/ordens/listarpecas';
const API_OS_SALVAR = 'http://localhost:8000/ordens/salvar';
const API_OS_ATUALIZAR = 'http://localhost:8000/ordens/atualizar';

const API_PECAS_LISTAR = 'http://localhost:8000/pecas/listartodos';

const API_OS_VINCULAR = 'http://localhost:8000/ordens/vincularpeca'; 
const API_OS_DESVINCULAR = 'http://localhost:8000/ordens/desvincularpeca'; 

let osSelecionadaParaPecasId = null;

document.addEventListener("DOMContentLoaded", () => {
    listarOrdensManutencao();
});

async function carregarPecasNoSelect() {
    const response = await fetch(API_PECAS_LISTAR);
    const pecas = await response.json();
    const select = document.getElementById("selectPecas");
    if (!select) return;
    
    select.innerHTML = '<option value="" disabled selected>-- Selecione Peças do Kit --</option>';
    pecas.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        let localizacao = p.prateleira ? ` | Prat: ${p.prateleira}` : '';
        option.text = `${p.nome} (Cod: ${p.codigo}${localizacao})`;
        select.appendChild(option);
    });
}

async function listarOrdensManutencao() {
    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();
    
    const tbody = document.getElementById("listaOrdensServico");
    if (!tbody) return;
    tbody.innerHTML = "";

    ordens.forEach(os => {
        // Padrão do Professor Ajustado: Filtra apenas quem realmente deve estar na manutenção
        if (os.status === "ABERTA" || os.status === "EM_MANUTENCAO") {
            const tr = document.createElement("tr");
            const dataFormatada = os.dataCadastro ? os.dataCadastro.split('-').reverse().join('/') : "-";
            const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "-";
            const nomeMecanico = os.usuario ? os.usuario.nome : "-";
            const nomeKit = os.kit ? os.kit.nome : "-";
            
            // Define o texto da tag dinamicamente dependendo do status real do banco
            const textoStatus = os.status === "ABERTA" ? "Aberta" : "Em Manutenção";
            const classeBadge = os.status === "ABERTA" ? "badge-gray" : "badge-blue"; // ajuste as classes se necessário

            tr.innerHTML = `
                <td><strong>#OS-${os.id}</strong></td>
                <td id="os-cliente-${os.id}">${nomeCliente}</td>
                <td>${nomeMecanico}</td>
                <td>${nomeKit}</td>
                <td>${dataFormatada}</td>
                <td><span class="${classeBadge}">${textoStatus}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-pecas-os" onclick="abrirModalPecas(${os.id})">🧩 Peças da OS</button> 
                        <button class="btn-success" onclick="concluirManutencao(${os.id})">Concluir Manutenção</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        }
    });

    // Se a tabela ficar vazia, adiciona uma mensagem amigável para o usuário
    if (tbody.innerHTML === "") {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:gray; padding:20px;">Nenhuma ordem de serviço em manutenção no momento.</td></tr>`;
    }
}

async function concluirManutencao(idOS) {
    if (!confirm("Deseja realmente concluir a manutenção desta OS?")) return;

    // Padrão do professor: monta um objeto simples com o novo status em texto
    const os = {
        status: "AGUARDANDO_RETIRADA"
    };

    // Faz o PUT para o controller
    await fetch(`${API_OS_ATUALIZAR}/${idOS}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(os)
    });

    // Recarrega a lista (a OS com status novo vai sumir por causa do IF do filtro)
    listarOrdensManutencao();
}
async function abrirModalPecas(idOS) {
    osSelecionadaParaPecasId = idOS;
    const nomeCliente = document.getElementById(`os-cliente-${idOS}`).innerText;
    document.getElementById('modalTitle').innerText = `Componentes da OS #OS-${idOS}`;
    document.getElementById('modalSubtitle').innerText = `Cliente: ${nomeCliente}`;
    
    await carregarPecasNoSelect();
    await renderizarPecasDaOS();
    
    document.getElementById('modalPecas').classList.add('active');
}

function fecharModalPecas() {
    document.getElementById('modalPecas').classList.remove('active');
    osSelecionadaParaPecasId = null;
}

// Nova função auxiliar para somar preços e atualizar o campo 'valor' no Banco
async function atualizarValorTotalOS() {
    const responsePecas = await fetch(`${API_OS_LISTAR_PECAS}/${osSelecionadaParaPecasId}`);
    const pecasDaOS = await responsePecas.json();

    let valorTotal = 0;
    pecasDaOS.forEach(peca => {
        valorTotal += peca.preco ? parseFloat(peca.preco) : 0;
    });

    const responseOS = await fetch(API_OS_LISTAR);
    const ordens = await responseOS.json();
    const os = ordens.find(o => o.id === osSelecionadaParaPecasId);

    os.valor = valorTotal;

    await fetch(`${API_OS_ATUALIZAR}/${osSelecionadaParaPecasId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(os)
    });
}

async function renderizarPecasDaOS() {
    const listaTbody = document.getElementById('listaPecasKit');
    if (!listaTbody) return;
    listaTbody.innerHTML = '';

    const response = await fetch(`${API_OS_LISTAR_PECAS}/${osSelecionadaParaPecasId}`);
    const pecasDaOS = await response.json();

    pecasDaOS.forEach(peca => {
        const tr = document.createElement("tr");
        const precoFormatado = peca.preco ? parseFloat(peca.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00";
        
        tr.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${peca.codigo}</td>
            <td style="text-align:left;">${peca.nome} <small style="color: var(--success); font-weight:bold;">(${precoFormatado})</small></td>
            <td style="text-align: right;">
              <button class="btn btn-danger btn-sm" onclick="removerPecaDaOS(${peca.id})">Remover</button>
            </td>
        `;
        listaTbody.appendChild(tr);
    });
}

async function adicionarPecaAoKit() {
    const selectPecas = document.getElementById('selectPecas');
    const pecaId = selectPecas.value;

    if (!pecaId) {
        alert("Por favor, selecione uma peça válida do estoque.");
        return;
    }

    await fetch(`${API_OS_VINCULAR}/${osSelecionadaParaPecasId}/${pecaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) 
    });

    selectPecas.value = "";
    
    await atualizarValorTotalOS();
    renderizarPecasDaOS();
}

async function removerPecaDaOS(pecaId) {
    if (!confirm("Deseja desvincular este componente da OS?")) return;
    
    await fetch(`${API_OS_DESVINCULAR}/${osSelecionadaParaPecasId}/${pecaId}`, {
        method: "DELETE"
    });
    
    await atualizarValorTotalOS();
    renderizarPecasDaOS();
}