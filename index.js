var express = require('express');
var app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  };
  
app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.post('/', function (req, res) {
    const { command, text, response_url } = req.body;
    // console.log(command, text);
    if(text.toLowerCase() === 'help'){
        if(command === '/cast'){
            res.send({
                "response_type": "ephemeral",
                "text": `Use \`/cast\` to find out about 5th Edition Dungeons and Dragons spells. Some examples include:`,
                "attachments": [
                    {
                        "text":"• \`/cast fireball\`\n• \`/cast acid arrow\`\n• \`/cast animate dead\`\n"
                    }
                ]
            });
        } else if(command === '/feat'){
            res.send({
                "response_type": "ephemeral",
                "text": `Use \`/feat\` to find out about 5th Edition Dungeons and Dragons features. Some examples include:`,
                "attachments": [
                    {
                        "text":"• \`/feat rage\`\n• \`/feat danger sense\`\n• \`/feat intimidating presence\`\n"
                    }
                ]
            });
        }
        
        return;
    }
    if(command === '/cast'){
        res.send('');
        postSpell(text, response_url);
    } else if(command === '/feat'){
        res.send('');
        postFeat(text, response_url);
    }else {
        res.send({
            "response_type": "ephemeral",
            "text": "This is a test of Gary",
            "attachments": [
                {
                    "text":"Gary will have more features soon."
                }
            ]
        });
    }
})

// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!');
// });

app.set('port', (process.env.PORT || 9001));

app.listen(app.get('port'), () => {
    console.log('Server listening on port %s', app.get('port'))
});

function postSpell(text, response_url){
    search_terms = convertText(text).join('+');
    // console.log(search_terms);
    axios.get('http://www.dnd5eapi.co/api/spells/?name=' + search_terms)
    .then(res => {
        const spell_url = res.data.results[0].url;
        axios.get(spell_url)
        .then(res => {
            const spell = `*Spell:* ${res.data.name}\n*Description:* ${res.data.desc.join(' ')}\n*Range:* ${res.data.range}\n*Duration:* ${res.data.duration}\n*Concentration:* ${res.data.concentration}\n*Casting Time:* ${res.data.casting_time}\n*Page:* ${res.data.page}\n`;
            axios.post(response_url, {
                "Content-type" : "application/json",
                "response_type": "ephemeral",
                "text": spell
            });
        })
        .catch(function (error) {
            console.log(error);
        })
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        axios.post(response_url, {
            "Content-type" : "application/json",
            "response_type": "ephemeral",
            "text": 'I can\'t seem to find that spell. Check the spelling and try asking again.',
            "attachments": [
                {
                    "text":`You searched for '${text}'.`
                }
            ]
        });
    })
}

function postFeat(text, response_url){
    search_terms = convertText(text).join(' ');
    if(search_terms === ''){
        axios.post(response_url, {
            "Content-type" : "application/json",
            "response_type": "ephemeral",
            "text": 'I can\'t seem to find that features. Check the spelling and try asking again.',
            "attachments": [
                {
                    "text": 'Make sure you type the name of the feature.'
                }
            ]
        });
        return;
    }
    // console.log(search_terms);
    axios.get('http://www.dnd5eapi.co/api/features')
    .then(res => {
        // console.log(res.data.results);
        feats = res.data.results;
        for(var i = 0; i < feats.length; i++){
            if(feats[i]['name'] === search_terms){
                var url = feats[i]['url'];
            }
        }
        if(url === undefined){
            axios.post(response_url, {
                "Content-type" : "application/json",
                "response_type": "ephemeral",
                "text": 'I can\'t seem to find that features. Check the spelling and try asking again.',
                "attachments": [
                    {
                        "text": `You searched for '${search_terms}'.`
                    }
                ]
            });
            return
        }
        axios.get(url)
        .then(res => {
            const feat = `*Feat:* ${res.data.name}\n*Description:* ${res.data.desc.join(' ')}\n`;
            axios.post(response_url, {
                "Content-type" : "application/json",
                "response_type": "ephemeral",
                "text": feat
            });
        })
        .catch(function (error) {
            console.log(error);
        })
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
}

function convertText(text){
    var terms = text.split(" ");
    for(var i = 0 ; i < terms.length ; i++){
        terms[i] = terms[i].charAt(0).toUpperCase() + terms[i].substring(1); 
    }
    return terms;
}