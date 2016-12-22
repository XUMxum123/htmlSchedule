// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1

Item {
    //=== Left Part
    Image {
        id: imgLeftTop
        source: "dialog_panel_1a_top_left.png"
    }
    Image {
        id: imgLeftMiddle
        source: "dialog_panel_2a_middle_left.png"
        anchors.top: imgLeftTop.bottom
        anchors.bottom: imgLeftBottom.top
    }
    Image {
        id: imgLeftBottom
        source: "dialog_panel_3a_bottom_left.png"
        anchors.bottom: parent.bottom
    }

    //=== Right Part
    Image {
        id: imgRightTop
        source: "dialog_panel_1c_top_right.png"
        anchors.right: parent.right
    }
    Image {
        id: imgRightMiddle
        source: "dialog_panel_2c_middle_right.png"
        anchors.right: parent.right
        anchors.top: imgRightTop.bottom
        anchors.bottom: imgRightBottom.top
    }
    Image {
        id: imgRightBottom
        source: "dialog_panel_3c_bottom_right.png"
        anchors.right: parent.right
        anchors.bottom: parent.bottom
    }

    //=== Center Part
    Image {
        id: imgCenterTop
        source: "dialog_panel_1b_top_center.png"
        anchors.left: imgLeftTop.right
        anchors.right: imgRightTop.left
    }
    Image {
        id: imgCenterMiddle
        source: "dialog_panel_2b_middle_center.png"
        anchors.left: imgLeftMiddle.right
        anchors.right: imgRightMiddle.left
        anchors.top: imgCenterTop.bottom
        anchors.bottom: imgCenterBottom.top
    }
    Image {
        id: imgCenterBottom
        source: "dialog_panel_3b_bottom_center.png"
        anchors.left: imgLeftBottom.right
        anchors.right: imgRightBottom.left
        anchors.bottom: parent.bottom
    }
}
