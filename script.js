// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
let email = ""
let password = ""
let runLoadSite = true

let widgetRawInput = args.widgetParameter;
if (widgetRawInput !== null) {
    widgetInput = widgetRawInput.toString().split(',')
    email = widgetInput[0]
    password = widgetInput[1]
}else{
    runLoadSite = false
    if(config.runsInWidget){
        init(false, null, 'Bitte gib deine E-Mail und dein Passwort für Dualis im Widget-Parameter an')
    }
}


async function loadSite() {
    if(email.length === 0 || password.length === 0){
        init(false, null, 'Bitte gib vollständige Daten im Widget-Parameter an')
    }else{
        let data;
        let url='https://dualis.dhbw.de/scripts/mgrqispi.dll?APPNAME=CampusNet&PRGNAME=EXTERNALPAGES&ARGUMENTS=-N000000000000001,-N000324,-Awelcome'
        var wbv = new WebView()
        await wbv.loadURL(url)
        //javasript to grab data from the website
        let jsc = `
      var arr = new Array()
      
      document.getElementById('field_user').value = "${email}"
      document.getElementById('field_pass').value = "${password}"
      document.getElementById('cn_loginForm').submit()
      
      `
        //Run the javascript
        await wbv.evaluateJavaScript(jsc)
        await wbv.waitForLoad()

        let tm = new Timer()
        tm.timeInterval = 2000

        tm.schedule(function() {

            let jsc2 = `document.getElementsByClassName('link000310')[0].click()`

            wbv.evaluateJavaScript(jsc2)

            wbv.waitForLoad().then(r => { wbv.getHTML().then(r => {

                let tab = r.split("table")[1]
                tab = `<table ${tab}table>`
                tab = tab.split('tr')

                let schnitt = r.split("table")[3].split("</th")[1].split('>')[2].trim()

                let grades = []
                let totalCredits

                // console.log(tab[1])
                for (let to = 1; to < tab.length-1; to++) {
                    // console.log(tab[to])
                    if (tab[to].includes('T3')) {
                        try {
                            let modul = tab[to].split('td')[1].trim().substr(15).split('<')[0]
                            let kurs = tab[to].split(',800,600);">')[1].split('</a>')[0]
                            let zahlen = tab[to].split('<td class="tbdata" style="text-align:right;">')
                            let credits = zahlen[2].trim().split('<')[0]
                            let note = zahlen[3].trim().split('<')[0]

                            grades.push({ modul: modul, kurs: kurs, credits: credits, note: note })

                        } catch(e) {
                            // console.log('error')
                        }
                    } else if (tab[to].includes('Friedrichshafen') && tab[to].includes('Summe')) {
                        totalCredits = tab[to].split('nowrap;"> ')[1].split(',0')[0]
                    }
                }

                // Output
                init(true, {noten: grades, totalCredits: totalCredits, schnitt: schnitt })

            })})
        })
    }

}

async function init(success, data, additionalData){

    // TODO: Check if login works
    // TODO: IF login works, then fetch the data and submit it to createWidget()
    // TODO: Otherwise, show in the widget that the login did not work
    // console.log(data)

    if (success === true) {
        const widget = await createWidget(data)
        widget.setPadding(0,4,0,4)

        if (config.widgetFamily === 'medium'){
            await widget.presentMedium()
        } else {
            await widget.presentSmall()
        }

        Script.setWidget(widget)
        Script.complete()
    }else{
        const errorWidget = new ListWidget()

        const headerRow = errorWidget.addStack()
        headerRow.setPadding(8, 6, 6, 6)
        headerRow.centerAlignContent()

        const headline = headerRow.addStack()
        const headlineText = headline.addText("✏️ Dualis")
        headlineText.textColor = new Color('e74c3c', 1)
        headlineText.font = Font.mediumSystemFont(16)
        headline.addSpacer()

        const errorBlock = errorWidget.addStack()
        errorBlock.setPadding(4,4,4,4)
        const errorText = errorBlock.addText(additionalData)
        errorText.font = Font.mediumSystemFont(12)
        errorText.textColor = new Color('e74c3c', 1)

        await errorWidget.presentSmall()

        Script.setWidget(errorWidget)
        Script.complete()

    }

}

// after crawl:

async function createWidget(data){
    console.log(data)
    const list = new ListWidget()

    if (config.widgetFamily === 'small' || config.widgetFamily === undefined){

        const headerRow = list.addStack()
        headerRow.setPadding(8, 6, 6, 6)
        headerRow.centerAlignContent()

        const headline = headerRow.addStack()
        const headlineText = headline.addText("✏️ Dualis")
        headlineText.textColor = new Color('e74c3c', 1)
        headlineText.font = Font.mediumSystemFont(16)
        headline.addSpacer()

        const averageBlock = headerRow.addStack()
        averageBlock.layoutHorizontally()
        averageBlock.setPadding(0, 8, 0, 0)
        const averageText = averageBlock.addText("Ø " + data["schnitt"])
        averageText.font = Font.mediumSystemFont(16)

        const gradeRow = list.addStack()
        gradeRow.setPadding(0, 0, 0, 0)
        gradeRow.layoutHorizontally()
        gradeRow.centerAlignContent()

        createGradeBlock(data["noten"], 0, 3, gradeRow)

        const footer = list.addStack();
        footer.addSpacer();
        footer.setPadding(4, 6, 8, 6)
        const footerText = footer.addText(data.totalCredits + " ECTS Credits")
        footerText.font = Font.mediumSystemFont(10)
    }


    if (config.widgetFamily === 'medium') {
        const wrapperStack = list.addStack();
        wrapperStack.layoutHorizontally()
        wrapperStack.addSpacer();

        const leftStack = wrapperStack.addStack();
        leftStack.layoutVertically()
        leftStack.centerAlignContent()
        const headlineText = leftStack.addText("✏️ Dualis")
        headlineText.textColor = new Color('e74c3c', 1)
        headlineText.font = Font.mediumSystemFont(16)
        leftStack.addSpacer(8)

        createGradeBlock(data["noten"], 0, 3, leftStack)

        leftStack.addSpacer(8)

        wrapperStack.addSpacer()

        const rightStack = wrapperStack.addStack()
        rightStack.layoutVertically()
        rightStack.centerAlignContent()

        const averageBlock = rightStack.addStack();
        averageBlock.addSpacer()
        averageBlock.setPadding(0, 0, 0, 8)
        const averageText = averageBlock.addText("Ø " + data["schnitt"])
        averageText.font = Font.mediumSystemFont(16)
        rightStack.addSpacer(8)

        createGradeBlock(data["noten"], 4, 7, rightStack)

        rightStack.addSpacer(8)
        const footer = rightStack.addStack()
        footer.setPadding(0, 0, 0, 8)
        footer.addSpacer()
        const footerText = footer.addText(data.totalCredits + " ECTS Credits")
        footerText.font = Font.mediumSystemFont(10)

        wrapperStack.addSpacer()

    }


    return list
}

// Future Options: Get different sets of courses, etc.
function createGradeBlock(dataSet, minRange, maxRange, gradeRow){
    const gradeBlock = gradeRow.addStack();
    gradeBlock.layoutVertically()
    gradeBlock.centerAlignContent()
    for (let i = minRange; i < maxRange + 1; i++){
        let note;
        if (dataSet[i].note === 'b'){
            note = "✓"
        }else{
            note = dataSet[i].note
        }
        gradeBlock.addText(convertLongNameToShortName(dataSet[i].kurs) + ": " + note).font = Font.mediumSystemFont(14)
    }
    gradeBlock.backgroundColor = new Color('cccccc', 0.1)
    gradeBlock.cornerRadius = 8
    gradeBlock.setPadding(8,8,8,8)
    return gradeBlock;
}

function convertLongNameToShortName(name) {
    let shortName
    switch (true){
        case name.contains("Mathematik II"):
            shortName = "Mathe 2"
            break;
        case name.contains("Mathematik I"):
            shortName = "Mathe 1"
            break;
        case name.contains("Technische Informatik II"):
            shortName = "TI 2"
            break;
        case name.contains("Technische Informatik I"):
            shortName = "TI 1"
            break;
        case name.contains("Theoretische Informatik III"):
            shortName = "TheoInf 3"
            break;
        case name.contains("Theoretische Informatik II"):
            shortName = "TheoInf 2"
            break;
        case name.contains("Theoretische Informatik I"):
            shortName = "TheoInf 1"
            break;
        case name.contains("Schlüsselqualifikationen"):
            shortName = "Schlüsselquali."
            break;
        case name.contains("Praxisprojekt III"):
            shortName = "T1000"
            break;
        case name.contains("Praxixprojekt II"):
            shortName = "T2000"
            break;
        case name.contains("Praxisprojekt I"):
            shortName = "T1000"
            break;
        default:
            shortName = name;
    }
    return shortName;
}

String.prototype.contains = function(substr) {
    return this.indexOf(substr) > -1;
}

if (config.runsInWidget){
    if (runLoadSite){
        await loadSite()
    }
}else{
    //redirect to Dualis?
    Safari.open("https://github.com/corusm/dualis-widget")
    Script.complete()
}