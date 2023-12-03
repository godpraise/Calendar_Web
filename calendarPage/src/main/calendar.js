// 페이지가 로드되면 현재 월의 달력을 보여주고, 달력을 만듭니다.
window.onload = function () {
    let currentMonth = today.getMonth() + 1; // 현재 월 가져오기 (0부터 시작하므로 1을 더해줍니다)
    showCalendar(currentMonth); // 현재 월을 선택된 상태로 보여주기
    buildCalendar(); // 달력을 만듭니다.
}

let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date();     // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildCalendar() {
    let doMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);
    let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth()+1, 0);
    updateYear();    // 년도 표시
    document.getElementById('calYear').innerText = nowMonth.getFullYear().toString(); // 년도 표시

    let calendar = document.querySelector('.Calendar tbody');

    // 이전에 만든 달력이 있다면 삭제
    while(calendar.rows.length > 0) {
        calendar.deleteRow(calendar.rows.length - 1);
    }

    let row = null;
    let cell = null;
    let dateNum = 1 - doMonth.getDay();

    for(let i=0; i<6; i++) {
        row = calendar.insertRow();
        for(let j=0; j<7; j++, dateNum++) {
            cell = row.insertCell();
            if(dateNum < 1 || dateNum > lastDate.getDate()) {
                continue;
            }
            cell.classList.add("dateCell");  // "dateCell" class 추가
            cell.innerText = dateNum.toString();  // 날짜 표시

            // 일요일 색상 변경
            if (j === 0) { // 일요일은 한 주의 첫 번째 날이므로 j가 0일 때입니다.
                cell.classList.add('sunday'); // 'sunday' 클래스 추가
            }

            if (j === 6) {
                cell.classList.add('saturday');
            }

            cell.addEventListener('click', function() {
                choiceDate(this);  // 날짜를 클릭하면 choiceDate 함수 호출
            });
            // 오늘 날짜를 표시
            if(nowMonth.getFullYear() === today.getFullYear() && nowMonth.getMonth() === today.getMonth() && dateNum === today.getDate()) {
                cell.classList.add('today');
            }
        }
    }
}

// 날짜 선택
function choiceDate(cell) {
    let choiceDay = document.getElementsByClassName("choiceDay")[0];
    if (choiceDay) {                              // 기존에 선택한 날짜가 있으면
        choiceDay.classList.remove("choiceDay");// 해당 날짜의 "choiceDay" class 제거
        choiceDay.style.backgroundColor = "";     // 기존에 선택한 날짜의 배경 색 초기화
    }
    cell.classList.add("choiceDay");// 선택된 날짜에 "choiceDay" class 추가

    // 선택한 날짜 정보를 쿼리 문자열로 만듭니다.
    let selectedDate = cell.innerText + "일 " + document.querySelector('.selectedMonth').innerText + " " + document.getElementById("calYear").innerText + "년";
    window.location.href = "timeCalendar.html?date=" + selectedDate;
}

// 'months' 요소를 클릭하면 발생하는 이벤트 핸들러
document.getElementById("months").addEventListener("click", function(e) {
    if(e.target.tagName === "SPAN") {
        nowMonth = new Date(nowMonth.getFullYear(), parseInt(e.target.innerText) - 1, 1);
        buildCalendar();    // 달력 다시 생성
    }
});

// 페이지가 로드되면 'prevYear'와 'nextYear' 버튼에 이벤트 리스너를 추가합니다.
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("prevYear").addEventListener("click", function () {
        nowMonth.setFullYear(nowMonth.getFullYear() - 1); // 현재 년도를 1 감소
        nowMonth.setMonth(nowMonth.getMonth()); // 현재 월 변경
        updateYear();    // 년도 업데이트
        buildCalendar();    // 달력 다시 생성
    });
    document.getElementById("nextYear").addEventListener("click", function () {
        nowMonth.setFullYear(nowMonth.getFullYear() + 1); // 현재 년도를 1 증가
        nowMonth.setMonth(nowMonth.getMonth()); // 현재 월 변경
        updateYear();    // 년도 업데이트
        buildCalendar();    // 달력 다시 생성
    });
});
// 년도 업데이트
function updateYear() {
    document.getElementById("calYear").innerText = nowMonth.getFullYear().toString();
}

// 선택한 월로 이동
function showCalendar(month) {
    // 이전에 선택된 달에서 'selectedMonth' 클래스 제거
    let selectedMonth = document.querySelector('.selectedMonth');
    if (selectedMonth) {
        selectedMonth.style.backgroundColor = ''; // 배경색 초기화
        selectedMonth.classList.remove('selectedMonth');
    }

    // 선택된 달에 'selectedMonth' 클래스 추가
    let monthElement = document.getElementById('month' + month);
    if (monthElement) {
        monthElement.style.backgroundColor = '#11ab7f'; // 배경색 변경
        monthElement.classList.add('selectedMonth');
    }

    nowMonth = new Date(nowMonth.getFullYear(), month - 1, 1);
    buildCalendar();    // 달력 다시 생성
}