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
        const condition = `*Condition:* ${ondition_data.data.name}`;
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

exports.cast = cast;
exports.feat = feat;
exports.condition = condition;