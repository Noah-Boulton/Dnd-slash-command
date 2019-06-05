const express = require('express');
const app = express();
const axios = require('axios');
const helpers = require('./helpers');
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

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
    console.log('Server listening on port %s', app.get('port'))
});

app.post('/cast', function (req, res) {
    helpers.verify(req, res)
        .then(res => {
            const { command, text, response_url } = req.body;
            if (text.toLowerCase() === 'help') {
                res.send({
                    "response_type": "ephemeral",
                    "text": `Use \`/cast\` to find out about 5th Edition Dungeons and Dragons spells. Some examples include:`,
                    "attachments": [
                        {
                            "text": "• \`/cast fireball\`\n• \`/cast acid arrow\`\n• \`/cast animate dead\`\n"
                        }
                    ]
                });
                return;
            }
            // Send empty HTTP 200 to original request
            res.send('');

            search_terms = helpers.convertText(text).join('+');
            if (search_terms === '') {
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": '*Critical fail!* Check your spelling and try asking again.'
                });
                return;
            }
            axios.get('http://www.dnd5eapi.co/api/spells/?name=' + search_terms)
                .then(res => {
                    const spell_url = res.data.results[0].url;
                    axios.get(spell_url)
                        .then(res => {
                            const name = res.data.name ? res.data.name : '';
                            const desc = res.data.desc.join('\n');
                            const range = res.data.range ? res.data.range  : '';
                            const duration = res.data.duration ? res.data.duration : '';
                            const concentration = res.data.concentration ? res.data.concentration  : '';
                            const casting_time = res.data.casting_time ? res.data.casting_time : '';
                            const higher_levels = res.data.higher_level ? res.data.higher_level : '';
                            const level = res.data.level ? res.data.level : '';
                            const ritual = res.data.ritual ? res.data.ritual : '';
                            const page = res.data.page ? res.data.page : '';
                            const spell = `*Spell:* ${name}\n*Description:* ${desc.replace('â€™', '\'')}\n*Range:* ${range}\n*Higher Levels:* ${higher_levels}\n*Level:* ${level}\n*Duration:* ${duration}\n*Concentration:* ${concentration}\n*Casting Time:* ${casting_time}\n*Ritual:* ${ritual}\n*Page:* ${page}\n`;
                            axios.post(response_url, {
                                "Content-type": "application/json",
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
                        "Content-type": "application/json",
                        "response_type": "ephemeral",
                        "text": '*Critical fail!* Check your spelling and try asking again.'
                    });
                })
        })
        .catch(res => {
            console.log('Unknown request');
        })
})

app.post('/feat', function (req, res) {
    helpers.verify(req, res)
        .then(res => {
            const { command, text, response_url } = req.body;
            if (text.toLowerCase() === 'help') {
                res.send({
                    "response_type": "ephemeral",
                    "text": `Use \`/feat\` to find out about 5th Edition Dungeons and Dragons features. Some examples include:`,
                    "attachments": [
                        {
                            "text": "• \`/feat rage\`\n• \`/feat danger sense\`\n• \`/feat intimidating presence\`\n"
                        }
                    ]
                });
                return;
            }
            // Send empty HTTP 200 to original request
            res.send('');

            search_terms = helpers.convertText(text).join(' ');
            if (search_terms === '') {
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": '*Critical fail!* Check your spelling and try asking again.'
                });
                return;
            }
            axios.get('http://www.dnd5eapi.co/api/features')
                .then(res => {
                    feats = res.data.results;
                    for (var i = 0; i < feats.length; i++) {
                        if (feats[i]['name'] === search_terms) {
                            var url = feats[i]['url'];
                        }
                    }
                    if (url === undefined) {
                        axios.post(response_url, {
                            "Content-type": "application/json",
                            "response_type": "ephemeral",
                            "text": '*Critical fail!* Check your spelling and try asking again.'
                        });
                        return
                    }
                    axios.get(url)
                        .then(res => {
                            const name = res.data.name ? res.data.name : '';
                            const desc = res.data.desc.join('\n');
                            const feat = `*Feat:* ${name}\n*Description:* ${desc.replace('â€™', '\'')}\n`;
                            axios.post(response_url, {
                                "Content-type": "application/json",
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
        })
        .catch(res => {
            console.log('Unknown request');
        })
})

app.post('/condition', function (req, res) {
    helpers.verify(req, res)
        .then(res => {
            const { command, text, response_url } = req.body;
            if (text.toLowerCase() === 'help') {
                res.send({
                    "response_type": "ephemeral",
                    "text": `Use \`/condition\` to find out about 5th Edition Dungeons and Dragons conditions. Some examples include:`,
                    "attachments": [
                        {
                            "text": "• \`/condition blinded\`\n• \`/condition petrified\`\n• \`/condition stunned\`\n"
                        }
                    ]
                });
                return;
            }
            // Send empty HTTP 200 to original request
            res.send('');

            search_terms = helpers.convertText(text).join(' ');
            if (search_terms === '') {
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": '*Critical fail!* Check your spelling and try asking again.'
                });
                return;
            }
            axios.get('http://www.dnd5eapi.co/api/conditions')
                .then(res => {
                    conditions = res.data.results;
                    for (var i = 0; i < conditions.length; i++) {
                        if (conditions[i]['name'] === search_terms) {
                            var url = conditions[i]['url'];
                        }
                    }
                    if (url === undefined) {
                        axios.post(response_url, {
                            "Content-type": "application/json",
                            "response_type": "ephemeral",
                            "text": '*Critical fail!* Check your spelling and try asking again.'
                        });
                        return
                    }
                    axios.get(url)
                        .then(res => {
                            const name = res.data.name ? res.data.name : '';
                            const desc = res.data.desc.join('\n');
                            const feat = `*Condition:* ${name}\n*Description:* ${desc.replace('â€™', '\'')}\n`;
                            axios.post(response_url, {
                                "Content-type": "application/json",
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
        })
        .catch(res => {
            console.log('Unknown request');
        })
})