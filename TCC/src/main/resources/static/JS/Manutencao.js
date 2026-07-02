const API_OS_LISTAR = 'http://localhost:8000/ordens/listartodos';
const API_OS_LISTAR_PECAS = 'http://localhost:8000/ordens/listarpecas';

document.addEventListener("DOMContentLoaded", () => {
    listarOrdensServico();
});

// ==========================================
// CONTROLE DOS MODAIS
// ==========================================
function abrirModalNovaOS() {
    const campoData = document.getElementById('osData');
    if (campoData) {
        campoData.value = new Date().toISOString().split('T')[0];
    }
    document.getElementById('modalNovaOS').classList.add('active');
}

function fecharModalNovaOS() {
    document.getElementById('modalNovaOS').classList.remove('active');
}

function fecharModalRelatorio() {
    document.getElementById('modalRelatorioOS').classList.remove('active');
}

// ==========================================
// 1. LISTAR ORDENS (Mantendo as rotas e regras locais)
// ==========================================
async function listarOrdensServico() {
    try {
        const response = await fetch(API_OS_LISTAR);
        const ordens = await response.json();

        const tbody = document.getElementById("listaOrdensServico");
        if (!tbody) return;
        tbody.innerHTML = "";

        if (ordens.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text3); padding:20px;">Nenhuma Ordem de Serviço ativa.</td></tr>`;
            return;
        }

        const manutencoesConcluidas = JSON.parse(localStorage.getItem("manutencoes_concluidas")) || [];
        const osFinalizadasRetirada = JSON.parse(localStorage.getItem("os_finalizadas")) || [];

        ordens.forEach(os => {
            const dataFormatada = os.dataAbertura ? os.dataAbertura.split('-').reverse().join('/') : "-";
            const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
            const nomeMecanico = os.usuario ? os.usuario.nome : "Não Informado";
            const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";

            let statusHTML = `<span class="badge" style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: #ffeeba; color: #856404;">Em Aberto</span>`;
            
            if (osFinalizadasRetirada.includes(os.id)) {
                statusHTML = `<span class="badge" style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: rgba(34,197,94,.1); color: #16a34a;">Finalizada</span>`;
            } else if (manutencoesConcluidas.includes(os.id)) {
                statusHTML = `<span class="badge" style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: rgba(245,158,11,.1); color: #d97706;">Aguardando Retirada</span>`;
            } else if (os.observacao && os.observacao.includes("Manutenção")) {
                statusHTML = `<span class="badge" style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: rgba(59,111,245,.1); color: var(--accent);">Em Manutenção</span>`;
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
    } catch (error) {
        console.error("Erro ao listar OS:", error);
    }
}

// ==========================================
// 2. BUSCAR DADOS E EXIBIR O RELATÓRIO AJUSTADO
// ==========================================
async function verRelatorioOS(idOS) {
    try {
        const resOS = await fetch(API_OS_LISTAR);
        const ordens = await resOS.json();
        const os = ordens.find(o => o.id === idOS);

        const resPecas = await fetch(`${API_OS_LISTAR_PECAS}/${idOS}`);
        const pecasUtilizadas = await resPecas.json();

        if (!os) return alert("Erro ao carregar dados da ordem.");

        const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
        const nomeMecanico = os.usuario ? os.usuario.nome : "Não Informado";
        const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";
        const valorCalculado = os.valor ? parseFloat(os.valor) : 0;
        
        // Formata a data de abertura/fechamento para o layout
        const dataFechamentoFormatada = os.dataAbertura ? os.dataAbertura.split('-').reverse().join('/') : "-";

        // Cria a listagem de peças injetando os nós HTML corretamente
        let listaPecasHTML = "";
        if (pecasUtilizadas && pecasUtilizadas.length > 0) {
            pecasUtilizadas.forEach(p => {
                const precoPeca = p.valor ? `R$ ${parseFloat(p.valor).toFixed(2).replace('.',',')}` : "R$ 0,00";
                listaPecasHTML += `<li>${p.nome} (${precoPeca})</li>`;
            });
        } else {
            listaPecasHTML = `<span style="color:var(--text3);">Nenhuma peça aplicada.</span>`;
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
                <strong>Data de Fechamento:</strong> ${dataFechamentoFormatada}
            </div>
        `;

        // Abre o modal removendo qualquer dependência externa
        document.getElementById('modalRelatorioOS').classList.add('active');

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        alert("Não foi possível montar o relatório dessa OS.");
    }
}

function salvarNovaOS() {
    alert("Salvar Ordem clicado!");
}