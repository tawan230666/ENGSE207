// app.js - Frontend Logic (Fixed Version)
// ENGSE207 Software Architecture - Week 5 Lab

// ========================================
// PART 1: STATE MANAGEMENT
// ========================================

let allTasks = [];
let currentFilter = 'ALL';

const todoCountHeader = document.getElementById('todoCountHeader');
const progressCountHeader = document.getElementById('progressCountHeader');
const doneCountHeader = document.getElementById('doneCountHeader');

// ========================================
// PART 2: DOM ELEMENTS
// ========================================

const addTaskForm = document.getElementById('addTaskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskPrioritySelect = document.getElementById('taskPriority');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

// Task list containers
const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

// Task counters
const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');

// Stats Elements
const allCountTop = document.getElementById('allCount');
const todoCountTop = document.getElementById('todoCountTop');
const progressCountTop = document.getElementById('progressCountTop');
const doneCountTop = document.getElementById('doneCountTop');

const statsTrack = document.getElementById('statsTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const statsCards = document.querySelectorAll('.stats-card');

// ✅ CONFIGURATION IMPORT (รับค่าจาก config.js)
const API_BASE = API_CONFIG.BASE_URL;
const API = {
    TASKS: `${API_BASE}${API_CONFIG.ENDPOINTS.TASKS}`,
    STATS: `${API_BASE}${API_CONFIG.ENDPOINTS.STATS}`
};

// เพิ่มฟังก์ชันนี้ใน app.js
function updateConnectionStatus(isOnline) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    if (isOnline) {
        statusIndicator.textContent = '🟢';
        statusText.textContent = 'เชื่อมต่อ Server แล้ว';
        statusText.style.color = 'green';
    } else {
        statusIndicator.textContent = '🔴';
        statusText.textContent = 'ไม่สามารถเชื่อมต่อ Server';
        statusText.style.color = 'red';
    }
}
// ========================================
// PART 3: API FUNCTIONS - FETCH TASKS
// ========================================

// แก้ไขฟังก์ชัน fetchTasks ให้เรียกใช้ updateConnectionStatus
async function fetchTasks() {
    showLoading();
    try {
        const response = await fetch(API.TASKS);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        allTasks = data.tasks || [];
        renderTasks();
        
        // ✅ ถ้าโหลดสำเร็จ ให้เปลี่ยนเป็นสีเขียว
        updateConnectionStatus(true); 
        
    } catch (error) {
        console.error('Error fetching tasks:', error);
        
        // ❌ ถ้าโหลดพลาด ให้เปลี่ยนเป็นสีแดง
        updateConnectionStatus(false);
        
        alert('❌ Failed to load tasks. Please check VM connection.');
    } finally {
        hideLoading();
    }
}
// ========================================
// PART 4: API FUNCTIONS - CREATE TASK
// ========================================

async function createTask(taskData) {
    showLoading();
    try {
        // ⚠️ แก้ไข: เปลี่ยนจาก '/api/tasks' เป็น API.TASKS
        const response = await fetch(API.TASKS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        const data = await response.json();
        allTasks.unshift(data.task);
        renderTasks();

        addTaskForm.reset();
        alert('✅ Task created successfully!');
    } catch (error) {
        console.error('Error creating task:', error);
        alert('❌ Failed to create task. Please try again.');
    } finally {
        hideLoading();
    }
}

// ========================================
// PART 5: API FUNCTIONS - UPDATE STATUS
// ========================================

async function updateTaskStatus(taskId, newStatus) {
    showLoading();
    try {
        // ⚠️ แก้ไข: เปลี่ยนจาก fetch(`/api/tasks/...`) เป็น API.TASKS
        const response = await fetch(`${API.TASKS}/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        const data = await response.json();
        const updated = data.task;

        allTasks = allTasks.map((task) =>
            task.id === updated.id ? updated : task
        );

        renderTasks();
    } catch (error) {
        console.error('Error updating task status:', error);
        alert('❌ Failed to update task status.');
    } finally {
        hideLoading();
    }
}

// ========================================
// PART 6: API FUNCTIONS - DELETE TASK
// ========================================

async function deleteTask(taskId) {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    showLoading();
    try {
        // ⚠️ แก้ไข: เปลี่ยนจาก fetch(`/api/tasks/...`) เป็น API.TASKS
        const response = await fetch(`${API.TASKS}/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        allTasks = allTasks.filter((task) => task.id !== taskId);
        renderTasks();

        alert('🗑️ Task deleted successfully');
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ Failed to delete task.');
    } finally {
        hideLoading();
    }
}

// ========================================
// PART 7: RENDER FUNCTIONS - MAIN RENDER
// ========================================

function renderTasks() {
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    let filteredTasks = allTasks;
    if (currentFilter !== 'ALL') {
        filteredTasks = allTasks.filter(
            (task) => task.status === currentFilter
        );
    }

    const todo = allTasks.filter((t) => t.status === 'TODO');
    const progress = allTasks.filter((t) => t.status === 'IN_PROGRESS');
    const done = allTasks.filter((t) => t.status === 'DONE');

    if (todoCount) todoCount.textContent = todo.length;
    if (progressCount) progressCount.textContent = progress.length;
    if (doneCount) doneCount.textContent = done.length;

    if (todoCountHeader) todoCountHeader.textContent = todo.length;
    if (progressCountHeader) progressCountHeader.textContent = progress.length;
    if (doneCountHeader) doneCountHeader.textContent = done.length;

    const todoToRender = filteredTasks.filter((t) => t.status === 'TODO');
    const progressToRender = filteredTasks.filter((t) => t.status === 'IN_PROGRESS');
    const doneToRender = filteredTasks.filter((t) => t.status === 'DONE');

    renderTaskList(todoToRender, todoTasks, 'TODO');
    renderTaskList(progressToRender, progressTasks, 'IN_PROGRESS');
    renderTaskList(doneToRender, doneTasks, 'DONE');

    if (statsCards) {
        statsCards.forEach((card) => {
            const f = card.dataset.filter;
            card.classList.toggle('active', f === currentFilter);
        });
    }
}

// ========================================
// PART 8: RENDER FUNCTIONS - TASK LIST
// ========================================

function renderTaskList(tasks, container, currentStatus) {
    if (!tasks || tasks.length === 0) {
        container.innerHTML =
            '<div class="empty-state"><p>No tasks yet</p></div>';
        return;
    }

    tasks.forEach((task) => {
        const card = createTaskCard(task, currentStatus);
        container.appendChild(card);
    });
}

// ========================================
// PART 9: RENDER FUNCTIONS - CREATE CARD
// ========================================

function createTaskCard(task, currentStatus) {
    const card = document.createElement('div');
    card.className = 'task-card';

    card.draggable = true;
    card.dataset.taskId = task.id;
    card.dataset.status = currentStatus;
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    const priority = (task.priority || 'MEDIUM').toUpperCase();
    const priorityClass = `priority-${priority.toLowerCase()}`;

    const title = escapeHtml(task.title || '');
    const description = escapeHtml(task.description || '');
    const createdAt = formatDateTime(task.created_at);

    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${title}</div>
            <span class="priority-badge ${priorityClass}">${priority}</span>
        </div>
        ${description ? `<div class="task-description">${description}</div>` : ''}
        <div class="task-meta">Created: ${createdAt}</div>
        <div class="task-actions">
            ${createStatusButtons(task.id, currentStatus)}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;

    return card;
}

// ========================================
// PART 10: HELPER FUNCTIONS - STATUS BUTTONS
// ========================================

function createStatusButtons(taskId, currentStatus) {
    const buttons = [];

    if (currentStatus === 'TODO') {
        buttons.push(`
            <button class="btn btn-progress btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">
                → In Progress
            </button>
        `);
        buttons.push(`
            <button class="btn btn-done btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">
                → Done
            </button>
        `);
    } else if (currentStatus === 'IN_PROGRESS') {
        buttons.push(`
            <button class="btn btn-todo btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">
                ← To Do
            </button>
        `);
        buttons.push(`
            <button class="btn btn-done btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">
                → Done
            </button>
        `);
    } else if (currentStatus === 'DONE') {
        buttons.push(`
            <button class="btn btn-todo btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">
                ← To Do
            </button>
        `);
        buttons.push(`
            <button class="btn btn-progress btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">
                ← In Progress
            </button>
        `);
    }

    return buttons.join('');
}

// ========================================
// PART 11: UTILITY FUNCTIONS
// ========================================

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString();
}

function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// ========================================
// PART 12: EVENT LISTENERS
// ========================================

if (addTaskForm) {
    addTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const priority = taskPrioritySelect.value;

        if (!title) {
            alert('Please enter a task title.');
            return;
        }

        createTask({ title, description, priority });
    });
}

if (statusFilter) {
    statusFilter.addEventListener('change', () => {
        currentFilter = statusFilter.value;
        renderTasks();
    });
}

// Drag & Drop Setup
function setupDropZones() {
  const columns = document.querySelectorAll('.column[data-status]');

  columns.forEach((columnEl) => {
    const status = columnEl.dataset.status;
    const taskListEl = columnEl.querySelector('.task-list') || columnEl;

    function onDragOver(e) {
      e.preventDefault();
      columnEl.classList.add('column-drop-target');
      ensurePlaceholder(taskListEl);
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    }

    function onDragLeave(e) {
      const related = e.relatedTarget;
      if (related && columnEl.contains(related)) return;
      clearDropUI();
    }

    function onDrop(e) {
      e.preventDefault();
      if (!draggedTaskId) {
        clearDropUI();
        return;
      }
      clearDropUI();
      updateTaskStatus(Number(draggedTaskId), status);
    }

    columnEl.addEventListener('dragover', onDragOver);
    taskListEl.addEventListener('dragover', onDragOver);
    columnEl.addEventListener('dragleave', onDragLeave);
    taskListEl.addEventListener('dragleave', onDragLeave);
    columnEl.addEventListener('drop', onDrop);
    taskListEl.addEventListener('drop', onDrop);
  });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    setupDropZones();

    if (statusFilter) {
        statusFilter.value = currentFilter;
        statusFilter.addEventListener('change', () => {
            currentFilter = statusFilter.value;
            renderTasks();
        });
    }

    if (statsCards) {
        statsCards.forEach((card) => {
            card.addEventListener('click', () => {
                const filter = card.dataset.filter;
                currentFilter = filter;
                if (statusFilter) statusFilter.value = filter;
                renderTasks();
            });
        });
    }

    const todoHeader = document.querySelector('.status-todo');
    const progressHeader = document.querySelector('.status-progress');
    const doneHeader = document.querySelector('.status-done');

    if (todoHeader) {
        todoHeader.addEventListener('click', () => {
            currentFilter = 'TODO';
            if (statusFilter) statusFilter.value = 'TODO';
            renderTasks();
        });
    }

    if (progressHeader) {
        progressHeader.addEventListener('click', () => {
            currentFilter = 'IN_PROGRESS';
            if (statusFilter) statusFilter.value = 'IN_PROGRESS';
            renderTasks();
        });
    }

    if (doneHeader) {
        doneHeader.addEventListener('click', () => {
            currentFilter = 'DONE';
            if (statusFilter) statusFilter.value = 'DONE';
            renderTasks();
        });
    }

    if (sliderPrev && statsTrack) {
        sliderPrev.addEventListener('click', () => {
            statsTrack.scrollBy({ left: -200, behavior: 'smooth' });
        });
    }
    if (sliderNext && statsTrack) {
        sliderNext.addEventListener('click', () => {
            statsTrack.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }
});

// Drag & Drop Helpers
let draggedTaskId = null;
let dropPlaceholder = null;

function ensurePlaceholder(taskListEl) {
  if (!dropPlaceholder) {
    dropPlaceholder = document.createElement('div');
    dropPlaceholder.className = 'drop-placeholder';
    dropPlaceholder.textContent = 'ปล่อยการ์ดที่นี่เพื่อย้ายงาน';
  }

  if (dropPlaceholder.parentElement !== taskListEl) {
    if (dropPlaceholder.parentElement) {
      dropPlaceholder.parentElement.removeChild(dropPlaceholder);
    }
    taskListEl.appendChild(dropPlaceholder);
  }
}

function clearDropUI() {
  document
    .querySelectorAll('.column-drop-target')
    .forEach((col) => col.classList.remove('column-drop-target'));

  if (dropPlaceholder && dropPlaceholder.parentElement) {
    dropPlaceholder.parentElement.removeChild(dropPlaceholder);
  }
}

function handleDragStart(e) {
  draggedTaskId = this.dataset.taskId;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
  this.classList.remove('dragging');
  draggedTaskId = null;

  document
    .querySelectorAll('.column-drop-target')
    .forEach((col) => col.classList.remove('column-drop-target'));

  document
    .querySelectorAll('.drop-target')
    .forEach((el) => el.classList.remove('drop-target'));

  const placeholder = document.querySelector('.drop-placeholder');
  if (placeholder && placeholder.parentElement) {
    placeholder.parentElement.removeChild(placeholder);
  }
}

// ========================================
// PART 14: EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ========================================

window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;