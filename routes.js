const helpers = require('./helpers');
const axios = require('axios');

async function cast(req, res) {
    try {
        await helpers.verify(req, res);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
    const { text, response_url } = req.body;
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

    try {
        const search_terms = helpers.convertText(text).join('+');
        const spell_list = await axios.get('http://www.dnd5eapi.co/api/spells/?name=' + search_terms);
        const spell_url = spell_list.data.results[0].url;
        const spell_data = await axios.get(spell_url);
        const spell = `*Spell:* ${spell_data.data.name}\n*Description:* ${spell_data.data.desc.join('\n').replace('â€™', '\'')}\n*Higher Levels:* ${spell_data.data.higher_level}\n*Range:* ${spell_data.data.range}\n*Level:* ${spell_data.data.level}\n*Duration:* ${spell_data.data.duration}\n*Concentration:* ${spell_data.data.concentration}\n*Casting Time:* ${spell_data.data.casting_time}\n*Ritual:* ${spell_data.data.ritual}\n*Page:* ${spell_data.data.page}\n`;
        axios.post(response_url, {
            "Content-type": "application/json",
            "response_type": "ephemeral",
            "text": spell
        });
    } catch (error) {
        console.log(error);
        axios.post(response_url, {
            "Content-type": "application/json",
            "response_type": "ephemeral",
            "text": '*Critical fail!* Check your spelling and try asking again.'
        });
    }
}

async function feat(req, res) {
    try {
        await helpers.verify(req, res);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
    const { text, response_url } = req.body;

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

    try {
        const search_terms = helpers.convertText(text).join(' ');
        const feat_list = await axios.get('http://www.dnd5eapi.co/api/features');
        const feats = feat_list.data.results;
        let url;
        for (var i = 0; i < feats.length; i++) {
            if (feats[i]['name'] === search_terms) {
                url = feats[i]['url'];
            }
        }
        if (url === undefined) {
            axios.post(response_url, {
                "Content-type": "application/json",
                "response_type": "ephemeral",
                "text": '*Critical fail!* Check your spelling and try asking again.'
            });
            return;
        }
        const feat_data = await axios.get(url);
        const feat = `*Feat:* ${feat_data.data.name}\n*Description:* ${feat_data.data.desc.join('\n').replace('â€™', '\'')}\n`;
        axios.post(response_url, {
            "Content-type": "application/json",
            "response_type": "ephemeral",
            "text": feat
        });
    } catch (error) {
        console.log(error);
        axios.post(response_url, {
            "Content-type": "application/json",
            "response_type": "ephemeral",
            "text": '*Critical fail!* Check your spelling and try asking again.'
        });
    }
}

async function condition(req, res) {
    try {
        await helpers.verify(req, res);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
    const { text, response_url } = req.body;
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
    try {
        const search_terms = helpers.convertText(text).join(' ');
        if (search_terms === '') {
            axios.post(response_url, {
                "Content-type": "application/json",
                "response_type": "ephemeral",
                "text": '*Critical fail!* Check your spelling and try asking again.'
            });
            return;
        }
        const condition_list = await axios.get('http://www.dnd5eapi.co/api/conditions');
        const conditions = condition_list.data.results
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
        const condition_data = await axios.get(url);
        const condition = `*Condition:* ${condition_data.data.name}`;
        axios.post(response_url, {
            "Content-type": "application/json",
            "response_type": "ephemeral",
            "text": condition,
            "attachments": [
                {
                    "text": `${condition_data.data.desc.join('\n').replace('â€™', '\'')}`
                }
            ]
        });
    } catch (error) {
        console.error(error);
        axios.post(response_url, {
            "Content-type": "application/json",
            "response_type": "ephemeral",
            "text": '*Critical fail!* Check your spelling and try asking again.'
        });
    }
}

async function gold(req, res, database) {
    try {
        await helpers.verify(req, res);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
    const { text, user_id, response_url} = req.body;
    if(text.toLowerCase() === 'help') {
        res.send({
            "response_type": "ephemeral",
            "text": `Use \`/gold\` to get and update your gold balance. Some examples include:`,
            "attachments": [
                {
                    "text": "• \`/gold\`\n• \`/gold 100\`\n• \`/gold -10\`\n"
                }
            ]
        });
        return;
    }

    // Send empty HTTP 200 to original request
    res.send('');
    if(text === '') {
        database.find({ user_id: user_id }, function (err, docs) {
            if(docs.length !== 0){
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": `*Gold:* ${docs[docs.length-1].amount}`
                });
            } else {
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": `*Critical fail!* You don't have any gold in the bank yet.`,
                    "attachments": [
                        {
                            "text": "Try adding some using \`/gold [amount]\`"
                        }
                    ]
                });
            }
        });
        return;
    }
    
    try {
        // console.log(user_id);
        const amount = Number.parseInt(text, 10);
        if(Number.isNaN(amount)){
            axios.post(response_url, {
                "Content-type": "application/json",
                "response_type": "ephemeral",
                "text": '*Critical fail!* Make sure you supply an integer'
            });
            return;
        }
        database.find({ user_id: user_id }, function (err, docs) {
            // console.log(docs);
            if(docs.length !== 0){
                database.update({ user_id: user_id  }, { user_id: user_id , amount: docs[docs.length-1].amount + amount}, {}, function (err, numReplaced) {});
                // console.log('Last doc: ', docs[docs.length-1]);
                const balance = docs[docs.length-1].amount + amount;
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": `*Gold: * ${balance}`
                });
            } else {
                const statement = { user_id: user_id,
                                    amount: amount};
                database.insert(statement);
                const balance = amount;
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": `*Gold: * ${balance}`
                });
            }
        });
    } catch (erorr) {
        console.error(error);
        return res.status(400).send(error);
    }
}

exports.cast = cast;
exports.feat = feat;
exports.condition = condition;
exports.gold = gold;