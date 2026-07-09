const API_OS_LISTAR = 'http://localhost:8001/ordens/listartodos';
const API_OS_LISTAR_PECAS = 'http://localhost:8001/ordens/listarpecas';
const API_OS_SALVAR = 'http://localhost:8001/ordens/salvar';
const API_OS_ATUALIZAR = 'http://localhost:8001/ordens/atualizar';
const API_PECAS_LISTAR = 'http://localhost:8001/pecas/listartodos';
const API_OS_VINCULAR = 'http://localhost:8001/ordens/vincularpeca'; 
const API_OS_DESVINCULAR = 'http://localhost:8001/ordens/desvincularpeca'; 
const API_KITS_LISTAR = 'http://localhost:8001/kits/listartodos'; 

let osSelecionadaParaPecasId = null;

async function carregarPecasNoSelect() {
    const response = await fetch(API_PECAS_LISTAR);
    const pecas = await response.json();
    const select = document.getElementById("selectPecas");
    
    select.innerHTML = '<option value="" disabled selected>-- Selecione Peças do Kit --</option>';
    
    pecas.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.text = p.nome;
        select.appendChild(option);
    });
}

async function buscarOSPorId(idOS) {
    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();
    return ordens.find(os => os.id === idOS);
}


async function listarOrdensManutencao() {
    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();
    const tbody = document.getElementById("listaOrdensServico");
    tbody.innerHTML = "-";

    
	// filtra apara eixar so as orders aberta ou em manutecao 
    const ordensAtivas = ordens.filter(os => os.status === "ABERTA" || os.status === "EM_MANUTENCAO");

    ordensAtivas.forEach(os => {
        const tr = document.createElement("tr");
        
		// usa o split para deixar a data no padrao brasileiro
        const dataFormatada = os.dataCadastro.split('-').reverse().join('/');
        const nomeCliente = os.cliente.razaoSocial;
        const nomeMecanico = os.usuario.nome;
        const nomeKit = os.kit.nome;

        const classesStatus = {
            "ABERTA": "badge-gray",
            "EM_MANUTENCAO": "badge-blue"
        };
        const classeAplicada = classesStatus[os.status];
				
        tr.innerHTML = `
            <td><strong>#OS-${os.id}</strong></td>
            <td id="os-cliente-${os.id}">${nomeCliente}</td>
            <td>${nomeMecanico}</td>
            <td>${nomeKit}</td>
            <td>${dataFormatada}</td>
            <td><span class="${classeAplicada}">${os.status}</span></td>
            <td>
                <div class="actions-cell">
                    <button class="btn-pecas-os" onclick="abrirModalPecas(${os.id})">🧩 Peças da OS</button> 
                    <button class="btn-success" onclick="concluirManutencao(${os.id})">Concluir Manutenção</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function concluirManutencao(idOS) {
    if (!confirm("Deseja realmente concluir a manutenção desta OS?")) return;

    await fetch(API_OS_ATUALIZAR + "/" + idOS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idOS, status: "AGUARDANDO_RETIRADA" })
    });

    listarOrdensManutencao();
}

async function abrirModalPecas(idOS) {
    osSelecionadaParaPecasId = idOS;
    
    await fetch(API_OS_ATUALIZAR + "/" + idOS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idOS, status: "EM_MANUTENCAO" })
    });
    
    listarOrdensManutencao(); 
    const osAtual = await buscarOSPorId(idOS); 

    const nomeCliente = document.getElementById("os-cliente-" + idOS).innerText;
    document.getElementById('modalTitle').innerText = "Componentes da OS #OS-" + idOS;
    document.getElementById('modalSubtitle').innerText = "Cliente: " + nomeCliente;
    document.getElementById("txtDescricaoOS").value = osAtual.descricao;
    
    await carregarPecasNoSelect();
    await renderizarPecasOriginaisDoKit(osAtual.kit);
    await renderizarPecasDaOS();

    const modal = new bootstrap.Modal(document.getElementById('modalPecas'));
    modal.show();
}

function fecharModalPecas() {
    const modalElement = document.getElementById('modalPecas');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    osSelecionadaParaPecasId = null;
}

async function renderizarPecasOriginaisDoKit(kitObj) {
    const tbodyOriginais = document.getElementById("listaPecasOriginaisKit");
    tbodyOriginais.innerHTML = "-";

    const response = await fetch(API_KITS_LISTAR);
    const kits = await response.json();
    const kitCompleto = kits.find(k => k.id === kitObj.id);

    kitCompleto.pecas.forEach(peca => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${peca.codigo}</td>
            <td>${peca.nome}</td>
        `;
        tbodyOriginais.appendChild(tr);
    });
}

async function salvarDescricaoOS() {
    const textoDescricao = document.getElementById("txtDescricaoOS").value;

    await fetch(API_OS_ATUALIZAR + "/" + osSelecionadaParaPecasId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: osSelecionadaParaPecasId, descricao: textoDescricao })
    });

    alert("Relatório da OS updated com sucesso!");
}

async function atualizarValorTotalOS() {
    const responsePecas = await fetch(API_OS_LISTAR_PECAS + "/" + osSelecionadaParaPecasId);
    const pecasDaOS = await responsePecas.json();

    let valorTotal = 0;
    pecasDaOS.forEach(peca => {
        // Uso necessário do String/replace para tratar strings numéricas vindas do banco antes de somar
        let precoTexto = String(peca.preco).replace(',', '.').trim();
        valorTotal += parseFloat(precoTexto);
    });

   
	// usa o tofixed para n deixar enviar dizimas periodicas
    let valorFormatado = parseFloat(valorTotal.toFixed(2));

    await fetch(API_OS_ATUALIZAR + "/" + osSelecionadaParaPecasId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: osSelecionadaParaPecasId, valor: valorFormatado })
    });
}

async function renderizarPecasDaOS() {
    const listaTbody = document.getElementById('listaPecasKit');
    listaTbody.innerHTML = "-";

    const response = await fetch(API_OS_LISTAR_PECAS + "/" + osSelecionadaParaPecasId);
    const pecasDaOS = await response.json();

    pecasDaOS.forEach(peca => {
        const tr = document.createElement("tr");
        
        // Uso necessário das funções de conversão para exibir a moeda formatada na listagem de peças vinculadas
        const precoNum = parseFloat(String(peca.preco).replace(',', '.'));
        const precoFormatado = precoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        tr.innerHTML = `
            <td>${peca.codigo}</td>
            <td>${peca.nome} (${precoFormatado})</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="removerPecaDaOS(${peca.id})">Remover</button>
            </td>
        `;
        listaTbody.appendChild(tr);
    });
}

async function adicionarPecaAoKit() {
    const selectPecas = document.getElementById('selectPecas');
    const pecaId = selectPecas.value;

    await fetch(API_OS_VINCULAR + "/" + osSelecionadaParaPecasId + "/" + pecaId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) 
    });

    selectPecas.value = "-";
    await atualizarValorTotalOS();
    renderizarPecasDaOS();
}

async function removerPecaDaOS(pecaId) {
    if (!confirm("Deseja desvincular este componente da OS?")) return;
    
    await fetch(API_OS_DESVINCULAR + "/" + osSelecionadaParaPecasId + "/" + pecaId, {
        method: "DELETE"
    });
    
    await atualizarValorTotalOS();
    renderizarPecasDaOS();
}

listarOrdensManutencao();