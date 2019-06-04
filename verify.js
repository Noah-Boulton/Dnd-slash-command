const crypto = require('crypto');
const qs = require('qs');

function verify(request){
    const slack_signature = request.headers['x-slack-signature'];
    const timestamp = request.headers['x-slack-request-timestamp'];
    const request_body = qs.stringify(request.body,{ format:'RFC1738' });
    const sig_basestring = 'v0:' + timestamp + ':' + request_body;

    const my_signature = 'v0=' + 
                        crypto.createHmac('sha256', process.env.SIGNING_SECRET)
                        .update(sigBasestring, 'utf8')
                        .digest('hex');
    // console.log(request);
    console.log(my_signature);
    console.log(slack_signature);
    if (crypto.timingSafeEqual(Buffer.from(mySignature, 'utf8'), Buffer.from(slackSignature, 'utf8'))){
        console.log('Vefified');
    } 
}

exports.verify = verify;