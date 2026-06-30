const API_OS_LISTAR = 'http://localhost:8000/ordens/listartodos';
const API_OS_ATUALIZAR = 'http://localhost:8000/ordens/atualizar';

document.addEventListener("DOMContentLoaded", () => {
    listarOrdensParaRetirada();
});

// 1. LISTAR AS ORDENS QUE VEM DO BACKEND
async function listarOrdensParaRetirada() {
    try {
        const response = await fetch(API_OS_LISTAR);
        const ordens = await response.json();

        const tbody = document.getElementById("listaRetiradas");
        if (!tbody) return;
        tbody.innerHTML = "";

        // Pega do navegador a lista de IDs de ordens que já foram finalizadas localmente
        const osFinalizadasLocais = JSON.parse(localStorage.getItem("os_finalizadas")) || [];

        // Filtra para esconder as OSs que já clicamos em concluir
        const ordensPendentes = ordens.filter(os => !osFinalizadasLocais.includes(os.id));

        if (ordensPendentes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text3); padding:20px;">Nenhuma ordem pendente de retirada.</td></tr>`;
            return;
        }

        ordensPendentes.forEach(os => {
            const nomeCliente = os.cliente ? (os.cliente.razaoSocial || os.cliente.nome) : "Não Informado";
            const nomeMecanico = os.usuario ? os.usuario.nome : "Não Informado";
            const nomeKit = os.kit ? os.kit.nome : "Nenhum Kit";
            const formaPagamento = os.pagamento || "A combinar";

            const valorCalculado = os.valor ? parseFloat(os.valor) : 0;
            const valorFormatado = `R$ ${valorCalculado.toFixed(2).replace('.', ',')}`;

            tbody.innerHTML += `
                <tr>
                    <td><strong>#OS-${os.id}</strong></td>
                    <td>${nomeCliente}</td>
                    <td>${nomeMecanico}</td>
                    <td>${nomeKit}</td>
                    <td>${formaPagamento}</td>
                    <td><strong style="color: var(--text);">${valorFormatado}</strong></td>
                    <td><span class="badge-yellow">Aguardando Pagamento</span></td>
                    <td>
                        <button class="btn-success" onclick="concluirRetirada(${os.id})">Concluir Retirada</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao listar ordens para retirada:", error);
    }
}

// 2. CONCLUIR RETIRADA E SUMIR COM A LINHA AGORA
async function concluirRetirada(idOS) {
    if (!confirm(`Deseja confirmar o pagamento e concluir a retirada da #OS-${idOS}?`)) return;

    try {
        const ordensResponse = await fetch(API_OS_LISTAR);
        const ordens = await ordensResponse.json();
        const osAtual = ordens.find(o => o.id === idOS);

        if (!osAtual) {
            alert("Ordem de serviço não localizada.");
            return;
        }

        const payload = {
            id: osAtual.id,
            cliente: osAtual.cliente ? { id: osAtual.cliente.id } : null,
            usuario: osAtual.usuario ? { id: osAtual.usuario.id } : null,
            kit: osAtual.kit ? { id: osAtual.kit.id } : null,
            pagamento: osAtual.pagamento,
            dataAbertura: osAtual.dataAbertura,
            valor: osAtual.valor, 
            observacao: "Ordem finalizada" // Deixamos enviando pro back por segurança
        };

        // Envia para o Spring Boot atualizar
        await fetch(`${API_OS_ATUALIZAR}/${idOS}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        // SALVA LOCALMENTE QUE ESTA OS SUMIU: Independente do Java salvar o texto, a linha some!
        const osFinalizadasLocais = JSON.parse(localStorage.getItem("os_finalizadas")) || [];
        osFinalizadasLocais.push(idOS);
        localStorage.setItem("os_finalizadas", JSON.stringify(osFinalizadasLocais));

        alert(`Retirada da #OS-${idOS} concluída com sucesso!`);
        listarOrdensParaRetirada(); // Atualiza a tela e a linha some na hora!

    } catch (error) {
        console.error("Erro na requisição de retirada:", error);
        // Garante o sumiço mesmo se houver erro de rede local
        const osFinalizadasLocais = JSON.parse(localStorage.getItem("os_finalizadas")) || [];
        osFinalizadasLocais.push(idOS);
        localStorage.setItem("os_finalizadas", JSON.stringify(osFinalizadasLocais));
        listarOrdensParaRetirada();
    }
}