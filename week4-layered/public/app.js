// app.js - Frontend Logic
// ENGSE207 Software Architecture - Week 3 Lab

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

// ====== เพิ่มด้านบนตรง DOM ELEMENTS เดิม ======
const allCountTop = document.getElementById('allCount');
const todoCountTop = document.getElementById('todoCountTop');
const progressCountTop = document.getElementById('progressCountTop');
const doneCountTop = document.getElementById('doneCountTop');

const statsTrack = document.getElementById('statsTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const statsCards = document.querySelectorAll('.stats-card');

// ========================================
// PART 3: API FUNCTIONS - FETCH TASKS
// ========================================

async function fetchTasks() {
    showLoading();
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        allTasks = data.tasks || [];
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('❌ Failed to load tasks. Please refresh the page.');
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
        const response = await fetch('/api/tasks', {
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
        // server.js ส่ง { task: {...} }
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
        const response = await fetch(`/api/tasks/${taskId}/status`, {
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

        // อัปเดตใน allTasks
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
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        // ลบออกจาก state
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
    // เคลียร์ column ทั้งหมดก่อน
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    // Filter ตาม currentFilter
    let filteredTasks = allTasks;
    if (currentFilter !== 'ALL') {
        filteredTasks = allTasks.filter(
            (task) => task.status === currentFilter
        );
    }

    const todo = allTasks.filter((t) => t.status === 'TODO');
    const progress = allTasks.filter((t) => t.status === 'IN_PROGRESS');
    const done = allTasks.filter((t) => t.status === 'DONE');

    // ถ้ามี counter แบบเก่าด้านบน column ก็อัปด้วย (ถ้ามี)
    if (todoCount) todoCount.textContent = todo.length;
    if (progressCount) progressCount.textContent = progress.length;
    if (doneCount) doneCount.textContent = done.length;

    // ✅ อัปเดตแสดงในหัวคอลัมน์ใหม่
    if (todoCountHeader) todoCountHeader.textContent = todo.length;
    if (progressCountHeader) progressCountHeader.textContent = progress.length;
    if (doneCountHeader) doneCountHeader.textContent = done.length;

    // แยกตาม status สำหรับการ render ตาม filter
    const todoToRender = filteredTasks.filter((t) => t.status === 'TODO');
    const progressToRender = filteredTasks.filter((t) => t.status === 'IN_PROGRESS');
    const doneToRender = filteredTasks.filter((t) => t.status === 'DONE');

    renderTaskList(todoToRender, todoTasks, 'TODO');
    renderTaskList(progressToRender, progressTasks, 'IN_PROGRESS');
    renderTaskList(doneToRender, doneTasks, 'DONE');

    // ✅ ทำให้การ์ดที่ active ตรงกับ currentFilter
    statsCards.forEach((card) => {
        const f = card.dataset.filter;
        card.classList.toggle('active', f === currentFilter);
    });
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

    // ✅ ทำให้ลากได้
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

// Submit ฟอร์มเพิ่มงาน
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

// เปลี่ยน filter
if (statusFilter) {
    statusFilter.addEventListener('change', () => {
        currentFilter = statusFilter.value;
        renderTasks();
    });
}

function setupDropZones() {
  // ใช้ .column ที่มี data-status ตาม HTML ที่แก้ไปแล้ว
  const columns = document.querySelectorAll('.column[data-status]');

  columns.forEach((columnEl) => {
    const status = columnEl.dataset.status; // "TODO" | "IN_PROGRESS" | "DONE"
    // list ด้านใน (ถ้ามี) – ถ้าไม่มีก็ใช้ column ตรง ๆ
    const taskListEl =
      columnEl.querySelector('.task-list') || columnEl;

    function onDragOver(e) {
      e.preventDefault(); // สำคัญมาก ต้องอยู่บน element เป้าหมาย
      columnEl.classList.add('column-drop-target');
      ensurePlaceholder(taskListEl);
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    }

    function onDragLeave(e) {
      const related = e.relatedTarget;
      // ยังอยู่ใน column นี้อยู่ → ไม่ต้องลบ
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

    // ผูกกับทั้ง column และ taskList เพื่อให้วางได้ทั้งบน–ล่าง
    columnEl.addEventListener('dragover', onDragOver);
    taskListEl.addEventListener('dragover', onDragOver);

    columnEl.addEventListener('dragleave', onDragLeave);
    taskListEl.addEventListener('dragleave', onDragLeave);

    columnEl.addEventListener('drop', onDrop);
    taskListEl.addEventListener('drop', onDrop);
  });
}

document.addEventListener('DOMContentLoaded', () => {
    // โหลดงานจาก backend
    fetchTasks();

    // ตั้งค่า drop zones ให้คอลัมน์
    setupDropZones();

    // เปลี่ยน filter จาก select ด้านบน
    if (statusFilter) {
        statusFilter.value = currentFilter;
        statusFilter.addEventListener('change', () => {
            currentFilter = statusFilter.value;
            renderTasks();
        });
    }

    // คลิกการ์ด Stats เพื่อเปลี่ยน Filter (ถ้ามี statsCards)
    statsCards.forEach((card) => {
        card.addEventListener('click', () => {
            const filter = card.dataset.filter; // ALL / TODO / IN_PROGRESS / DONE
            currentFilter = filter;

            if (statusFilter) statusFilter.value = filter;
            renderTasks();
        });
    });

    // คลิกหัวคอลัมน์ To Do / In Progress / Done เพื่อ filter
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

    // ปุ่มเลื่อน slider ซ้าย–ขวา (ถ้ามี)
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



let draggedTaskId = null;
let dropPlaceholder = null;

function ensurePlaceholder(taskListEl) {
  if (!dropPlaceholder) {
    dropPlaceholder = document.createElement('div');
    dropPlaceholder.className = 'drop-placeholder';
    dropPlaceholder.textContent = 'ปล่อยการ์ดที่นี่เพื่อย้ายงาน';
  }

  // ถ้า placeholder ยังไม่ได้อยู่ใน list นี้ → ย้ายมา
  if (dropPlaceholder.parentElement !== taskListEl) {
    if (dropPlaceholder.parentElement) {
      dropPlaceholder.parentElement.removeChild(dropPlaceholder);
    }
    taskListEl.appendChild(dropPlaceholder);
  }
}

function clearDropUI() {
  // ลบขอบฟ้าคอลัมน์ทั้งหมด
  document
    .querySelectorAll('.column-drop-target')
    .forEach((col) => col.classList.remove('column-drop-target'));

  // เอา placeholder ออกจาก DOM
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

  // เคลียร์ขอบคอลัมน์ที่ไฮไลต์อยู่
  document
    .querySelectorAll('.column-drop-target')
    .forEach((col) => col.classList.remove('column-drop-target'));

  // เคลียร์ drop-target เก่า (ถ้ายังมีอยู่)
  document
    .querySelectorAll('.drop-target')
    .forEach((el) => el.classList.remove('drop-target'));

  // 👇 เพิ่มส่วนนี้เพื่อลบกล่องเส้นประ "drop-placeholder"
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
