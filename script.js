/**
 * ROSCAS DO HOMER - INTERAÇÕES & E-COMMERCE LOGIC
 */

// Catálogo Oficial de Roscas e Caixas
const PRODUCTS_DATA = [
  {
    id: 'homer-pink',
    name: 'A Clássica do HOmer',
    category: 'homer',
    tag: 'Bestseller',
    tagClass: 'tag-bestseller',
    price: 14.50,
    image: 'assets/images/homer_pink.jpg',
    description: 'A lendária cobertura rosa de framboesas silvestres e morangos frescos com confeitos multicoloridos crocantes. Massa brioche ultra aerada.',
    details: 'Massa brioche de longa fermentação (24h), glaçagem artesanal à base de frutas vermelhas e açúcar de confeiteiro puro, finalizada com confeitos importados.',
    calories: '320 kcal',
    rating: 5.0
  },
  {
    id: 'choco-gold',
    name: 'Choco Belga Gold 70%',
    category: 'supreme',
    tag: 'Gourmet',
    tagClass: 'tag-gourmet',
    price: 18.00,
    image: 'assets/images/choc_gold.jpg',
    description: 'Ganache aveludada de chocolate meio amargo belga Callebaut, avelãs tostadas crocantes e toque de ouro 24k comestível.',
    details: 'Chocolate 70% cacau de origem sustentável, avelãs de Piemonte levemente caramelizadas com flor de sal e flocos de ouro.',
    calories: '380 kcal',
    rating: 4.9
  },
  {
    id: 'box-party',
    name: 'Box Degustação Supreme (6 Unidades)',
    category: 'boxes',
    tag: 'Mais Pedida',
    tagClass: 'tag-special',
    price: 84.00,
    image: 'assets/images/box_party.jpg',
    description: 'Caixa magnética de presente com 6 roscas autorais: 2 Clássicas do Homer, 1 Choco Gold, 1 Pistache, 1 Doce de Leite e 1 Blueberry.',
    details: 'Embalagem rígida na cor preta com berço individual para proteção e fita de cetim. Acompanha cartão de presente personalizado.',
    calories: 'Serve até 6 pessoas',
    rating: 5.0
  },
  {
    id: 'pistache-imperial',
    name: 'Pistache Siciliano Imperial',
    category: 'supreme',
    tag: 'Gourmet',
    tagClass: 'tag-gourmet',
    price: 19.50,
    image: 'assets/images/box_party.jpg', // utiliza a foto sortida focada no pistache
    description: 'Glaçagem de pistache puro de Bronte, recheio cremoso de brigadeiro de pistache e crumble amanteigado.',
    details: 'Pistache italiano com selo de origem, toque sutil de chocolate branco nobre e massa dourada.',
    calories: '360 kcal',
    rating: 4.9
  },
  {
    id: 'dulce-salgado',
    name: 'Dulce de Leche & Flor de Sal',
    category: 'homer',
    tag: 'Bestseller',
    tagClass: 'tag-bestseller',
    price: 16.00,
    image: 'assets/images/box_party.jpg',
    description: 'Cobertura generosa de doce de leite argentino lentamente cozido na panela de cobre com pitadas de flor de sal de Guérande.',
    details: 'Combinação clássica que une a intensidade do caramelo ao contraste delicado do sal.',
    calories: '350 kcal',
    rating: 4.8
  },
  {
    id: 'blueberry-velvet',
    name: 'Blueberry Velvet Glaze',
    category: 'supreme',
    tag: 'Especial',
    tagClass: 'tag-special',
    price: 17.50,
    image: 'assets/images/box_party.jpg',
    description: 'Glace roxo de mirtilos frescos e amoras, finalizado com pétalas comestíveis e mirtilos orgânicos inteiros no topo.',
    details: 'Frutas frescas cozidas em compota suave com infusão de fava de baunilha de Madagascar.',
    calories: '310 kcal',
    rating: 4.9
  }
];

// Estado da Aplicação
let cart = JSON.parse(localStorage.getItem('roscas_cart')) || [];
let currentDiscount = 0;
let customBoxSelection = [];
let maxBoxSlots = 4;
let currentBoxPrice = 58.00;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  renderProducts('all');
  initCategoryFilters();
  initBoxBuilder();
  initCartListeners();
  updateCartUI();
  initQuickContactForm();
});

// Efeito de rolagem na Navbar
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Menu Mobile
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

// Renderização dos Produtos do Cardápio
function renderProducts(categoryFilter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = categoryFilter === 'all' 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === categoryFilter);

  grid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-thumb-container">
        <span class="product-tag ${product.tagClass}">${product.tag}</span>
        <img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy">
        <button class="product-quick-view-btn" onclick="openProductModal('${product.id}')" title="Ver Detalhes">
          <i class="fa-solid fa-eye"></i>
        </button>
      </div>

      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        
        <div class="product-footer">
          <div class="product-price">
            <span class="price-unit">Valor unitário</span>
            <span class="price-value">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-plus"></i> Adicionar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filtro de Categorias
function initCategoryFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderProducts(cat);
    });
  });
}

// Carrinho de Compras Logic
function addToCart(productId, customName = null, customPrice = null) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  
  if (product) {
    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    showToast(`"${product.name}" adicionada ao carrinho! 🍩`);
  } else if (customName && customPrice) {
    // Para Box Personalizada
    cart.push({
      id: 'custom-box-' + Date.now(),
      name: customName,
      price: customPrice,
      image: 'assets/images/box_party.jpg',
      quantity: 1
    });
    showToast(`Sua Box Personalizada foi adicionada ao carrinho! ✨`);
  }

  saveCart();
  updateCartUI();
}

function updateCartQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
  }
}

function clearCart() {
  cart = [];
  currentDiscount = 0;
  saveCart();
  updateCartUI();
  showToast('Cesta esvaziada.');
}

function saveCart() {
  localStorage.setItem('roscas_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const counter = document.getElementById('cart-counter');
  const itemsList = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const discountRow = document.getElementById('discount-row');
  const discountValEl = document.getElementById('cart-discount');
  const discountPctEl = document.getElementById('discount-pct');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (counter) counter.innerText = totalCount;

  if (!itemsList) return;

  if (cart.length === 0) {
    itemsList.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-cookie-bite" style="font-size: 2.5rem; color: var(--text-subtle); margin-bottom: 0.8rem; display: block;"></i>
        Sua cesta ainda está vazia.<br>Escolha suas roscas favoritas e aproveite!
      </div>
    `;
    subtotalEl.innerText = 'R$ 0,00';
    totalEl.innerText = 'R$ 0,00';
    if (discountRow) discountRow.style.display = 'none';
    return;
  }

  itemsList.innerHTML = cart.map((item, idx) => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
      <div class="cart-item-meta">
        <h4 class="cart-item-name">${item.name}</h4>
        <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="cart-qty-ctrl">
        <button class="qty-btn" onclick="updateCartQuantity(${idx}, -1)">-</button>
        <span class="qty-val">${item.quantity}</span>
        <button class="qty-btn" onclick="updateCartQuantity(${idx}, 1)">+</button>
      </div>
      <button class="remove-cart-item" onclick="removeFromCart(${idx})" title="Remover item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (currentDiscount / 100);
  const total = subtotal - discountAmount;

  subtotalEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  totalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

  if (currentDiscount > 0 && discountRow) {
    discountRow.style.display = 'flex';
    discountPctEl.innerText = `${currentDiscount}%`;
    discountValEl.innerText = `- R$ ${discountAmount.toFixed(2).replace('.', ',')}`;
  } else if (discountRow) {
    discountRow.style.display = 'none';
  }
}

// Modal do Carrinho & Cupom
function initCartListeners() {
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const clearBtn = document.getElementById('clear-cart-btn');
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const checkoutBtn = document.getElementById('checkout-whatsapp-btn');

  if (openCartBtn && cartModal) {
    openCartBtn.addEventListener('click', () => {
      cartModal.classList.add('active');
    });
  }

  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener('click', () => {
      cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) cartModal.classList.remove('active');
    });
  }

  if (clearBtn) clearBtn.addEventListener('click', clearCart);

  // Cupom de Desconto
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const input = document.getElementById('coupon-input');
      const msg = document.getElementById('coupon-message');
      const code = input.value.trim().toUpperCase();

      if (code === 'HOMER10') {
        currentDiscount = 10;
        msg.className = 'coupon-message coupon-success';
        msg.innerText = 'Cupom HOMER10 aplicado com sucesso! (10% OFF)';
        updateCartUI();
      } else if (code === 'SPRINGFIELD') {
        currentDiscount = 15;
        msg.className = 'coupon-message coupon-success';
        msg.innerText = 'Cupom VIP SPRINGFIELD aplicado! (15% OFF)';
        updateCartUI();
      } else {
        msg.className = 'coupon-message coupon-error';
        msg.innerText = 'Cupom inválido ou expirado.';
      }
    });
  }

  // Checkout no WhatsApp
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Seu carrinho está vazio! Adicione deliciosas roscas antes de finalizar.');
        return;
      }

      let orderText = `*NOVO PEDIDO - ROSCAS DO HOMER* 🍩%0A%0A`;
      orderText += `*Itens selecionados:*%0A`;
      
      cart.forEach(item => {
        orderText += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}%0A`;
      });

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountAmount = subtotal * (currentDiscount / 100);
      const total = subtotal - discountAmount;

      orderText += `%0A*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}`;
      if (currentDiscount > 0) {
        orderText += `%0A*Desconto (${currentDiscount}%):* -R$ ${discountAmount.toFixed(2).replace('.', ',')}`;
      }
      orderText += `%0A*VALOR TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}%0A%0A`;
      orderText += `*Nome do Cliente:* (Por favor, informe seu nome)%0A`;
      orderText += `*Endereço de Entrega:* (Informe rua, número e bairro)%0A`;
      orderText += `*Forma de Pagamento:* (Pix / Cartão)%0A`;

      const whatsappUrl = `https://wa.me/5511999999999?text=${orderText}`;
      window.open(whatsappUrl, '_blank');
    });
  }
}

// Montador de Caixa Personalizada (Box Builder)
function initBoxBuilder() {
  const sizeOptions = document.querySelectorAll('.size-option');
  const slotsCountEl = document.getElementById('slots-count');
  const slotsTotalEl = document.getElementById('slots-total');
  const slotsProgress = document.getElementById('slots-progress');
  const tagsContainer = document.getElementById('box-selected-tags');
  const addBoxBtn = document.getElementById('add-custom-box-btn');
  const resetBoxBtn = document.getElementById('reset-box-btn');
  const pickerGrid = document.getElementById('picker-grid');

  if (!pickerGrid) return;

  // Renderizar opções de sabores no seletor da box
  const availableFlavors = PRODUCTS_DATA.filter(p => p.id !== 'box-party');
  pickerGrid.innerHTML = availableFlavors.map(flavor => `
    <div class="picker-item" onclick="addDonutToBox('${flavor.id}')">
      <img src="${flavor.image}" alt="${flavor.name}" class="picker-thumb">
      <div class="picker-details">
        <span class="picker-name">${flavor.name}</span>
        <span class="picker-sub">+ Adicionar à Box</span>
      </div>
    </div>
  `).join('');

  // Troca de tamanho (4 ou 6 unidades)
  sizeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      sizeOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input');
      radio.checked = true;
      maxBoxSlots = parseInt(opt.getAttribute('data-slots'));
      currentBoxPrice = parseFloat(opt.getAttribute('data-price'));
      
      // Ajusta seleção se exceder o novo limite
      if (customBoxSelection.length > maxBoxSlots) {
        customBoxSelection = customBoxSelection.slice(0, maxBoxSlots);
      }
      updateBoxUI();
    });
  });

  // Limpar box
  if (resetBoxBtn) {
    resetBoxBtn.addEventListener('click', () => {
      customBoxSelection = [];
      updateBoxUI();
    });
  }

  // Adicionar Box ao carrinho
  if (addBoxBtn) {
    addBoxBtn.addEventListener('click', () => {
      if (customBoxSelection.length === maxBoxSlots) {
        const flavorSummary = customBoxSelection.map(s => s.name).join(', ');
        const boxTitle = `Box Personalizada (${maxBoxSlots} Roscas: ${flavorSummary})`;
        addToCart(null, boxTitle, currentBoxPrice);
        customBoxSelection = [];
        updateBoxUI();
      }
    });
  }
}

function addDonutToBox(flavorId) {
  if (customBoxSelection.length >= maxBoxSlots) {
    showToast(`Sua Box já atingiu o limite de ${maxBoxSlots} roscas!`);
    return;
  }

  const flavor = PRODUCTS_DATA.find(p => p.id === flavorId);
  if (flavor) {
    customBoxSelection.push(flavor);
    updateBoxUI();
  }
}

function removeDonutFromBox(index) {
  customBoxSelection.splice(index, 1);
  updateBoxUI();
}

function updateBoxUI() {
  const countEl = document.getElementById('slots-count');
  const totalEl = document.getElementById('slots-total');
  const progressEl = document.getElementById('slots-progress');
  const tagsEl = document.getElementById('box-selected-tags');
  const addBtn = document.getElementById('add-custom-box-btn');

  if (!countEl) return;

  const count = customBoxSelection.length;
  countEl.innerText = count;
  totalEl.innerText = maxBoxSlots;

  const pct = (count / maxBoxSlots) * 100;
  progressEl.style.width = `${pct}%`;

  if (count === 0) {
    tagsEl.innerHTML = `<span class="empty-hint">Nenhuma rosca adicionada à caixa ainda. Clique nos sabores ao lado!</span>`;
  } else {
    tagsEl.innerHTML = customBoxSelection.map((item, idx) => `
      <div class="donut-tag-item">
        <span>🍩 ${item.name}</span>
        <button class="remove-tag-btn" onclick="removeDonutFromBox(${idx})" title="Remover">×</button>
      </div>
    `).join('');
  }

  if (count === maxBoxSlots) {
    addBtn.removeAttribute('disabled');
  } else {
    addBtn.setAttribute('disabled', 'true');
  }
}

// Modal de Detalhes do Produto (Quick View)
function openProductModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const content = document.getElementById('product-modal-content');
  const closeBtn = document.getElementById('close-product-btn');

  content.innerHTML = `
    <div class="modal-product-layout">
      <img src="${product.image}" alt="${product.name}" class="modal-product-img">
      <div class="modal-product-content">
        <span class="product-tag ${product.tagClass}">${product.tag}</span>
        <h3 class="modal-product-title">${product.name}</h3>
        <p class="modal-product-desc">${product.description}</p>
        
        <div class="modal-ingredients">
          <strong>Composição & Ingredientes:</strong>
          ${product.details}
        </div>

        <div class="product-footer" style="border: none; padding: 0;">
          <div class="product-price">
            <span class="price-unit">Valor unitário</span>
            <span class="price-value">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
          </div>
          <button class="btn btn-primary" onclick="addToCart('${product.id}'); document.getElementById('product-modal').classList.remove('active');">
            <i class="fa-solid fa-cart-plus"></i> Adicionar
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');

  closeBtn.onclick = () => modal.classList.remove('active');
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('active');
  };
}

// Formulário de Contato Rápido
function initQuickContactForm() {
  const form = document.getElementById('quick-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-whatsapp').value;
    const interest = document.getElementById('contact-interest').value;
    const msg = document.getElementById('contact-message').value;

    let interestText = 'Pedido Individual';
    if (interest === 'encomenda_festa') interestText = 'Encomenda para Festa';
    if (interest === 'evento_corporativo') interestText = 'Evento Corporativo';
    if (interest === 'franquia_revenda') interestText = 'Revenda / Parceria';

    const text = `*CONTATO VIA SITE - ROSCAS DO HOMER*%0A%0A` +
      `*Nome:* ${name}%0A` +
      `*WhatsApp:* ${phone}%0A` +
      `*Interesse:* ${interestText}%0A` +
      `*Mensagem:* ${msg ? msg : 'Gostaria de mais detalhes e cardápio de encomendas!'}`;

    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
    showToast('Redirecionando para o WhatsApp oficial...');
  });
}

// Toast de Notificação
function showToast(text) {
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  if (toast && toastText) {
    toastText.innerText = text;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }
}
