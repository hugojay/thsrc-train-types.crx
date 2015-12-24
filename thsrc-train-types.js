var thsrcTrainTypesInjected = "thsrc-train-types-injected",
    thsrcTrainTypesHelpPage = "http://hugojay.com/thsrc-train-types/?help#help",
    toBeMarkedQuery = "#BookingS2Form_TrainQueryDataViewPanel, #HistoryDetailsModifyTripS2Form_TrainQueryDataViewPanel";

function main() {
    var locationPath = window.location.href,
        trains;
    if (locationPath.match(/\/TimeTable\/SearchResult/)) {
        // 時刻表查詢
        trains = document.querySelectorAll(".touch_table tr .column1 a");
    } else if (locationPath.match(/\/IMINT\/\?wicket:interface=:/)) {
        // 網路訂票
        var bookingStep = document.querySelector("#steps strong");
        bookingStep = bookingStep ? bookingStep.innerHTML : "";
        if (document.querySelector("#QueryCode")) {
            // step 2 選擇車次
            trains = document.querySelectorAll("[id='QueryCode']");
        } else if (bookingStep.match(/3/)) {
            // step 3 取票資訊
            trains = document.querySelectorAll("#InfoCode0");
        } else if (document.querySelector("#setTrainCode0")) {
            // step 4 完成訂位 & 訂位查詢/修改
            trains = document.querySelectorAll("#setTrainCode0");
        }
    } else if (locationPath.match(/\/tw\/Article\/ArticleContent\//)) {
        // 早鳥優惠適用車次表
        caption = document.querySelectorAll("caption");
        if (caption) {
            if (caption[1].innerHTML.match(/早鳥優惠車次內容/)) {
                trains = document.querySelectorAll(".SB td:first-child, .NB td:first-child");
            }
        }
    } else if (locationPath.match(/\/TimeTable\/DailyTimeTable/)) {
        // 時刻表查詢(檢視當日時刻表)
        trains = document.querySelectorAll(".text_orange_link");
    } else if (locationPath.match(/\/tw\/FullyOccupied\/Detail\//)) {
        // 疏運期間銷售資訊
        trains = document.querySelectorAll("table td:first-child");
    } else {
        return false;
    }

    // mark for injection completed
    if (trains) {
        var toBeMarkedElements = document.querySelector(toBeMarkedQuery);
        if (toBeMarkedElements) {
            toBeMarkedElements.classList.add(thsrcTrainTypesInjected);
        } else {
            document.body.classList.add(thsrcTrainTypesInjected);
        }
    }

    for (train in trains) {
        if (trains.hasOwnProperty(train)) {
            var trainNum = trains[train].innerHTML,
                trainType = trainNum.length === 4 ? trainNum.substr(1, 1) : trainNum.substr(0, 1);

            switch (trainType) {
                case "1":
                    // 只停板橋和台中的傳統直達車
                    trainTypeText = "直達車";
                    break;
                case "2":
                    // 加停嘉義與台南的直達車
                    trainTypeText = "準直達";
                    break;
                case "3":
                    // 台中以南站站停
                    trainTypeText = "南跳蛙";
                    break;
                case "5":
                    // 台北到台中或台中到左營
                    trainTypeText = "台中區";
                    break;
                case "6":
                    // 不停新增3站
                    trainTypeText = "北蛙跳";
                    break;
                case "8":
                    // 每站停
                    trainTypeText = "站站停";
                    break;
                default:
                    trainTypeText = "未知號";
                    break;
            }

            var trainTypeLable = document.createElement("a");
            trainTypeLable.classList.add("trainTypeLable");
            trainTypeLable.classList.add("type-" + trainType);
            trainTypeLable.innerHTML = trainTypeText;
            trainTypeLable.setAttribute("href", thsrcTrainTypesHelpPage);
            trainTypeLable.setAttribute("target", "_blank");
            trains[train].appendChild(trainTypeLable);
        }
    }
}

main();

// bind event for ajax completion (網路訂票)
function DOMChangedlistener() {
    if (!document.querySelector("." + thsrcTrainTypesInjected) && document.querySelector(toBeMarkedQuery)) {
        main();
    }
}
document.addEventListener("DOMSubtreeModified", function () {
    if (typeof(timeout) !== "undefined") {
        clearTimeout(timeout);
    }
    timeout = setTimeout(DOMChangedlistener, 500);
}, false);