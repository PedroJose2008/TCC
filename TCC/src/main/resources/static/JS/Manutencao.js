const API_OS_LISTAR = 'http://localhost:8001/ordens/listartodos';
const API_OS_LISTAR_PECAS = 'http://localhost:8001/ordens/listarpecas';
const API_OS_SALVAR = 'http://localhost:8001/ordens/salvar';
const API_OS_ATUALIZAR = 'http://localhost:8001/ordens/atualizar';
const API_PECAS_LISTAR = 'http://localhost:8001/pecas/listartodos';
const API_OS_VINCULAR = 'http://localhost:8001/ordens/vincularpeca'; 
const API_OS_DESVINCULAR = 'http://localhost:8001/ordens/desvincularpeca'; 
const API_KITS_LISTAR = 'http://localhost:8001/kits/listartodos'; 

let osSelecionadaParaPecasId = null;

document.addEventListener("DOMContentLoaded", function() {
    listarOrdensManutencao();
    
    const btnAdicionarPeca = document.getElementById("btnAdicionarPeca");
    if (btnAdicionarPeca) {
        btnAdicionarPeca.addEventListener("click", function() {
            adicionarPecaAoKit();
        });
    }

    const btnSalvarDescricao = document.getElementById("btnSalvarDescricao");
    if (btnSalvarDescricao) {
        btnSalvarDescricao.addEventListener("click", function() {
            salvarDescricaoOS();
        });
    }
});

async function carregarPecasNoSelect() {
    const response = await fetch(API_PECAS_LISTAR);
    const pecas = await response.json();
    const select = document.getElementById("selectPecas");
    if (!select) return;
    
    select.innerHTML = '<option value="" disabled selected>-- Selecione Peças do Kit --</option>';
    
    pecas.forEach(function(p) {
        const option = document.createElement("option");
        option.value = p.id;
        let localizacao = "";
        if (p.prateleira) {
            localizacao = " | Prat: " + p.prateleira;
        }
        option.text = p.nome + " (Cod: " + p.codigo + localizacao + ")";
        select.appendChild(option);
    });
}

async function buscarOSPorId(idOS) {
    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();
    let osEncontrada = null;
    for (let i = 0; i < ordens.length; i++) {
        if (ordens[i].id === idOS) {
            osEncontrada = ordens[i];
            break;
        }
    }
    return osEncontrada;
}

async function listarOrdensManutencao() {
    const response = await fetch(API_OS_LISTAR);
    const ordens = await response.json();
    
    const tbody = document.getElementById("listaOrdensServico");
    if (!tbody) return;
    tbody.innerHTML = "";

    ordens.forEach(function(os) {
        if (os.status === "ABERTA" || os.status === "Aberta" || os.status === "Aberto" || os.status === "EM_MANUTENCAO" || os.status === "manutencao" || os.status === "Em Manutenção") {
            const tr = document.createElement("tr");
            
            let dataFormatada = "-";
            if (os.dataCadastro) {
                dataFormatada = os.dataCadastro.split('-').reverse().join('/');
            }
            
            let nomeCliente = "-";
            if (os.cliente) {
                nomeCliente = os.cliente.nome || os.cliente.razaoSocial || "-";
            }
            
            let nomeMecanico = "-";
            if (os.usuario) {
                nomeMecanico = os.usuario.nome;
            }
            
            let nomeKit = "-";
            if (os.kit) {
                nomeKit = os.kit.nome;
            }
            
            let textoStatus = "Em Manutenção";
            let classeBadge = "badge-blue"; 

            if (os.status === "ABERTA" || os.status === "Aberta" || os.status === "Aberto") {
                textoStatus = "Aberta";
                classeBadge = "badge-gray";
            }

            tr.innerHTML = `
                <td><strong>#OS-${os.id}</strong></td>
                <td id="os-cliente-${os.id}">${nomeCliente}</td>
                <td>${nomeMecanico}</td>
                <td>${nomeKit}</td>
                <td>${dataFormatada}</td>
                <td><span class="${classeBadge}">${textoStatus}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-pecas-os" id="btn-pecas-${os.id}" data-bs-toggle="modal" data-bs-target="#modalPecas">🧩 Peças da OS</button> 
                        <button class="btn-success" id="btn-concluir-${os.id}">Concluir Manutenção</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);

            document.getElementById("btn-pecas-" + os.id).onclick = function() {
                abrirModalPecas(os.id);
            };

            document.getElementById("btn-concluir-" + os.id).onclick = function() {
                concluirManutencao(os.id);
            };
        }
    });

    if (tbody.innerHTML === "") {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:gray; padding:20px;">Nenhuma ordem de serviço em manutenção no momento.</td></tr>';
    }
}

async function concluirManutencao(idOS) {
    if (!confirm("Deseja realmente concluir a manutenção desta OS?")) return;

    const response = await fetch(API_OS_ATUALIZAR + "/" + idOS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idOS, status: "AGUARDANDO_RETIRADA" })
    });

    if (response.ok) {
        await listarOrdensManutencao();
    } else {
        alert("Erro no servidor (500) ao concluir a OS.");
    }
}

async function abrirModalPecas(idOS) {
    osSelecionadaParaPecasId = idOS;
    
    let osAtual = await buscarOSPorId(idOS);
    if (!osAtual) return;

    if (osAtual.status === "ABERTA" || osAtual.status === "Aberta" || osAtual.status === "Aberto") {
        const responseStatus = await fetch(API_OS_ATUALIZAR + "/" + idOS, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: idOS, status: "EM_MANUTENCAO" })
        });
        
        if(responseStatus.ok) {
            await listarOrdensManutencao(); 
            osAtual = await buscarOSPorId(idOS); 
        }
    }

    const nomeCliente = document.getElementById("os-cliente-" + idOS)?.innerText || "-";
    document.getElementById('modalTitle').innerText = "Componentes da OS #OS-" + idOS;
    document.getElementById('modalSubtitle').innerText = "Cliente: " + nomeCliente;
    
    const campoDescricao = document.getElementById("txtDescricaoOS");
    if (campoDescricao) {
        campoDescricao.value = osAtual.descricao || "";
    }
    
    await carregarPecasNoSelect();
    await renderizarPecasOriginaisDoKit(osAtual.kit);
    await renderizarPecasDaOS();
}

async function renderizarPecasOriginaisDoKit(kitObj) {
    const tbodyOriginais = document.getElementById("listaPecasOriginaisKit");
    if (!tbodyOriginais) return;
    tbodyOriginais.innerHTML = "";

    if (!kitObj || !kitObj.id) {
        tbodyOriginais.innerHTML = '<tr><td colspan="2" style="color:gray; padding:8px;">Nenhum kit cadastrado nesta ordem.</td></tr>';
        return;
    }

    const response = await fetch(API_KITS_LISTAR);
    const kits = await response.json();
    let kitCompleto = null;

    for (let i = 0; i < kits.length; i++) {
        if (kits[i].id === kitObj.id) {
            kitCompleto = kits[i];
            break;
        }
    }

    if (kitCompleto && kitCompleto.pecas && kitCompleto.pecas.length > 0) {
        kitCompleto.pecas.forEach(function(peca) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-family: monospace;">${peca.codigo}</td>
                <td style="text-align: left;">${peca.nome}</td>
            `;
            tbodyOriginais.appendChild(tr);
        });
    } else {
        tbodyOriginais.innerHTML = '<tr><td colspan="2" style="color:gray; padding:8px;">Este kit não possui componentes registrados.</td></tr>';
    }
}

async function salvarDescricaoOS() {
    if (!osSelecionadaParaPecasId) return;
    
    const textoDescricao = document.getElementById("txtDescricaoOS").value;

    const response = await fetch(API_OS_ATUALIZAR + "/" + osSelecionadaParaPecasId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: osSelecionadaParaPecasId, descricao: textoDescricao })
    });

    if(response.ok) {
        alert("Relatório da OS atualizado com sucesso!");
    } else {
        alert("Erro no servidor (500) ao salvar a descrição.");
    }
}

async function atualizarValorTotalOS() {
    const responsePecas = await fetch(API_OS_LISTAR_PECAS + "/" + osSelecionadaParaPecasId);
    const pecasDaOS = await responsePecas.json();

    let valorTotal = 0;
    pecasDaOS.forEach(function(peca) {
        if (peca.preco) {
            // Garante que o número está limpo de vírgulas do padrão brasileiro
            let precoTexto = String(peca.preco).replace(',', '.').trim();
            let precoNum = parseFloat(precoTexto);
            
            // Proteção contra valores inválidos / NaN
            if (!isNaN(precoNum)) {
                valorTotal = valorTotal + precoNum;
            }
        }
    });

    // Fixa duas casas decimais para respeitar o tipo numeric do SQL Server (ex: decimal(10,2))
    valorTotal = parseFloat(valorTotal.toFixed(2));

    const response = await fetch(API_OS_ATUALIZAR + "/" + osSelecionadaParaPecasId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: osSelecionadaParaPecasId, valor: valorTotal })
    });
    
    if(!response.ok) {
        console.error("Erro interno ao atualizar valor financeiro consolidado.");
    }
}

async function renderizarPecasDaOS() {
    const listaTbody = document.getElementById('listaPecasKit');
    if (!listaTbody) return;
    listaTbody.innerHTML = '';

    const response = await fetch(API_OS_LISTAR_PECAS + "/" + osSelecionadaParaPecasId);
    const pecasDaOS = await response.json();

    pecasDaOS.forEach(function(peca) {
        const tr = document.createElement("tr");
        
        let precoFormatado = "R$ 0,00";
        if (peca.preco) {
            let precoTexto = String(peca.preco).replace(',', '.').trim();
            let precoNum = parseFloat(precoTexto);
            if (!isNaN(precoNum)) {
                precoFormatado = precoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            }
        }
        
        tr.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${peca.codigo}</td>
            <td style="text-align:left;">${peca.nome} <small style="color: var(--success); font-weight:bold;">(${precoFormatado})</small></td>
            <td style="text-align: right;">
              <button class="btn btn-danger btn-sm" id="btn-remover-peca-${peca.id}">Remover</button>
            </td>
        `;
        listaTbody.appendChild(tr);

        document.getElementById("btn-remover-peca-" + peca.id).onclick = function() {
            removerPecaDaOS(peca.id);
        };
    });
}

async function adicionarPecaAoKit() {
    const selectPecas = document.getElementById('selectPecas');
    const pecaId = selectPecas.value;

    if (!pecaId) {
        alert("Por favor, selecione uma peça válida do estoque.");
        return;
    }

    const response = await fetch(API_OS_VINCULAR + "/" + osSelecionadaParaPecasId + "/" + pecaId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) 
    });

    if (response.ok) {
        selectPecas.value = "";
        await atualizarValorTotalOS();
        await renderizarPecasDaOS();
    } else {
        alert("Erro ao vincular a peça à OS.");
    }
}

async function removerPecaDaOS(pecaId) {
    if (!confirm("Deseja desvincular este componente da OS?")) return;
    
    const response = await fetch(API_OS_DESVINCULAR + "/" + osSelecionadaParaPecasId + "/" + pecaId, {
        method: "DELETE"
    });
    
    if (response.ok) {
        await atualizarValorTotalOS();
        await renderizarPecasDaOS();
    } else {
        alert("Erro ao remover a peça da OS.");
    }
}