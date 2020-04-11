const helpers = require('./helpers');
const axios = require('axios');
const mongodb = require('mongodb');

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
        const spell_url = 'http://www.dnd5eapi.co/api/spells/?name=' + spell_list.data.results[0].url;
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

async function gold(req, res) {
    try {
        await helpers.verify(req, res);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
    res.send('');
    const { text, user_id, response_url} = req.body;

    switch (text.toLowerCase()) {
        case 'help' :
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
        case '' :
            const client = await mongodb.MongoClient.connect(process.env.DATABASE_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true });
            const gold = client.db('dnd_app').collection('gold');
            const record = await gold.findOne({user_id: user_id});
            
            if (record) {
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": `*Gold:* ${record.amount}`
                });
            } else {
                gold.insertOne({
                    user_id: user_id,
                    amount: 0,
                });
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": `*Critical fail!* You don't have any gold in the bank!`,
                    "attachments": [
                        {
                            "text": "Try adding some using \`/gold [amount]\`"
                        }
                    ]
                });
            }
            break;
        default :
            try {
                const amount = text * 1;
                if(Number.isNaN(amount)){
                    axios.post(response_url, {
                        "Content-type": "application/json",
                        "response_type": "ephemeral",
                        "text": '*Critical fail!* Make sure you supply an integer'
                    });
                    return;
                }
            const client = await mongodb.MongoClient.connect(process.env.DATABASE_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true });
            const gold = client.db('dnd_app').collection('gold');
            const record = await gold.findOne({user_id: user_id});
            
            if (record) {
                await gold.updateOne({ user_id: user_id}, { $set: { amount: record.amount + amount } }, (err, res) => {
                    if (err) throw err;
                });
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": `*Gold: * ${record.amount + amount}`
                });
            } else {
                gold.insertOne({
                    user_id: user_id,
                    amount: amount,
                });
                axios.post(response_url, {
                    "Content-type": "application/json",
                    "response_type": "ephemeral",
                    "text": `*Gold: * ${amount}`
                });
            }
        } catch (erorr) {
            console.error(error);
            return res.status(400).send(error);
        } 
    }
    client.close();             
}

async function tldr (req, res) {
    // try {
    //     await helpers.verify(req, res);
    // } catch (error) {
    //     console.error(error);
    //     return res.status(400).send(error);
    // }
    const { text, user_id, response_url } = req.body;
    const client = await mongodb.MongoClient.connect(process.env.DATABASE_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true });
    const tldr = client.db('dnd_app').collection('tldr');
    switch (text.toLowerCase()) {
        case '' :
            const record = await tldr.findOne();
            console.log(record);
            axios.post(response_url, {
                "Content-type": "application/json",
                "response_type": "ephemeral",
                "text": `*tldr: * ${record.description}`
            });
            break;
        case 'list' :
            console.log('List of all sessions');
            break;
        default :
            console.log(text);
    }
    res.send('');
    axios.post(response_url, {
        "Content-type": "application/json",
        "response_type": "ephemeral",
        "text": '*Critical fail!*'
    });

    client.close();
}

exports.cast = cast;
exports.feat = feat;
exports.condition = condition;
exports.gold = gold;
exports.tldr = tldr;
