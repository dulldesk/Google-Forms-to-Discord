var POST_URL = "WEBBHOOK URL";
const EMBED_TITLE = "Embed title";
const EMBED_URL = "https://example.com";

function onSubmit(e,ind=-1) {
    var form = FormApp.getActiveForm();
    var allResponses = form.getResponses();
    var latestResponse = allResponses[ind === -1 ? allResponses.length - 1 : ind];
    var response = latestResponse.getItemResponses();
    var items = [];
    const timestamp = latestResponse.getTimestamp().toLocaleString();

    for (var i = 0; i < response.length; i++) {
        var question = response[i].getItem().getTitle();
        var answer = response[i].getResponse();
        try {
            var parts = answer.match(/[\s\S]{1,1024}/g) || [];
        } catch (e) {
            var parts = answer;
        }

        if (answer == "") {
            continue;
        }
        for (var j = 0; j < parts.length; j++) {
            if (j == 0) {
                items.push({
                    "name": question,
                    "value": parts[j],
                    "inline": false
                });
            } else {
                items.push({
                    "name": question.concat(" (cont.)"),
                    "value": parts[j],
                    "inline": false
                });
            }
        }
    }

    var options = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
        },
        "payload": JSON.stringify({
            "content": "‌",
            "embeds": [{
                "title": EMBED_TITLE,
              "color": 33023, // This is optional, you can look for decimal colour codes at https://www.webtoolkitonline.com/hexadecimal-decimal-color-converter.html
                "fields": items,
                "url": EMBED_URL,
                "footer": {
                    "text": timestamp
                }
            }]
        })
    };

    UrlFetchApp.fetch(POST_URL, options);
};

function postCurrentResponses() {
    const allResponses = FormApp.getActiveForm().getResponses();
    for (let i=0;i<allResponses.length;i++) {
        onSubmit("",i);
    }
}
