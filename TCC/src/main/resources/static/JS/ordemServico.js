const API_OS_LISTAR = 'http://localhost:8001/ordens/listartodos';
const API_OS_SALVAR = 'http://localhost:8001/ordens/salvar';
const API_CLIENTES_LISTAR = 'http://localhost:8001/clientes/listartodos';

document.addEventListener("DOMContentLoaded", () => {
    listarOrdensServico();
});

function abrirModal() {
    const modalElement = document.getElementById("modalOS");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function abrirModalCadastro() {
    limparFormulario();
    carregarClientesSelect();
    abrirModal();
}

function fecharModal() {
    const modalElement = document.getElementById("modalOS");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
    limparFormulario();
}

function fecharModalRelatorio() {
    const modalElement = document.getElementById("modalRelatorioOS");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
}

function limparFormulario() {
    document.getElementById("formOS").reset();
    document.getElementById("codigo").value = "";
}

async function carregarClientesSelect() {
    let res = await fetch(API_CLIENTES_LISTAR);
    let dados = await res.json();
    let select = document.getElementById("idCliente");
    
    select.innerHTML = '<option value="" disabled selected hidden>Selecione o cliente...</option>';

    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.text = dado.razaoSocial || dado.nome;
        select.appendChild(option);
    });
}

async function listarOrdensServico() {
    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();
    const tbody = document.getElementById("tabelaOS");
    
    tbody.innerHTML = "";

    if (ordens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text3); padding:20px;">Nenhuma Ordem de Serviço ativa.</td></tr>`;
        return;
    }

    ordens.forEach(os => {
        // Se a API não mandar data, gera a data de hoje automaticamente no formato DD/MM/AAAA
        let dataFormatada = "-";
        if (os.dataCadastro) {
            dataFormatada = os.dataCadastro.split('-').reverse().join('/');
        } else {
            const hoje = new Date();
            dataFormatada = hoje.toLocaleDateString('pt-BR');
        }

        const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
        const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";
        
        // Mantém a estrutura de crachás coloridos conforme o status
        let statusHTML = "";
        if (os.status === "Aberto" || os.status === "ABERTA") {
            statusHTML = `<span class="badge" style="background:#ffeeba; color:#856404; padding:4px 10px; border-radius:20px;">Aberto</span>`;
        } else {
            statusHTML = `<span class="badge" style="background:rgba(59,111,245,.1); color:#3b6ff5; padding:4px 10px; border-radius:20px;">${os.status || 'Aberto'}</span>`;
        }

        tbody.innerHTML += `
            <tr>
                <td><strong>#OS-${os.id}</strong></td>
                <td>${nomeCliente}</td>
                <td>${nomeKit}</td>
                <td>${statusHTML}</td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 11px;" onclick="verRelatorioOS(${os.id})">📋 Ver Resumo</button>
                </td>
            </tr>
        `;
    });
}

async function salvarNovaOS() {
    const ordemServico = {
        cliente: { id: document.getElementById("idCliente").value },
        equipamento: document.getElementById("equipamento").value,
        descricao: document.getElementById("descricao").value,
        status: document.getElementById("status").value,
        valor: parseFloat(document.getElementById("valor").value) || 0.00
    };

    await fetch(API_OS_SALVAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordemServico)
    });

    fecharModal();
    await listarOrdensServico();
}

async function verRelatorioOS(idOS) {
    const resOS = await fetch(API_OS_LISTAR);
    const ordens = await resOS.json();
    const os = ordens.find(o => o.id === idOS);

    const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
    const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";
    const valorCalculado = os.valor ? parseFloat(os.valor) : 0;
    
    let dataFormatada = "-";
    if (os.dataCadastro) {
        dataFormatada = os.dataCadastro.split('-').reverse().join('/');
    } else {
        const hoje = new Date();
        dataFormatada = hoje.toLocaleDateString('pt-BR');
    }

    const containerRelatorio = document.getElementById("corpoRelatorio");
    containerRelatorio.innerHTML = `
        <div style="border-bottom: 2px dashed var(--border); padding-bottom: 12px; margin-bottom: 12px; text-align: center;">
            <h4 style="font-family:'Syne',sans-serif; font-size: 16px; margin: 0;">ORDEM DE SERVIÇO #OS-${os.id}</h4>
        </div>
        <p style="margin-bottom: 6px;"><strong>Cliente:</strong> ${nomeCliente}</p>
        <p style="margin-bottom: 6px;"><strong>Kit Vinculado:</strong> ${nomeKit}</p>
        <p style="margin-bottom: 6px;"><strong>Equipamento / Veículo:</strong> ${os.equipamento || "-"}</p>
        <p style="margin-bottom: 6px;"><strong>Descrição do Defeito:</strong> ${os.descricao || "-"}</p>
        <p style="margin-bottom: 6px;"><strong>Status Atual:</strong> ${os.status || "Aberto"}</p>
        
        <div style="margin-top: 16px; text-align: right; font-size: 16px;">
            <strong>Preço Mão de Obra:</strong> 
            <span style="color: var(--success); font-weight: 800; margin-left: 6px;">
                R$ ${valorCalculado.toFixed(2).replace('.', ',')}
            </span>
        </div>
        <div style="text-align: right; font-size: 14px; margin-top: 4px; color: var(--text2);">
            <strong>Data de Abertura:</strong> ${dataFormatada}
        </div>
    `;

    const modalElement = document.getElementById("modalRelatorioOS");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function buscarPorDescricao() {
    const termo = document.getElementById("filtroDescricao").value.toLowerCase().trim();
    
    if (termo === "") {
        listarOrdensServico();
        return;
    }

    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();
    const tbody = document.getElementById("tabelaOS");
    
    tbody.innerHTML = "";

    ordens.forEach(os => {
        const descricaoOS = os.descricao ? os.descricao.toLowerCase() : "";
        
        if (descricaoOS.includes(termo)) {
            let dataFormatada = "-";
            if (os.dataCadastro) {
                dataFormatada = os.dataCadastro.split('-').reverse().join('/');
            } else {
                const hoje = new Date();
                dataFormatada = hoje.toLocaleDateString('pt-BR');
            }

            const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
            const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";
            
            let statusHTML = `<span class="badge">${os.status || 'Aberto'}</span>`;

            tbody.innerHTML += `
                <tr>
                    <td><strong>#OS-${os.id}</strong></td>
                    <td>${nomeCliente}</td>
                    <td>${nomeKit}</td>
                    <td>${statusHTML}</td>
                    <td>${dataFormatada}</td>
                    <td>
                        <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 11px;" onclick="verRelatorioOS(${os.id})">📋 Ver Resumo</button>
                    </td>
                </tr>
            `;
        }
    });
}