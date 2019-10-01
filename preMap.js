async function getTrashInfo() {
    let json;
    const url =
        "containere.csv";
    await fetch(url).then(data =>
        data.text().then(csv => {
            json = csvJSON(csv);
        })
    );
    return json;
}

function csvJSON(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            if (currentline[j] == undefined) continue;
            currentline[j] = currentline[j].replace(/'/g, "");
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}