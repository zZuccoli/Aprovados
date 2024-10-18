document.getElementById('addFlashcard').addEventListener('click', function () {
    if (getFlashcardCount() >= 20) {
        alert("Você atingiu o limite máximo de 20 flashcards.");
        return;
    }

    let question = prompt("Digite a pergunta:");
    let answer = prompt("Digite a resposta:");

    if (question && answer) {
        let flashcardWrapper = document.getElementById('flashcardWrapper');

        let newFlashcard = document.createElement('div');
        newFlashcard.className = 'flashcard';
        newFlashcard.setAttribute('draggable', 'true');
        newFlashcard.setAttribute('data-index', flashcardWrapper.children.length);
        newFlashcard.innerHTML =
            `<div class="flashcard-inner">
                <div class="front">
                    <h2>${question}</h2>
                </div>
                <div class="back">
                    <p>${answer}</p>
                </div>
            </div>`;

        flashcardWrapper.appendChild(newFlashcard);

        // Adicionando a funcionalidade de flip ao novo flashcard
        newFlashcard.addEventListener('click', function () {
            this.classList.toggle('flip');
        });

        // Adicionando os eventos de arrastar e soltar
        newFlashcard.addEventListener('dragstart', handleDragStart);
        newFlashcard.addEventListener('dragover', handleDragOver);
        newFlashcard.addEventListener('drop', handleDrop);
        newFlashcard.addEventListener('dragend', handleDragEnd);
    } else {
        alert("Pergunta e resposta não podem estar vazias.");
    }
});

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');

    if (e.target.classList.contains('flip')) {
        e.target.querySelector('.front').style.opacity = '0'; // Esconde a frente durante o arrasto
        e.target.querySelector('.back').style.opacity = '1'; // Mostra a parte de trás durante o arrasto
    } else {
        e.target.querySelector('.front').style.opacity = '1'; // Mostra a frente se não estiver virado
        e.target.querySelector('.back').style.opacity = '0'; // Esconde a parte de trás se não estiver virado
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    const targetIndex = e.target.closest('.flashcard').dataset.index;

    if (draggedIndex !== targetIndex) {
        const flashcardWrapper = document.getElementById('flashcardWrapper');
        const draggedFlashcard = flashcardWrapper.children[draggedIndex];
        const targetFlashcard = flashcardWrapper.children[targetIndex];

        // Determina a posição correta para inserir o flashcard arrastado
        if (draggedIndex < targetIndex) {
            flashcardWrapper.insertBefore(draggedFlashcard, targetFlashcard.nextSibling);
        } else {
            flashcardWrapper.insertBefore(draggedFlashcard, targetFlashcard);
        }
        updateIndices();
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.querySelector('.front').style.opacity = '1'; // Restaura a opacidade da frente após o arrasto
    e.target.querySelector('.back').style.opacity = '1'; // Restaura a opacidade da parte de trás após o arrasto
}

function getFlashcardCount() {
    return document.querySelectorAll('.flashcard').length;
}

function updateIndices() {
    const flashcards = document.querySelectorAll('.flashcard');
    flashcards.forEach((card, index) => {
        card.dataset.index = index;
    });
}

// Editando um flashcard específico
document.getElementById('editFlashcard').addEventListener('click', function () {
    let flashcards = document.querySelectorAll('.flashcard');

    if (flashcards.length === 0) {
        alert("Nenhum flashcard disponível para editar.");
        return;
    }

    let flashcardTitles = Array.from(flashcards).map((card, index) => `${index + 1}: ${card.querySelector('.front h2').textContent}`);
    let choice = prompt(`Escolha o número do flashcard que deseja editar:\n${flashcardTitles.join('\n')}`);

    if (choice && !isNaN(choice) && choice > 0 && choice <= flashcards.length) {
        let selectedFlashcard = flashcards[choice - 1];
        let newQuestion = prompt("Digite a nova pergunta:", selectedFlashcard.querySelector('.front h2').textContent);
        let newAnswer = prompt("Digite a nova resposta:", selectedFlashcard.querySelector('.back p').textContent);

        if (newQuestion) {
            selectedFlashcard.querySelector('.front h2').textContent = newQuestion;
        }

        if (newAnswer) {
            selectedFlashcard.querySelector('.back p').textContent = newAnswer;
        }
    } else {
        alert("Escolha inválida.");
    }
});

// Excluindo um flashcard
document.getElementById('deleteFlashcard').addEventListener('click', function () {
    let flashcards = document.querySelectorAll('.flashcard');

    if (flashcards.length === 0) {
        alert("Nenhum flashcard disponível para excluir.");
        return;
    }

    let flashcardTitles = Array.from(flashcards).map((card, index) => `${index + 1}: ${card.querySelector('.front h2').textContent}`);
    let choice = prompt(`Escolha o número do flashcard que deseja excluir:\n${flashcardTitles.join('\n')}`);

    if (choice && !isNaN(choice) && choice > 0 && choice <= flashcards.length) {
        flashcards[choice - 1].remove();
        updateIndices();
    } else {
        alert("Escolha inválida.");
    }
});
