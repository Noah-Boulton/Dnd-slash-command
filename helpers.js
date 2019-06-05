const crypto = require('crypto');
const qs = require('qs');

function verify(request, res) {
    const slack_signature = request.headers['x-slack-signature'];
    const timestamp = request.headers['x-slack-request-timestamp'];
    const request_body = qs.stringify(request.body, { format: 'RFC1738' });
    const sig_basestring = 'v0:' + timestamp + ':' + request_body;

    const my_signature = 'v0=' +
        crypto.createHmac('sha256', process.env.SIGNING_SECRET)
            .update(sig_basestring, 'utf8')
            .digest('hex');
    return new Promise(function (resolve, reject) {
        if (crypto.timingSafeEqual(Buffer.from(my_signature, 'utf8'), Buffer.from(slack_signature, 'utf8'))) {
            resolve(res);
        } else {
            reject(res);
        }
    });
}

function convertText(text) {
    var terms = text.split(" ");
    for (var i = 0; i < terms.length; i++) {
        terms[i] = terms[i].charAt(0).toUpperCase() + terms[i].substring(1);
    }
    return terms;
}

exports.verify = verify;
exports.convertText = convertText;