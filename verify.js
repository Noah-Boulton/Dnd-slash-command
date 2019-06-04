const crypto = require('crypto');

function verify(request){
    console.log(request.headers);
    timestamp = request.headers['x-slack-request-timestamp'];
    request_body = request.body;
    sig_basestring = 'v0:' + timestamp + ':' + request_body;

    const hmac = crypto.createHmac('sha256', process.env.SIGNING_SECRET);
    my_signature = 'v0=' + hmac.update(sig_basestring).digest('hex');
    slack_signature = request.headers['x-slack-signature'];
    // console.log(request);
    console.log(my_signature);
    console.log(slack_signature);
    if (crypto.timingSafeEqual(Buffer.from(my_signature, 'utf8'), Buffer.from(slack_signature, 'utf8'))){
        console.log('safe');
    }
}

exports.verify = verify;