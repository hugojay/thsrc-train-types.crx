var thsrcTrainTypesInjected = "thsrc-train-types-injected";

function main() {
    var locationPath = window.location.href,
        trains;
    if (locationPath.match(/\/TimeTable\/SearchResult/)) {
        // 時刻表查詢
        trains = document.querySelectorAll(".touch_table tr .column1 a");
    } else if (locationPath.match(/\/IMINT\/\?wicket:interface=:/)) {
        // 網路訂票
        var bookingStep = document.querySelector("#steps strong").innerHTML;
        if (bookingStep.match(/2/)) {
            // step 2 選擇車次
            trains = document.querySelectorAll("[id='QueryCode']");
        } else if (bookingStep.match(/3/)) {
            // step 3 取票資訊
            trains = document.querySelectorAll("#InfoCode0");
        }
    } else if (locationPath.match(/\/tw\/Article\/ArticleContent\//)) {
        caption = document.querySelectorAll("caption");
        if (caption) {
            if (caption[1].innerHTML.match(/早鳥優惠車次內容/)) {
                trains = document.querySelectorAll(".SB td:first-child, .NB td:first-child");
            }
        }
    }

    // mark for injection completed
    if (trains) {
        var BookingS2FormTrainQueryDataViewPanel = document.querySelector("#BookingS2Form_TrainQueryDataViewPanel");
        if (BookingS2FormTrainQueryDataViewPanel) {
            BookingS2FormTrainQueryDataViewPanel.classList.add(thsrcTrainTypesInjected);
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
                    trainTypeText = "蛙跳式";
                    break;
                case "5":
                    // 台北到台中或台中到左營
                    trainTypeText = "台中區";
                    break;
                case "6":
                    // 不停新增3站
                    trainTypeText = "８站停";
                    break;
                case "8":
                    // 每站停
                    trainTypeText = "各站停";
                    break;
            }

            var trainTypeLable = document.createElement("span");
            trainTypeLable.classList.add("trainTypeLable");
            trainTypeLable.classList.add("type-" + trainType);
            trainTypeLable.innerHTML = trainTypeText;
            trains[train].appendChild(trainTypeLable);
        }
    }
}

main();

// bind event for ajax completion (網路訂票)
function DOMChangedlistener() {
    if (!document.querySelector("." + thsrcTrainTypesInjected) && document.querySelector("#BookingS2Form_TrainQueryDataViewPanel")) {
        main();
    }
}
document.addEventListener("DOMSubtreeModified", function () {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(DOMChangedlistener, 500);
}, false);