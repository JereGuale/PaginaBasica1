
// Variables globales
let users = [];
let editingUserId = null;

// Elementos del DOM
const userForm = document.getElementById('registroForm');
const usersList = document.getElementById('usuariosList');
const loading = document.getElementById('loading');
const noUsers = document.getElementById('noUsers');
const refreshBtn = document.getElementById('actualizarBtn');
const clearFormBtn = document.getElementById('clearForm');
const notification = document.getElementById('notification');
const themeToggle = document.getElementById('themeToggle');
const totalUsersEl = document.getElementById('totalUsers');
const todayUsersEl = document.getElementById('todayUsers');

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
  initializeTheme();
  loadUsers();
  setupEventListeners();
  setupThemeToggle();
  setupFormValidation();
});

// Inicializar tema
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Siempre oscuro por defecto
  
  document.documentElement.setAttribute('data-theme', theme);
  
  // Actualizar icono del botón
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Formulario principal
  if (userForm) {
    userForm.addEventListener('submit', handleSubmit);
  }
  if (clearFormBtn) {
    clearFormBtn.addEventListener('click', clearForm);
  }

  // Botón de actualizar
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadUsers);
  }
}

// Configurar toggle de tema
function setupThemeToggle() {
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

// Configurar validación de formularios
function setupFormValidation() {
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', function () {
      validateEmail(this);
    });
  }
}

// Toggle de tema
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Actualizar icono
  const icon = themeToggle.querySelector('i');
  if (newTheme === 'dark') {
    icon.className = 'fas fa-moon';
  } else {
    icon.className = 'fas fa-sun';
  }
  
  showNotification(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info');
}

// Cargar usuarios desde la API
async function loadUsers() {
  try {
    showLoading(true);
    const response = await fetch('/api/usuarios');

    if (!response.ok) {
      throw new Error('Error al cargar usuarios');
    }

    users = await response.json();
    renderUsers();
    updateStats();
  } catch (error) {
    console.error('Error:', error);
    showNotification('Error al cargar usuarios', 'error');
  } finally {
    showLoading(false);
  }
}

// Actualizar estadísticas
function updateStats() {
  if (totalUsersEl) {
    totalUsersEl.textContent = users.length;
  }
  
  if (todayUsersEl) {
    const today = new Date().toDateString();
    const todayUsers = users.filter(user => {
      const userDate = new Date(user.fecha_registro).toDateString();
      return userDate === today;
    });
    todayUsersEl.textContent = todayUsers.length;
  }
}

// Mostrar/ocultar loading
function showLoading(show) {
  if (loading) loading.style.display = show ? 'block' : 'none';
  if (usersList) usersList.style.display = show ? 'none' : 'block';
  if (noUsers) noUsers.style.display = 'none';
}

// Renderizar lista de usuarios
function renderUsers() {
  if (!usersList || !noUsers) return;

  if (!users || users.length === 0) {
    usersList.style.display = 'none';
    noUsers.style.display = 'block';
    return;
  }

  usersList.style.display = 'block';
  noUsers.style.display = 'none';

  usersList.innerHTML = users
    .map(
      (user) => `
      <div class="user-card">
        <div class="user-header">
          <div class="user-info">
            <h3>${escapeHtml(user.nombre)}</h3>
            <div class="email">${escapeHtml(user.email)}</div>
          </div>
          <div class="user-actions">
            <button class="btn btn-outline" onclick="editUser(${user.id})" title="Editar usuario">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline" onclick="deleteUser(${user.id})" title="Eliminar usuario">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="user-details">
          ${user.telefono ? `<p><strong>Teléfono:</strong> ${escapeHtml(user.telefono)}</p>` : ''}
          ${user.descripcion ? `<p><strong>Descripción:</strong> ${escapeHtml(user.descripcion)}</p>` : ''}
          <p class="fecha-registro">
            <i class="fas fa-calendar"></i> Registrado: ${formatDate(user.fecha_registro)}
          </p>
        </div>
      </div>
    `
    )
    .join('');
}

// Manejar envío del formulario principal
async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(userForm);
  const userData = {
    nombre: (formData.get('nombre') || '').trim(),
    email: (formData.get('email') || '').trim(),
    telefono: (formData.get('telefono') || '').trim(),
    descripcion: (formData.get('descripcion') || '').trim()
  };

  try {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (response.ok) {
      showNotification('Usuario registrado exitosamente', 'success');
      clearForm();
      loadUsers();
    } else {
      showNotification(result.error || 'Error al registrar usuario', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('Error de conexión', 'error');
  }
}

// Editar usuario (función simplificada)
function editUser(id) {
  showNotification('Función de edición en desarrollo', 'info');
}

// Eliminar usuario
async function deleteUser(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

  try {
    const response = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    const result = await response.json();

    if (response.ok) {
      showNotification('Usuario eliminado exitosamente', 'success');
      loadUsers();
    } else {
      showNotification(result.error || 'Error al eliminar usuario', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('Error de conexión', 'error');
  }
}

// Limpiar formulario principal
function clearForm() {
  if (userForm) userForm.reset();
}

// Mostrar notificación
function showNotification(message, type = 'info') {
  if (!notification) {
    console[type === 'error' ? 'error' : 'log'](message);
    return;
  }
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Utilidades
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function validateEmail(input) {
  if (!input) return;
  const email = (input.value || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    input.style.borderColor = '#dc3545';
    showNotification('Por favor, ingresa un email válido', 'error');
  } else {
    input.style.borderColor = '#e0e0e0';
  }
}



