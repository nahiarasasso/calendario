const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const datesContainer = document.getElementById("dates");
const monthElement = document.getElementById("month");
const yearElement = document.getElementById("year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const eventDateInput = document.getElementById("event-date");
const eventTitleInput = document.getElementById("event-title");
const saveEventBtn = document.getElementById("save-event");
const eventListContainer = document.getElementById("event-list");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let events = JSON.parse(localStorage.getItem("events")) || {}; 


const holidays = [
    "2025-01-01",
    "2025-02-16", 
    "2025-02-17", 
    "2025-03-24",
    "2025-04-02", 
    "2025-04-17", 
    "2025-04-18", 
    "2025-05-01", 
    "2025-05-25", 
    "2025-06-15", 
    "2025-06-20", 
    "2025-07-09", 
    "2025-08-15", 
    "2025-10-12", 
    "2025-11-20", 
    "2025-12-08", 
    "2025-12-25"  
];

function loadCalendar(month = currentMonth, year = currentYear) {
    datesContainer.innerHTML = "";
    monthElement.textContent = monthNames[month];
    yearElement.textContent = year;

    let firstDay = new Date(year, month, 1).getDay();
    let totalDays = new Date(year, month + 1, 0).getDate();

    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < firstDay; i++) {
        let emptyCell = document.createElement("div");
        emptyCell.classList.add("day");
        datesContainer.appendChild(emptyCell);
    }

    for (let i = 1; i <= totalDays; i++) {
        let day = document.createElement("div");
        day.classList.add("day");
        day.textContent = i;

        let dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      
        if (new Date(year, month, i).getDay() === 0 || new Date(year, month, i).getDay() === 6) {
            day.classList.add("weekend");
        }

       
        let today = new Date();
        if (today.toISOString().split("T")[0] === dateKey) {
            day.classList.add("today");
        }

        
        if (holidays.includes(dateKey)) {
            day.classList.add("holiday");
        }

        
        if (events[dateKey] && events[dateKey].length > 0) {
            let eventDot = document.createElement("span");
            eventDot.classList.add("event-dot");
            day.appendChild(eventDot);
        }

        day.addEventListener("click", () => {
            eventDateInput.value = dateKey;
            showEvents(dateKey);
        });

        datesContainer.appendChild(day);
    }
}

function showEvents(dateKey) {
    const eventsForDay = events[dateKey] || [];

    
    eventListContainer.innerHTML = "";

    if (eventsForDay.length === 0) {
        eventListContainer.innerHTML = "<p>No hay eventos para este día.</p>";
    } else {
        let list = document.createElement("ul");
        eventsForDay.forEach((event, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = event;

         
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.classList.add("delete-event");
            deleteBtn.addEventListener("click", () => {
                deleteEvent(dateKey, index);
            });

            listItem.appendChild(deleteBtn);
            list.appendChild(listItem);
        });

        eventListContainer.appendChild(list);
    }
}

function deleteEvent(dateKey, index) {
    events[dateKey].splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    showEvents(dateKey);
    loadCalendar();
}

saveEventBtn.addEventListener("click", () => {
    let dateKey = eventDateInput.value;
    let eventTitle = eventTitleInput.value.trim();

    if (dateKey && eventTitle) {
        if (!events[dateKey]) {
            events[dateKey] = [];
        }
        events[dateKey].push(eventTitle);

        localStorage.setItem("events", JSON.stringify(events));

        showEvents(dateKey);
        loadCalendar();
        eventTitleInput.value = ""; 
    }
});

prevMonthBtn.addEventListener("click", () => {
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    loadCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
    currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
    loadCalendar(currentMonth, currentYear);
});


loadCalendar(currentMonth, currentYear);
