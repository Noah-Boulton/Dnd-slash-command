const crypto = require('crypto');

function verify(request){
    timestamp = request.headers['X-Slack-Request-Timestamp'];
    request_body = request.body;
    sig_basestring = 'v0:' + timestamp + ':' + request_body;

    const hmac = crypto.createHmac('sha256', process.env.SIGNING_SECRET);
    my_signature = 'v0=' + hmac.update(sig_basestring).digest('hex');
    slack_signature = request.headers['X-Slack-Signature'];
    if (crypto.timingSafeEqual(Buffer.from(my_signature, 'utf8'), Buffer.from(slack_signature, 'utf8'))){
        console.log('safe');
    }
}

exports.verify = verify;