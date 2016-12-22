// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1
import "../Common"

Item {
    id: pvrMainWindow
    width: 1280
    height: 720

    property date currentTime//: pvrInfo.getCurrentSystemTime()
    property double currentUtc
    property int selectedRecStatus: (recordListview.currentItem == null) ? 0 : recordListModel.get(recordListview.currentIndex).recordStatus
    property string selectedChanNum: (recordListview.currentItem == null) ? "" : recordListModel.get(recordListview.currentIndex).chNum
    property string selectedChanName: (recordListview.currentItem == null) ? "" : recordListModel.get(recordListview.currentIndex).chName
    property string selectedChanLogo: (recordListview.currentItem == null) ? "" : recordListModel.get(recordListview.currentIndex).chLogo
    property string selectedProgTitle: (recordListview.currentItem == null) ? "" : recordListModel.get(recordListview.currentIndex).progTitle
    property date selectedProgSTime: (recordListview.currentItem == null) ? new Date() : recordListModel.get(recordListview.currentIndex).progSTime
    property date selectedProgETime: (recordListview.currentItem == null) ? new Date() : recordListModel.get(recordListview.currentIndex).progETime
    property double selectedProgSUtc: (recordListview.currentItem == null) ? 0 : recordListModel.get(recordListview.currentIndex).progSUtc
    property double selectedProgEUtc: (recordListview.currentItem == null) ? 0 : recordListModel.get(recordListview.currentIndex).progEUtc
    property string selectedProgDuration: (recordListview.currentItem == null) ? "0" : recordListModel.get(recordListview.currentIndex).duration
    property int selectedListId: (recordListview.currentItem == null) ? 0 : recordListModel.get(recordListview.currentIndex).listId
    property alias selectedItem: recordListview.currentItem
    property double recordProgSUtc
    property double recordProgEUtc
    property int sortType: pvrInfo.getLatestSortType()
    property int devStatus: 0
    property bool isReady: (recordListview.currentItem == null) ? false : (recordListModel.get(recordListview.currentIndex).recordStatus >= 2 && recordListModel.get(recordListview.currentIndex).recordStatus <= 4)
    property int pageSize: 8
    property int topMaskIndex: -1
    property int bottomMaskIndex: pageSize - 1
    property bool isMainPointEnable: true
    property alias notificationVisible: notification.visible

    property int uPointMode: stagePVR.isUPointSupport() ? 0 : -1 //0: ghost, -1: hide
    property bool isMousePressed: false
    property bool isClickable: false

    signal closePVR(bool isBackKey)
    signal itemSelected(string fileId, int listId, int recStatus)
    signal openKB(string progName)

    function refreshContent() {
        console.log("[PVRMain] refresh content")
        var tmpIndex = recordListview.currentIndex
        recordListModel.appendData(true)
        recordListview.currentIndex = tmpIndex
    }

    function updateCurrentTime() {
        var faCurTime = pvrInfo.getCurrentSystemTime();

        currentTime = faCurTime[0];
        currentUtc = faCurTime[1];
    }

    Timer {
        id: tmrRefresh
        interval: 5000; running: false; repeat: true; triggeredOnStart: true
        onTriggered: updateCurrentTime()
    }

    function showNotification(text) {
        notification.visible = true
        notification.text = text
    }

    function getIconPrefix(statusId) {

        switch(statusId) {
        case 1: { // Scheduled
            return "iconPVR_recorded_"
        }
        case 2: { // Unwatched
            return "play_ready_"
        }
        case 3: { // Watched
            return "seen_"
        }
        case 4: { // Partially Watched
            return "part_seen_"
        }
        case 5: { // Expired
            return "expired_"
        }
        case 6: { // Ongoing
            return "recording_"
        }
        case 7: { // Failed
            return "rec_failed_"
        }

        }
    }

    function getSortTypeName(type) {
        var typeName;
        switch (type) {
            case 0:
                typeName = qsTranslate("QObject", "Date");
                break;
            case 1:
                typeName = qsTranslate("QObject", "Expiry date");
                break;
            case 2:
                typeName = qsTranslate("QObject", "Name");
                break;
            case 3:
                typeName = qsTranslate("QObject", "Type");
                break;
        }
        return typeName;
    }

    function getDeviceInfo() {
        var status = pvrInfo.getDeviceStatus()
        devStatus = status[0]
        txtDeviceStatus.text = status[1]
    }

    function getDevStatusIcon(status) {
        var fileName
        switch (status) {
            case 0:
                fileName = "icon_storage.png"
                break
            case 1:
            case 2:
                fileName = "icon_storage_problem.png"
                break
            case 3:
            case 4:
                fileName = "icon_storage_not_available.png"
                break
        }
        return fileName
    }

    function onCloseKB(kbString) {
        // TBD
        //console.log("KB closed, the rename string = " + kbString)
        var ret = pvrInfo.renamePvrRecording(selectedListId, kbString)
        if (ret) {
            recordListModel.setProperty( recordListview.currentIndex, "progTitle", kbString)
        }
        recordListview.focus = true
        bottomBanner.visible = true
    }

    function showRecording() {
//        isMainPointEnable = false
        loaderRecording.source = "Recording.qml"
        loaderRecording.item.parent = pvrMainWindow
        loaderRecording.item.focus = true
        isMainPointEnable = false
    }

    function showDialogDelete() {
//        isMainPointEnable = false
        loaderDialog.source = "../Common/Dialog.qml"
        loaderDialog.type = "delete"
        loaderDialog.item.parent = pvrMainWindow
        loaderDialog.item.contentString = qsTranslate("QObject", "Are you sure you want to delete this recording?")
        loaderDialog.item.lBtnString = qsTranslate("QObject", "Delete")
        loaderDialog.item.rBtnString = qsTranslate("QObject", "Cancel")
        loaderDialog.item.focus = true
        loaderDialog.item.mouseVisible = stagePVR.isMouseVisible()
        isMainPointEnable = false
    }

    function showDialogCancel() {
//        isMainPointEnable = false
        loaderDialog.source = "../Common/Dialog.qml"
        loaderDialog.type = "cancel"
        loaderDialog.item.parent = pvrMainWindow
        loaderDialog.item.contentString = qsTranslate("QObject", "Are you sure you want to cancel this scheduled recording?")
        loaderDialog.item.lBtnString = qsTranslate("QObject", "Yes")
        loaderDialog.item.rBtnString = qsTranslate("QObject", "No")
        loaderDialog.item.focus = true
        loaderDialog.item.mouseVisible = stagePVR.isMouseVisible()
        isMainPointEnable = false
    }

    function showDialogStop() {
        loaderDialog.source = "../Common/Dialog.qml"
        loaderDialog.type = "stop"
        loaderDialog.item.parent = pvrMainWindow
        loaderDialog.item.contentString = qsTranslate("QObject", "Are you sure you want to stop the recording?")
        loaderDialog.item.lBtnString = qsTranslate("QObject", "Yes")
        loaderDialog.item.rBtnString = qsTranslate("QObject", "No")
        loaderDialog.item.focus = true
        loaderDialog.item.mouseVisible = stagePVR.isMouseVisible()
        bgMain.visible = false
        isMainPointEnable = false
    }

    function showWarningDialog(text) {
        loaderDialog.source = "../Common/Dialog.qml"
        loaderDialog.item.parent = pvrMainWindow
        loaderDialog.type = "warning"

        loaderDialog.item.lBtnVisible = false
        loaderDialog.item.rBtnString = qsTranslate("QObject", "Close")
        loaderDialog.item.contentString = text
        loaderDialog.item.focus = true
        loaderDialog.item.mouseVisible = stagePVR.isMouseVisible()
        isMainPointEnable = false
    }

    function showOptionMenu() {
//        isMainPointEnable = false
        loaderOptionMenu.source = "OptionMenu.qml"
        loaderOptionMenu.item.parent = pvrMainWindow
        loaderOptionMenu.item.focus = true
        isMainPointEnable = false
        stagePVR.setXtvOptions(1)
    }

    function showManualRecording() {
//        isMainPointEnable = false
        loaderSchedule.source = "ManualRecording.qml"
        loaderSchedule.item.parent = pvrMainWindow
        loaderSchedule.item.focus = true
        isMainPointEnable = false
    }

    function showWatchedRecording() {
        loaderWatched.source = "WatchedRecording.qml"
        loaderWatched.item.parent = pvrMainWindow
        loaderWatched.item.focus = true
        isMainPointEnable = false
    }

    function getCurrentTimeText() {
        var dayText = Qt.formatDateTime(currentTime, "d");
        var timeText = Qt.formatDateTime(currentTime, "hh:mm");

        var monthNum = currentTime.getMonth() + 1;
        var monthText = trTools.longMonthName(monthNum);

        var retText = dayText + " " + monthText + " " + timeText;
        return retText;
    }

    function getUPointImg() {
        if (uPointMode == 0)
            return "../Common/Pointer_Ghost.png"
        else if (isMousePressed)
            return "../Common/Pointer_Pressed.png"
        else if ( (imgPointRecordingList.visible && uPointRecordingList.mouseIndex != -1) || pointerBackTop.visible || pointerBackBottom.visible || isClickable)
            return "../Common/Pointer_HL.png"
        else
            return "../Common/Pointer_N.png"
    }

    Image {
        id: bgMain
        source: "Background_1280x720.jpg"
    }

    Item {
        id: recordingsView
        width: parent.width
        height: parent.height
        visible: bgMain.visible

        ColorKeysBar {
            id: bottomBanner

            txtBtnRed: qsTranslate("QObject", "Schedule")
            txtBtnGreen: getBtnGreenText()
            txtBtnYellow: getBtnYellowText()
            txtBtnBlue: qsTranslate("QObject", "Help")
            showBtnInfo: isReady

            function getBtnGreenText() {
                var retText = ""
                if ( selectedRecStatus == 1 || selectedRecStatus == 6 ) { //Scheduled and Ongoing
                    retText = qsTranslate("QObject", "Adjust time")
                }
                else if (selectedRecStatus >= 2 && selectedRecStatus <= 4){ //Watched, Partially Watched, Unwatched
                    retText = qsTranslate("QObject", "Rename")
                }
                return retText
            }

            function getBtnYellowText() {
                var retText = "";

                if (recordListModel.count > 0)
                    retText = qsTranslate("QObject", "Remove");

                return retText;
            }
        }

        Item {
            id: topBanner
            width: parent.width
            height: 108

            Text {
                id: txtRecordings
                color: "white"
                opacity: 0.5
                font.pixelSize: 65
                width: 600
                height: 60
                anchors.left: parent.left
                anchors.leftMargin: 10
                anchors.bottom: parent.bottom
                anchors.bottomMargin: 18
                text: qsTranslate("QObject", "Recordings")
            }

            Text {
                id: txtCurrentTime
                color: "#D3D4D5"
                font.pixelSize: 20
                width: 260
                height: 20
                anchors.left: txtRecordings.right
                anchors.leftMargin: 60
                anchors.bottom: parent.bottom
                anchors.bottomMargin: 10
                text: getCurrentTimeText()
            }

            Text {
                id: txtSortBy
                color: "#D3D4D5"
                font.pixelSize: 20
                width: 220
                height: 20
                anchors.right: parent.right
                anchors.rightMargin: 58
                anchors.top: parent.top
                anchors.topMargin: 33
                horizontalAlignment: Text.AlignRight
                text: qsTranslate("QObject", "Sort by:") + getSortTypeName(sortType)
            }

            Text {
                id: txtDeviceStatus
                color: "#D3D4D5"
                font.pixelSize: 20
//                width: 220
                height: 20
//                anchors.left: txtSortBy.left
                anchors.right: parent.right
                anchors.rightMargin: 10
                anchors.top: parent.top
                anchors.topMargin: 82
            }

            Image {
                id: statusIcon
                anchors.right: txtDeviceStatus.left
                anchors.rightMargin: 1
                anchors.bottom: txtDeviceStatus.bottom
                anchors.bottomMargin: -6
                source: getDevStatusIcon(devStatus)
            }

            Component.onCompleted: {
                getDeviceInfo()
            }
        }

        Item {
            id : titleBanner
            width: parent.width
            height: 44
            anchors.top: topBanner.bottom

            Image {
                id: bgTitleBanner
                source: "subMenuBar_1280.png"
                width: parent.width
                height: parent.height
            }

            Row {
                id: titleRow
                anchors.left: parent.left
                anchors.leftMargin: 57
                anchors.right: parent.right
                anchors.rightMargin: 57
                height: parent.height

                Item {
                    id: title1
                    width: 580
                    height: parent.height

                    Text {
                        id: txtTitle1
                        width: parent.width
                        anchors.left: parent.left
                        anchors.leftMargin: 54
                        anchors.bottom: parent.bottom
                        anchors.bottomMargin: 10
                        color: "#D3D4D5"
                        font.pixelSize: 24
                        text: qsTranslate("QObject", "Program")
                    }
                }

                Item {
                    id: title2
                    width: 292
                    height: parent.height

                    Text {
                        id: txtTitle2
                        width: parent.width
                        anchors.left: parent.left
                        anchors.leftMargin: 33
                        anchors.bottom: parent.bottom
                        anchors.bottomMargin: 10
                        color: "#D3D4D5"
                        font.pixelSize: 24
                        text: qsTranslate("QObject", "Date")
                    }
                }

                Item {
                    id: title3
                    width: 290
                    height: parent.height

                    Text {
                        id: txtTitle3
                        width: parent.width
                        anchors.left: parent.left
                        anchors.leftMargin: 21
                        anchors.bottom: parent.bottom
                        anchors.bottomMargin: 10
                        color: "#D3D4D5"
                        font.pixelSize: 24
                        text: qsTranslate("QObject", "Duration")
                    }
                }
            }
        }

        Item {
            id : pvrMainBody
            width: parent.width
            anchors.top: titleBanner.bottom
            anchors.bottom: bottomBanner.top

            ListModel {
                id: recordListModel
                property int initialIndex

                function appendData(bForceReload) {
                    recordListModel.clear()
                    var pvrlist = pvrInfo.getRecrodingList(sortType, bForceReload)
                    var count = pvrlist[0]
                    var recordStatus, progTitle, recordDate, duration, isConflict, diskId, fileId, listId, chNum, chName, chLogo, progSTime, progETime, progSUtc, progEUtc
                    var latestListId = stagePVR.getLatestListId()

                    for (var i = 0; i < count; i++) {
                        recordStatus = pvrlist[15*i+1]
                        progTitle = pvrlist[15*i+2]
                        recordDate = pvrlist[15*i+3]
                        duration = pvrlist[15*i+4]
                        isConflict = pvrlist[15*i+5]
                        diskId = pvrlist[15*i+6]
                        fileId = pvrlist[15*i+7]
                        listId = pvrlist[15*i+8]
                        chNum = pvrlist[15*i+9]
                        chName = pvrlist[15*i+10]
                        chLogo = pvrlist[15*i+11]
                        progSTime = pvrlist[15*i+12]
                        progETime = pvrlist[15*i+13]
                        progSUtc = pvrlist[15*i+14]
                        progEUtc = pvrlist[15*i+15]

                        if (listId == latestListId)
                            initialIndex = i
                        // append record list
                        recordListModel.append({    "recordStatus" : recordStatus,
                                                    "progTitle" : progTitle,
                                                    "recordDate": recordDate,
                                                    "duration": duration,
                                                    "isConflict" : isConflict,
                                                    "diskId" : diskId,
                                                    "fileId" : fileId,
                                                    "listId" : listId,
                                                    "chNum" : chNum,
                                                    "chName" : chName,
                                                    "chLogo" : chLogo,
                                                    "progSTime" : progSTime,
                                                    "progETime" : progETime,
                                                    "progSUtc" : progSUtc,
                                                    "progEUtc" : progEUtc
                                            })
                    }
                }
            }

            Component {
                id: recordListItem
                Item {
                    id: recordItem
                    width: recordListview.width
                    height: 50

                    Row {
                        id: itemRow
                        width: parent.width
                        height: 40//parent.height
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 6

                        Image {
                            id: imgStatusIcon
                            width: 44
                            height: 44

                            property string srcPrefix: getIconPrefix(recordStatus)
                            source: index == recordListview.currentIndex?  srcPrefix + "HL.png" : srcPrefix + "normal.png"
                        }

                        Item {
                            width: 548
                            height: parent.height

                            Text {
                                id: txtProgTitle
                                width: parent.width - 20
                                height: parent.height// - 20
                                text: progTitle
                                color: index == recordListview.currentIndex? "#F1F2F3": ((index == topMaskIndex || index == bottomMaskIndex)?  "#8E8E8E" : "#D3D4D5" )
                                font.pixelSize: index == recordListview.currentIndex? 26:24
                                verticalAlignment: Text.AlignVCenter
                                elide: Text.ElideRight
                            }
                        }

                        Item {
                            width: 286
                            height: parent.height
//                            color: "transparent"
//                            border.color: "red"
//                            border.width: 1

                            Text {
                                width: parent.width
                                height: parent.height
                                text: recordDate
                                color: txtProgTitle.color//index == recordListview.currentIndex? "#F1F2F3" : "#D3D4D5"
                                font.pixelSize: index == recordListview.currentIndex? 26:24
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        Item {
                            width: 260
                            height: parent.height
//                            color: "transparent"
//                            border.color: "red"
//                            border.width: 1

                            Text {
                                width: parent.width
                                height: parent.height
                                text: duration
                                color: txtProgTitle.color//index == recordListview.currentIndex? "#F1F2F3" : "#D3D4D5"
                                font.pixelSize: index == recordListview.currentIndex? 26:24
                                verticalAlignment: Text.AlignVCenter
                            }

                            Image {
                                id: imgConfict
                                source: "iconPVR_conflict.png"
                                visible: isConflict
                                anchors.verticalCenter: parent.verticalCenter
                                anchors.left: parent.left
                                anchors.leftMargin: 174
                            }
                        }
                    }
                }
            }

            Component {
                id: recordListHighlighter
                Item {
                    width: recordListview.width
                    height: 50

                    Image {
                        source: "List_Glow_Blue.png"
                        anchors.verticalCenter: parent.verticalCenter
                        anchors.left: parent.left
                        anchors.leftMargin: -5
                        visible: isMainPointEnable
                    }

                    Row {
                        width: parent.width
                        height: parent.height

                        Image {
                            id: highlightLeft
                            source: isMainPointEnable? "Blue_Left.png" : "Selected_HL_2_left.png"
                            height: parent.height
                        }
                        Image {
                            id: highlightCenter
                            source: isMainPointEnable? "Blue_Middle.png" : "Selected_HL_2_center.png"
                            width: parent.width - highlightLeft.width - highlightRight.width
                            height: parent.height
                        }
                        Image {
                            id: highlightRight
                            source: isMainPointEnable? "Blue_Right.png" : "Selected_HL_2_right.png"
                            height: parent.height
                        }
                    }
                }
            }

            Item {
                id: itemListView
                anchors.left: verticalLine1.right
                anchors.leftMargin: 5
                anchors.right: verticalLine4.left
                height: pageSize * 50
                anchors.verticalCenter: parent.verticalCenter
                clip: true

                ListView {
                    id: recordListview
                    width: parent.width
                    height: parent.height - 50
                    anchors.verticalCenter: parent.verticalCenter
                    model: recordListModel
                    delegate: recordListItem
                    highlight: recordListHighlighter
                    focus: true
                    cacheBuffer: 50
                    property bool reResult : false

                    function onRecordListClicked() {
                        var fileId = recordListModel.get(currentIndex).fileId
                        var listId = recordListModel.get(currentIndex).listId
                        var recStatus = recordListModel.get(currentIndex).recordStatus

                        if (recStatus == 7) {
                            var failedReason = String(pvrInfo.getRecFailedReason(listId))
                            if (failedReason !== "")
                                showNotification(failedReason)
                        }
                        else
                            itemSelected(fileId, listId, recStatus)
                    }

                    onContentYChanged: {
                        topMaskIndex = indexAt(0, contentY-50)
                        bottomMaskIndex = indexAt(0, height+contentY)
                    }

                    Keys.onPressed: {
                        //console.log("focus recordListview")
                        if (event.isAutoRepeat) {
                            return
                        }

                        if (event.key == Qt.Key_F34) //RC_Back
                            closePVR(true)
                        else if (event.key == Qt.Key_Escape)
                            closePVR(false)
                        else if ( event.key == Qt.Key_Return || event.key == Qt.Key_MediaPlay || event.key == Qt.Key_Favorites ) {
                            onRecordListClicked()
                        }
                        else if ( event.key == Qt.Key_G || event.key == Qt.Key_Alt) { //16777251 RC_Green
                            if ( selectedRecStatus == 1 || selectedRecStatus == 6 ) { //Scheduled and Ongoing
                                // Adjust Time
                                showRecording()
                            }
                            else if (selectedRecStatus >= 2 && selectedRecStatus <= 4){ //Watched, Partially Watched, Unwatched
                                // Rename
                                var progName = recordListModel.get(currentIndex).progTitle
                                openKB(progName)
                                bottomBanner.visible = false
                            }
                        }
                        else if ( event.key == Qt.Key_Y || event.key == Qt.Key_Shift ) { //16777248 RC_Yellow
                            if (recordListModel.count > 0) {
                                if (selectedRecStatus == 1) //scheduled recording
                                    showDialogCancel()
                                else
                                    showDialogDelete()
                            }
                        }
                        else if ( event.key == Qt.Key_O || event.key == Qt.Key_F18) { //16777281 RC_Option
                            showOptionMenu()
                        }
                        else if ( event.key == Qt.Key_R || event.key == Qt.Key_Control ) { //16777249 RC_Red
                            if (!pvrInfo.isUsbDevReady()) {
                                closePVR(false)
                                return
                            }
                            showManualRecording()
                        }
                        else if ( event.key == Qt.Key_I || event.key == Qt.Key_F26) { // RC_Info
    //                        if (isReady)
                                showWatchedRecording()
                        }
                        else if (event.key == Qt.Key_Meta ) {                // 16777250 RC_Blue Key
                            console.log("[K][PVRMain] RC_Blue Key pressed");
                            reResult = pvrInfo.pvrSeteDfuEntry("Recordings:Options:share:NA");
                            console.log("[K][PVRMain] call pvrSeteDfuEntry(), reResult= " + reResult);
                            closePVR(false);
                        }
                        else if (event.key == Qt.Key_Community) { //RC_Share
//                            if (selectedItem != null)
//                                pvrInfo.pvrShare(selectedListId)
                        }
                        else if (event.key == Qt.Key_MediaStop || event.key == Qt.Key_Eject) {
                            if (pvrInfo.isPvrRecording()) {
                                showDialogStop()
                            }
                        }
                        else if ( event.key == Qt.Key_PageUp ) { //16777238, Ch+
                            if (currentIndex - pageSize <= 0)
                                currentIndex = 0
                            else
                                currentIndex -= pageSize
                        }
                        else if ( event.key == Qt.Key_PageDown ) { //16777239, Ch-
                            if (currentIndex + pageSize >= count)
                                currentIndex = count -1
                            else
                                currentIndex += pageSize
                        }
                    }
                }

                Item {
                    id: itemScrollBar
                    width: 8
                    height: parent.height
                    anchors.right: parent.right
                    visible: recordListview.contentHeight > recordListview.height

                    Image {
                        id: imgScrollBar
                        source: "List_Scroll_Bar.png"
                        height: (recordListview.height / recordListview.contentHeight) * parent.height
                        visible: recordListview.contentHeight > parent.height
                    }

                    Connections {
                        target: recordListview
                        onContentYChanged: {
                            imgScrollBar.y = (recordListview.contentY * (itemScrollBar.height - imgScrollBar.height))/(recordListview.contentHeight - recordListview.height)
                        }
                    }
                }

            }

            Image {
                id: verticalLine1
                source: "divider.png"
                width: 2
                height: parent.height
                anchors.left: parent.left
                anchors.leftMargin: 57
            }

            Image {
                id: verticalLine2
                source: "divider.png"
                width: 2
                height: parent.height
                anchors.left: parent.left
                anchors.leftMargin: 639
            }

            Image {
                id: verticalLine3
                source: "divider.png"
                width: 2
                height: parent.height
                anchors.left: parent.left
                anchors.leftMargin: 931
            }

            Image {
                id: verticalLine4
                source: "divider.png"
                width: 2
                height: parent.height
                anchors.right: parent.right
                anchors.rightMargin: 57
            }

            Image {
                id: pointerBackTop
                source: "../Common/Pointer_button_back.png"
                width: itemListView.width
                height: 50
                anchors.left: itemListView.left
                anchors.top: itemListView.top
                anchors.topMargin: -25
                visible: recordListview.currentIndex > 0 && uPointMode == 1 && isMainPointEnable && x < uPointRecordingList.mouseX && uPointRecordingList.mouseX < (x + width) && y < uPointRecordingList.mouseY && uPointRecordingList.mouseY < (y + height) && uPointRecordingList.containsMouse

                Image {
                    id: topArrow
                    source: "../Common/Pointer_button_arrow_up.png"
                    anchors.centerIn: parent
                }
            }

            Image {
                id: pointerBackBottom
                source: "../Common/Pointer_button_back.png"
                width: pointerBackTop.width
                height: 50
                anchors.left: pointerBackTop.left
                anchors.bottom: itemListView.bottom
                anchors.bottomMargin: -25
                visible: recordListview.count > 7 && recordListview.currentIndex < recordListview.count - 1 && uPointMode == 1 && isMainPointEnable && x < uPointRecordingList.mouseX && uPointRecordingList.mouseX < (x + width) && y < uPointRecordingList.mouseY && uPointRecordingList.mouseY < (y + height)  && uPointRecordingList.containsMouse

                Image {
                    id: bottomArrow
                    source: "../Common/Pointer_button_arrow_down.png"
                    anchors.centerIn: parent
                }
            }

            Image {
                id: imgPointRecordingList
                source: getUPointImg()
                visible: uPointMode != -1 && stagePVR.isMouseVisible() && uPointRecordingList.enabled && uPointRecordingList.containsMouse
                x: uPointRecordingList.mouseX
                y: uPointRecordingList.mouseY
            }

            MouseArea {
                id: uPointRecordingList
                anchors.fill: parent
                hoverEnabled: true
                enabled: isMainPointEnable
                property int mouseIndex: -1

                onMousePositionChanged: {
                    mouseIndex = recordListview.indexAt(mouseX - itemListView.x, recordListview.contentY + mouseY - itemListView.y - 25)
//                    console.log("[uPointRecordingList]MousePositionChanged, (x,y)=(" + mouseX + "," + mouseY +")")
//                    console.log("mouseIndex = " + mouseIndex)
                    if (mouseY < pointerBackTop.y + pointerBackTop.height + 5 || mouseY > pointerBackBottom.y - 10  )
                        return
                    if(mouseIndex != -1) {
                        recordListview.currentIndex = mouseIndex
                    }
                }

                onClicked: {
                    if (pointerBackTop.visible)
                        recordListview.decrementCurrentIndex()
                    else if (pointerBackBottom.visible)
                        recordListview.incrementCurrentIndex()
                    else if(mouseIndex != -1) {
                        recordListview.onRecordListClicked()
                    }
                }
            }
        }

        Image {
            source: getUPointImg()
            visible: uPointMode != -1 && stagePVR.isMouseVisible() && uPointPVRMain.containsMouse && uPointPVRMain.enabled && !imgPointRecordingList.visible
            x: uPointPVRMain.mouseX
            y: uPointPVRMain.mouseY
        }

        MouseArea {
            id: uPointPVRMain
            anchors.fill: parent
            enabled: isMainPointEnable
            hoverEnabled: true
            z: -1
        }
    }

    Loader {
        id: loaderRecording
    }

    Connections {
        target: loaderRecording.item
        onConfirm : {
            var ret = pvrInfo.adjustPvrRecording(selectedListId, recordProgSUtc, recordProgEUtc)
            if (ret) {
//                programModel.setProperty( programListView.currentIndex, "isRecord", true)
//                selectedProgIsRecord = !selectedProgIsRecord
                var tmpIndex = recordListview.currentIndex
                recordListModel.appendData(false)
                recordListview.currentIndex = tmpIndex

                var warnStrId = loaderRecording.item.warnStrId
                var conflictState = loaderRecording.item.conflictState
                if (warnStrId != -1) {
                    loaderRecording.source = ""

                    var msg = String(pvrInfo.getConflictWarnMsg(warnStrId))
                    if (conflictState == 3)
                        msg = pvrInfo.getPvrMainMsg(3) + "\n" + msg
                    else
                        msg = pvrInfo.getPvrMainMsg(2) + "\n" + msg

                    showWarningDialog(msg)
                    return
                }
            }

            loaderRecording.source = ""
            recordListview.focus = true
            isMainPointEnable = true
        }

        onClose: {
            loaderRecording.source = ""
            recordListview.focus = true
            isMainPointEnable = true
        }
    }

    Loader {
        id: loaderDialog
        property string type
    }

    Connections {
        target: loaderDialog.item
        onLBtnClicked : {
            if (loaderDialog.type == "stop") {
                pvrInfo.stopPvrRecording()
                loaderDialog.source = ""
                closePVR(false)
            }
            else {
                var ret = pvrInfo.cancelOrDeleteRecording(selectedListId)
                if (ret) {
                    //recordListModel.remove(recordListview.currentIndex)
                    var tmpIndex = recordListview.currentIndex
                    recordListModel.appendData(false);
                    recordListview.currentIndex = (tmpIndex < recordListview.count) ? tmpIndex : recordListview.count - 1

                    loaderDialog.source = ""
                    recordListview.focus = true
                }
                isMainPointEnable = true
            }
        }

        onRBtnClicked: {
            if (loaderDialog.type == "stop") {
                loaderDialog.source = ""
                closePVR(false)
            }
            else {
                loaderDialog.source = ""
                recordListview.focus = true
                isMainPointEnable = true
            }
        }
    }

    Loader {
        id: loaderOptionMenu
    }

    Connections {
        target: loaderOptionMenu.item
        onClose: {
            loaderOptionMenu.source = ""
            recordListview.focus = true
            isMainPointEnable = true
        }
        onSort: {
            //console.log("onSort, sortType = " + sortType)
            recordListModel.appendData(false)
        }
    }

    Loader {
        id: loaderSchedule
    }

    Connections {
        target: loaderSchedule.item
        onCancel: {
            loaderSchedule.source = ""
            recordListview.focus = true
            isMainPointEnable = true
        }
        onConfirm: {
            recordListModel.appendData(false)

            var warnStrId = loaderSchedule.item.warnStrId
            var conflictState = loaderSchedule.item.conflictState
            if (warnStrId != -1) {
                loaderSchedule.source = ""

                var msg = String(pvrInfo.getConflictWarnMsg(warnStrId))
                if (conflictState == 3)
                    msg = pvrInfo.getPvrMainMsg(3) + "\n" + msg
                else
                    msg = pvrInfo.getPvrMainMsg(2) + "\n" + msg

                showWarningDialog(msg)
                return
            }

            loaderSchedule.source = ""
            recordListview.focus = true
            isMainPointEnable = true
        }
    }

    Loader {
        id: loaderWatched
    }

    Connections {
        target: loaderWatched.item
        onClose: {
            loaderWatched.source = ""
            recordListview.focus = true
            isMainPointEnable = true
        }
    }

    Notification {
        id: notification
        width: 984; height: 122
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 125
        anchors.horizontalCenter: parent.horizontalCenter
        visible: false
        z: 1

        onVisibleChanged: {
            if (visible)
                tmrHideNotification.start()
            else
                tmrHideNotification.stop()
        }

        Timer {
            id: tmrHideNotification
            interval: 6000; running: false; repeat: false
            onTriggered: {
                notification.visible = false
            }
        }
    }

    Component.onCompleted: {
        tmrRefresh.start();
        recordListModel.appendData(false)
        recordListview.currentIndex = recordListModel.initialIndex
    }

    Image {
        id: imgPointGray
        source: "../Common/Pointer_Ghost.png"
        visible: stagePVR.isMouseVisible()
        anchors.horizontalCenter: parent.horizontalCenter
        y: 480
    }
    onUPointModeChanged: {
        if (uPointMode != 0 && imgPointGray.visible)
            imgPointGray.visible = false
    }
}
