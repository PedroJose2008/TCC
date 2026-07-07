const API_KITS_LISTAR = 'http://localhost:8001/kits/listartodos';
const API_KITS_BUSCAR_ID = 'http://localhost:8001/kits/listarporid';
const API_KITS_SALVAR = 'http://localhost:8001/kits/salvar';
const API_KITS_ATUALIZAR = 'http://localhost:8001/kits/atualizar';
const API_KITS_DELETAR = 'http://localhost:8001/kits/deletar';
const API_KITS_BUSCAR_NOME = 'http://localhost:8001/kits/buscarpornome';

const API_CLIENTES_LISTAR = 'http://localhost:8001/clientes/listartodos';
const API_PECAS_LISTAR = 'http://localhost:8001/pecas/listartodos';

const API_KITS_LISTAR_PECAS = 'http://localhost:8001/kits/listarpecas'; 
const API_KITS_VINCULAR = 'http://localhost:8001/kits/vincularpeca'; 
const API_KITS_DESVINCULAR = 'http://localhost:8001/kits/desvincularpeca'; 

let editandoKitId = null;
let kitSelecionadoParaPecasId = null;

async function carregarClientesNoSelect() {
    const response = await fetch(API_CLIENTES_LISTAR);
    const clientes = await response.json();
    const select = document.getElementById("kitCliente");
    if (!select) return;
    
    select.innerHTML = '<option value="" disabled selected>-- Escolha um Cliente --</option>';
    clientes.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.text = c.razaoSocial || c.nome;
        select.appendChild(option);
    });
}

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

async function listarKits() {
    const response = await fetch(API_KITS_LISTAR);
    const kits = await response.json();
    
    const tbody = document.getElementById("tabelaKits");
    tbody.innerHTML = "";

    kits.forEach(k => {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
            <td><strong>#${k.codigo}</strong></td>
            <td id="kit-nome-${k.id}">${k.nome}</td>
            <td><span style="color:#1a2340; font-weight:600;">${k.prateleira || '-'}</span></td>
			<td>${k.numero}</td>

            <td>${k.cliente ? k.cliente.razaoSocial : '-'}</td>
            <td>
                <button class="btn btn-accent btn-sm" onclick="abrirModalPecas(${k.id}, '${k.codigo}')">🧩 Peças do Kit</button> 
                <button class="btn btn-warning btn-sm" onclick="editarKit(${k.id})">Editar</button> 
                <button class="btn btn-danger btn-sm" onclick="deletarKit(${k.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function abrirModalCadastroKit() {
    editandoKitId = null;
    document.getElementById("kitForm").reset();
    document.getElementById("formModalTitle").innerText = "Cadastrar Novo Kit";
    
    await carregarClientesNoSelect();

    const modal = new bootstrap.Modal(document.getElementById("modalKitForm"));
    modal.show();
}

function fecharModalCadastroKit() {
    const modalElement = document.getElementById("modalKitForm");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
}

async function editarKit(id) {
    await carregarClientesNoSelect();

    const response = await fetch(`${API_KITS_BUSCAR_ID}/${id}`);
    const k = await response.json();

    editandoKitId = id;
    document.getElementById("formModalTitle").innerText = "Editar Estrutura do Kit";
    document.getElementById("kitCodigo").value = k.codigo || "";
    document.getElementById("kitNome").value = k.nome || "";
    document.getElementById("kitPrateleira").value = k.prateleira || "";
    
    if (k.cliente && k.cliente.id) {
        document.getElementById("kitCliente").value = k.cliente.id;
    } else {
        document.getElementById("kitCliente").value = k.idCliente || "";
    }

    const modal = new bootstrap.Modal(document.getElementById("modalKitForm"));
    modal.show();
}

async function salvarKit() {
    const kit = {
        codigo: document.getElementById("kitCodigo").value,
        nome: document.getElementById("kitNome").value,
        prateleira: document.getElementById("kitPrateleira").value,
        cliente: {
            id: document.getElementById("kitCliente").value
        }
    };

    if (editandoKitId) {
        await fetch(`${API_KITS_ATUALIZAR}/${editandoKitId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kit)
        });
    } else {
        await fetch(API_KITS_SALVAR, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kit)
        });
    }

    fecharModalCadastroKit();
    listarKits();
}

async function deletarKit(id) {
    if (!confirm("Deseja realmente excluir este Kit do sistema?")) return;
    
    await fetch(`${API_KITS_DELETAR}/${id}`, { 
        method: "DELETE" 
    });
    listarKits();
}

async function abrirModalPecas(idKit, codigoKit) {
    kitSelecionadoParaPecasId = idKit;
    const nomeKit = document.getElementById(`kit-nome-${idKit}`).innerText;
    document.getElementById('modalTitle').innerText = `Componentes do ${nomeKit}`;
    document.getElementById('modalSubtitle').innerText = `Código Identificador: #${codigoKit}`;
    
    await carregarPecasNoSelect();
    await renderizarPecasDoKit();
    
    const modal = new bootstrap.Modal(document.getElementById('modalPecas'));
    modal.show();
}

function fecharModalPecas() {
    const modalElement = document.getElementById('modalPecas');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
    kitSelecionadoParaPecasId = null;
}

async function renderizarPecasDoKit() {
    const listaTbody = document.getElementById('listaPecasKit');
    listaTbody.innerHTML = '';

    const response = await fetch(`${API_KITS_LISTAR_PECAS}/${kitSelecionadoParaPecasId}`);
    const pecasDoKit = await response.json();

    pecasDoKit.forEach(peca => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${peca.codigo}</td>
            <td style="text-align:left;">${peca.nome}</td>
            <td style="text-align: right;">
              <button class="btn btn-danger btn-sm" onclick="removerPecaDoKit(${peca.id})">Remover</button>
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

    await fetch(`${API_KITS_VINCULAR}/${kitSelecionadoParaPecasId}/${pecaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) 
    });

    selectPecas.value = "";
    renderizarPecasDoKit();
}

async function removerPecaDoKit(pecaId) {
    if (!confirm("Deseja desvincular este componente do Kit?")) return;
    
    await fetch(`${API_KITS_DESVINCULAR}/${kitSelecionadoParaPecasId}/${pecaId}`, {
        method: "DELETE"
    });
    renderizarPecasDoKit();
}

async function buscarKitPorNome() {
    const nomeBusca = document.getElementById("buscaKitNome").value;

    if (!nomeBusca) {
        listarKits();
        return;
    }

    const response = await fetch(`${API_KITS_BUSCAR_NOME}/${nomeBusca}`);
    const kits = await response.json();
    
    const tbody = document.getElementById("tabelaKits");
    tbody.innerHTML = "";

    kits.forEach(k => {
        const tr = document.createElement("tr");
        let razaoSocialCliente = "-";
        if (k.cliente && k.cliente.razaoSocial) {
            razaoSocialCliente = k.cliente.razaoSocial;
        }

        tr.innerHTML = `
            <td><strong>#${k.codigo}</strong></td>
            <td id="kit-nome-${k.id}">${k.nome}</td>
            <td><span class="badge">${k.prateleira || '-'}</span></td>
            <td>${razaoSocialCliente}</td>
            <td>
                <button class="btn btn-accent btn-sm" onclick="abrirModalPecas(${k.id}, '${k.codigo}')">🧩 Peças do Kit</button> 
                <button class="btn btn-warning btn-sm" onclick="editarKit(${k.id})">Editar</button> 
                <button class="btn btn-danger btn-sm" onclick="deletarKit(${k.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function limparBuscaKit() {
    document.getElementById("buscaKitNome").value = "";
    listarKits();
}

listarKits();