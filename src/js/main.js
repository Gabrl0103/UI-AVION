import '../css/styles.css';
import { flightData, state } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  renderView();
});

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      state.activeClass = parseInt(e.target.dataset.class);
      
      tabs.forEach(t => {
        t.className = 'tab-btn px-6 md:px-8 py-1.5 md:py-2 rounded-full text-xs font-bold transition-all cursor-pointer text-[#64748b] hover:text-[#101214]';
      });
      e.target.className = 'tab-btn px-6 md:px-8 py-1.5 md:py-2 rounded-full text-xs font-bold transition-all cursor-pointer bg-[#101214] text-white shadow-sm';
      
      renderView();
    });
  });
}

function updateAirplaneSelector() {
  const selectorDesktop = document.getElementById('airplane-selector');
  const textDesktop = document.getElementById('airplane-selector-text');

  // Posiciones exactas y fluidas para el cuadro selector transparente
  const classConfig = {
    1: { name: "BUSINESS", left: "2.5%" },
    2: { name: "PREMIUM", left: "calc(50% - 110px)" },
    3: { name: "ECONOMY", left: "calc(97.5% - 220px)" }
  };

  const config = classConfig[state.activeClass];
  if (selectorDesktop) {
    selectorDesktop.style.left = config.left;
    textDesktop.textContent = config.name;
  }
}

function renderView() {
  updateAirplaneSelector(); 
  const currentData = flightData[state.activeClass];
  
  document.getElementById('section-title').textContent = `Section ${currentData.id} (${currentData.name})`;
  const freeSeats = currentData.totalSeats - currentData.occupied.length;
  document.getElementById('section-info').innerHTML = `${freeSeats} libres <span class="mx-1">•</span> $${currentData.price} / asiento`;

  renderSeatMap(currentData);
  updateCheckout();
}

function renderSeatMap(currentData) {
  const container = document.getElementById('seat-grid');
  container.innerHTML = ''; 

  // Cabecera numérica alineada a la izquierda con padding exacto
  const colsHeader = document.createElement('div');
  colsHeader.className = 'flex justify-start items-center gap-2 text-[9px] text-[#a0aec0] font-bold mb-2 pl-12';
  colsHeader.innerHTML = `
    <span class="w-[28px] text-center">1</span><span class="w-[28px] text-center">2</span><span class="w-[28px] text-center">3</span><span class="w-[28px] text-center">4</span>
    <div class="w-4"></div>
    <span class="w-[28px] text-center">5</span><span class="w-[28px] text-center">6</span><span class="w-[28px] text-center">7</span><span class="w-[28px] text-center">8</span>
  `;
  container.appendChild(colsHeader);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  rows.forEach((row) => {
    // Fila alineada a la izquierda (justify-start) con padding izquierdo (pl-4)
    const rowDiv = document.createElement('div');
    rowDiv.className = 'flex justify-start items-center gap-2 mb-1.5 pl-4';
    
    // Etiqueta de la fila (A, B, C...)
    const label = document.createElement('span');
    label.className = 'text-[9px] font-bold text-[#a0aec0] w-4 text-right pr-1';
    label.textContent = row;
    rowDiv.appendChild(label);

    const seatsWrapper = document.createElement('div');
    seatsWrapper.className = 'flex gap-2';

    cols.forEach((col) => {
      const seatId = `${col}${row}`;
      const isOccupied = currentData.occupied.includes(seatId);
      const isSelected = state.selectedSeats.some(s => s.id === seatId && s.classId === currentData.id);

      const btn = document.createElement('button');
      btn.textContent = isSelected ? col : '';
      
      let baseStyle = 'relative w-[28px] h-[26px] rounded-[7px] text-[9px] font-extrabold flex items-center justify-center transition-all overflow-hidden ';
      
      const headrest = document.createElement('span');
      headrest.className = 'absolute right-1 top-1.5 bottom-1.5 w-[3px] rounded-full ';

      if (isSelected) {
        baseStyle += 'bg-[#5b4dff] text-white shadow-[0_0_12px_rgba(91,77,255,0.4)]';
        headrest.className += 'bg-white/40';
      } else if (isOccupied) {
        baseStyle += 'bg-[#94a3b8] cursor-not-allowed opacity-80';
        headrest.className += 'bg-white/30';
        btn.disabled = true;
      } else {
        baseStyle += 'bg-[#e2e8f0] hover:bg-[#cbd5e1] cursor-pointer';
        headrest.className += 'bg-white/70';
      }
      
      btn.className = baseStyle;
      btn.appendChild(headrest);

      if (!isOccupied) {
        btn.addEventListener('click', () => toggleSeat(seatId, currentData));
      }

      seatsWrapper.appendChild(btn);

      // Pasillo central vertical
      if (col === 4) {
        const aisle = document.createElement('div');
        aisle.className = 'w-4';
        seatsWrapper.appendChild(aisle);
      }
    });

    rowDiv.appendChild(seatsWrapper);
    container.appendChild(rowDiv);

    // Pasillo horizontal entre C y D
    if (row === 'C') {
      const hAisle = document.createElement('div');
      hAisle.className = 'h-2.5';
      container.appendChild(hAisle);
    }
  });
}

function createSeatButton(seatId, currentData) {
  const isOccupied = currentData.occupied.includes(seatId);
  const isSelected = state.selectedSeats.some(s => s.id === seatId && s.classId === currentData.id);

  const btn = document.createElement('button');
  // Diseño de asiento compacto con la barra de reposacabezas lateral derecha
  let baseStyle = 'relative w-[28px] sm:w-[30px] h-[24px] sm:h-[28px] rounded-[8px] sm:rounded-[10px] text-[10px] font-bold flex items-center justify-center transition-all overflow-hidden ';
  
  const headrest = document.createElement('span');
  headrest.className = 'absolute right-1 top-1 bottom-1 w-[2.5px] rounded-full ';

  if (isSelected) {
    baseStyle += 'bg-[#5b4dff] text-white shadow-[0_0_10px_rgba(91,77,255,0.4)]';
    headrest.className += 'bg-white/40';
    btn.textContent = seatId.replace(/[^0-9]/g, '');
  } else if (isOccupied) {
    baseStyle += 'bg-[#94a3b8] cursor-not-allowed opacity-80';
    headrest.className += 'bg-white/30';
    btn.disabled = true;
  } else {
    baseStyle += 'bg-[#e2e8f0] hover:bg-[#cbd5e1] cursor-pointer';
    headrest.className += 'bg-white/70';
  }
  
  btn.className = baseStyle;
  btn.appendChild(headrest);

  if (!isOccupied) {
    btn.addEventListener('click', () => toggleSeat(seatId, currentData));
  }

  return btn;
}

function toggleSeat(seatId, currentData) {
  const index = state.selectedSeats.findIndex(s => s.id === seatId && s.classId === currentData.id);
  
  if (index >= 0) {
    state.selectedSeats.splice(index, 1);
  } else {
    // Restricción estricta de máximo 4 asientos
    if (state.selectedSeats.length >= 4) {
      alert("Solo puedes seleccionar un máximo de 4 asientos.");
      return;
    }
    state.selectedSeats.push({ id: seatId, classId: currentData.id, price: currentData.price });
  }
  
  renderView(); 
}

function updateCheckout() {
  const container = document.getElementById('selected-seats-container');
  const totalPriceEl = document.getElementById('total-price');
  const confirmBtn = document.getElementById('btn-confirm');

  container.innerHTML = '';
  let total = 0;

  state.selectedSeats.forEach((seat) => {
    total += seat.price;
    const chip = document.createElement('button');
    chip.className = 'px-3 py-1 rounded-full bg-[#22252a] md:bg-[#101214] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm hover:opacity-80 transition';
    chip.innerHTML = `${seat.id} <span class="text-[9px] text-[#8b939c]">×</span>`;
    
    chip.addEventListener('click', () => {
      state.selectedSeats = state.selectedSeats.filter(s => !(s.id === seat.id && s.classId === seat.classId));
      renderView();
    });

    container.appendChild(chip);
  });

  totalPriceEl.textContent = `$${total.toLocaleString()}`;
  confirmBtn.textContent = `Confirmar (${state.selectedSeats.length})`;
}
