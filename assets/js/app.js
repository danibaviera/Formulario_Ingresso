// Retorna elementos da pagina Index
const addButton = document.getElementById('btnAdicionaIngresso');
const clearButton = document.getElementById('btnlimpaSelecaoDeIngresso');
const ticketsQty = document.getElementById('qtdIngressos');
const purchaseList = document.getElementById('listaDeCompras');
const totalPurchaseValue = document.getElementById('valorTotalDaCompra');
const validationMessage = document.getElementById('validaMensagem');

// Lista de objetos com os eventos disponíveis
var ticketEvents = [
    { id: 1, title: "Show Bring Me The Horizon - Credicard Hall", price: 500.00 },
    { id: 2, title: "Concerto Rock Legends", price: 300.00 },
    { id: 3, title: "Festival Indie Summer", price: 250.00 }
];

// Formata moeda para Real Brasileiro
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Limpa o Dropdown (select) para o valor padrão
function clearSelectedEvents() {
    ticketsQty.value = 1;
    initEventSelect();
    validationMessage.classList.add('d-none');
}

// Dispara o evento do botão Limpar
clearButton.addEventListener('click', function () {
    clearSelectedEvents();
});

// Dispara o evento do botão adicionar, incluindo um evento
addButton.addEventListener('click', function() {
    if (purchaseList.classList.contains('d-none')) {
        purchaseList.classList.remove('d-none');
    }

    if (totalPurchaseValue.classList.contains('d-none')) {
        totalPurchaseValue.classList.remove('d-none');
    }

    const selectedId = document.getElementById('eventSelect').value;
    let selectedItemTitle = '';
    let tickets = parseInt(ticketsQty.value);

    const existingItem = purchaseList.querySelector(`[data-item-id="${selectedId}"]`);
    if (existingItem) {
        validationMessage.classList.remove('d-none');
        return;
    } else {
        validationMessage.classList.add('d-none');
    }

    ticketEvents.forEach(event => {
        if (event.id == selectedId) {
            selectedItemTitle = event.title;
        }
    });

    if (selectedItemTitle && tickets > 0) {
        const newItemDiv = document.createElement('div');
        newItemDiv.className = 'd-flex text-body-secondary pt-3';
        newItemDiv.dataset.itemId = selectedId;

        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('class', 'bd-placeholder-img flex-shrink-0 me-2 rounded');
        svgIcon.setAttribute('width', '32');
        svgIcon.setAttribute('height', '32');
        svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgIcon.setAttribute('role', 'img');
        svgIcon.setAttribute('aria-label', 'Placeholder: 32x32');
        svgIcon.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svgIcon.setAttribute('focusable', 'false');

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', '#007bff');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '50%');
        text.setAttribute('y', '50%');
        text.setAttribute('fill', '#007bff');
        text.textContent = '32x32';
        svgIcon.appendChild(rect);
        svgIcon.appendChild(text);

        const listItemDiv = document.createElement('div');
        listItemDiv.className = 'pb-3 mb-0 small lh-sm border-bottom w-100';

        const titleActionDiv = document.createElement('div');
        titleActionDiv.className = 'd-flex justify-content-between';

        const title = document.createElement('strong');
        title.className = 'text-gray-dark';
        title.textContent = `${selectedItemTitle} - Ingressos: ${tickets}`;

        const deleteLink = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.textContent = 'Remover';
        deleteLink.id = `delete-${selectedId}`;
        deleteLink.onclick = function() { removeItemFromPurchaseList(selectedId); };
        titleActionDiv.appendChild(title);
        titleActionDiv.appendChild(deleteLink);

        let eventPrice = 0;
        ticketEvents.forEach(event => {
            if (event.id == selectedId) {
                eventPrice = event.price;
            }
        });

        let totalPrice = parseFloat((eventPrice * tickets).toFixed(2));
        const priceSpan = document.createElement('span');
        priceSpan.className = 'd-block item-price';
        priceSpan.textContent = formatCurrency(totalPrice);

        listItemDiv.appendChild(titleActionDiv);
        listItemDiv.appendChild(priceSpan);

        newItemDiv.appendChild(svgIcon);
        newItemDiv.appendChild(listItemDiv);

        purchaseList.appendChild(newItemDiv);
        updateTotalPurchaseValue();
        
        clearSelectedEvents();
    }
});

// Dispara evento para excluir evento da lista
function removeItemFromPurchaseList(itemId) {
    const itemsToRemove = purchaseList.querySelectorAll(`[data-item-id="${itemId}"]`);
    itemsToRemove.forEach(item => {
        purchaseList.removeChild(item);
    });
    updateTotalPurchaseValue();
}

// Calcula o total da compra
function calculateTotalPurchases() {
    let total = 0;
    const items = purchaseList.querySelectorAll('.item-price');
    items.forEach(item => {
        const priceText = item.textContent.replace('R$', '').trim();
        const price = parseFloat(priceText.replace('.', '').replace(',', '.'));
        total += price;
    });
    return total.toFixed(2);
}

// Calcula a quantidade total de ingressos
function calculateTotalTickets() {
    let totalTickets = 0;
    const items = purchaseList.querySelectorAll('.item-price');
    items.forEach(item => {
        const ticketInfo = item.previousElementSibling.textContent;
        const tickets = parseInt(ticketInfo.split('Ingressos: ')[1]);
        totalTickets += tickets;
    });
    return totalTickets;
}

// Atualiza o valor total dos ingressos
function updateTotalPurchaseValue() {
    const totalValueElement = document.getElementById('valorTotalFinal');
    totalValueElement.textContent = formatCurrency(calculateTotalPurchases());

    const totalTicketsElement = document.getElementById('qtdIngressosFinal');
    totalTicketsElement.textContent = `Total de Ingressos: ${calculateTotalTickets()}`;
}

document.addEventListener('DOMContentLoaded', function() {
    initEventSelect();
    const deleteLinks = document.querySelectorAll('[id^="delete-"]');
    deleteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.id.split('-')[1];
            removeItemFromPurchaseList(itemId);
        });
    });
});

// Inicializa o Dropdown (select) com os eventos disponíveis
function initEventSelect() {
    const select = document.getElementById('eventSelect');
    select.innerHTML = '';  // Clear existing options
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Escolha um evento';
    select.appendChild(defaultOption);

    ticketEvents.forEach(evento => {
        const option = document.createElement('option');
        option.value = evento.id;
        option.text = `${evento.title} - ${formatCurrency(evento.price)}`;
        select.appendChild(option);
    });

    select.value = '';
}
