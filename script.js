// Julian Yaman & Niklas Leinz
// -----------------
// Dualis Widget
// -----------------
// Contact:
// dev@corusm.de || mail@yaman.pro

// Web Crawl



// Widget
// Widget Parameter => E-Mail & Password
let MEDIUMWIDGET = (config.widgetFamily === 'medium') ? true : false

const widget = await createWidget()
widget.setPadding(0,0,0,0)

if (!config.runsInWidget){
    if (MEDIUMWIDGET){
        await widget.presentMedium()
    } else {
        await widget.presentSmall()
    }
}

Script.setWidget(widget)
Script.complete()

async function createWidget(){
    const list = new ListWidget()

    const headerRow = list.addStack();
    const headerText = headerRow.addText("âš”ï¸ Dualis")
    headerText.textColor = new Color('e74c3c', 1)
    const headerTextExtended = headerRow.addText(" - Noten")
    headerText.font = Font.mediumSystemFont(16)
    headerTextExtended.font = Font.mediumSystemFont(16)
    headerRow.setPadding(0,0,0,0)
    headerRow.centerAlignContent()
    headerRow.addSpacer(3)
    list.addSpacer(3)

    const gradeRow = list.addStack()
    gradeRow.layoutVertically()
    gradeRow.centerAlignContent()

    let padding = (MEDIUMWIDGET) ? 5 : 10
    gradeRow.addText("Fach 1: 2,9")
    gradeRow.addText("Fach 2: 2,4")
    gradeRow.addText("Fach 3: WKL")
    gradeRow.backgroundColor = new Color('cccccc', 0.1)
    gradeRow.cornerRadius = 8
    gradeRow.setPadding(8,8,8,8)

    return list
}