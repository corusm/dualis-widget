// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;

let data = await loadSite()

async function loadSite() {
    let data;
    let url='https://dualis.dhbw.de/scripts/mgrqispi.dll?APPNAME=CampusNet&PRGNAME=EXTERNALPAGES&ARGUMENTS=-N000000000000001,-N000324,-Awelcome'
    var wbv = new WebView()
    await wbv.loadURL(url)
    //javasript to grab data from the website
    let jsc = `
      var arr = new Array()
      
      document.getElementById('field_user').value = "EMAIL"
      document.getElementById('field_pass').value = "PASSWORD"
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
            init({noten: grades, totalCredits: totalCredits, schnitt: schnitt })

        })})
    })

}

async function init(data){

    if (config.runsInWidget){

        // TODO: Check widgetParameter
        // TODO: Check if content of args.widgetParameter fits with the needed content (slice out e-mail and password
        // TODO: Check if login works
        // TODO: IF login works, then fetch the data and submit it to createWidget()
        // TODO: Otherwise, show in the widget that the login did not work
        console.log(data)


        let widget = await createWidget(data)
        widget.setPadding(0,4,0,4)

        if (config.widgetFamily === 'medium'){
            await widget.presentMedium()
        } else {
            await widget.presentSmall()
        }

        Script.setWidget(widget)
        Script.complete()
    }else{
        //redirect to Dualis
        Safari.open("https://dualis.dhbw.de")
    }
}

// after crawl:

async function createWidget(data){
    console.log(data)
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

    createGradeBlock(data["noten"], 0, 3, gradeRow)

    if (config.widgetFamily === 'medium') {
        const emptySpace = gradeRow.addStack();
        emptySpace.setPadding(0,8,0,8)
        createGradeBlock(data["noten"], 4, 7, gradeRow)
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
        gradeBlock.addText(convertLongNameToShortName(dataSet[i].kurs) + ": " + dataSet[i].note).font
            = Font.mediumSystemFont(14)
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
            shortName = "Schlüsselq."
            break;
        case name.contains("Praxisprojekt I"):
            shortName = "T1000"
            break;
        default:
            shortName = name;
    }
    return name;
}

String.prototype.contains = function(substr) {
    return this.indexOf(substr) > -1;
}