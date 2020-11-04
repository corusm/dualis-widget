// Julian Yaman & Niklas Leinz
// -----------------
// Dualis Widget
// -----------------
// Contact:
// dev@corusm.de || mail@yaman.pro

// Web Crawl



// Widget
// Widget Parameter => E-Mail & Password
// args.widgetParameter
// E-Mail,PW ?
let MEDIUMWIDGET = (config.widgetFamily === 'medium') ? true : false

if (config.runsInWidget){

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
    Safari.open("https://dualis.dhbw.de")
}

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
    list.addSpacer(5)

    const gradeRow = list.addStack()
    gradeRow.layoutHorizontally()
    gradeRow.centerAlignContent()

    createGradeBlock(gradeRow)

    if (MEDIUMWIDGET) {
        const emptySpace = gradeRow.addStack();
        emptySpace.setPadding(0,8,0,8)
        createGradeBlock(gradeRow)
    }

    const footer = list.addStack();
    footer.setPadding(2,4,0,4)
    const footerText = footer.addText("Klicken, um Dualis zu Ã¶ffnen")
    footerText.font = Font.mediumSystemFont(10)

    return list
}

// Future Options: Get different sets of courses, etc.
function createGradeBlock(gradeRow){
    const gradeBlock = gradeRow.addStack();
    gradeBlock.layoutVertically()
    gradeBlock.centerAlignContent()
    gradeBlock.addText("TheoInf: 2,9").font = Font.mediumSystemFont(14)
    gradeBlock.addText("Mathe 1: 2,4").font = Font.mediumSystemFont(14)
    gradeBlock.addText("Physik: WKL").font = Font.mediumSystemFont(14)
    gradeBlock.addText("DV Linux: 3,99 lol").font = Font.mediumSystemFont(14)
    gradeBlock.backgroundColor = new Color('cccccc', 0.1)
    gradeBlock.cornerRadius = 8
    gradeBlock.setPadding(8,8,8,8)
    return gradeBlock;
}