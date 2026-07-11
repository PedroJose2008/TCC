const API_LISTAR_OS       = "http://192.168.10.22:8013/ordens/listartodos";
const API_SALVAR_OS       = "http://192.168.10.22:8013/ordens/salvar";
const API_LISTAR_CLIENTES = "http://192.168.10.22:8013/clientes/listartodos";
const API_LISTAR_KITS     = "http://192.168.10.22:8013/kits/listartodos";
const API_LISTAR_USUARIOS = "http://192.168.10.22:8013/usuarios/listartodos";

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

	// data no padrao
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
        const tr = document.createElement("tr");

        const dataExibicao = os.dataCadastro.split('-').reverse().join('/');
        const textoCliente = os.cliente.razaoSocial;
        
        // css de Status 
        const classesStatus = {
            "ABERTA": "badge-gray",
            "EM_MANUTENCAO": "badge-blue",
            "AGUARDANDO_RETIRADA": "badge-yellow",
            "FINALIZADA": "badge-green"
        };
        const classeAplicada = classesStatus[os.status];

        tr.innerHTML = `
            <td><strong>#OS-${os.id}</strong></td>
            <td>${textoCliente}</td>
            <td>${os.kit.nome}</td>
            <td>${os.usuario.nome}</td>
            <td>${os.pagamento}</td>
            <td><span class="${classeAplicada}">${os.status}</span></td>
            <td>${dataExibicao}</td>
            <td>
                <button class="btn btn-ghost" onclick="verRelatorioOS(${os.id})">📋 Ver Resumo</button>
            </td>
        `;
        
        corpoTabela.appendChild(tr);
    });
}


// peguei o chat para me ajudara fazer esse relatorio
async function verRelatorioOS(idOS) {
    const resposta = await fetch(API_LISTAR_OS);
    const ordens = await resposta.json();
    
    const osObj = ordens.find(o => o.id === idOS);

    document.getElementById('resumoTitulo').innerText = "ORDEM DE SERVIÇO #OS-" + osObj.id;
    document.getElementById('resumoCliente').innerText = osObj.cliente.razaoSocial;
    document.getElementById('resumoKit').innerText = osObj.kit.nome;
    document.getElementById('resumoMecanico').innerText = osObj.usuario.nome;
    document.getElementById('resumoPagamento').innerText = osObj.pagamento;
    document.getElementById('resumoStatus').innerText = osObj.status;
    
    
    let descricaoTexto = "Nenhuma descrição informada.";
    if (osObj.descricao && osObj.descricao.trim() !== "") {
        descricaoTexto = osObj.descricao;
    }
    document.getElementById('resumoDescricao').innerText = descricaoTexto;
    
    
    document.getElementById('resumoAbertura').innerText = osObj.dataCadastro.split('-').reverse().join('/');
    
    const stringData = String(osObj.dataFinalizacao);
    const chaveData = String(stringData.includes("-"));
    
    const dicionarioData = {
        "true": stringData.split('-').reverse().join('/'),
        "false": "Em andamento..."
    };
    
    document.getElementById('resumoFinalizacao').innerText = dicionarioData[chaveData];

    const respostaPecas = await fetch('http://localhost:8001/ordens/listarpecas/' + idOS);
    const pecasTrocadas = await respostaPecas.json();
    
    const tabelaPecas = document.getElementById('resumoListaPecas');
    tabelaPecas.innerHTML = "";

    let somaTotalDoServico = 0;

    pecasTrocadas.forEach(peca => {
        const tr = document.createElement("tr");
        
        const precoLimpo = String(peca.preco).replace('R$', '').replace('.', '').replace(',', '.').trim();
        
        const chavePreco = String(isNaN(parseFloat(precoLimpo)));
        const dicionarioPreco = {
            "true": 0,
            "false": parseFloat(precoLimpo)
        };
        
        const precoNum = dicionarioPreco[chavePreco];
        
        somaTotalDoServico += precoNum;

        const precoPecaFormatado = precoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        tr.innerHTML = `
            <td style="text-align: left; padding: 6px;">${peca.codigo}</td>
            <td style="text-align: left; padding: 6px;">${peca.nome}</td>
            <td style="text-align: right; padding: 6px;">${precoPecaFormatado}</td>
        `;
        tabelaPecas.appendChild(tr);
    });

    document.getElementById('resumoValorTotal').innerText = somaTotalDoServico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const modalResumo = new bootstrap.Modal(document.getElementById('modalRelatorioOS'));
    modalResumo.show();
}


let modalRelatorioInstancia = null;
function fecharModalRelatorio() {
    const modalElement = document.getElementById('modalRelatorioOS');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
	
	
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
	
	if (document.activeElement && modalElement.contains(document.activeElement)) {
	        document.activeElement.blur(); 
	    }
	
}

function fecharModalRelatorio() {
    const modalElement = document.getElementById("modalRelatorioOS");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
	
	if (document.activeElement && modalElement.contains(document.activeElement)) {
	        document.activeElement.blur(); 
	    }
	
}