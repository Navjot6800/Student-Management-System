const recordForm = document.getElementById('record-form');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const emailInput = document.getElementById('email');
const recordList = document.getElementById('record-list');
const editIndexInput = document.getElementById('edit-index');

let records = JSON.parse(localStorage.getItem('records')) || [];

function isDuplicateEmail(email) {
    return records.some(record => record.email.toLowerCase() === email.toLowerCase());
}

function displayRecords() {
    recordList.innerHTML = '';
    if (records.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align:center;color:red;">No Records Found</td>';
        recordList.appendChild(row);
        return;
    }
    records.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.age}</td>
            <td>${record.email}</td>
            <td><button class="edit-btn" onclick="editRecord(${index})">Edit</button></td>
            <td class="delete-confirm">
                <button class="delete-btn" onclick="deleteRecord(${index})">Delete</button>
            </td>
        `;
        recordList.appendChild(row);
    });
}

recordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const age = ageInput.value;
    const email = emailInput.value.trim();
    const editIndex = parseInt(editIndexInput.value);

    if (!name || !age || !email) return alert('Please fill all fields.');

    if (isDuplicateEmail(email) && editIndex === -1) {
        return alert('Student with this email already exists.');
    }

    if (editIndex === -1) {
        records.push({ name, age, email });
    } else {
        records[editIndex] = { name, age, email };
        editIndexInput.value = -1;
    }

    localStorage.setItem('records', JSON.stringify(records));
    nameInput.value = ageInput.value = emailInput.value = '';
    displayRecords();
});

function editRecord(index) {
    const record = records[index];
    nameInput.value = record.name;
    ageInput.value = record.age;
    emailInput.value = record.email;
    editIndexInput.value = index;
}

function deleteRecord(index) {
    const cell = event.target.closest('td');
    cell.innerHTML = `
        <i id="yesBtn" class="fa-solid fa-check" onclick="confirmDelete(${index})" title="Confirm"></i>
        <i id="noBtn" class="fa-solid fa-xmark" onclick="resetDelete(${index})" title="Cancel"></i>
    `;
}

function confirmDelete(index) {
    records.splice(index, 1);
    localStorage.setItem('records', JSON.stringify(records));
    displayRecords();
}

function resetDelete(index) {
    displayRecords();
}

displayRecords();
