// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1
import "../Common"

Item {
    id: recordingView
    width: parent.width
    height: parent.height

    property date initRecSTime
    property date initRecETime
    property double initRecSUtc
    property double initRecEUtc
    property int warnStrId: -1
    property int conflictState: 0

    signal confirm
    signal close

    function checkConflict() {
        var conflictInfo = pvrInfo.getPvrRecConflictInfo(selectedListId, selectedProgTitle, itemStartTime.recSUtc, itemEndTime.recEUtc)
        conflictState = conflictInfo[0]
        txtErrorMsg.text = conflictInfo[1]
        warnStrId = conflictInfo[2]

        if (conflictState == -1) {
            if (endHour.focus || endMin.focus) {
                sTimeConflict.visible = false
                eTimeConflict.visible = true
                txtErrorMsg.text = qsTranslate("QObject", "Invalid end time")
            }
            else {
                sTimeConflict.visible = true
                eTimeConflict.visible = false
                txtErrorMsg.text = qsTranslate("QObject", "Invalid start time")
            }
        }
        else if (conflictState == 1) {
            sTimeConflict.visible = true
            eTimeConflict.visible = false
        }
        else if (conflictState == 2) {
            sTimeConflict.visible = false
            eTimeConflict.visible = true
        }
        else if (conflictState == 3) {
            sTimeConflict.visible = true
            eTimeConflict.visible = true
        }
        else {
            sTimeConflict.visible = false
            eTimeConflict.visible = false
        }
    }

    Component.onCompleted: {
        initRecSUtc = selectedProgSUtc;
        initRecSTime = selectedProgSTime;
        itemStartTime.recSTime = initRecSTime;

        initRecEUtc = selectedProgEUtc;
        initRecETime = selectedProgETime;
        itemEndTime.recETime = initRecETime;
    }

    Connections {
        target: pvrMainWindow
        onCurrentTimeChanged: {
            if (selectedRecStatus != 6) {
    //            console.log("currentTime = " + currentTime)
                if (currentTime > itemStartTime.recSTime) {
                    itemStartTime.recSTime = currentTime
                    if (itemEndTime.recETime - itemStartTime.recSTime < 60000) {
                        itemEndTime.addMin(1)
                    }
                }
            }
        }
    }

    WindowBackground {
        width: 984
        height: 510
        anchors.verticalCenter: parent.verticalCenter
        anchors.horizontalCenter: parent.horizontalCenter

        Item {
            id: recordingTop
            width: 920
            height: 105
            anchors.horizontalCenter: parent.horizontalCenter
//            color:"transparent"
//            border.color: "red"
//            border.width: 1

            Image {
                source: "iconPVR_recorded_HL.png"
                anchors.left: parent.left
                anchors.top: parent.top
                anchors.topMargin: 30
            }

            Text {
                height: parent.height
                color: "#8E8E8E"
                font.pixelSize: 36
                anchors.left: parent.left
                anchors.leftMargin: 66
                anchors.top: parent.top
                anchors.topMargin: 36
                text: qsTranslate("QObject", "Schedule Recording")
            }
        }

        Item {
            id: recordingBody
            width: 920
            height: 373
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: recordingTop.bottom
            anchors.topMargin: 20
//            color:"transparent"
//            border.color: "red"
//            border.width: 1

            Item {
                id: bodyLeft
                width: 142
                height: parent.height
                clip: true

                Image {
                    id: imgIcon
                    width: 92
                    height: 69
                    anchors.left: parent.left
                    anchors.leftMargin: 10
                    source: selectedChanLogo
                    fillMode: Image.PreserveAspectFit
                }

                Text {
                    id: txtChannel
                    width: 92
                    height: 20
                    anchors.left: imgIcon.left
                    anchors.right: parent.right
                    anchors.rightMargin: 10
                    anchors.top: imgIcon.bottom
                    anchors.topMargin: 10
                    color:"#D4D5D6"
                    font.pixelSize: 22
                    wrapMode: Text.WrapAtWordBoundaryOrAnywhere
                    text: selectedChanName + " " + selectedChanNum
                }

            }

            Item {
                id: bodyMain
                anchors.left: bodyLeft.right
                anchors.right: parent.right
                height: parent.height

                Item {
                    id: itemProgram
                    width: parent.width
                    height: 60
//                    color:"transparent"
//                    border.color: "red"
//                    border.width: 1

                    Text {
                        id: txtProgram
                        width: parent.width - 20
                        height: parent.height
                        color: "white"
                        font.pixelSize: 26
                        text: selectedProgTitle + ", "
                              + Qt.formatDate ( selectedProgSTime, "MM/dd/yyyy" ) + ", "
                              + Qt.formatDateTime ( selectedProgSTime, "hh:mm" ) + " - "
                              + Qt.formatDateTime ( selectedProgETime, "hh:mm" )
                        wrapMode: Text.WordWrap
                    }
                }

                Item {
                    id: itemAdjust
                    width: parent.width
                    height: 151
                    anchors.top: itemProgram.bottom
//                    color:"transparent"
//                    border.color: "green"
//                    border.width: 1

                    Item {
                        id: itemStartTime
                        width: 267
                        height: parent.height
//                        color:"transparent"
//                        border.color: "red"
//                        border.width: 1
                        property date recSTime
                        property double recSUtc: getRecSUtc()

                        function getRecSUtc() {
                            return initRecSUtc + (recSTime.getTime() - initRecSTime.getTime()) / 1000
                        }

                        onRecSUtcChanged: {
                            checkConflict()
                        }

                        function addHour(numAdded) {
                            inputStartHour.visible = false
                            var dateTime = new Date( Qt.formatDate( recSTime, "MM/dd/yyyy" ) )
                            dateTime.setMinutes( Qt.formatDateTime ( recSTime, "mm" )  );
                            dateTime.setHours( recSTime.getHours()+numAdded );
                            while (dateTime - currentTime < 60000) {
                                dateTime.setHours(dateTime.getHours() + 1)
                            }
                            recSTime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                            itemEndTime.refresh()
                            //console.log("recSTime = " + recSTime)
                        }

                        function addMin(numAdded) {
                            inputStartMin.visible = false
                            var dateTime = new Date( Qt.formatDate( recSTime, "MM/dd/yyyy" ) )
                            dateTime.setHours( Qt.formatDateTime ( recSTime, "hh" )  );
                            dateTime.setMinutes( recSTime.getMinutes()+numAdded );
                            while (dateTime - currentTime < 60000) {
                                dateTime.setMinutes(dateTime.getMinutes() + 1)
                            }
                            recSTime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                            itemEndTime.refresh()
                            //console.log("recSTime = " + recSTime)
                        }

                        function setHour(numHour) {
                            startMin.focus = true
                            var dateTime = new Date( Qt.formatDate( recSTime, "MM/dd/yyyy" ) )
                            dateTime.setMinutes( Qt.formatDateTime ( recSTime, "mm" )  );
                            dateTime.setHours( numHour );
                            while (dateTime - currentTime < 60000) {
                                dateTime.setHours(dateTime.getHours() + 1)
                            }
                            recSTime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                            itemEndTime.refresh()
//                            console.log("recSTime = " + recSTime)
                        }

                        function setMin(numMin) {
                            endHour.focus = true
                            var dateTime = new Date( Qt.formatDate( recSTime, "MM/dd/yyyy" ) )
                            dateTime.setHours( Qt.formatDateTime ( recSTime, "hh" )  );
                            dateTime.setMinutes( numMin );
                            while (dateTime - currentTime < 60000) {
                                dateTime.setMinutes(dateTime.getMinutes() + 1)
                            }
                            recSTime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                            itemEndTime.refresh()
//                            console.log("recSTime = " + recSTime)
                        }

                        Image {
                            id: imgFocusStartTime
                            source: "Glow_blue.png"
                            visible: startHour.focus || startMin.focus

                            Row {
                                id: startTime_highlight
                                width: 73
                                height: 66
                                anchors.centerIn: parent
                                visible: inputStartHour.visible || inputStartMin.visible

                                Image {
                                    source: "../Common/datetim_HL_bar_left.png"
                                }
                                Image {
                                    source: "../Common/datetim_HL_bar_middle.png"
                                }
                                Image {
                                    source: "../Common/datetim_HL_bar_right.png"
                                }
                            }

                            Row {
                                id: arrow_up_highlight_S
                                width: 73
                                height: 36
                                anchors.centerIn: arrow_up_S
                                visible: (mouse_startHour.containsMouse && mouse_startHour.mouseY < 20) || mouse_startMin.containsMouse && mouse_startMin.mouseY < 20

                                Image {
                                    source: "../Common/Blue_Left_36.png"
                                }
                                Image {
                                    source: "../Common/Blue_Middle_36.png"
                                }
                                Image {
                                    source: "../Common/Blue_Right_36.png"
                                }
                            }

                            Image {
                                id: arrow_up_S
                                source: "Pointer_button_arrow_up.png"
                                anchors.left: parent.left
                                anchors.leftMargin: 131
                                anchors.top: parent.top
                                anchors.topMargin: 94
                            }

                            Row {
                                id: arrow_down_highlight_S
                                width: 73
                                height: 36
                                anchors.centerIn: arrow_down_S
                                visible: (mouse_startHour.containsMouse && mouse_startHour.height - mouse_startHour.mouseY < 20) || (mouse_startMin.containsMouse && mouse_startMin.height - mouse_startMin.mouseY < 20)

                                Image {
                                    source: "../Common/Blue_Left_36.png"
                                }
                                Image {
                                    source: "../Common/Blue_Middle_36.png"
                                }
                                Image {
                                    source: "../Common/Blue_Right_36.png"
                                }
                            }

                            Image {
                                id: arrow_down_S
                                source: "Pointer_button_arrow_down.png"
                                anchors.left: parent.left
                                anchors.leftMargin: 131
                                anchors.top: parent.top
                                anchors.topMargin: 183
                            }
                        }

                        Text {
                            id: txtStartTime
                            width: 100
                            height: 24
                            color: "#8E8E8E"
                            font.pixelSize: 24
                            text: qsTranslate("QObject", "Start time")
                        }

                        Text {
                            id: startHour
                            width: 73
                            height: 50
                            anchors.top: txtStartTime.bottom
                            anchors.topMargin: 41
//                            focus: recordingView.focus
                            color: inputStartHour.visible? "transparent" : (focus? "white" : "#D4D5D6")
                            font.pixelSize: focus? 56 : 50
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            text: Qt.formatDateTime ( itemStartTime.recSTime, "hh" )
                            onFocusChanged: {
                                if (focus) {
                                    inputStartMin.visible = false
                                    imgFocusStartTime.anchors.centerIn = startHour
                                }
                            }

                            Keys.onPressed: {
                                //console.log("[Recording][startHour] event.key = " + event.key)
                                if (selectedRecStatus != 6) {
                                    if ( event.key == Qt.Key_Up ) {
                                        //console.log("add hour")
                                        itemStartTime.addHour(1)
                                    }
                                    else if ( event.key == Qt.Key_Down ) {
                                        //console.log("minus hour")
                                        itemStartTime.addHour(-1)
                                    }
                                    else if ( event.key >= Qt.Key_0 && event.key <= Qt.Key_9 ) {
                                        var num = event.key - Qt.Key_0
    //                                    console.log("key " + num + " be pressed")
                                        if (inputStartHour.visible == false) {
                                            inputStartHour.visible = true
                                            inputStartHour.digitNum1 = num
                                            inputStartHour.text = num + "-"
                                        }
                                        else {
                                            if (inputStartHour.digitNum1 > 2)
                                                return
                                            if (!(inputStartHour.digitNum1 == 2 && num >4)) {
                                                inputStartHour.text = inputStartHour.digitNum1 + num
                                                var hour = parseInt(inputStartHour.text, 10)
    //                                            console.log("hour = " + hour)
                                                itemStartTime.setHour(hour)
                                            }
                                        }
                                    }
                                }

                                if ( event.key == Qt.Key_Right  || event.key == Qt.Key_Return ) {
                                    if (inputStartHour.visible) {
                                        itemStartTime.setHour(inputStartHour.digitNum1)
                                    }
                                    startMin.focus = true
                                }
                            }
                        }

                        Text {
                            id: inputStartHour
                            width: startHour.width
                            height: startHour.height
                            anchors.top: startHour.top
                            anchors.left: startHour.left
                            color: "white"
                            font.pixelSize: 56
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            visible: false
                            property string digitNum1
                        }

                        Item {
                            width: startHour.width
                            height: startHour.height + 60
                            anchors.left: startHour.left
                            anchors.verticalCenter: startHour.verticalCenter

                            MouseArea {
                                id: mouse_startHour
                                anchors.fill: parent
                                hoverEnabled: true

                                Image {
                                    source: getUPointImg()
                                    visible: uPointMode != -1 && stagePVR.isMouseVisible() && parent.enabled && parent.containsMouse
                                    x: parent.mouseX
                                    y: parent.mouseY
                                }

                                onClicked: {
//                                    console.log("mouseY = " + mouseY + ", height = " + height)
                                    if (mouseY < 20)
                                        itemStartTime.addHour(1)
                                    else if (height - mouseY < 20)
                                        itemStartTime.addHour(-1)
                                }
                                onEntered: {
                                    startHour.focus = true
                                }
                                onExited: {
                                    inputStartHour.visible = false
                                }

                            }

                        }

                        Text {
//                            id: name
                            text: ":"
                            width: 5
                            height: 50
                            anchors.top: startHour.top
                            anchors.left: startHour.right
                            anchors.leftMargin: 11
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            color: "#D4D5D6"
                            font.pixelSize: 50
                        }

                        Text {
                            id: startMin
                            width: 73
                            height: 50
                            anchors.top: startHour.top
                            anchors.left: startHour.right
                            anchors.leftMargin: 25
                            color: inputStartMin.visible? "transparent" : (focus? "white" : "#D4D5D6")
                            font.pixelSize: focus? 56 : 50
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            text: Qt.formatDateTime ( itemStartTime.recSTime, "mm" )
                            onFocusChanged: {
                                if (focus) {
                                    inputStartHour.visible = false
                                    inputEndHour.visible = false
                                    imgFocusStartTime.anchors.centerIn = startMin
                                }
                            }

                            Keys.onPressed: {
                                //console.log("[Recording][startMin] event.key = " + event.key)
                                if (selectedRecStatus != 6) {
                                    if ( event.key == Qt.Key_Up ) {
                                        //console.log("add minute")
                                        itemStartTime.addMin(1)
                                    }
                                    else if ( event.key == Qt.Key_Down ) {
                                        //console.log("minus minute")
                                        itemStartTime.addMin(-1)
                                    }
                                }

                                if ( event.key == Qt.Key_Right || event.key == Qt.Key_Return ) {
                                    if (inputStartMin.visible) {
                                        itemStartTime.setMin(inputStartMin.digitNum1)
                                    }
                                    endHour.focus = true
                                }
                                else if ( event.key == Qt.Key_Left ) {
                                    if (inputStartMin.visible) {
                                        itemStartTime.setMin(inputStartMin.digitNum1)
                                    }
                                    startHour.focus = true
                                }
                                else if ( event.key >= Qt.Key_0 && event.key <= Qt.Key_9 ) {
                                    var num = event.key - Qt.Key_0
//                                    console.log("key " + num + " be pressed")
                                    if (inputStartMin.visible == false ) {
                                        if (num >=0 && num <=5) {
                                            inputStartMin.visible = true
                                            inputStartMin.digitNum1 = num
                                            inputStartMin.text = num + "-"
                                        }
                                        else {
                                            itemStartTime.setMin(num)
                                        }
                                    }
                                    else if (inputStartMin.visible == true) {
                                        inputStartMin.text = inputStartMin.digitNum1 + num
                                        var min = parseInt(inputStartMin.text, 10)
//                                        console.log("min = " + min)
                                        itemStartTime.setMin(min)
                                    }
                                }
                            }
                        }

                        Text {
                            id: inputStartMin
                            width: startMin.width
                            height: startMin.height
                            anchors.top: startMin.top
                            anchors.left: startMin.left
                            color: "white"
                            font.pixelSize: 56
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            visible: false
                            property string digitNum1
                        }

                        Item {
                            width: startMin.width
                            height: startMin.height + 60
                            anchors.left: startMin.left
                            anchors.verticalCenter: startMin.verticalCenter

                            MouseArea {
                                id: mouse_startMin
                                anchors.fill: parent
                                hoverEnabled: true

                                Image {
                                    source: getUPointImg()
                                    visible: uPointMode != -1 && stagePVR.isMouseVisible() && parent.enabled && parent.containsMouse
                                    x: parent.mouseX
                                    y: parent.mouseY
                                }

                                onClicked: {
//                                    console.log("mouseY = " + mouseY + ", height = " + height)
                                    if (mouseY < 20)
                                        itemStartTime.addMin(1)
                                    else if (height - mouseY < 20)
                                        itemStartTime.addMin(-1)
                                }
                                onEntered: {
                                    startMin.focus = true
                                }
                                onExited: {
                                    inputStartMin.visible = false
                                }

                            }

                        }

                        Image {
                            id: sTimeConflict
                            source: "iconPVR_conflict.png"
                            anchors.left: startMin.right
                            anchors.leftMargin: 3
                            anchors.top: startMin.top
                            anchors.topMargin: 10
                            visible: false
                        }

                    }

                    Item {
                        id: itemEndTime
                        width: 267
                        anchors.left: itemStartTime.right
                        height: parent.height
//                        color:"transparent"
//                        border.color: "green"
//                        border.width: 1
                        property date recETime: selectedProgETime
                        property double recEUtc: getRecEUtc()

                        function getRecEUtc() {
                            return initRecEUtc + (recETime.getTime() - initRecETime.getTime()) / 1000
                        }

                        onRecEUtcChanged: {
                            checkConflict()
                        }

                        function addHour(numAdded) {
                            inputEndHour.visible = false
                            var dateTime = new Date( Qt.formatDate( recETime, "MM/dd/yyyy" ) )
                            dateTime.setMinutes( Qt.formatDateTime ( recETime, "mm" )  );
                            dateTime.setHours( recETime.getHours()+numAdded );
                            setRecETime(dateTime)
                            //console.log("recSTime = " + recETime)
                        }

                        function addMin(numAdded) {
                            inputEndMin.visible = false
                            var dateTime = new Date( Qt.formatDate( recETime, "MM/dd/yyyy" ) )
                            dateTime.setHours( Qt.formatDateTime ( recETime, "hh" )  );
                            dateTime.setMinutes( recETime.getMinutes()+numAdded );
                            setRecETime(dateTime)
                            //console.log("recSTime = " + recETime)
                        }

                        function setHour(numHour) {
                            endMin.focus = true
                            var dateTime = new Date( Qt.formatDate( recETime, "MM/dd/yyyy" ) )
                            dateTime.setMinutes( Qt.formatDateTime ( recETime, "mm" )  );
                            dateTime.setHours( numHour );
                            setRecETime(dateTime)
                        }

                        function setMin(numMin) {
                            btnConfirm.focus = true
                            inputEndMin.visible = false
                            var dateTime = new Date( Qt.formatDate( recETime, "MM/dd/yyyy" ) )
                            dateTime.setHours( Qt.formatDateTime ( recETime, "hh" )  );
                            dateTime.setMinutes( numMin );
                            setRecETime(dateTime)
                        }

                        function refresh() {
                            var dateTime = new Date(recETime)
                            setRecETime(dateTime)
                        }

                        function setRecETime(dateTime) {
                            while (dateTime - itemStartTime.recSTime >= 86400000) {
                                dateTime.setDate(dateTime.getDate() - 1)
                            }
                            while (dateTime < itemStartTime.recSTime) {
                                dateTime.setDate(dateTime.getDate() + 1)
                            }
                            recETime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                        }

                        Image {
                            id: imgFocusEndTime
                            source: "Glow_blue.png"
                            visible: endHour.focus || endMin.focus

                            Row {
                                id: endTime_highlight
                                width: 73
                                height: 66
                                anchors.centerIn: parent
                                visible: inputEndHour.visible || inputEndMin.visible

                                Image {
                                    source: "../Common/datetim_HL_bar_left.png"
                                }
                                Image {
                                    source: "../Common/datetim_HL_bar_middle.png"
                                }
                                Image {
                                    source: "../Common/datetim_HL_bar_right.png"
                                }
                            }

                            Row {
                                id: arrow_up_highlight_E
                                width: 73
                                height: 36
                                anchors.centerIn: arrow_up_E
                                visible: (mouse_endHour.containsMouse && mouse_endHour.mouseY < 20) || mouse_endMin.containsMouse && mouse_endMin.mouseY < 20

                                Image {
                                    source: "../Common/Blue_Left_36.png"
                                }
                                Image {
                                    source: "../Common/Blue_Middle_36.png"
                                }
                                Image {
                                    source: "../Common/Blue_Right_36.png"
                                }
                            }

                            Image {
                                id: arrow_up_E
                                source: "Pointer_button_arrow_up.png"
                                anchors.left: parent.left
                                anchors.leftMargin: 131
                                anchors.top: parent.top
                                anchors.topMargin: 94
                            }

                            Row {
                                id: arrow_down_highlight_E
                                width: 73
                                height: 36
                                anchors.centerIn: arrow_down_E
                                visible: (mouse_endHour.containsMouse && mouse_endHour.height - mouse_endHour.mouseY < 20) || (mouse_endMin.containsMouse && mouse_endMin.height - mouse_endMin.mouseY < 20)

                                Image {
                                    source: "../Common/Blue_Left_36.png"
                                }
                                Image {
                                    source: "../Common/Blue_Middle_36.png"
                                }
                                Image {
                                    source: "../Common/Blue_Right_36.png"
                                }
                            }

                            Image {
                                id: arrow_down_E
                                source: "Pointer_button_arrow_down.png"
                                anchors.left: parent.left
                                anchors.leftMargin: 131
                                anchors.top: parent.top
                                anchors.topMargin: 183
                            }
                        }

                        Text {
                            id: txtEndTime
                            width: 100
                            height: 24
                            color: "#8E8E8E"
                            font.pixelSize: 24
                            text: qsTranslate("QObject", "End time")
                        }

                        Text {
                            id: endHour
                            width: 73
                            height: 50
                            anchors.top: txtEndTime.bottom
                            anchors.topMargin: 41
                            color: inputEndHour.visible? "transparent" : (focus? "white" : "#D4D5D6")
                            font.pixelSize: focus? 56 : 50
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            text: Qt.formatDateTime ( itemEndTime.recETime, "hh" )
                            onFocusChanged: {
                                if (focus) {
                                    inputStartMin.visible = false
                                    inputEndMin.visible = false
                                    imgFocusEndTime.anchors.centerIn = endHour
                                }
                            }

                            Keys.onPressed: {
                                //console.log("[Recording][endHour] event.key = " + event.key)
                                if ( event.key == Qt.Key_Up ) {
                                    //console.log("add hour")
                                    itemEndTime.addHour(1)
                                }
                                if ( event.key == Qt.Key_Down ) {
                                    //console.log("minus hour")
                                    itemEndTime.addHour(-1)
                                }
                                if ( event.key == Qt.Key_Right || event.key == Qt.Key_Return ) {
                                    if (inputEndHour.visible) {
                                        itemEndTime.setHour(inputEndHour.digitNum1)
                                    }
                                    endMin.focus = true
                                }
                                if ( event.key == Qt.Key_Left ) {
                                    if (inputEndHour.visible) {
                                        itemEndTime.setHour(inputEndHour.digitNum1)
                                    }
                                    startMin.focus = true
                                }
                                if ( event.key >= Qt.Key_0 && event.key <= Qt.Key_9 ) {
                                    var num = event.key - Qt.Key_0
//                                    console.log("key " + num + " be pressed")
                                    if (inputEndHour.visible == false) {
                                        inputEndHour.visible = true
                                        inputEndHour.digitNum1 = num
                                        inputEndHour.text = num + "-"
                                    }
                                    else {
                                        if (inputEndHour.digitNum1 > 2)
                                            return
                                        if (!(inputEndHour.digitNum1 == 2 && num >4)) {
                                            inputEndHour.text = inputEndHour.digitNum1 + num
                                            var hour = parseInt(inputEndHour.text, 10)
//                                            console.log("hour = " + hour)
                                            itemEndTime.setHour(hour)
                                        }
                                    }
                                }
                            }
                        }

                        Text {
                            id: inputEndHour
                            width: endHour.width
                            height: endHour.height
                            anchors.top: endHour.top
                            anchors.left: endHour.left
                            color: "white"
                            font.pixelSize: 56
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            visible: false
                            property string digitNum1
                        }

                        Item {
                            width: endHour.width
                            height: endHour.height + 60
                            anchors.left: endHour.left
                            anchors.verticalCenter: endHour.verticalCenter

                            MouseArea {
                                id: mouse_endHour
                                anchors.fill: parent
                                hoverEnabled: true

                                Image {
                                    source: getUPointImg()
                                    visible: uPointMode != -1 && stagePVR.isMouseVisible() && parent.enabled && parent.containsMouse
                                    x: parent.mouseX
                                    y: parent.mouseY
                                }

                                onClicked: {
//                                    console.log("mouseY = " + mouseY + ", height = " + height)
                                    if (mouseY < 20)
                                        itemEndTime.addHour(1)
                                    else if (height - mouseY < 20)
                                        itemEndTime.addHour(-1)
                                }
                                onEntered: {
                                    endHour.focus = true
                                }
                                onExited: {
                                    inputEndHour.visible = false
                                }

                            }

                        }

                        Text {
//                            id: name
                            text: ":"
                            width: 5
                            height: 50
                            anchors.top: endHour.top
                            anchors.left: endHour.right
                            anchors.leftMargin: 11
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            color: "#D4D5D6"
                            font.pixelSize: 50
                        }

                        Text {
                            id: endMin
                            width: 73
                            height: 50
                            anchors.top: endHour.top
                            anchors.left: endHour.right
                            anchors.leftMargin: 25
                            color: inputEndMin.visible? "transparent" : (focus? "white" : "#D4D5D6")
                            font.pixelSize: focus? 56 : 50
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            text: Qt.formatDateTime ( itemEndTime.recETime, "mm" )
                            onFocusChanged: {
                                if (focus) {
                                    inputEndHour.visible = false
                                    imgFocusEndTime.anchors.centerIn = endMin
                                }
                            }

                            Keys.onPressed: {
                                //console.log("[Recording][endMin] event.key = " + event.key)
                                if ( event.key == Qt.Key_Up ) {
                                    //console.log("add minute")
                                    itemEndTime.addMin(1)
                                }
                                if ( event.key == Qt.Key_Down ) {
                                    //console.log("minus minute")
                                    itemEndTime.addMin(-1)
                                }
                                if ( event.key == Qt.Key_Right || event.key == Qt.Key_Return ) {
                                    if (inputEndMin.visible) {
                                        itemEndTime.setMin(inputEndMin.digitNum1)
                                    }
                                    btnConfirm.focus = true
                                }
                                if ( event.key == Qt.Key_Left ) {
                                    if (inputEndMin.visible) {
                                        itemEndTime.setMin(inputEndMin.digitNum1)
                                    }
                                    endHour.focus = true
                                }
                                if ( event.key >= Qt.Key_0 && event.key <= Qt.Key_9 ) {
                                    var num = event.key - Qt.Key_0
//                                    console.log("key " + num + " be pressed")
                                    if (inputEndMin.visible == false ) {
                                        if (num >=0 && num <=5) {
                                            inputEndMin.visible = true
                                            inputEndMin.digitNum1 = num
                                            inputEndMin.text = num + "-"
                                        }
                                        else {
                                            itemEndTime.setMin(num)
                                        }
                                    }
                                    else if (inputEndMin.visible == true) {
                                        inputEndMin.text = inputEndMin.digitNum1 + num
                                        var min = parseInt(inputEndMin.text, 10)
//                                        console.log("min = " + min)
                                        itemEndTime.setMin(min)
                                    }
                                }
                            }
                        }

                        Text {
                            id: inputEndMin
                            width: endMin.width
                            height: endMin.height
                            anchors.top: endMin.top
                            anchors.left: endMin.left
                            color: "white"
                            font.pixelSize: 56
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            visible: false
                            property string digitNum1
                        }

                        Item {
                            width: endMin.width
                            height: endMin.height + 60
                            anchors.left: endMin.left
                            anchors.verticalCenter: endMin.verticalCenter

                            MouseArea {
                                id: mouse_endMin
                                anchors.fill: parent
                                hoverEnabled: true

                                Image {
                                    source: getUPointImg()
                                    visible: uPointMode != -1 && stagePVR.isMouseVisible() && parent.enabled && parent.containsMouse
                                    x: parent.mouseX
                                    y: parent.mouseY
                                }

                                onClicked: {
//                                    console.log("mouseY = " + mouseY + ", height = " + height)
                                    if (mouseY < 20)
                                        itemEndTime.addMin(1)
                                    else if (height - mouseY < 20)
                                        itemEndTime.addMin(-1)
                                }
                                onEntered: {
                                    endMin.focus = true
                                }
                                onExited: {
                                    inputEndMin.visible = false
                                }

                            }

                        }

                        Image {
                            id: eTimeConflict
                            source: "iconPVR_conflict.png"
                            anchors.left: endMin.right
                            anchors.leftMargin: 3
                            anchors.top: endMin.top
                            anchors.topMargin: 10
                            visible: false
                        }

                    }

                }

                Item {
                    id: itemErrorMsg
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.rightMargin: 86
                    height: 88
                    anchors.top: itemAdjust.bottom
//                    color:"transparent"
//                    border.color: "red"
//                    border.width: 1

                    Text {
                        id: txtErrorMsg
                        width: parent.width
                        height: parent.height
                        wrapMode: Text.WordWrap
                        color: "#8E8E8E"
                        font.pixelSize: 26
                    }
                }

                Item {
                    id: itemButtons
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.rightMargin: 12
                    height: 70
                    anchors.top: itemErrorMsg.bottom
//                    color:"transparent"
//                    border.color: "blue"
//                    border.width: 1

                    DialogButton {
                        id: btnConfirm
                        btnString: qsTranslate("QObject", "Confirm")
                        focus: recordingView.focus

                        function onBtnConfirmClicked() {
                            if (conflictState == -1) {
                                console.log("Cancel because of invalid time")
                                close()
                                return
                            }

                            //console.log("Confirm")
                            recordProgSUtc = itemStartTime.recSUtc
                            recordProgEUtc = itemEndTime.recEUtc
                            confirm()
                            //close()
                        }

                        Keys.onPressed: {
                            //console.log("[Recording][btnConfirm] event.key = " + event.key)
                            if ( event.key == Qt.Key_Return ) {
                                onBtnConfirmClicked()
                            }
                            if ( event.key == Qt.Key_Right ) {
                                btnClose.focus = true
                            }
                            if ( event.key == Qt.Key_Left || event.key == Qt.Key_Up ) {
                                endMin.focus = true
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            hoverEnabled: true

                            Image {
                                source: getUPointImg()
                                visible: uPointMode != -1 && stagePVR.isMouseVisible() && parent.enabled && parent.containsMouse
                                x: parent.mouseX
                                y: parent.mouseY
                            }

                            onClicked: {
                                parent.onBtnConfirmClicked()
                            }
                            onEntered: {
                                parent.focus = true
                            }

                        }

                    }

                    DialogButton {
                        id: btnClose
                        btnString: qsTranslate("QObject", "Close")
                        anchors.left: btnConfirm.right
                        anchors.leftMargin: 10
//                        focus: true
                        Keys.onPressed: {
                            //console.log("[Recording][btnClose] event.key = " + event.key)
                            if ( event.key == Qt.Key_Return ) {
                                //console.log("Close")
                                close()
                            }
                            if ( event.key == Qt.Key_Left ) {
                                btnConfirm.focus = true
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            hoverEnabled: true

                            Image {
                                source: getUPointImg()
                                visible: uPointMode != -1 && stagePVR.isMouseVisible() && parent.enabled && parent.containsMouse
                                x: parent.mouseX
                                y: parent.mouseY
                            }

                            onClicked: {
                                close()
                            }
                            onEntered: {
                                parent.focus = true
                            }

                        }

                    }


                }

            }

        }

        Image {
            id: imgPointRecording
            source: getUPointImg()
            visible: uPointMode != -1 && stagePVR.isMouseVisible() && uPointRecording.enabled && uPointRecording.containsMouse
            x: uPointRecording.mouseX
            y: uPointRecording.mouseY
            parent:uPointRecording.parent

        }

        MouseArea {
            id: uPointRecording
            anchors.fill: parent
            hoverEnabled: true
            z: -1
        }

    }


}
