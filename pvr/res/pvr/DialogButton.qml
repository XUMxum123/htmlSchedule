// import QtQuick 1.0 // to target S60 5th Edition or Maemo 5
import QtQuick 1.1

Item {
    id: diaglogButton
    width: 200
    height: 70

    property alias btnString: btnText.text
    property bool isHighlight: focus

    Row {
        id: btnBgImg
        width: parent.width
        height: parent.height
        Image {
            id: btnLeft
            source: isHighlight? "But_HL_Blue_Left.png" : "But_Normal_Left.png"
        }
        Image {
            id: btnCenter
            source: isHighlight? "But_HL_Blue_Center.png" : "But_Normal_Center.png"
        }
        Image {
            id: btnRight
            source: isHighlight? "But_HL_Blue_Right.png" : "But_Normal_Right.png"
        }
    }

    Text {
        id: btnText
        width: parent.width
        height: parent.height
        verticalAlignment: Text.AlignVCenter
        horizontalAlignment: Text.AlignHCenter
        font.pixelSize: isHighlight?26: 24
        color: isHighlight?"#F1F2F3":"#8E8E8E"
    }
}
