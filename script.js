let groups = [];

function addGroup() {
    const groupId = document.getElementById("groupId").value.trim();
    const groupName = document.getElementById("groupName").value.trim();
    const message = document.getElementById("message");

    message.textContent = "";
    message.className = "message";

    if (groupId === "" || groupName === "") {
        showMessage("Please fill all fields.", false);
        return;
    }

    const idExists = groups.some(group => group.id === groupId);
    if (idExists) {
        showMessage("Group ID already exists.", false);
        return;
    }

    const nameExists = groups.some(group => group.name.toLowerCase() === groupName.toLowerCase());
    if (nameExists) {
        showMessage("Group name already exists.", false);
        return;
    }

    const currentDate = new Date().toLocaleString();
    const newGroup = {
        id: groupId,
        name: groupName,
        active: true,
        createdAt: currentDate,
        updatedAt: currentDate
    };

    groups.unshift(newGroup);
    displayGroups();

    document.getElementById("groupId").value = "";
    document.getElementById("groupName").value = "";
    showMessage("Group added successfully.", true);
}

function displayGroups() {
    const tableBody = document.getElementById("groupTableBody");
    tableBody.innerHTML = "";

    if (groups.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">No groups added yet. Use the form above to create your first group.</td>
            </tr>
        `;
    }

    groups.forEach((group, index) => {
        const row = `
            <tr>
                <td>${group.id}</td>
                <td>${group.name}</td>
                <td><span class="status-pill ${group.active ? 'active' : 'inactive'}">${group.active ? 'Active' : 'Inactive'}</span></td>
                <td>${group.createdAt}</td>
                <td>${group.updatedAt}</td>
                <td>
                    <button class="action-btn edit" onclick="editGroup(${index})">Edit</button>
                    <button class="action-btn toggle" onclick="toggleStatus(${index})">${group.active ? 'Deactivate' : 'Activate'}</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    updateStats();
}

function editGroup(index) {
    const newName = prompt("Enter new group name:", groups[index].name);
    if (newName === null || newName.trim() === "") {
        showMessage("Group name cannot be empty.", false);
        return;
    }

    const duplicate = groups.some((group, i) => group.name.toLowerCase() === newName.toLowerCase() && i !== index);
    if (duplicate) {
        showMessage("Group name already exists.", false);
        return;
    }

    groups[index].name = newName.trim();
    groups[index].updatedAt = new Date().toLocaleString();
    displayGroups();
    showMessage("Group updated successfully.", true);
}

function toggleStatus(index) {
    groups[index].active = !groups[index].active;
    groups[index].updatedAt = new Date().toLocaleString();
    displayGroups();
    showMessage(`Group ${groups[index].active ? 'activated' : 'deactivated'}.`, true);
}

function updateStats() {
    const total = groups.length;
    const active = groups.filter(group => group.active).length;
    const inactive = total - active;

    document.getElementById("totalGroups").textContent = total;
    document.getElementById("activeGroups").textContent = active;
    document.getElementById("inactiveGroups").textContent = inactive;
}

function showMessage(text, success) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = `message ${success ? 'success' : 'error'}`;
}

window.addEventListener('load', displayGroups);
