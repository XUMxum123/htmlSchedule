// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1
import "../Common"

Item {
    id: menualRecording
    width: 1280
    height: 720

    property bool isStep1: true
    property double systemCurUtc
    property string selectedChanNum
    property double selectedChanId
    property string selectedChanName
    property string selectedChanLogo
    property date initRecSTime
    property date initRecETime
    property double initRecSUtc
    property double initRecEUtc
    property int warnStrId: -1
    property int conflictState: 0

    signal cancel
    signal confirm

    function checkConflict() {
        var conflictInfo = pvrInfo.getPvrRecConflictInfo(-1, selectedChanName, itemStartTime.recSUtc, itemEndTime.recEUtc)
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

    onFocusChanged: {
//        console.log("[ManualRecording] focus changed:" + focus)
        if (focus)
            channelListView.focus = true
    }

    Component.onCompleted: {
        var faTime = pvrInfo.getCurrentSystemTime();
        systemCurUtc = faTime[1];

        var startUtc = faTime[1];
        startUtc = startUtc - (startUtc % 300) + 300;
        var startTime = pvrInfo.convertToLocalTime(startUtc);

        initRecSUtc = startUtc;
        initRecSTime = startTime;
        itemStartTime.recSTime = initRecSTime;

        var endTime = startTime;
        endTime.setMinutes(endTime.getMinutes() + 30);

        initRecEUtc = startUtc + 1800;
        initRecETime = endTime;
        itemEndTime.recETime = initRecETime;
    }

    Connections {
        target: pvrMainWindow
        onCurrentTimeChanged: {
            systemCurUtc = currentUtc;
//            console.log("currentTime = " + currentTime)
        }
    }

    MouseArea {
        id: uPointOutside
        anchors.fill: parent
        hoverEnabled: true

        onEntered: {
            isClickable = false
        }
    }

    WindowBackground {
        width: isStep1? 984 : 1164
        height: isStep1? 654 : 510
        anchors.verticalCenter: parent.verticalCenter
        anchors.horizontalCenter: parent.horizontalCenter
    }

    Item {
        id: itemStep1
        width: 920
        height: 590
        anchors.centerIn: parent
        visible: isStep1

        Image {
//            id: name
            source: "PVR_Vertical_divider.png"
            width: 886
            height: 1
            anchors.top: itemStep1Main.top
            anchors.horizontalCenter: parent.horizontalCenter
        }

        Image {
//            id: name
            source: "PVR_Vertical_divider.png"
            width: 886
            height: 1
            anchors.top: itemStep1Main.bottom
            anchors.horizontalCenter: parent.horizontalCenter
        }

        Item {
            id: itemStep1Bottom
            width: parent.width
            height: 75
            anchors.bottom: parent.bottom

            DialogButton {
                id: btnStep1Cancel
                anchors.left: parent.left
                anchors.leftMargin: 4
                anchors.bottom: parent.bottom
                anchors.bottomMargin: -4
                btnString: qsTranslate("QObject", "Cancel")
                Keys.onPressed: {
//                    console.log("[ManualRecording][btnStep1Cancel] event.key = " + event.key)
                    if ( event.key == Qt.Key_Return ) {
//                        console.log("step1, cancel")
                        cancel()
                    }
                    if ( event.key == Qt.Key_Right ) {
                        btnStep1Next.focus = true
                    }
                    if ( event.key == Qt.Key_Up ) {
                        channelListView.focus = true
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
                        isClickable = false
                        cancel()
                    }
                    onEntered: {
                        parent.focus = true
                        isClickable = true
                    }
                    onExited: {
                        isClickable = false
                    }
                }

            }

            DialogButton {
                id: btnStep1Next
                anchors.right: parent.right
                anchors.rightMargin: 4
                anchors.bottom: parent.bottom
                anchors.bottomMargin: -4
                btnString: qsTranslate("QObject", "Next")
                Keys.onPressed: {
//                    console.log("[ManualRecording][btnStep1Next] event.key = " + event.key)
                    if ( event.key == Qt.Key_Return ) {
//                        console.log("step1, next")
                        isStep1 = false
                    }
                    if ( event.key == Qt.Key_Left ) {
                        btnStep1Cancel.focus = true
                    }
                    if ( event.key == Qt.Key_Up ) {
                        channelListView.focus = true
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
                        isClickable = false
                        isStep1 = false
                    }
                    onEntered: {
                        parent.focus = true
                        isClickable = true
                    }
                    onExited: {
                        isClickable = false
                    }
                }

            }
        }

        Item {
            id: itemStep1Top
            width: parent.width
            height: 106

            Text {
                id: step1Title
                width: 800
                height: 36
                anchors.left: parent.left
                anchors.leftMargin: 17
                font.pixelSize: 34
                color: "white"
                text: qsTranslate("QObject", "Manual Recording")+qsTranslate("QObject", " - ")+qsTranslate("QObject", "Select Channel")
            }

//            Text {
//                width: 90
//                height: 26
//                anchors.right: parent.right
//                horizontalAlignment: Text.AlignRight
//                font.pixelSize: 36
//                color: "white"
//                text: "1/2"
//            }

            Text {
                id: step1Subtitle
                width: 800
                height: 26
                anchors.left: parent.left
                anchors.leftMargin: 17
                anchors.top: step1Title.bottom
                anchors.topMargin: 5
                font.pixelSize: 26
                color: "#8D9498"
                text: qsTranslate("QObject", "Please select the channel that you would like to record")
            }
        }

        Item {
            id: itemStep1Main
            width: parent.width
            height: 409
            anchors.top: parent.top
            anchors.topMargin: 106

            MouseArea {
                id: uPointChList
                anchors.fill: parent
                hoverEnabled: true
//                enabled: !itemChannelList.isBtnFocus
                property int mouseIndex: -1

                onMousePositionChanged: {
                    mouseIndex = channelListView.indexAt(0, channelListView.contentY + mouseY - itemChannelList.y - channelListView.y)
//                    console.log("[uPointChList]MousePositionChanged, (x,y)=(" + mouseX + "," + mouseY +")")
//                    console.log("mouseIndex = " + mouseIndex)
                    if(mouseIndex == -1)
                        isClickable = false
                    btnStep1Next.focus = false
                    btnStep1Cancel.focus = false
                    if (mouseY < pointerTop.y + pointerTop.height + 10 || mouseY > pointerBottom.y - 10  )
                        return
                    if(mouseIndex != -1) {
                        channelListView.currentIndex = mouseIndex
                        isClickable = true
                    }
                }

                onClicked: {
                    if (pointerTop.visible)
                        channelListView.decrementCurrentIndex()
                    else if (pointerBottom.visible)
                        channelListView.incrementCurrentIndex()
                    else if (mouseIndex != -1) {
                        channelListView.onChListClicked()
                        isStep1 = false
                    }
                }
            }

            Item {
                id: itemChannelList
                width: parent.width
                height: 360
//                color: "transparent"
//                border.color: "red"
//                border.width: 1
                anchors.centerIn: parent
                clip: true
                property bool isBtnFocus: btnStep1Cancel.focus || btnStep1Next.focus

                ListModel {
                    id: channelModel
                    property int initialIndex
                    property int currentSection

                    function appendData() {                        
                        waitingBar.visible = true
                        var channellist = stagePVR.getChannelList()
                        waitingBar.visible = false

                        channelModel.clear()

                        var channelcount = channellist[0]
                        var num, id, name, logopath

                        for (var i = 0; i < channelcount; i++) {
                            num = channellist[4*i+1]
                            id = channellist[4*i+2]
                            name = channellist[4*i+3]
                            logopath = channellist[4*i+4]

                            // append channel list
                            channelModel.append({   "num" : num,
                                                    "id" : id,
                                                    "name": name,
                                                    "logopath" : logopath
                                                })
                        }
                    }
                }

                ListView {
                    id: channelListView
                    width: parent.width
                    height: 300
                    anchors.verticalCenter: parent.verticalCenter
                    model: channelModel
                    delegate: channelItemView
                    highlight: channelHighlighter
//                    focus: menualRecording.focus
                    cacheBuffer: 30
                    interactive: false
                    keyNavigationWraps: true

                    function onChListClicked() {
                        selectedChanId = channelModel.get(currentIndex).id
                        selectedChanName = channelModel.get(currentIndex).name
                        selectedChanNum = channelModel.get(currentIndex).num
                        selectedChanLogo = channelModel.get(currentIndex).logopath
                        btnStep1Next.focus = true
                    }

                    Keys.onPressed: {
//                        console.log("[ManualRecording][channelListView] event.key = " + event.key)
                        if ( event.key == Qt.Key_Down ) {
                            incrementCurrentIndex()
                        }
                        else if ( event.key == Qt.Key_Up ) {
                            decrementCurrentIndex()
                        }
                        else if ( event.key == Qt.Key_PageUp ) { //16777238, Ch+
                            //console.log("Ch+ be pressed, next day")
                            if (currentIndex - 5 <= 0)
                                currentIndex = 0
                            else
                                currentIndex -= 5
                        }
                        else if ( event.key == Qt.Key_PageDown ) { //16777239, Ch-
                            //console.log("Ch- be pressed, previous day")
                            if (currentIndex + 5 >= count)
                                currentIndex = count -1
                            else
                                currentIndex += 5
                        }
                        else if ( event.key == Qt.Key_Left ) {
                            btnStep1Cancel.focus = true
                        }
                        else if ( event.key == Qt.Key_B || event.key == Qt.Key_F34 ) { // RC_Back
                            cancel()
                        }
                        else if ( event.key == Qt.Key_Return || event.key == Qt.Key_Right) {
                            onChListClicked()
                        }
                    }
                }

                Rectangle {
//                        id: maskEffectTop
                    width: parent.width
                    height: 25
                    color: "black"
                    opacity: 0.5
                    visible: channelModel.count > 0
                }

                Rectangle {
//                        id: maskEffectBottom
                    width: parent.width
                    height: 25
                    anchors.bottom: parent.bottom
                    color: "black"
                    opacity: 0.5
                    visible: channelModel.count > 0
                }

                Item {
                    id: itemScrollBar
                    width: 8
                    height: channelListView.height
                    anchors.top: channelListView.top
//                    color: "transparent"
//                    border.color: "red"
//                    border.width: 1
                    anchors.right: parent.right
                    visible: channelListView.contentHeight > channelListView.height
//                    property int interval: parseInt(channelListView.contentHeight - channelListView.height) / 10

                    Image {
                        id: imgScrollBar
                        source: "List_Scroll_Bar.png"
                        height: (channelListView.height / channelListView.contentHeight) * parent.height
                        visible: channelListView.contentHeight > parent.height
                    }

                    Connections {
                        target: channelListView
                        onContentYChanged: {
                            imgScrollBar.y = (channelListView.contentY * (itemScrollBar.height - imgScrollBar.height)) /
                                             (channelListView.contentHeight - channelListView.height)
                        }
                    }
                }

                Component {
                    id: channelItemView
                    Item {
                        id: itemRow
                        width: channelListView.width - 50
                        height: 60

                        Item {
                            id: channelLogo
                            width: imgLogo.sourceSize.width == 0? 70 : 200
                            height: parent.height
//                                color: "transparent"
//                                border.color: "red"
//                                border.width: 1

                            Image {
                                id: imgLogo
                                source: logopath
                                anchors.left: parent.left
                                anchors.leftMargin: 46
                                anchors.verticalCenter: parent.verticalCenter
                                width: 80
                                height: 46
                                smooth: true
                                fillMode: Image.PreserveAspectFit
                            }
                        }

                        Item {
                            id: channelNumName
                            width: parent.width - channelLogo.width
                            height: parent.height
                            anchors.right: parent.right

                            Text {
                                id: txtNumName
                                width: parent.width
                                height: parent.height
                                color: "#D9D9D9"
                                font.pixelSize: 28
                                horizontalAlignment: Text.AlignLeft
                                verticalAlignment: Text.AlignVCenter
                                text: num + " " + name
                            }
                        }
                    }
                }

                Component {
                    id: channelHighlighter

                    Row {
                        width: channelListView.width
                        height: 60

                        Image {
                            id: highlightLeft
                            source: itemChannelList.isBtnFocus?"Selected_HL_2_left.png":"Blue_Left.png"
                            height: parent.height
                        }
                        Image {
                            id: highlightCenter
                            source: itemChannelList.isBtnFocus?"Selected_HL_2_center.png":"Blue_Middle.png"
                            width: parent.width - highlightLeft.width - highlightRight.width
                            height: parent.height
                        }
                        Image {
                            id: highlightRight
                            source: itemChannelList.isBtnFocus?"Selected_HL_2_right.png":"Blue_Right.png"
                            height: parent.height
                        }
                    }
                }

                Component.onCompleted: {
                    channelModel.appendData()
                }
            }

            Image {
                id: pointerTop
                source: "../Common/Pointer_button_back.png"
                width: parent.width
                height: 50
                visible: channelListView.currentIndex > 0 && uPointMode == 1 && x < uPointChList.mouseX && uPointChList.mouseX < (x + width) && y < uPointChList.mouseY && uPointChList.mouseY < (y + height) && uPointChList.containsMouse

                onVisibleChanged: {
                    if (visible)
                        isClickable = true
                }

                Image {
                    id: topArrow
                    source: "../Common/Pointer_button_arrow_up.png"
                    anchors.centerIn: parent
                }
            }

            Image {
                id: pointerBottom
                source: "../Common/Pointer_button_back.png"
                width: pointerTop.width
                height: 50
                anchors.left: pointerTop.left
                anchors.bottom: parent.bottom
                visible: channelListView.currentIndex < channelListView.count - 1 && uPointMode == 1 && x < uPointChList.mouseX && uPointChList.mouseX < (x + width) && y < uPointChList.mouseY && uPointChList.mouseY < (y + height)  && uPointChList.containsMouse

                onVisibleChanged: {
                    if (visible)
                        isClickable = true
                }

                Image {
                    id: bottomArrow
                    source: "../Common/Pointer_button_arrow_down.png"
                    anchors.centerIn: parent
                }
            }

            Image {
                id: imgPointChList
                source: getUPointImg()
                visible: uPointMode != -1 && stagePVR.isMouseVisible() && uPointChList.enabled && uPointChList.containsMouse
                x: uPointChList.mouseX
                y: uPointChList.mouseY
            }

        }

    }

    Item {
        id: itemStep2
        width: 1100
        height: 478
        anchors.centerIn: parent
        visible: !isStep1

        Item {
            id: recordingTop
            width: parent.width
            height: 85
            anchors.horizontalCenter: parent.horizontalCenter
//            color:"transparent"
//            border.color: "red"
//            border.width: 1

            Image {
                source: "iconPVR_recorded_HL.png"
                anchors.left: parent.left
                anchors.leftMargin: 5
                anchors.verticalCenter: txtTitle.verticalCenter
            }

            Text {
                id: txtTitle
                height: 40
                color: "white"
                font.pixelSize: 36
                anchors.left: parent.left
                anchors.leftMargin: 60
                anchors.top: parent.top
                anchors.topMargin: 36
                 text: qsTranslate("QObject", "Manual Recording") +
                       qsTranslate("QObject", " - ") +
                       qsTranslate("QObject", "Select Date and Time")
            }

//            Text {
//                height: parent.height
//                color: "white"
//                font.pixelSize: 36
//                anchors.right: parent.right
//                anchors.rightMargin: 14
//                anchors.top: parent.top
//                anchors.topMargin: 36
//                text: qsTranslate("QObject", "2/2")
//            }
        }

        Item {
            id: recordingBody
            width: 1100
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
                    anchors.top: imgIcon.bottom
                    anchors.topMargin: 10
                    color:"#D4D5D6"
                    font.pixelSize: 22
                    wrapMode: Text.WordWrap
                    text: selectedChanName + " " + selectedChanNum
                }
            }

            Item {
                id: bodyMain
                anchors.left: bodyLeft.right
                anchors.right: parent.right
                height: parent.height

                Item {
                    id: itemAdjust
                    width: parent.width
                    height: 207
//                    color:"transparent"
//                    border.color: "green"
//                    border.width: 1

                    Item {
                        id: itemStartDate
                        width: 217
                        height: parent.height
//                        color:"transparent"
//                        border.color: "red"
//                        border.width: 1

                        Image {
                            id: imgFocusStartDate
                            source: "Glow_blue.png"
                            visible: startDate.focus || startMonth.focus

                            Row {
                                id: arrow_up_highlight_D
                                width: 73
                                height: 36
                                anchors.centerIn: arrow_up_D
                                visible: (mouse_startDate_img.visible && mouse_startDate.mouseY < 20) //|| (mouse_startMonth.containsMouse && mouse_startMonth.mouseY < 20)

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
                                id: arrow_up_D
                                source: "Pointer_button_arrow_up.png"
                                anchors.left: parent.left
                                anchors.leftMargin: 131
                                anchors.top: parent.top
                                anchors.topMargin: 94
                            }

                            Row {
                                id: arrow_down_highlight_D
                                width: 73
                                height: 36
                                anchors.centerIn: arrow_down_D
                                visible: (mouse_startDate_img.visible && mouse_startDate.height - mouse_startDate.mouseY < 20) //|| (mouse_startMonth.containsMouse && mouse_startMonth.height - mouse_startMonth.mouseY < 20)

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
                                id: arrow_down_D
                                source: "Pointer_button_arrow_down.png"
                                anchors.left: parent.left
                                anchors.leftMargin: 131
                                anchors.top: parent.top
                                anchors.topMargin: 183
                            }
                        }

                        Text {
                            id: txtStartDate
                            width: 100
                            height: 24
                            color: "#8E8E8E"
                            font.pixelSize: 24
                            text: qsTranslate("QObject", "Date")
                        }

                        Text {
                            id: startDate
                            width: 73
                            height: 50
                            anchors.top: txtStartDate.bottom
                            anchors.topMargin: 43
                            focus: itemStep2.visible
                            color: focus? "white" : "#D4D5D6"
                            font.pixelSize: focus? 56 : 50
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            text: Qt.formatDateTime(itemStartTime.recSTime, "dd")
                            onFocusChanged: {
                                if (focus)
                                    imgFocusStartDate.anchors.centerIn = startDate
                            }

                            Keys.onPressed: {
//                                console.log("[ManualRecording][startDate] event.key = " + event.key)
                                if ( event.key == Qt.Key_Up ) {
                                    if ((itemStartTime.recSUtc + 86400) < (systemCurUtc + 86400 * 8))
                                    {
                                        //console.log("add date")
                                        itemStartTime.addDay(1)
                                    }
                                }
                                if ( event.key == Qt.Key_Down ) {
                                    if ((itemStartTime.recSUtc - 86400) >= systemCurUtc)
                                    {
                                        //console.log("minus date")
                                        itemStartTime.addDay(-1)
                                    }
                                }
                                if ( event.key == Qt.Key_Right ) {
                                    //startMonth.focus = true
                                    startHour.focus = true;
                                }
                            }
                        }

                        Item {
                            width: startDate.width
                            height: startDate.height + 60
                            anchors.left: startDate.left
                            anchors.verticalCenter: startDate.verticalCenter

                            MouseArea {
                                id: mouse_startDate
                                anchors.fill: parent
                                hoverEnabled: true

                                Image {
                                    id: mouse_startDate_img
                                    source: getUPointImg()
                                    visible: uPointMode != -1 && stagePVR.isMouseVisible() && parent.enabled && parent.containsMouse
                                    x: parent.mouseX
                                    y: parent.mouseY
                                }

                                onClicked: {
//                                    console.log("mouseY = " + mouseY + ", height = " + height)
                                    if (mouseY < 20) {
                                        itemStartTime.addDay(1)
                                        itemEndTime.addDay(1)
                                    }
                                    else if (height - mouseY < 20) {
                                        itemStartTime.addDay(-1)
                                        itemEndTime.addDay(-1)
                                    }
                                }
                                onEntered: {
                                    startDate.focus = true
                                }
                            }

                        }

                        Text {
//                            id: name
                            text: "/"
                            width: 5
                            height: 50
                            anchors.top: startDate.top
                            anchors.left: startDate.right
                            anchors.leftMargin: 11
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            color: "#D4D5D6"
                            font.pixelSize: 50
                        }

                        Text {
                            id: startMonth
                            width: 73
                            height: 50
                            anchors.top: startDate.top
                            anchors.left: startDate.right
                            anchors.leftMargin: 25
                            color: focus? "white" : "#D4D5D6"
                            font.pixelSize: focus? 56 : 50
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            text: Qt.formatDateTime(itemStartTime.recSTime, "MM")
//                            onFocusChanged: {
//                                if (focus)
//                                    imgFocusStartDate.anchors.centerIn = startMonth
//                            }

//                            Keys.onPressed: {
////                                console.log("[ManualRecording][startMonth] event.key = " + event.key)
//                                if ( event.key == Qt.Key_Up ) {
////                                    console.log("add month")
//                                    itemStartTime.addMonth(1)
//                                    itemEndTime.addMonth(1)
//                                }
//                                if ( event.key == Qt.Key_Down ) {
////                                    console.log("minus month")
//                                    itemStartTime.addMonth(-1)
//                                    itemEndTime.addMonth(-1)
//                                }
//                                if ( event.key == Qt.Key_Right ) {
//                                    startHour.focus = true
//                                }
//                                if ( event.key == Qt.Key_Left ) {
//                                    startDate.focus = true
//                                }
//                            }
                        }
                    }

                    Item {
                        id: itemStartDay
                        width: 168
                        height: parent.height
                        anchors.left: itemStartDate.right
//                        color:"transparent"
//                        border.color: "red"
//                        border.width: 1

                        Text {
                            id: txtStartDay
                            width: 100
                            height: 24
                            color: "#8E8E8E"
                            font.pixelSize: 24
                            text: qsTranslate("QObject", "Day")
                        }

                        Text {
                            id: startDay
                            width: 73
                            height: 50
                            anchors.top: txtStartDay.bottom
                            anchors.topMargin: 43
                            color: "#D4D5D6"
                            font.pixelSize: 50
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            text: trTools.shortDayName(Qt.formatDateTime(itemStartTime.recSTime, "ddd"))
                        }
                    }

                    Item {
                        id: itemStartTime
                        width: 267
                        height: parent.height
                        anchors.left: itemStartDay.right
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

                        function addMonth(numAdded) {
                            var dateTime = new Date(Qt.formatDate(recSTime, "MM/dd/yyyy"))
                            dateTime.setMinutes(Qt.formatDateTime(recSTime, "mm"));
                            dateTime.setHours(Qt.formatDateTime(recSTime, "hh"));
                            dateTime.setDate(Qt.formatDateTime(recSTime, "dd"));
                            dateTime.setMonth(recSTime.getMonth() + numAdded);
                            recSTime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                            itemEndTime.refresh()
                            console.log("recSTime = " + recSTime)
                        }

                        function addDay(numAdded) {
                            var dateTime = new Date(Qt.formatDate(recSTime, "MM/dd/yyyy"))
                            dateTime.setMinutes(Qt.formatDateTime(recSTime, "mm"));
                            dateTime.setHours(Qt.formatDateTime(recSTime, "hh"));
                            dateTime.setDate(recSTime.getDate() + numAdded);
                            recSTime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                            itemEndTime.refresh()
                            console.log("recSTime = " + recSTime)
                        }

                        function addHour(numAdded) {
                            inputStartHour.visible = false
                            var dateTime = new Date(Qt.formatDate(recSTime, "MM/dd/yyyy"))
                            dateTime.setMinutes(Qt.formatDateTime(recSTime, "mm"));
                            dateTime.setHours(recSTime.getHours() + numAdded);
                            while (dateTime - currentTime < 60000) {
                                dateTime.setHours(dateTime.getHours() + 1)
                            }
                            recSTime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                            itemEndTime.refresh()
//                            console.log("recSTime = " + recSTime)
                        }

                        function addMin(numAdded) {
                            inputStartMin.visible = false
                            var dateTime = new Date(Qt.formatDate(recSTime, "MM/dd/yyyy"))
                            dateTime.setHours(Qt.formatDateTime(recSTime, "hh"));
                            dateTime.setMinutes(recSTime.getMinutes() + numAdded);
                            while (dateTime - currentTime < 60000) {
                                dateTime.setMinutes(dateTime.getMinutes() + 1)
                            }
                            recSTime = (Qt.formatDateTime(dateTime, "yyyy-MM-dd hh:mm:ss"))
                            itemEndTime.refresh()
//                            console.log("recSTime = " + recSTime)
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
                                visible: (mouse_startHour_img.visible && mouse_startHour.mouseY < 20) || (mouse_startMin_img.visible && mouse_startMin.mouseY < 20)

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
                                visible: (mouse_startHour_img.visible && mouse_startHour.height - mouse_startHour.mouseY < 20) || (mouse_startMin_img.visible && mouse_startMin.height - mouse_startMin.mouseY < 20)

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
//                            focus: true
                            color: inputStartHour.visible? "transparent" : (focus? "white" : "#D4D5D6")
                            font.pixelSize: focus? 56 : 50
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: Text.AlignHCenter
                            text: Qt.formatDateTime(itemStartTime.recSTime, "hh")
                            onFocusChanged: {
                                if (focus) {
                                    inputStartMin.visible = false
                                    imgFocusStartTime.anchors.centerIn = startHour
                                }
                            }

                            Keys.onPressed: {
//                                console.log("[ManualRecording][startHour] event.key = " + event.key)
                                if ( event.key == Qt.Key_Up ) {
//                                    console.log("add hour")
                                    itemStartTime.addHour(1)
                                }
                                if ( event.key == Qt.Key_Down ) {
//                                    console.log("minus hour")
                                    itemStartTime.addHour(-1)
                                }
                                if ( event.key == Qt.Key_Right  || event.key == Qt.Key_Return ) {
                                    if (inputStartHour.visible) {
                                        itemStartTime.setHour(inputStartHour.digitNum1)
                                    }
                                    startMin.focus = true
                                }
                                if ( event.key == Qt.Key_Left ) {
                                    if (inputStartHour.visible) {
                                        itemStartTime.setHour(inputStartHour.digitNum1)
                                    }
                                    startDate.focus = true;
                                }
                                if ( event.key >= Qt.Key_0 && event.key <= Qt.Key_9 ) {
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
                                    id: mouse_startHour_img
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
                            text: Qt.formatDateTime(itemStartTime.recSTime, "mm")
                            onFocusChanged: {
                                if (focus) {
                                    inputStartHour.visible = false
                                    inputEndHour.visible = false
                                    imgFocusStartTime.anchors.centerIn = startMin
                                }
                            }

                            Keys.onPressed: {
//                                console.log("[ManualRecording][startMin] event.key = " + event.key)
                                if ( event.key == Qt.Key_Up ) {
//                                    console.log("add minute")
                                    itemStartTime.addMin(1)
                                }
                                if ( event.key == Qt.Key_Down ) {
//                                    console.log("minus minute")
                                    itemStartTime.addMin(-1)
                                }
                                if ( event.key == Qt.Key_Right || event.key == Qt.Key_Return ) {
                                    if (inputStartMin.visible) {
                                        itemStartTime.setMin(inputStartMin.digitNum1)
                                    }
                                    endHour.focus = true
                                }
                                if ( event.key == Qt.Key_Left ) {
                                    if (inputStartMin.visible) {
                                        itemStartTime.setMin(inputStartMin.digitNum1)
                                    }
                                    startHour.focus = true
                                }
                                if ( event.key >= Qt.Key_0 && event.key <= Qt.Key_9 ) {
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
                                    id: mouse_startMin_img
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
                        property date recETime
                        property double recEUtc: getRecEUtc()

                        function getRecEUtc() {
                            return initRecEUtc + (recETime.getTime() - initRecETime.getTime()) / 1000
                        }

                        onRecEUtcChanged: {
                            checkConflict()
                        }

                        function addHour(numAdded) {
                            inputEndHour.visible = false
                            var dateTime = new Date(Qt.formatDate(recETime, "MM/dd/yyyy"))
                            dateTime.setMinutes(Qt.formatDateTime(recETime, "mm"));
                            dateTime.setHours(recETime.getHours() + numAdded);
                            setRecETime(dateTime)
//                            console.log("recSTime = " + recETime)
                        }

                        function addMin(numAdded) {
                            inputEndMin.visible = false
                            var dateTime = new Date(Qt.formatDate(recETime, "MM/dd/yyyy"))
                            dateTime.setHours(Qt.formatDateTime(recETime, "hh"));
                            dateTime.setMinutes(recETime.getMinutes() + numAdded);
                            setRecETime(dateTime)
//                            console.log("recSTime = " + recETime)
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
                                visible: (mouse_endHour_img.visible && mouse_endHour.mouseY < 20) || (mouse_endMin_img.visible && mouse_endMin.mouseY < 20)

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
                                visible: (mouse_endHour_img.visible && mouse_endHour.height - mouse_endHour.mouseY < 20) || (mouse_endMin_img.visible && mouse_endMin.height - mouse_endMin.mouseY < 20)

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
                            text: Qt.formatDateTime(itemEndTime.recETime, "hh")
                            onFocusChanged: {
                                if (focus) {
                                    inputStartMin.visible = false
                                    inputEndMin.visible = false
                                    imgFocusEndTime.anchors.centerIn = endHour
                                }
                            }

                            Keys.onPressed: {
//                                console.log("[ManualRecording][endHour] event.key = " + event.key)
                                if ( event.key == Qt.Key_Up ) {
                                    console.log("add hour")
                                    itemEndTime.addHour(1)
                                }
                                if ( event.key == Qt.Key_Down ) {
                                    console.log("minus hour")
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
                                    id: mouse_endHour_img
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
                            text: Qt.formatDateTime(itemEndTime.recETime, "mm")
                            onFocusChanged: {
                                if (focus) {
                                    inputEndHour.visible = false
                                    imgFocusEndTime.anchors.centerIn = endMin
                                }
                            }

                            Keys.onPressed: {
//                                console.log("[ManualRecording][endMin] event.key = " + event.key)
                                if ( event.key == Qt.Key_Up ) {
                                    console.log("add minute")
                                    itemEndTime.addMin(1)
                                }
                                if ( event.key == Qt.Key_Down ) {
                                    console.log("minus minute")
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
                                    id: mouse_endMin_img
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
                    height: 84
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
                        id: btnPrevious
                        btnString: qsTranslate("QObject", "Previous")
//                        focus:
                        Keys.onPressed: {
//                            console.log("[ManualRecording][btnPrevious] event.key = " + event.key)
                            if ( event.key == Qt.Key_Return ) {
//                                console.log("Previous")
                                isStep1 = true
                                btnStep1Next.focus = true
                            }
                            if ( event.key == Qt.Key_Right ) {
                                btnConfirm.focus = true
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
                                isStep1 = true
                                btnStep1Next.focus = true
                            }
                            onEntered: {
                                parent.focus = true
                            }

                        }

                    }

                    DialogButton {
                        id: btnConfirm
                        anchors.left: btnPrevious.right
                        anchors.leftMargin: 350
                        btnString: qsTranslate("QObject", "Confirm")
//                        focus:

                        function onConfirmClicked() {
                            if (conflictState == -1) {
                                console.log("Cancel because of invalid time")
                                cancel()
                                return
                            }

//                            console.log("Confirm")
                            var currTimeList = pvrInfo.getCurrentSystemTime();
                            var currUtc = currTimeList[1];
                            if (itemStartTime.recSUtc <= currUtc + 5) {
                                console.log("Set start time to 5 seconds later.")
                                itemStartTime.recSUtc = currUtc + 5
                            }

                            pvrInfo.addPvrRecording(selectedChanId, itemStartTime.recSUtc, itemEndTime.recEUtc)
                            confirm()
                        }

                        Keys.onPressed: {
//                            console.log("[ManualRecording][btnConfirm] event.key = " + event.key)
                            if ( event.key == Qt.Key_Return ) {
                                onConfirmClicked()
                            }
                            if ( event.key == Qt.Key_Right ) {
                                btnClose.focus = true
                            }
                            if ( event.key == Qt.Key_Left || event.key == Qt.Key_Up ) {
                                btnPrevious.focus = true
                            }
                            if ( event.key == Qt.Key_Up ) {
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
                                parent.onConfirmClicked()
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
//                            console.log("[ManualRecording][btnClose] event.key = " + event.key)
                            if ( event.key == Qt.Key_Return ) {
//                                console.log("Close")
                                cancel()
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
                                cancel()
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
            id: imgPointStep2
            source: getUPointImg()
            visible: uPointMode != -1 && stagePVR.isMouseVisible() && uPointStep2.enabled && uPointStep2.containsMouse
            x: uPointStep2.mouseX
            y: uPointStep2.mouseY

        }

        MouseArea {
            id: uPointStep2
            anchors.fill: parent
            hoverEnabled: true
            z: -1
        }

    }

    WaitingBar {
        id: waitingBar
        x: 525; y: 639 //639 = 674 - 35
        visible: false
    }

    Image {
        source: getUPointImg()
        visible: uPointMode != -1 && uPointOutside.containsMouse
        x: uPointOutside.mouseX
        y: uPointOutside.mouseY
    }

}
