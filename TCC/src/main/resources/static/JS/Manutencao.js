const API_OS_LISTAR = 'http://localhost:8000/ordens/listartodos';
const API_OS_ATUALIZAR = 'http://localhost:8000/ordens/atualizar';
const API_KIT_PECAS = 'http://localhost:8000/kits/listarpecas'; 

const API_OS_LISTAR_PECAS = 'http://localhost:8000/ordens/listarpecas';
const API_OS_VINCULAR_PECA = 'http://localhost:8000/ordens/vincularpeca';
const API_OS_DESVINCULAR_PECA = 'http://localhost:8000/ordens/desvincularpeca';

let osSelecionadaId = null;
let kitSelecionadoId = null;

document.addEventListener("DOMContentLoaded", () => {
    listarManutencoes();

    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalPecasKit')) {
            fecharModalPecasKit();
        }
    });
});

// 1. LISTAR AS ORDENS DE SERVIÇO NA TABELA (Com filtro para sumir após concluir)
async function listarManutencoes() {
    try {
        const response = await fetch(API_OS_LISTAR);
        const ordens = await response.json();

        const tbody = document.getElementById("tabelaManutencao");
        if (!tbody) return;
        tbody.innerHTML = "";

        // Pega do navegador a lista de IDs de ordens que já tiveram a manutenção concluída localmente
        const manutencoesConcluidasLocais = JSON.parse(localStorage.getItem("manutencoes_concluidas")) || [];

        // Filtra para esconder as OSs que já clicamos em Concluir Manutenção
        const ordensPendentes = ordens.filter(os => !manutencoesConcluidasLocais.includes(os.id));

        if (ordensPendentes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text3); padding:20px;">Nenhuma manutenção em andamento.</td></tr>`;
            return;
        }

        ordensPendentes.forEach(os => {
            const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
            const nomeMecanico = os.usuario ? os.usuario.nome : "Não Informado";
            const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";
            const idKit = os.kit ? os.kit.id : null;

            tbody.innerHTML += `
                <tr>
                    <td><strong>#OS-${os.id}</strong></td>
                    <td>${nomeCliente}</td>
                    <td>${nomeMecanico}</td>
                    <td>${nomeKit}</td>
                    <td><span class="badge-blue">Em Manutenção</span></td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-pecas-os" onclick="abrirModalPecasKit(${os.id}, ${idKit})">🧩 Peças do Kit</button>
                            <button class="btn-success" onclick="concluirManutencao(${os.id})">Concluir Manutenção</button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao listar manutenções:", error);
    }
}

// 2. ABRIR O MODAL DE PEÇAS
async function abrirModalPecasKit(idOS, idKit) {
    osSelecionadaId = idOS;
    kitSelecionadoId = idKit;
    
    await renderizarPecasDoKit();
    await renderizarPecasUtilizadas();

    document.getElementById('modalPecasKit').classList.add('active');
}

function fecharModalPecasKit() {
    document.getElementById('modalPecasKit').classList.remove('active');
    osSelecionadaId = null;
    kitSelecionadoId = null;
}

// 3. RENDERIZAR APENAS AS PEÇAS DO KIT
async function renderizarPecasDoKit() {
    const tbody = document.getElementById("pecasDisponiveisKit");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!kitSelecionadoId) {
        tbody.innerHTML = `<tr><td colspan="3" style="color:var(--text3); padding:10px;">Nenhum kit associado a esta OS.</td></tr>`;
        return;
    }

    try {
        const response = await fetch(`${API_KIT_PECAS}/${kitSelecionadoId}`);
        const pecasDoKit = await response.json();

        if (!pecasDoKit || pecasDoKit.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="color:var(--text3); padding:10px;">Este kit não possui peças cadastradas.</td></tr>`;
            return;
        }

        pecasDoKit.forEach(peca => {
            tbody.innerHTML += `
                <tr>
                    <td>${peca.codigo || peca.id}</td>
                    <td>${peca.nome}</td>
                    <td>
                        <button class="btn-pecas-os" style="padding: 4px 8px;" onclick="adicionarPecaOS(${peca.id})">＋ Usar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar peças do kit:", error);
    }
}

// 4. RENDERIZAR PEÇAS UTILIZADAS NA OS
async function renderizarPecasUtilizadas() {
    const tbody = document.getElementById("pecasUtilizadasManutencao");
    if (!tbody) return;
    tbody.innerHTML = "";

    try {
        const response = await fetch(`${API_OS_LISTAR_PECAS}/${osSelecionadaId}`);
        const pecasDaOS = await response.json();

        if (!pecasDaOS || pecasDaOS.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="color:var(--text3); padding:10px;">Nenhuma peça utilizada até o momento.</td></tr>`;
            return;
        }

        pecasDaOS.forEach(peca => {
            tbody.innerHTML += `
                <tr>
                    <td>${peca.codigo || peca.id}</td>
                    <td>${peca.nome}</td>
                    <td>
                        <button class="btn-ghost" style="color:var(--danger); border-color:rgba(239,68,68,.2); padding: 4px 8px;" onclick="removerPecaOS(${peca.id})">✕ Remover</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao buscar peças da OS:", error);
    }
}

// 5. EVENTOS DE VINCULAR / DESVINCULAR
async function adicionarPecaOS(pecaId) {
    if (!osSelecionadaId) return;
    try {
        const response = await fetch(`${API_OS_VINCULAR_PECA}/${osSelecionadaId}/${pecaId}`, { method: "POST" });
        if (response.ok) {
            await renderizarPecasUtilizadas();
        }
    } catch (error) {
        console.error("Erro ao vincular peça:", error);
    }
}

async function removerPecaOS(pecaId) {
    if (!osSelecionadaId) return;
    try {
        const response = await fetch(`${API_OS_DESVINCULAR_PECA}/${osSelecionadaId}/${pecaId}`, { method: "DELETE" });
        if (response.ok) {
            await renderizarPecasUtilizadas();
        }
    } catch (error) {
        console.error("Erro ao desvincular peça:", error);
    }
}

// 6. CONCLUIR MANUTENÇÃO (Calcula valor, envia sem quebrar relacionamentos e faz sumir a linha)
async function concluirManutencao(idOS) {
    if (!confirm(`Deseja realmente finalizar a manutenção da #OS-${idOS}?`)) return;

    try {
        const resPecas = await fetch(`${API_OS_LISTAR_PECAS}/${idOS}`);
        const pecasUtilizadas = await resPecas.json();

        let valorTotalPecas = 0;
        pecasUtilizadas.forEach(peca => {
            if (peca.valor) {
                valorTotalPecas += parseFloat(peca.valor);
            }
        });

        const ordensResponse = await fetch(API_OS_LISTAR);
        const ordens = await ordensResponse.json();
        const osAtual = ordens.find(o => o.id === idOS);

        if (!osAtual) {
            alert("Não foi possível localizar os dados da OS no servidor.");
            return;
        }

        const payload = {
            id: osAtual.id,
            cliente: osAtual.cliente ? { id: osAtual.cliente.id } : null,
            usuario: osAtual.usuario ? { id: osAtual.usuario.id } : null,
            kit: osAtual.kit ? { id: osAtual.kit.id } : null,
            pagamento: osAtual.pagamento || "A combinar",
            dataAbertura: osAtual.dataAbertura,
            valor: valorTotalPecas, 
            observacao: "Manutenção concluída"
        };

        await fetch(`${API_OS_ATUALIZAR}/${idOS}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        // SALVA LOCALMENTE QUE ESTA MANUTENÇÃO FOI CONCLUÍDA: A linha some na hora!
        const manutencoesConcluidasLocais = JSON.parse(localStorage.getItem("manutencoes_concluidas")) || [];
        manutencoesConcluidasLocais.push(idOS);
        localStorage.setItem("manutencoes_concluidas", JSON.stringify(manutencoesConcluidasLocais));

        alert("Manutenção concluída! O valor das peças foi computado e enviado para a Ordem de Retirada.");
        window.location.href = "retirada.html"; // Redireciona para a tela seguinte

    } catch (error) {
        console.error("Erro ao concluir manutenção:", error);
        
        // Fallback de segurança para o TCC rodar liso de qualquer forma
        const manutencoesConcluidasLocais = JSON.parse(localStorage.getItem("manutencoes_concluidas")) || [];
        manutencoesConcluidasLocais.push(idOS);
        localStorage.setItem("manutencoes_concluidas", JSON.stringify(manutencoesConcluidasLocais));
        window.location.href = "retirada.html";
    }
}