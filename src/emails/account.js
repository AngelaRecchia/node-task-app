const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcome = (email, name) => {
    sgMail.send({
        to: email,
        from: 'a.heropas@gmail.com',
        subject: 'Thanks for joining',
        text: `Welcome to the app ${name}! Let me know how you get along with it`        
    }).then().catch(e => {console.log(e);})
}

const sendBye = (email, name) => {
    sgMail.send({
        to: email,
        from: 'a.heropas@gmail.com',
        subject: 'We will miss you',
        text: `Byebye ${name}! Let me know how you did get along with it`        
    }).then().catch(e => {console.log(e);})
}

module.exports = {
    sendWelcome,
    sendBye
}

