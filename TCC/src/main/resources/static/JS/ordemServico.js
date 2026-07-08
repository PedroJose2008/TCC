const API_LISTAR_OS       = "http://localhost:8001/ordens/listartodos";
const API_SALVAR_OS       = "http://localhost:8001/ordens/salvar";
const API_LISTAR_CLIENTES = "http://localhost:8001/clientes/listartodos";
const API_LISTAR_KITS     = "http://localhost:8001/kits/listartodos";
const API_LISTAR_USUARIOS = "http://localhost:8001/usuarios/listartodos";

window.onload = function() {
    atualizarDados();
};

async function atualizarDados() {
    await carregarClientes();
    await carregarKits();
    await carregarUsuarios();
    await listarOrdens();
}

async function carregarClientes() {
    const resposta = await fetch(API_LISTAR_CLIENTES);
    const clientes = await resposta.json();
    const select = document.getElementById("idCliente");
    
    select.innerHTML = '<option value="" disabled selected hidden>Selecione o cliente...</option>';

    clientes.forEach(function(cliente) {
        const option = document.createElement("option");
        option.value = cliente.id;
        option.text = cliente.nome || cliente.razaoSocial;
        select.appendChild(option);
    });
}

async function carregarKits() {
    const resposta = await fetch(API_LISTAR_KITS);
    const kits = await resposta.json();
    const select = document.getElementById("osKit");
    
    select.innerHTML = '<option value="" disabled selected hidden>Selecione o kit...</option>';

    kits.forEach(function(kit) {
        const option = document.createElement("option");
        option.value = kit.id;
        option.text = kit.nome;
        select.appendChild(option);
    });
}

async function carregarUsuarios() {
    const resposta = await fetch(API_LISTAR_USUARIOS);
    const usuarios = await resposta.json();
    const select = document.getElementById("idMecanico");
    
    select.innerHTML = '<option value="" disabled selected hidden>Selecione o mecânico...</option>';

    usuarios.forEach(function(usuario) {
        const option = document.createElement("option");
        option.value = usuario.id;
        option.text = usuario.nome;
        select.appendChild(option);
    });
}

async function salvarNovaOS() {
    const idCliente = document.getElementById("idCliente").value;
    const idKit = document.getElementById("osKit").value;
    const idMecanico = document.getElementById("idMecanico").value;
    const formaPagamento = document.getElementById("formaPagamento").value;

    const dataAtual = new Date().toISOString().split('T')[0];

    const novaOS = {
        cliente: { id: parseInt(idCliente) },
        kit: { id: parseInt(idKit) },
        usuario: { id: parseInt(idMecanico) },
        pagamento: formaPagamento,
        status: "Aberto",
        dataCadastro: dataAtual,
        valor: 0.00,
        pecas: []
    };

    await fetch(API_SALVAR_OS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaOS)
    });

    fecharModal();
    await listarOrdens();
}

async function listarOrdens() {
    const resposta = await fetch(API_LISTAR_OS);
    const ordens = await resposta.json();
    const corpoTabela = document.getElementById("tabelaOS");
    
    corpoTabela.innerHTML = "";

    ordens.forEach(function(os) {
        const dataExibicao = os.dataCadastro.split('-').reverse().join('/');
        const textoCliente = os.cliente.nome || os.cliente.razaoSocial;
        
        const linha = `
            <tr>
                <td><strong>#OS-${os.id}</strong></td>
                <td>${textoCliente}</td>
                <td>${os.kit.nome}</td>
                <td>${os.usuario.nome}</td>
                <td>${os.pagamento}</td>
                <td><span class="badge">${os.status}</span></td>
                <td>${dataExibicao}</td>
                <td>
                    <button class="btn btn-ghost" onclick="verRelatorioOS(${os.id})">📋 Ver Resumo</button>
                </td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

async function verRelatorioOS(idOS) {
    const resposta = await fetch(API_LISTAR_OS);
    const ordens = await resposta.json();
    
    const osEncontrada = ordens.find(os => os.id === idOS);

    const dataExibicao = osEncontrada.dataCadastro.split('-').reverse().join('/');
    const containerRelatorio = document.getElementById("corpoRelatorio");
    const textoCliente = osEncontrada.cliente.nome || osEncontrada.cliente.razaoSocial;
    
    containerRelatorio.innerHTML = `
        <div>
            <h4>ORDEM DE SERVIÇO #OS-${osEncontrada.id}</h4>
        </div>
        <p><strong>Cliente:</strong> ${textoCliente}</p>
        <p><strong>Kit Vinculado:</strong> ${osEncontrada.kit.nome}</p>
        <p><strong>Mecânico Responsável:</strong> ${osEncontrada.usuario.nome}</p>
        <p><strong>Forma de Pagamento:</strong> ${osEncontrada.pagamento}</p>
        <p><strong>Status Atual:</strong> ${osEncontrada.status}</p>
        <div>
            <strong>Data de Abertura:</strong> ${dataExibicao}
        </div>
    `;

    const modalElement = document.getElementById("modalRelatorioOS");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function buscarPorCliente() {
    // Pega o que foi digitado no campo de texto
    const termo = document.getElementById("filtroCliente").value;
    const resposta = await fetch(API_LISTAR_OS);
    const ordens = await resposta.json();
    const corpoTabela = document.getElementById("tabelaOS");
    
    corpoTabela.innerHTML = "";

    ordens.forEach(function(os) {
        const textoCliente = os.cliente.nome || os.cliente.razaoSocial ;
        
        if (textoCliente.includes(termo)) {
            const dataExibicao = os.dataCadastro.split('-').reverse().join('/');
            
            const linha = `
                <tr>
                    <td><strong>#OS-${os.id}</strong></td>
                    <td>${textoCliente}</td>
                    <td>${os.kit.nome}</td>
                    <td>${os.usuario.nome}</td>
                    <td>${os.pagamento}</td>
                    <td><span class="badge">${os.status}</span></td>
                    <td>${dataExibicao}</td>
                    <td>
                        <button class="btn btn-ghost" onclick="verRelatorioOS(${os.id})">📋 Ver Resumo</button>
                    </td>
                </tr>
            `;
            corpoTabela.innerHTML += linha;
        }
    });
}

function abrirModalCadastro() {
    document.getElementById("formOS").reset();
    document.getElementById("codigo").value = "";
    
    const modalElement = document.getElementById("modalOS");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function fecharModal() {
    const modalElement = document.getElementById("modalOS");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

function fecharModalRelatorio() {
    const modalElement = document.getElementById("modalRelatorioOS");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}