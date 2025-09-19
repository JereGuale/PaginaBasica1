<div id="notification" class="notification" style="display:none"></div>
<div id="loading" style="display:none"></div>
<div id="noUsers" style="display:none">No hay usuarios registrados.</div>// Variables globales
let users = [];
let editingUserId = null;

// Elementos del DOM
const userForm = document.getElementById('registroForm');
const editForm = document.getElementById('editForm');
const usersList = document.getElementById('usersList');
const loading = document.getElementById('loading');
const noUsers = document.getElementById('noUsers');
const refreshBtn = document.getElementById('actualizarBtn');
const clearFormBtn = document.getElementById('clearForm');
const editModal = document.getElementById('editModal');
const cancelEditBtn = document.getElementById('cancelEdit');
const notification = document.getElementById('notification');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulario principal
    userForm.addEventListener('submit', handleSubmit);
    clearFormBtn.addEventListener('click', clearForm);
    
    // Formulario de edición
    editForm.addEventListener('submit', handleEditSubmit);
    cancelEditBtn.addEventListener('click', closeEditModal);
    
    // Botón de actualizar
    refreshBtn.addEventListener('click', loadUsers);
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
    });
    
    // Cerrar modal con la X
    document.querySelector('.close').addEventListener('click', closeEditModal);
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
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar usuarios', 'error');
    } finally {
        showLoading(false);
    }
}

// Mostrar/ocultar loading
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    usersList.style.display = show ? 'none' : 'block';
    noUsers.style.display = 'none';
}

// Renderizar lista de usuarios
function renderUsers() {
    if (users.length === 0) {
        usersList.style.display = 'none';
        noUsers.style.display = 'block';
        return;
    }
    
    usersList.style.display = 'block';
    noUsers.style.display = 'none';
    
    usersList.innerHTML = users.map(user => `
        <div class="user-card" data-id="${user.id}">
            <div class="user-header">
                <div class="user-info">
                    <h3>${escapeHtml(user.nombre)}</h3>
                    <div class="email">${escapeHtml(user.email)}</div>
                </div>
                <div class="user-actions">
                    <button class="btn btn-success" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
            <div class="user-details">
                ${user.telefono ? `<p><strong>Teléfono:</strong> ${escapeHtml(user.telefono)}</p>` : ''}
                ${user.descripcion ? `<p><strong>Descripción:</strong> ${escapeHtml(user.descripcion)}</p>` : ''}
                <p class="fecha-registro">
                    <i class="fas fa-calendar"></i> 
                    Registrado: ${formatDate(user.fecha_registro)}
                </p>
            </div>
        </div>
    `).join('');
}

// Manejar envío del formulario principal
async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(userForm);
    const userData = {
        nombre: formData.get('nombre').trim(),
        email: formData.get('email').trim(),
        telefono: formData.get('telefono').trim(),
        descripcion: formData.get('descripcion').trim()
    };
    
    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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

// Manejar envío del formulario de edición
async function handleEditSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(editForm);
    const userData = {
        nombre: formData.get('nombre').trim(),
        email: formData.get('email').trim(),
        telefono: formData.get('telefono').trim(),
        descripcion: formData.get('descripcion').trim()
    };
    
    try {
        const response = await fetch(`/api/usuarios/${editingUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Usuario actualizado exitosamente', 'success');
            closeEditModal();
            loadUsers();
        } else {
            showNotification(result.error || 'Error al actualizar usuario', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

// Editar usuario
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    editingUserId = id;
    
    // Llenar el formulario de edición
    document.getElementById('editId').value = user.id;
    document.getElementById('editNombre').value = user.nombre;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editTelefono').value = user.telefono || '';
    document.getElementById('editDescripcion').value = user.descripcion || '';
    
    // Mostrar modal
    editModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Eliminar usuario
async function deleteUser(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        });
        
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

// Cerrar modal de edición
function closeEditModal() {
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    editingUserId = null;
    editForm.reset();
}

// Limpiar formulario principal
function clearForm() {
    userForm.reset();
}

// Mostrar notificación
function showNotification(message, type = 'info') {
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
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const editEmailInput = document.getElementById('editEmail');
    
    // Validar email en formulario principal
    emailInput.addEventListener('blur', function() {
        validateEmail(this);
    });
    
    // Validar email en formulario de edición
    editEmailInput.addEventListener('blur', function() {
        validateEmail(this);
    });
});

function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        input.style.borderColor = '#dc3545';
        showNotification('Por favor, ingresa un email válido', 'error');
    } else {
        input.style.borderColor = '#e0e0e0';
    }
}

