window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var date = urlParams.get('date');

    var [day, month, year] = date.split(" ");
    var rearrangedDate = `${year} ${month} ${day}`;

    document.getElementById("dateTitle").innerText = rearrangedDate;

    var timeTable = document.getElementById("timeTable");
    for(var i = 0; i < 24; i++) {
        var row = document.createElement("tr");
        row.id = `row${i}`;

        var timeSlot = document.createElement("td");
        timeSlot.classList.add("timeSlot");
        timeSlot.innerText = (i < 12 ? `오전 ${i}시` : (i === 12 ? "오후 12시" : `오후 ${i - 12}시`));
        row.appendChild(timeSlot);

        var eventSlot = document.createElement("td");
        eventSlot.classList.add("eventSlot");
        eventSlot.onclick = function() {
            var event = this.dataset.event;
            if (event) {
                showEvent(JSON.parse(event));
            } else {
                showEventForm(this.parentElement.id);
            }
        };
        row.appendChild(eventSlot);

        timeTable.appendChild(row);
    }
};

function showEventForm(rowId) {
    var eventFormWrapper = document.getElementById("eventFormWrapper");
    eventFormWrapper.style.display = "block";
    eventFormWrapper.dataset.rowId = rowId;

    var eventDisplay = document.getElementById("eventDisplay");
    eventDisplay.style.display = "none";
}

function addEvent() {
    var eventFormWrapper = document.getElementById("eventFormWrapper");
    var rowId = eventFormWrapper.dataset.rowId;
    var eventTitle = document.getElementById("eventTitle").value;
    var eventContent = document.getElementById("eventContent").value;

    var eventSlot = document.getElementById(rowId).getElementsByClassName("eventSlot")[0];
    eventSlot.textContent = eventTitle;
    eventSlot.dataset.event = JSON.stringify({ title: eventTitle, content: eventContent }); // event data를 저장합니다.

    eventFormWrapper.style.display = "none";
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventContent").value = "";
}

function showEvent(event) {
    var eventDisplay = document.getElementById("eventDisplay");
    document.getElementById("eventDisplayTitle").textContent = event.title;
    document.getElementById("eventDisplayContent").textContent = event.content;
    eventDisplay.style.display = "block";

    var eventFormWrapper = document.getElementById("eventFormWrapper");
    eventFormWrapper.style.display = "none";
}
