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

    var modal = document.getElementById("myModal");
    var btn = document.getElementById("addEventButton");
    var span = document.getElementsByClassName("close")[0];
    var spanForm = document.querySelector("#eventForm .close");

    spanForm.onclick = function() {
        modal.style.display = "none";
    }

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById("editEventButton").addEventListener("click", function() {
        showEventList();
    });
};

function showEventDetails(event) {
    var eventDetails = JSON.parse(event.currentTarget.dataset.event);
    var eventDetailsWrapper = document.getElementById("eventDetailsWrapper");

    var titleElement = document.createElement("h2");
    titleElement.textContent = `제목: ${eventDetails.title}`;
    eventDetailsWrapper.appendChild(titleElement);

    var categoryElement = document.createElement("p");
    categoryElement.textContent = `카테고리: ${eventDetails.category}`;
    eventDetailsWrapper.appendChild(categoryElement);

    var timeElement = document.createElement("p");
    timeElement.textContent = `시간: ${eventDetails.startTime}시부터 ${eventDetails.endTime}시까지`;
    eventDetailsWrapper.appendChild(timeElement);

    var contentElement = document.createElement("p");
    contentElement.textContent = `내용: ${eventDetails.content}`; // 이벤트의 내용을 표시
    eventDetailsWrapper.appendChild(contentElement);

    var closeButton = document.createElement("button");
    closeButton.textContent = "닫기";
    closeButton.addEventListener("click", function() {
        eventDetailsWrapper.innerHTML = ""; // 팝업창의 내용을 비움
        eventDetailsWrapper.style.display = "none"; // 팝업창을 숨김
        eventDetailsWrapper.classList.remove('show');
    });

    eventListWrapper.classList.add('show');

    eventDetailsWrapper.appendChild(closeButton);

    eventDetailsWrapper.style.display = "block"; // 팝업창을 보이게 함
}

function showEventList() {
    var eventListWrapper = document.getElementById("eventListWrapper");
    eventListWrapper.innerHTML = ""; // 이전에 표시된 목록을 초기화

    var events = {};

    for(var i = 0; i < 24; i++) {
        var eventSlot = document.getElementById(`row${i}`).getElementsByClassName("eventSlot")[0];
        var event = eventSlot.dataset.event;
        if (event) {
            event = JSON.parse(event);
            var eventDuration = event.endTime - event.startTime;
            if (!events[event.title]) { // 같은 제목의 이벤트가 없는 경우에만 추가
                events[event.title] = event; // 이벤트의 전체 데이터를 저장
            }
        }
    }

    for (var title in events) {
        var eventItem = document.createElement("div");
        eventItem.innerHTML = `제목: ${title}, 카테고리: ${events[title].category}, 시간: ${events[title].endTime - events[title].startTime}시간`; // 제목, 카테고리, 총 시간을 표시
        eventItem.dataset.event = JSON.stringify(events[title]); // 클릭 이벤트에서 사용할 이벤트 데이터
        eventItem.addEventListener("click", showEventDetails); // 클릭 이벤트 추가
        eventListWrapper.appendChild(eventItem);
    }

    eventListWrapper.style.display = "block"; // 일정 목록을 보이게 함
    eventDetailsWrapper.classList.add('show');
}

function showEventForm() {
    var eventFormWrapper = document.getElementById("eventFormWrapper");
    eventFormWrapper.style.display = "block";

    var eventDisplay = document.getElementById("eventDisplay");
    eventDisplay.style.display = "none";

    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

document.getElementById("addEventButton").addEventListener("click", function() {
    showEventForm();
});

function addEvent() {
    var startRowId = parseInt(document.getElementById("startTime").value);
    var endRowId = parseInt(document.getElementById("endTime").value);
    var eventTitle = document.getElementById("eventTitle").value;
    var eventContent = document.getElementById("eventContent").value;
    var eventCategory = document.getElementById("eventCategory").value; // 카테고리 가져오기
    var eventDuration = startRowId === endRowId ? 1 : (endRowId - startRowId); // 시작 시간과 종료 시간이 같으면 1, 그렇지 않으면 두 시간의 차이

    for (var i = startRowId; i <= endRowId; i++) {
        var eventSlot = document.getElementById(`row${i}`).getElementsByClassName("eventSlot")[0];
        eventSlot.textContent = eventTitle;
        // startTime, endTime, eventDuration, category를 이벤트 데이터에 추가
        eventSlot.dataset.event = JSON.stringify({ title: eventTitle, content: eventContent, startTime: startRowId, endTime: endRowId, duration: eventDuration, category: eventCategory });
    }

    resetForm();
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function resetForm() {
    var eventFormWrapper = document.getElementById("eventFormWrapper");
    eventFormWrapper.style.display = "none";
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventContent").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
}

/*function deleteEvent() {
    if (selectedEventSlot) {
        selectedEventSlot.textContent = "";
        selectedEventSlot.dataset.event = "";

        var eventDisplay = document.getElementById("eventDisplay");
        eventDisplay.style.display = "none";
    }
}*/

function showEvent(event) {
    var eventDisplay = document.getElementById("eventDisplay");
    document.getElementById("eventDisplayTitle").textContent = event.title;
    document.getElementById("eventDisplayContent").textContent = event.content;
    eventDisplay.style.display = "block";

    var eventFormWrapper = document.getElementById("eventFormWrapper");
    eventFormWrapper.style.display = "none";
}

