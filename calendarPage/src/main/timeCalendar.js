// 페이지가 로드되면 실행되는 함수
window.onload = function() {
    // 현재 페이지의 URL에서 'date' 쿼리를 가져옵니다.
    var urlParams = new URLSearchParams(window.location.search);
    var date = urlParams.get('date');

    // date를 공백으로 나누어 day, month, year를 얻습니다.
    var [day, month, year] = date.split(" ");
    // 'dateTitle' 요소의 텍스트를 설정합니다.
    document.getElementById("dateTitle").innerText = `${year} ${month} ${day}`;

    // 'timeTable' 요소를 가져옵니다.
    var timeTable = document.getElementById("timeTable");
    // 24시간 동안 각 시간에 대해 행을 생성합니다.
    for(var i = 0; i < 24; i++) {
        // 새로운 행을 생성합니다.
        var row = document.createElement("tr");
        // 행에 id를 설정합니다.
        row.id = `row${i}`;

        // 새로운 셀을 생성합니다.
        var timeSlot = document.createElement("td");
        // 셀에 'timeSlot' 클래스를 추가합니다.
        timeSlot.classList.add("timeSlot");
        // 셀의 텍스트를 설정합니다.
        timeSlot.innerText = (i < 12 ? `오전 ${i}시` : (i === 12 ? "오후 12시" : `오후 ${i - 12}시`));
        // 행에 셀을 추가합니다.
        row.appendChild(timeSlot);

        // 새로운 셀을 생성합니다.
        var eventSlot = document.createElement("td");
        // 셀에 'eventSlot' 클래스를 추가합니다.
        eventSlot.classList.add("eventSlot");
        // 셀에 클릭 이벤트 리스너를 추가합니다.
        eventSlot.onclick = function() {
            // 이 셀에 저장된 이벤트 데이터를 가져옵니다.
            var event = this.dataset.event;

            // 'wrapper' 요소가 열려 있는 경우 닫습니다.
            var wrapper = document.getElementById("wrapper");
            if (wrapper.style.display === "block") {
                wrapper.style.display = "none";
            }

            // 이벤트가 있는 경우 이벤트를 보여주고, 그렇지 않은 경우 이벤트 폼을 보여줍니다.
            if (event) {
                showEvent(JSON.parse(event));
            } else {
                showEventForm(this.parentElement.id);
            }
        };
        // 행에 셀을 추가합니다.
        row.appendChild(eventSlot);

        // 'timeTable'에 행을 추가합니다.
        timeTable.appendChild(row);
    }

    // 모달 요소를 가져옵니다.
    var modal = document.getElementById("myModal");
    // 'addEventButton' 요소를 가져옵니다.
    var btn = document.getElementById("addEventButton");
    // 'close' 클래스를 가진 첫 번째 요소를 가져옵니다.
    var span = document.getElementsByClassName("close")[0];
    // '#eventForm .close' 요소를 가져옵니다.
    var spanForm = document.querySelector("#eventForm .close");

    // 'spanForm' 요소를 클릭하면 모달을 닫습니다.
    spanForm.onclick = function() {
        modal.style.display = "none";
    }

    // 'addEventButton'을 클릭하면 모달을 엽니다.
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // 'close' 요소를 클릭하면 모달을 닫습니다.
    span.onclick = function() {
        modal.style.display = "none";
    }

    // 모달 외부를 클릭하면 모달을 닫습니다.
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    // 'editEventButton' 클릭 이벤트를 추가합니다.
    document.getElementById("editEventButton").addEventListener("click", function() {
        showEventList();
    });
};

// 이벤트 세부 정보를 보여주는 함수
function showEventDetails(event) {
    // 클릭된 이벤트 아이템의 데이터를 가져옵니다.
    var eventDetails = JSON.parse(event.currentTarget.dataset.event);
    // 'eventDetailsWrapper' 요소를 가져옵니다.
    var eventDetailsWrapper = document.getElementById("eventDetailsWrapper");

    // 제목을 생성하여 추가합니다.
    var titleElement = document.createElement("h2");
    titleElement.textContent = `제목: ${eventDetails.title}`;
    eventDetailsWrapper.appendChild(titleElement);

    // 카테고리를 생성하여 추가합니다.
    var categoryElement = document.createElement("p");
    categoryElement.textContent = `카테고리: ${eventDetails.category}`;
    eventDetailsWrapper.appendChild(categoryElement);

    // 시간을 생성하여 추가합니다.
    var timeElement = document.createElement("p");
    timeElement.textContent = `시간: ${eventDetails.startTime}시부터 ${eventDetails.endTime}시까지`;
    eventDetailsWrapper.appendChild(timeElement);

    // 내용을 생성하여 추가합니다.
    var contentElement = document.createElement("p");
    contentElement.textContent = `내용: ${eventDetails.content}`; // 이벤트의 내용을 표시
    eventDetailsWrapper.appendChild(contentElement);

    // 닫기 버튼을 생성하여 추가합니다.
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

// 해당 함수는 전체 이벤트 목록을 보여주는 기능을 수행합니다.
function showEventList() {
    var eventListWrapper = document.getElementById("eventListWrapper");
    eventListWrapper.innerHTML = "";

    var events = {};

    // 24시간 동안 각 시간에 대해 이벤트를 가져와서 events 객체에 저장합니다.
    for(var i = 0; i < 24; i++) {
        var eventSlot = document.getElementById(`row${i}`).getElementsByClassName("eventSlot")[0];
        var event = eventSlot.dataset.event;
        if (event) {
            event = JSON.parse(event);
            if (!events[event.title]) { // 같은 제목의 이벤트가 없는 경우에만 추가
                events[event.title] = event; // 이벤트의 전체 데이터를 저장
            }
        }
    }

    // events 객체에 있는 각 이벤트에 대해 이벤트 아이템을 생성하고 'eventListWrapper'에 추가합니다.
    for (var title in events) {
        var eventItem = document.createElement("div");
        eventItem.innerHTML = `제목: ${title}, 카테고리: ${events[title].category}, 시간: ${events[title].endTime - events[title].startTime}시간`; // 제목, 카테고리, 총 시간을 표시
        eventItem.dataset.event = JSON.stringify(events[title]); // 클릭 이벤트에서 사용할 이벤트 데이터
        eventItem.addEventListener("click", showEventDetails); // 클릭 이벤트 추가

        var deleteButton = document.createElement('button');
        deleteButton.textContent = '-'; // 삭제 버튼 텍스트
        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation();  // 이벤트 버블링 방지
            // 버튼 클릭 시, 리스트에서 해당 일정 삭제
            eventListWrapper.removeChild(eventItem);

            // eventSlot에서 해당 일정 삭제
            for (var i = events[title].startTime; i <= events[title].endTime; i++) {
                var eventSlot = document.getElementById(`row${i}`).getElementsByClassName("eventSlot")[0];
                if (eventSlot.dataset.event) {
                    var eventData = JSON.parse(eventSlot.dataset.event);
                    if (eventData.title === title) { // 제목이 일치하는지 확인
                        eventSlot.textContent = '';
                        eventSlot.dataset.event = '';
                    }
                }
            }
        });
        eventItem.appendChild(deleteButton); // 삭제 버튼을 일정 요소에 추가

        eventListWrapper.appendChild(eventItem);
    }
    // 일정 팝업이 열려있으면 닫습니다.
    var eventDisplay = document.getElementById("eventDisplay");
    if (eventDisplay.style.display === "block") {
        eventDisplay.style.display = "none";
    }

    eventListWrapper.style.display = "block"; // 일정 목록을 보이게 함
}

// 이벤트 폼을 보여주는 함수
function showEventForm() {
    var eventFormWrapper = document.getElementById("eventFormWrapper");
    eventFormWrapper.style.display = "block";

    var eventDisplay = document.getElementById("eventDisplay");
    eventDisplay.style.display = "none";

    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// 'addEventButton' 클릭 이벤트를 추가합니다.
document.getElementById("addEventButton").addEventListener("click", function() {
    showEventForm();
});

// 이벤트를 추가하는 함수
function addEvent() {
    // HTML 요소에서 사용자 입력 값을 가져옵니다.
    var startRowId = parseInt(document.getElementById("startTime").value);
    var endRowId = parseInt(document.getElementById("endTime").value);
    var eventTitle = document.getElementById("eventTitle").value;
    var eventContent = document.getElementById("eventContent").value;
    var eventCategory = document.getElementById("eventCategory").value; // 카테고리 가져오기

    // 시작 시간과 종료 시간이 같으면 1, 그렇지 않으면 두 시간의 차이
    var eventDuration = startRowId === endRowId ? 1 : (endRowId - startRowId);


    // 시작 시간부터 종료 시간까지 해당하는 슬롯에 이벤트 정보를 추가합니다.
    for (var i = startRowId; i <= endRowId; i++) {
        var eventSlot = document.getElementById(`row${i}`).getElementsByClassName("eventSlot")[0];
        eventSlot.textContent = eventTitle;
        // startTime, endTime, eventDuration, category를 이벤트 데이터에 추가
        eventSlot.dataset.event = JSON.stringify({ title: eventTitle, content: eventContent, startTime: startRowId, endTime: endRowId, duration: eventDuration, category: eventCategory });
    }

    // 폼을 초기화하고 모달을 닫습니다.
    resetForm();
    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    showEventList();

}

// 폼을 초기화하는 함수
function resetForm() {
    var eventFormWrapper = document.getElementById("eventFormWrapper");
    // 폼을 숨깁니다.
    eventFormWrapper.style.display = "none";
    // 모든 입력 필드를 비웁니다.
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventContent").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
}

// 이벤트 디스플레이를 닫는 이벤트 핸들러
document.querySelector(".eventClose").addEventListener("click", function() {
    document.getElementById("eventDisplay").style.display = "none";
});

// 특정 이벤트를 보여주는 함수
function showEvent(event) {
    var eventDisplay = document.getElementById("eventDisplay");
    // 제목, 내용, 시간, 카테고리를 디스플레이에 표시합니다.
    document.getElementById("eventDisplayTitle").textContent = '제목: ' + event.title;
    document.getElementById("eventDisplayContent").textContent = '내용: ' + event.content;
    document.getElementById("eventDisplayTime").textContent = '시간: ' + event.startTime + '시부터 ' + event.endTime + '시까지';
    document.getElementById("eventDisplayCategory").textContent = '카테고리: ' + event.category;

    // 이벤트 디스플레이를 보여줍니다.
    eventDisplay.style.display = "block";

    // 이벤트 폼을 숨깁니다.
    var eventFormWrapper = document.getElementById("eventFormWrapper");
    eventFormWrapper.style.display = "none";
}

// 'editEventButton' 클릭 이벤트 핸들러
document.getElementById("editEventButton").addEventListener("click", function() {
    var wrapper = document.getElementById('wrapper');

    // editEventButton을 클릭했을 때만 wrapper가 열리도록 수정
    wrapper.style.display = (wrapper.style.display === 'none' || wrapper.style.display === '') ? 'block' : 'none';

    if (wrapper.style.display === 'block') {
        // eventDisplay는 항상 숨겨집니다.
        var eventDisplay = document.getElementById("eventDisplay");
        eventDisplay.style.display = 'none';

        // showEventList()를 무조건 호출하여 이벤트 리스트를 보여줍니다.
        showEventList();
    }
});

// 'backToCalendar' 버튼 클릭 이벤트 핸들러
document.getElementById('backToCalendar').addEventListener('click', function() {
    // 달력 페이지로 이동하는 코드
    window.location.href = 'calendar.html';
});
