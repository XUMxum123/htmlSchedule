// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1
import "../Common"

Item {
    id: watchedView
    width: parent.width
    height: parent.height

    signal close

    function getHeader(statusId) {

        switch(statusId) {
        case 1: { // Scheduled
            return qsTranslate("QObject", "Recording scheduled")
        }
        case 2: { // Unwatched
            return qsTranslate("QObject", "Unwatched recording")
        }
        case 3: { // Watched
            return qsTranslate("QObject", "Watched Recording")
        }
        case 4: { // Partially Watched
            return qsTranslate("QObject", "Partially watched")
        }
        case 5: { // Expired
            return qsTranslate("QObject", "Expired")
        }
        case 6: { // Ongoing
            return qsTranslate("QObject", "Recording")
        }
        case 7: { // Failed
            return qsTranslate("QObject", "Failed recording")
        }

        }
    }

    WindowBackground {
        width: 984
        height: 510
        anchors.verticalCenter: parent.verticalCenter
        anchors.horizontalCenter: parent.horizontalCenter

        Item {
            id: watchedTop
            width: 920
            height: 105
            anchors.horizontalCenter: parent.horizontalCenter
//            color:"transparent"
//            border.color: "red"
//            border.width: 1

            Image {
                source: getIconPrefix(selectedRecStatus) + "HL.png"//"iconPVR_header_seen.png"
                anchors.left: parent.left
                anchors.top: parent.top
                anchors.topMargin: 35
            }

            Text {
                height: parent.height
                color: "#8E8E8E"
                font.pixelSize: 36
                anchors.left: parent.left
                anchors.leftMargin: 66
                anchors.top: parent.top
                anchors.topMargin: 36
                text: getHeader(selectedRecStatus)//qsTranslate("QObject", "Watched Recording")
            }
        }

        Item {
            id: watchedBody
            width: 920
            height: 373
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: watchedTop.bottom
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
                    height: 43
//                    color:"transparent"
//                    border.color: "red"
//                    border.width: 1

                    Text {
                        id: txtProgram
                        width: parent.width - 20
                        height: parent.height
                        color: "white"
                        font.pixelSize: 26
                        text: selectedProgTitle
                        wrapMode: Text.WordWrap
                    }
                }

                Item {
                    id: itemExpire
                    width: parent.width
                    height: 119
                    anchors.top: itemProgram.bottom
//                    color:"transparent"
//                    border.color: "green"
//                    border.width: 1

                    Text {
                        id: txtExpireTime
                        width: 100
                        height: 24
                        color: "#8E8E8E"
                        font.pixelSize: 24
                        text: selectedProgDuration//parseInt(( currentTime - selectedProgETime ) / 60000) + " mins"
                    }

                    Text {
                        id: txtExpire
                        width: 100
                        height: 24
                        anchors.top: txtExpireTime.bottom
                        anchors.topMargin: 10
                        color: "red"
                        font.pixelSize: 24
                        text: qsTranslate("QObject", "Expired")
                        visible: selectedRecStatus == 5
                    }

                }

                Item {
                    id: itemInfo
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.rightMargin: 86
                    height: 118
                    anchors.top: itemExpire.bottom
//                    color:"transparent"
//                    border.color: "red"
//                    border.width: 1

                    Text {
                        id: txtRecoredTime
                        width: parent.width
                        height: 26
                        wrapMode: Text.WordWrap
                        color: "#8E8E8E"
                        font.pixelSize: 26
                        text: qsTranslate("QObject", "Recorded at: ") + Qt.formatDateTime ( selectedProgSTime, "MM/dd/yyyy hh:mm" )
                    }

                    Text {
                        id: txtDiskSpace
                        width: parent.width
                        height: 26
                        anchors.top: txtRecoredTime.bottom
                        anchors.topMargin: 14
                        wrapMode: Text.WordWrap
                        color: "#8E8E8E"
                        font.pixelSize: 26
                        text: qsTranslate("QObject", "Disk Space: ") + pvrInfo.getDiskSpace(selectedListId)
                    }


                }

                Item {
                    id: itemButtons
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.rightMargin: 12
                    height: 70
                    anchors.top: itemInfo.bottom
//                    color:"transparent"
//                    border.color: "blue"
//                    border.width: 1

                    DialogButton {
                        id: btnClose
                        btnString: qsTranslate("QObject", "Close")
                        anchors.right: parent.right
                        anchors.rightMargin: 10
                        focus: watchedView.focus
                        Keys.onPressed: {
                            //console.log("[watched][btnClose] event.key = " + event.key)
                            if ( event.key == Qt.Key_Return ) {
                                //console.log("Close")
                                close()
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            hoverEnabled: true

                            Image {
                                source: getUPointImg()
                                visible: uPointMode != -1 && stagePVR.isMouseVisible() && parent.containsMouse
                                x: parent.mouseX
                                y: parent.mouseY
                            }

                            onClicked: {
                                close()
                            }
                        }

                    }


                }

            }

        }

        Image {
            source: getUPointImg()
            visible: uPointMode != -1 && stagePVR.isMouseVisible() && uPointWatchRecording.containsMouse
            x: uPointWatchRecording.mouseX
            y: uPointWatchRecording.mouseY
        }

        MouseArea {
            id: uPointWatchRecording
            anchors.fill: parent
            hoverEnabled: true
            z: -1
        }

    }


}
