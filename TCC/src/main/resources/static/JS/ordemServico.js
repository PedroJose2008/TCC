const API_OS_LISTAR = 'http://localhost:8001/ordens/listartodos';
const API_OS_LISTAR_PECAS = 'http://localhost:8001/ordens/listarpecas';
const API_OS_SALVAR = 'http://localhost:8001/ordens/salvar';

const API_OS_ATUALIZAR = 'http://localhost:8001/ordens/atualizar';

const API_CLIENTES_LISTAR = 'http://localhost:8001/clientes/listartodos';
const API_KITS_LISTAR = 'http://localhost:8001/kits/listartodos';
const API_MECANICOS_LISTAR = 'http://localhost:8001/usuarios/listartodos';

document.addEventListener("DOMContentLoaded", () => {
    listarOrdensServico();
});

function abrirModalNovaOS() {
    document.getElementById("osForm")?.reset();
    
    carregarClientesSelect();
    carregarKitsSelect();
    carregarMecanicosSelect();

    document.getElementById('modalNovaOS').classList.add('active');
}

function fecharModalNovaOS() {
    document.getElementById('modalNovaOS').classList.remove('active');
}

function fecharModalRelatorio() {
    document.getElementById('modalRelatorioOS').classList.remove('active');
}

async function carregarClientesSelect() {
    let res = await fetch(API_CLIENTES_LISTAR);
    let dados = await res.json();
    let select = document.getElementById("osCliente");
    
    select.innerHTML = '<option value="" disabled selected hidden>-- Selecione o Cliente --</option>';

    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.text = dado.razaoSocial || dado.nome;
        select.appendChild(option);
    });
}

async function carregarKitsSelect() {
    let res = await fetch(API_KITS_LISTAR);
    let dados = await res.json();
    let select = document.getElementById("osKit");

    select.innerHTML = '<option value="" disabled selected hidden>-- Selecione o Kit Base --</option>';

    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.text = dado.nome;
        select.appendChild(option);
    });
}

async function carregarMecanicosSelect() {
    let res = await fetch(API_MECANICOS_LISTAR);
    let dados = await res.json();
    let select = document.getElementById("osUsuario");

    select.innerHTML = '<option value="" disabled selected hidden>-- Selecione o Mecânico --</option>';

    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.text = dado.nome;
        select.appendChild(option);
    });
}


function atualizarStatusParaManutencao(idOS) {
    fetch(`${API_OS_ATUALIZAR}/${idOS}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "EM_MANUTENCAO"
        })
    });
}

async function listarOrdensServico() {
    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();
    const tbody = document.getElementById("listaOrdensServico");
    
    if (ordens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text3); padding:20px;">Nenhuma Ordem de Serviço ativa.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";

    ordens.forEach(os => {
       
        if (os.status === "ABERTA") {
            atualizarStatusParaManutencao(os.id);
            os.status = "EM_MANUTENCAO";
        }

        const dataFormatada = os.dataCadastro ? os.dataCadastro.split('-').reverse().join('/') : "-";
        const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
        const nomeMecanico = os.usuario ? os.usuario.nome : "Não Informado";
        const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";

        let statusHTML = "";

        
        if (os.status === "ABERTA") {
            statusHTML = `
                <span class="badge" style="padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#ffeeba;color:#856404;">
                    Em Aberto
                </span>`;
        } else if (os.status === "EM_MANUTENCAO") {
            statusHTML = `
                <span class="badge" style="padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(59,111,245,.1);color:#3b6ff5;">
                    Em Manutenção
                </span>`;
        } else if (os.status === "AGUARDANDO_RETIRADA") {
            statusHTML = `
                <span class="badge" style="padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(245,158,11,.1);color:#d97706;">
                    Aguardando Retirada
                </span>`;
        } else if (os.status === "FINALIZADA") {
            statusHTML = `
                <span class="badge" style="padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(34,197,94,.1);color:#16a34a;">
                    Finalizada
                </span>`;
        } else {
            statusHTML = `
                <span class="badge bg-secondary">
                    ${os.status || 'Sem Status'}
                </span>`;
        }

        tbody.innerHTML += `
            <tr>
                <td><strong>#OS-${os.id}</strong></td>
                <td>${nomeCliente}</td>
                <td>${nomeMecanico}</td>
                <td>${nomeKit}</td>
                <td>${dataFormatada}</td>
                <td>${statusHTML}</td>
                <td>
                    <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 11px;" onclick="verRelatorioOS(${os.id})">📋 Ver Resumo</button>
                </td>
            </tr>
        `;
    });
}

async function salvarNovaOS() {
    const ordemServico = {
        cliente: { id: document.getElementById("osCliente").value },
        usuario: { id: document.getElementById("osUsuario").value },
        kit: { id: document.getElementById("osKit").value },
        pagamento: document.getElementById("osPagamento").value,
        valor: 0.00,
        // Força a OS a nascer diretamente no status correto
        status: "EM_MANUTENCAO"
    };

    await fetch(API_OS_SALVAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordemServico)
    });

    fecharModalNovaOS();
    listarOrdensServico();
}

async function verRelatorioOS(idOS) {
    const resOS = await fetch(API_OS_LISTAR);
    const ordens = await resOS.json();
    const os = ordens.find(o => o.id === idOS);

    const resPecas = await fetch(`${API_OS_LISTAR_PECAS}/${idOS}`);
    const pecasUtilizadas = await resPecas.json();

    const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
    const nomeMecanico = os.usuario ? os.usuario.nome : "Não Informado";
    const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";
    const valorCalculado = os.valor ? parseFloat(os.valor) : 0;
    const dataFechamentoFormatada = os.dataCadastro ? os.dataCadastro.split('-').reverse().join('/') : "-";

    let listaPecasHTML = `<span style="color:var(--text3);">Nenhuma peça aplicada.</span>`;
    
    if (pecasUtilizadas && pecasUtilizadas.length > 0) {
        listaPecasHTML = "";
        
        // Seu laço corrigido aplicando p.preco para puxar o valor real de cada item
        pecasUtilizadas.forEach(p => {
            const precoPeca = p.preco
                ? `R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}`
                : "R$ 0,00";

            listaPecasHTML += `<li>${p.nome} (${precoPeca})</li>`;
        });
    }

    const containerRelatorio = document.getElementById("corpoRelatorio");
    containerRelatorio.innerHTML = `
        <div style="border-bottom: 2px dashed var(--border); padding-bottom: 12px; margin-bottom: 12px; text-align: center;">
            <h4 style="font-family:'Syne',sans-serif; font-size: 16px; margin: 0;">ORDEM DE SERVIÇO #OS-${os.id}</h4>
            <small style="color: var(--text3);">Acoa Peças Ltda</small>
        </div>
        <p style="margin-bottom: 6px;"><strong>Cliente:</strong> ${nomeCliente}</p>
        <p style="margin-bottom: 6px;"><strong>Mecânico Responsável:</strong> ${nomeMecanico}</p>
        <p style="margin-bottom: 6px;"><strong>Kit Base Vinculado:</strong> ${nomeKit}</p>
        <p style="margin-bottom: 6px;"><strong>Forma de Pagamento:</strong> ${os.pagamento || "A combinar"}</p>
        
        <div style="margin-top: 14px; padding: 10px; background: var(--surface2); border-radius: 8px;">
            <strong style="font-size: 12px; text-transform: uppercase; color: var(--text2); display:block; margin-bottom: 4px;">Peças e Componentes Trocados:</strong>
            <ul style="padding-left: 16px; margin: 0; font-size: 13px;">
                ${listaPecasHTML}
            </ul>
        </div>

        <div style="margin-top: 16px; text-align: right; font-size: 16px;">
            <strong>Valor Total do Serviço:</strong> 
            <span style="color: var(--success); font-weight: 800; margin-left: 6px;">
                R$ ${valorCalculado.toFixed(2).replace('.', ',')}
            </span>
        </div>
        <div style="text-align: right; font-size: 14px; margin-top: 4px; color: var(--text2);">
            <strong>Data de Cadastro:</strong> ${dataFechamentoFormatada}
        </div>
    `;

    document.getElementById('modalRelatorioOS').classList.add('active');
}