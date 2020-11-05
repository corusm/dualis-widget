// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: user-graduate;
// Julian Yaman & Niklas Leinz
// -----------------
// Dualis Widget
// -----------------
// Contact:
// dev@corusm.de || mail@yaman.pro

// Widget Settings
let MEDIUMWIDGET = (config.widgetFamily === 'medium') ? true : false

// Web Crawl Function



// Widget

if (config.runsInWidget){

    // TODO: Check if widgetParameter contains anything
    // TODO: Check if widgetParameter fits with the needed values (slicing out E-Mail and Password)
    // TODO: Check if user can login (function call for login, giving the e-mail and the password as parameter values)
    // TODO: If the login was successful, then fetch all data (function call to fetch the data)
    // TODO: If the login was unsuccessful, then show an error message inside the widget

    let widget = await createWidget()
    widget.setPadding(0,4,0,4)

    if (MEDIUMWIDGET){
        await widget.presentMedium()
    } else {
        await widget.presentSmall()
    }

    Script.setWidget(widget)
    Script.complete()
}else{
    // Don't need to scrape the data again
    Safari.open("https://dualis.dhbw.de")
}

async function createWidget(){
    const list = new ListWidget()

    const headerRow = list.addStack();
    const headerText = headerRow.addText("⚔️ Dualis")
    headerText.textColor = new Color('e74c3c', 1)
    const headerTextExtended = headerRow.addText(" - Noten")
    headerText.font = Font.mediumSystemFont(16)
    headerTextExtended.font = Font.mediumSystemFont(16)
    headerRow.setPadding(0,0,0,0)
    headerRow.centerAlignContent()
    headerRow.addSpacer(3)
    list.addSpacer(5)

    const gradeRow = list.addStack()
    gradeRow.layoutHorizontally()
    gradeRow.centerAlignContent()

    const placeholderDataSet = [
        {
            'courseName': 'TheoInf 3',
            'grade': 2.9
        },
        {
            'courseName': 'Datenbanken',
            'grade': '⏳'
        },
        {
            'courseName': 'Physik',
            'grade': 'WKL'
        },
        {
            'courseName': 'Digitaltechnik',
            'grade': 2.4
        }
    ]

    createGradeBlock(placeholderDataSet, 0, 3, gradeRow)

    if (MEDIUMWIDGET) {
        const emptySpace = gradeRow.addStack();
        emptySpace.setPadding(0,8,0,8)
        createGradeBlock(placeholderDataSet, 4, 7, gradeRow)
    }

    const footer = list.addStack();
    footer.setPadding(2,4,0,4)
    const footerText = footer.addText("Klicken, um Dualis zu öffnen")
    footerText.font = Font.mediumSystemFont(10)

    return list
}

// Future Options: Get different sets of courses, etc.
function createGradeBlock(dataSet, minRange, maxRange, gradeRow){
    const gradeBlock = gradeRow.addStack();
    gradeBlock.layoutVertically()
    gradeBlock.centerAlignContent()
    for (let i = minRange; i < maxRange + 1; i++){
        gradeBlock.addText(dataSet[i].courseName + ": " + dataSet[i].grade).font
            = Font.mediumSystemFont(14)
    }
    gradeBlock.backgroundColor = new Color('cccccc', 0.1)
    gradeBlock.cornerRadius = 8
    gradeBlock.setPadding(8,8,8,8)
    return gradeBlock;
}