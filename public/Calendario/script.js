// Seleção de elementos do DOM
const btnCalendario = document.getElementById('btn-calendario');
const btnKanban = document.getElementById('btn-kanban');
const btnAdicionarTarefa = document.getElementById('btn-adicionar-tarefa');

const secaoCalendario = document.getElementById('secao-calendario');
const secaoKanban = document.getElementById('secao-kanban');

const modalTarefa = document.getElementById('modal-tarefa');
const modalTarefaDia = document.getElementById('modal-tarefa-dia');
const fecharModal = document.querySelectorAll('.fechar-modal');
const formTarefa = document.getElementById('form-tarefa');
const modalTitulo = document.getElementById('modal-titulo');
const listaTarefasDia = document.getElementById('lista-tarefas-dia');

const mesAno = document.getElementById('mes-ano');
const mesAnterior = document.getElementById('mes-anterior');
const mesSeguinte = document.getElementById('mes-seguinte');
const diasCalendario = document.getElementById('dias-calendario');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaEditando = null;

let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();

// Eventos de navegação
btnCalendario.addEventListener('click', () => {
    secaoCalendario.classList.remove('oculto');
    secaoKanban.classList.add('oculto');
    location.reload(); // Adiciona o F5 automático
});

btnKanban.addEventListener('click', () => {
    secaoKanban.classList.remove('oculto');
    secaoCalendario.classList.add('oculto');
    renderizarKanban();
});

btnAdicionarTarefa.addEventListener('click', () => {
    abrirModalAdicionarTarefa();
});

// Eventos do Modal
fecharModal.forEach(button => {
    button.addEventListener('click', () => {
        fecharModalTarefaDoDia();
        fecharModalAdicionarTarefa();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === modalTarefa || e.target === modalTarefaDia) {
        fecharModalTarefaDoDia();
        fecharModalAdicionarTarefa();
    }
});

formTarefa.addEventListener('submit', salvarTarefa);

// Navegação do Calendário
mesAnterior.addEventListener('click', () => {
    if (mesAtual === 0) {
        mesAtual = 11;
        anoAtual--;
    } else {
        mesAtual--;
    }
    renderizarCalendario();
});

mesSeguinte.addEventListener('click', () => {
    if (mesAtual === 11) {
        mesAtual = 0;
        anoAtual++;
    } else {
        mesAtual++;
    }
    renderizarCalendario();
});

// Funções
function abrirModalTarefaDoDia(data) {
    fecharModalAdicionarTarefa(); // Fecha a modal de Adicionar Tarefa, se estiver aberta
    listaTarefasDia.innerHTML = ''; // Limpa as tarefas anteriores
    modalTarefaDia.querySelector('h2').textContent = `Tarefas do dia ${data}`;

    const tarefasDoDia = tarefas.filter(tarefa => tarefa.data === data);
    tarefasDoDia.forEach(tarefa => {
        const li = document.createElement('li');
        li.textContent = tarefa.titulo;
        li.addEventListener('click', () => abrirModalEditarTarefa(tarefa.id));
        listaTarefasDia.appendChild(li);
    });

    // Remove qualquer botão "Adicionar Tarefa" existente antes de adicionar um novo
    const addButtonExistente = document.getElementById('btn-add-tarefa');
    if (addButtonExistente) {
        addButtonExistente.remove();
    }

    const addButton = document.createElement('button');
    addButton.id = 'btn-add-tarefa';
    addButton.textContent = 'Adicionar Tarefa';
    addButton.addEventListener('click', abrirModalAdicionarTarefa);

    listaTarefasDia.appendChild(addButton);

    modalTarefaDia.classList.remove('oculto');
}

function abrirModalAdicionarTarefa() {
    fecharModalTarefaDoDia(); // Fecha a modal de Tarefas do Dia, se estiver aberta
    modalTarefa.classList.remove('oculto');
    modalTarefa.classList.add('modal-adicionar-tarefa'); // Adiciona a classe específica
    formTarefa.reset();
    modalTitulo.textContent = 'Adicionar Tarefa';
    tarefaEditando = null;
}

function abrirModalEditarTarefa(tarefaId) {
    fecharModalTarefaDoDia(); // Fecha a modal de Tarefas do Dia, se estiver aberta
    const tarefa = tarefas.find(t => t.id === tarefaId);
    if (tarefa) {
        modalTarefa.classList.remove('oculto');
        modalTarefa.classList.add('modal-editar-tarefa'); // Adiciona a classe específica
        modalTitulo.textContent = 'Editar Tarefa';

        formTarefa.titulo.value = tarefa.titulo;
        formTarefa.descricao.value = tarefa.descricao;
        formTarefa.materia.value = tarefa.materia;
        formTarefa.objetivo.value = tarefa.objetivo;
        formTarefa.data.value = tarefa.data;
        formTarefa.status.value = tarefa.status;

        tarefaEditando = tarefa;
    }
}

function fecharModalTarefaDoDia() {
    modalTarefaDia.classList.add('oculto');
}

function fecharModalAdicionarTarefa() {
    modalTarefa.classList.add('oculto');
    modalTarefa.classList.remove('modal-adicionar-tarefa');
    modalTarefa.classList.remove('modal-editar-tarefa'); // Remove ambas para resetar
}

function salvarTarefa(e) {
    e.preventDefault();

    const novaTarefa = {
        id: tarefaEditando ? tarefaEditando.id : Date.now(),
        titulo: formTarefa.titulo.value,
        descricao: formTarefa.descricao.value,
        materia: formTarefa.materia.value,
        objetivo: formTarefa.objetivo.value,
        data: formTarefa.data.value,
        status: formTarefa.status.value
    };

    if (tarefaEditando) {
        // Atualiza a tarefa existente
        tarefas = tarefas.map(tarefa => tarefa.id === tarefaEditando.id ? novaTarefa : tarefa);
    } else {
        // Adiciona uma nova tarefa
        tarefas.push(novaTarefa);
    }

    // Salva a lista de tarefas atualizada no localStorage
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    fecharModalAdicionarTarefa();
    renderizarCalendario();
    renderizarKanban();
}

function renderizarCalendario() {
    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(anoAtual, mesAtual, 0).getDate();
    const ultimoDiaSemana = 6;  // Sábado

    mesAno.textContent = `${obterNomeMes(mesAtual)} ${anoAtual}`;
    diasCalendario.innerHTML = '';

    let linha = document.createElement('tr');
    
    // Preencher os dias do mês anterior
    for (let i = primeiroDia; i > 0; i--) {
        const td = document.createElement('td');
        td.textContent = ultimoDiaMesAnterior - i + 1;
        td.classList.add('inactive');
        linha.appendChild(td);
    }

    // Preencher os dias do mês atual
    for (let i = 1; i <= ultimoDia; i++) {
        if (linha.children.length === 7) {
            diasCalendario.appendChild(linha);
            linha = document.createElement('tr');
        }

        const td = document.createElement('td');
        td.textContent = i;
        const dataCompleta = `${anoAtual}-${adicionarZero(mesAtual + 1)}-${adicionarZero(i)}`;

        if (i === dataAtual.getDate() && mesAtual === dataAtual.getMonth() && anoAtual === dataAtual.getFullYear()) {
            td.classList.add('active');
        }

        if (tarefas.some(tarefa => tarefa.data === dataCompleta)) {
            const icon = document.createElement('span');
            icon.classList.add('material-icons');
            icon.textContent = 'event';
            td.appendChild(icon);
        }

        td.addEventListener('click', () => abrirModalTarefaDoDia(dataCompleta));

        linha.appendChild(td);
    }

    // Se a linha tiver menos de 7 dias, preencher com os dias do próximo mês
    if (linha.children.length > 0) {
        for (let i = 1; linha.children.length < 7; i++) {
            const td = document.createElement('td');
            td.textContent = i;
            td.classList.add('inactive');
            linha.appendChild(td);
        }
        diasCalendario.appendChild(linha);
    }
}

function renderizarKanban() {
    const status = ['proxima', 'em-andamento', 'concluida', 'atrasada'];

    status.forEach(s => {
        const coluna = document.getElementById(s);
        coluna.innerHTML = '';

        const tarefasStatus = tarefas.filter(tarefa => tarefa.status === s);

        tarefasStatus.forEach(tarefa => {
            const item = document.createElement('div');
            item.classList.add('kanban-item');
            item.setAttribute('draggable', 'true');
            item.setAttribute('data-id', tarefa.id);

            item.innerHTML = `
                <h4>${tarefa.titulo}</h4>
                <p><strong>Matéria:</strong> ${tarefa.materia}</p>
                <p><strong>Objetivo:</strong> ${tarefa.objetivo}</p>
                <p><strong>Data:</strong> ${formatarData(tarefa.data)}</p>
                <div class="acoes">
                    <button onclick="abrirModalEditarTarefa(${tarefa.id})">Editar</button>
                    <button onclick="deletarTarefa(${tarefa.id})">Excluir</button>
                </div>
            `;

            coluna.appendChild(item);
        });
    });

    habilitarDragAndDrop(); // Ativa o drag-and-drop após renderizar o Kanban
}

function deletarTarefa(id) {
    if (confirm('Você tem certeza que deseja excluir esta tarefa?')) {
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        renderizarCalendario();
        renderizarKanban();
    }
}

function habilitarDragAndDrop() {
    const kanbanItems = document.querySelectorAll('.kanban-item');
    const kanbanColunas = document.querySelectorAll('.kanban-coluna');

    kanbanItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
        });

        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    kanbanColunas.forEach(coluna => {
        coluna.addEventListener('dragover', (e) => {
            e.preventDefault();
            coluna.classList.add('drag-over');
            const draggingItem = document.querySelector('.dragging');
            coluna.appendChild(draggingItem);
        });

        coluna.addEventListener('dragleave', () => {
            coluna.classList.remove('drag-over');
        });

        coluna.addEventListener('drop', (e) => {
            e.preventDefault();
            coluna.classList.remove('drag-over');
            const draggingItem = document.querySelector('.dragging');
            coluna.appendChild(draggingItem);
            const novoStatus = coluna.getAttribute('data-status');
            atualizarStatusTarefa(draggingItem, novoStatus);
        });
    });
}

function atualizarStatusTarefa(item, novoStatus) {
    const id = parseInt(item.getAttribute('data-id'));
    tarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            tarefa.status = novoStatus;
        }
        return tarefa;
    });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function obterNomeMes(mes) {
    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return nomesMeses[mes];
}

function adicionarZero(numero) {
    return numero < 10 ? `0${numero}` : numero;
}

function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Inicialização
renderizarCalendario();
