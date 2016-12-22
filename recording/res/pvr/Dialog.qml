// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1

Item {
    id: dialogView
    width: parent.width
    height: parent.height

    anchors.horizontalCenter: parent.horizontalCenter
    anchors.bottom: parent.bottom
    anchors.bottomMargin: 30

    property alias lBtnString: btnLeft.btnString
    property alias rBtnString: btnRight.btnString
    property alias contentString: txtContent.text

    signal lBtnClicked
    signal rBtnClicked

    Keys.onPressed: {
        //console.log("[Dialog][dialogView] event.key = " + event.key)
        //console.log("[Dialog][dialogView] isAutoRepeat = " + event.isAutoRepeat);
        if (event.isAutoRepeat) {
            return;
        }
        if ( event.key == Qt.Key_B || event.key == Qt.Key_F34 ) { // back
            //console.log("[Dialog][dialogView] close()");
            rBtnClicked();
        }
    }

    WindowBackground {
        width: 984
        height: 199
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 125

        Item {
            id: recContent
            width: 878
            height: 66
            anchors.top: parent.top
            anchors.topMargin: 32
            anchors.horizontalCenter: parent.horizontalCenter
//            color: "transparent"
//            border.color: "red"
//            border.width: 1

            Text {
                id: txtContent
                width: parent.width
                wrapMode: Text.WordWrap
                color: "#F1F2F3"
                font.pixelSize: 24
            }
        }

        Item {
            id: recBtns
            width: 400
            anchors.right: parent.right
            anchors.rightMargin: 50
            anchors.top: recContent.bottom
            anchors.bottom: parent.bottom
    //        color: "red"

            Row {
                id: btns
                anchors.bottom: parent.bottom
                anchors.bottomMargin: 10
                anchors.verticalCenter: parent.verticalCenter

                DialogButton {
                    id: btnLeft
    //                btnString: qsTranslate("QObject", "Yes")
                    focus: dialogView.focus
                    Keys.onPressed: {
                        //console.log("[Dialog][btnLeft] event.key = " + event.key)
                        //console.log("[Dialog][btnLeft] isAutoRepeat = " + event.isAutoRepeat);
                        if (event.isAutoRepeat) {
                            return;
                        }
                        if ( event.key == Qt.Key_Return ) {
                            // TBD
                            //console.log("[Dialog][btnLeft] lBtnClicked()");
                            lBtnClicked();
                        }
                        if ( event.key == Qt.Key_Right ) {
                            btnRight.focus = true
                        }
                    }
    //                MouseArea {
    //                    anchors.fill: parent
    //                    onClicked: {
    //                        close()
    //                    }
    //                }
                }

                DialogButton {
                    id: btnRight
    //                btnString: qsTranslate("QObject", "No")
                    Keys.onPressed: {
                        //console.log("[Dialog][btnRight] event.key = " + event.key)
                        //console.log("[Dialog][btnRight] isAutoRepeat = " + event.isAutoRepeat);
                        if (event.isAutoRepeat) {
                            return;
                        }
                        if ( event.key == Qt.Key_Return ) {
                            //console.log("[Dialog][btnRight] rBtnClicked()");
                            rBtnClicked();
                        }
                        if ( event.key == Qt.Key_Left ) {
                            btnLeft.focus = true
                        }
                    }
    //                MouseArea {
    //                    anchors.fill: parent
    //                    onClicked: {
    //                        close()
    //                    }
    //                }
                }

            }
        }

    }


}
