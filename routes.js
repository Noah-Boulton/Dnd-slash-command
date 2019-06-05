const helpers = require('./helpers');
const axios = require('axios');

async function cast(req, res) {
    try {
        await helpers.verify(req, res);
    } catch (error) {
        return response.status(400).send(error);
    }
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

    const search_terms = helpers.convertText(text).join('+');
    if (search_terms === '') {
        axios.post(response_url, {
            "Content-type": "application/json",
            "response_type": "ephemeral",
            "text": '*Critical fail!* Check your spelling and try asking again.'
        });
        return;
    }
    let spell_list;
    try {
        spell_list = await axios.get('http://www.dnd5eapi.co/api/spells/?name=' + search_terms);
    } catch (error) {
        console.log(error);
        axios.post(response_url, {
            "Content-type": "application/json",
            "response_type": "ephemeral",
            "text": '*Critical fail!* Check your spelling and try asking again.'
        });
    }

    const spell_url = spell_list.data.results[0].url;
    let spell_data;
    try {
        spell_data = await axios.get(spell_url);
    } catch (error) {
        console.error(error);
    }
    const name = spell_data.data.name ? spell_data.data.name : '';
    const desc = spell_data.data.desc.join('\n');
    const range = spell_data.data.range ? spell_data.data.range : '';
    const duration = spell_data.data.duration ? spell_data.data.duration : '';
    const concentration = spell_data.data.concentration ? spell_data.data.concentration : '';
    const casting_time = spell_data.data.casting_time ? spell_data.data.casting_time : '';
    const higher_levels = spell_data.data.higher_level ? spell_data.data.higher_level : '';
    const level = spell_data.data.level ? rspell_dataes.data.level : '';
    const ritual = spell_data.data.ritual ? spell_data.data.ritual : '';
    const page = spell_data.data.page ? spell_data.data.page : '';
    const spell = `*Spell:* ${name}\n*Description:* ${desc.replace('â€™', '\'')}\n*Higher Levels:* ${higher_levels}\n*Range:* ${range}\n*Level:* ${level}\n*Duration:* ${duration}\n*Concentration:* ${concentration}\n*Casting Time:* ${casting_time}\n*Ritual:* ${ritual}\n*Page:* ${page}\n`;
    axios.post(response_url, {
        "Content-type": "application/json",
        "response_type": "ephemeral",
        "text": spell
    });
}

exports.cast = cast;