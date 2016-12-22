// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1
import "../Common"

Item {
    id: optionMenu
    width: menuBody.width
    height: menuBody.height
    anchors.horizontalCenter: parent.horizontalCenter
    anchors.bottom: parent.bottom
    anchors.bottomMargin: 30

    signal close
    signal sort
    property bool isMenu1Focus: true

    function onMenu1Clicked() {
        if (menu1List.currentIndex == 0) // sort
            isMenu1Focus = false
//        else // share
//            pvrInfo.share() // TBD
    }

    function onMenu2Clicked() {
        if (menu1List.currentIndex == 0) {
            // TBD: refresh list by selected order
            sortType = menu2List.currentIndex
            //console.log("[OptionMenu] sortType = " + sortType)
            sort()
            close()
        }
    }

    onIsMenu1FocusChanged: {
        if (!isMenu1Focus) {
            menu2Model.appendData()
            menu2List.currentIndex = sortType
        }
        else {
            menu2Model.clear()
        }
    }

    Item {
        id: menuBody
        width: menu1.width + menu2.width
        height: menu1.height

        Item {
            id: menu1
            width: menu1_bg.width
            height: menu1_bg.height

            Image {
                id: menu1_bg
                source: "qrc:///global/OptionsMenu/OptionMeamu_Panel.png" // OptionMeamu_Panel
            }

            Item {
                id: menu1_title
                width: 42
                height: 380
                anchors.left: parent.left
                anchors.leftMargin: 32
                anchors.top: parent.top
                anchors.topMargin: 38
//                color: "transparent"
//                border.color: "red"
//                border.width: 1


                Text {
                    id: txtMenuTitle
                    font.pixelSize: 26
                    width: parent.height
                    height: parent.width
                    anchors.top: parent.bottom
                    horizontalAlignment: Text.AlignRight
                    color: "#F1F2F3"
                    text: qsTranslate("QObject", "Recordings options")
                    transform: Rotation { origin.x: 0; origin.y: 0; angle: 270}
                }
            }


            Item {
                id: recMenu1
                width: 286
                anchors.left: menu1_title.right
//                anchors.leftMargin: 12
                height: parent.height - 30
                anchors.verticalCenter: parent.verticalCenter
                clip: true

                ListModel {
                    id: menu1Model

                    function appendData() {
                        menu1Model.append({"menuTitle": qsTranslate("QObject", "Sort")})
//                        if (selectedItem != null)
//                            menu1Model.append({"menuTitle": qsTranslate("QObject", "Share")})
                    }
                }

                ListView {
                    id: menu1List
                    anchors.left: parent.left
                    anchors.leftMargin: 5
                    anchors.right: parent.right
                    height: parent.height - 30
                    anchors.verticalCenter: parent.verticalCenter
                    model: menu1Model
                    delegate: menu1Item
                    highlight: isMenu1Focus?menu1ItemHighlighter:menu1ItemHighlighterDisable
                    focus: optionMenu.focus
                    interactive: false

                    Keys.onPressed: {
                        //console.log("[OptionMenu][menu1List] event.key = " + event.key)
                        //console.log("[OptionMenu][menu1List] isAutoRepeat = " + event.isAutoRepeat);
                        if (event.isAutoRepeat) {
                            return;
                        }
                        if ( event.key == Qt.Key_B || event.key == Qt.Key_O || event.key == Qt.Key_F18 || event.key == Qt.Key_F34 ) { // RC_Option || RC_Back
                            //console.log("[OptionMenu][menu1List] close()");
                            close();
                            stagePVR.setXtvOptions(0)
                        }
                        if ( event.key == Qt.Key_Return ) {
                            onMenu1Clicked()
                            stagePVR.setXtvOptions(0)
                        }
                        if ( event.key == Qt.Key_Down )
                            incrementCurrentIndex()
                        if ( event.key == Qt.Key_Up )
                            decrementCurrentIndex()
                    }

                }

                Component {
                    id: menu1Item

                    Item {
                        width: 333
                        height: 40
//                        color: "transparent"

                        Item {
                            id: itemMenuTxt
                            width: parent.width - 10
                            height: parent.height
                            anchors.left: parent.left
                            anchors.leftMargin: 10
                            clip: true

                            ScrollText {
                                width: parent.width
                                height: 40
                                anchors.left: parent.left
                                verticalAlignment: Text.AlignVCenter
                                color: menu1List.currentIndex == index? "white" : "#D3D4D5"
                                font.pixelSize: menu1List.currentIndex == index? 26:24
                                text: menuTitle
                                isScroll: font.pixelSize == 26? true: false
                                isTextAlignLeft: true
                            }
                        }
                    }
                }

                Component {
                    id: menu1ItemHighlighter
                    Item {
                        width: menu1List.width
                        height: 40

                        Image {
                            source: "List_Glow_Blue.png"
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.left: parent.left
                            anchors.leftMargin: -5
                        }

                        Row {
                            width: parent.width
                            height: parent.height
                            Image {
                                id: highlightLeft
                                source: "Blue_Left.png"
                            }
                            Image {
                                id: highlightCenter
                                source: "Blue_Middle.png"
                                width: parent.width - highlightLeft.width - highlightRight.width
                            }
                            Image {
                                id: highlightRight
                                source: "Blue_Right.png"
                            }
                        }

                    }

                }

                Component {
                    id: menu1ItemHighlighterDisable
                    Image {
                        id: itemDisable
                        source: "qrc:///global/OptionsMenu/SelectionBar_Panel_disable_new.png"
                    }
                }


            }

        }

        Item {
            id: menu2
            width: visible?menu2_bg.width : 0
            height: menu2_bg.height
            anchors.left: menu1.right
            anchors.leftMargin: -28
            anchors.top: menu1.top
            anchors.topMargin: -5
            visible: !isMenu1Focus

            Image {
                id: menu2_bg
                source: "qrc:///global/OptionsMenu/options_menu_R.png"
            }

            Item {
                id: recMenu2
                width: parent.width - 40
                height: parent.height - 40
                anchors.centerIn: parent
                clip: true

                ListModel {
                    id: menu2Model

                    function appendData() {
                        menu2Model.clear()
                        if (menu1List.currentIndex == 0) {
                            menu2Model.append({"menuTitle": qsTranslate("QObject", "By date")})
                            menu2Model.append({"menuTitle": qsTranslate("QObject", "By expiry date")})
                            menu2Model.append({"menuTitle": qsTranslate("QObject", "By name")})
                            menu2Model.append({"menuTitle": qsTranslate("QObject", "By type")})
                        }
                    }
                }

                ListView {
                    id: menu2List
                    anchors.left: parent.left
                    anchors.leftMargin: 5
                    anchors.right: parent.right
                    height: parent.height - 30
                    anchors.verticalCenter: parent.verticalCenter
                    model: menu2Model
                    delegate: menu2Item
                    highlight: menu2ItemHighlighter
                    focus: parent.visible
                    interactive: false
    //                keyNavigationWraps: true

                    Keys.onPressed: {
                        //console.log("[OptionMenu][menu2List] event.key = " + event.key)
                        if ( event.key == Qt.Key_B || event.key == Qt.Key_F34 ) { // back
                            isMenu1Focus = true
                            menu1List.focus = true
                        }
                        else if ( event.key == Qt.Key_Return ) {
                            onMenu2Clicked()
                        }
                        else if ( event.key == Qt.Key_Down )
                            incrementCurrentIndex()
                        else if ( event.key == Qt.Key_Up )
                            decrementCurrentIndex()
                        else if ( event.key == Qt.Key_O || event.key == Qt.Key_F18 ) {// RC_Option
                            close()
                        }
                    }

                }

                Component {
                    id: menu2Item

                    Item {
                        width: 323
                        height: 40

                        Item {
                            width: parent.width - 10
                            height: parent.height
                            anchors.left: parent.left
                            anchors.leftMargin: 10
//                            color: "transparent"
//                            border.color: "red"
//                            border.width: 1
                            clip: true

                            ScrollText {
                                width: parent.width
                                height: parent.height
                                anchors.left: parent.left
    //                            horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                                font.pixelSize: menu2List.currentIndex == index? 26:24
                                color: menu2List.currentIndex == index? "white" : "#D3D4D5"
                                text: menuTitle
                                isScroll: font.pixelSize == 26? true: false
                                isTextAlignLeft: true
                            }

                        }
                    }
                }

                Component {
                    id: menu2ItemHighlighter
                    Item {
                        width: menu2List.width
                        height: 40

                        Image {
                            source: "List_Glow_Blue.png"
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.left: parent.left
                            anchors.leftMargin: -5
                        }

                        Row {
                            width: parent.width
                            height: parent.height
                            Image {
                                id: highlightLeft
                                source: "Blue_Left.png"
                            }
                            Image {
                                id: highlightCenter
                                source: "Blue_Middle.png"
                                width: parent.width - highlightLeft.width - highlightRight.width
                            }
                            Image {
                                id: highlightRight
                                source: "Blue_Right.png"
                            }
                        }

                    }

                }

            }

        }

    }

    Image {
        id: imgPointMenu1
        source: getUPointImg()
        visible: uPointMode != -1 && stagePVR.isMouseVisible() && uPointMenu1.enabled && uPointMenu1.containsMouse
        x: uPointMenu1.mouseX
        y: uPointMenu1.mouseY
        parent:uPointMenu1.parent
    }

    MouseArea {
        id: uPointMenu1
        anchors.fill: parent
        enabled: !menu2.visible
        hoverEnabled: true
        parent: menu1List
        property int mouseIndex: menu1List.indexAt(mouseX, menu1List.contentY + mouseY)

        onMousePositionChanged: {
            if(mouseIndex != -1)
                menu1List.currentIndex = mouseIndex
        }

        onClicked: {
            if(mouseIndex != -1)
                onMenu1Clicked()
        }
    }

    Image {
        id: imgPointMenu2
        source: getUPointImg()
        visible: uPointMode != -1 && stagePVR.isMouseVisible() && uPointMenu2.containsMouse
        x: uPointMenu2.mouseX
        y: uPointMenu2.mouseY
        parent:uPointMenu2.parent

    }

    MouseArea {
        id: uPointMenu2
        anchors.fill: parent
        enabled: !uPointMenu1.enabled
        hoverEnabled: true
        parent: menu2List
        property int mouseIndex: menu2List.indexAt(mouseX, menu2List.contentY + mouseY)

        onMousePositionChanged: {
            if(mouseIndex != -1)
                menu2List.currentIndex = mouseIndex
        }

        onClicked: {
            if(mouseIndex != -1)
                onMenu2Clicked()
        }
    }

    Component.onCompleted: {
        menu1Model.appendData()
    }

}
