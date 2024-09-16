const nodemailer = require('nodemailer');


// SPTP Setting 

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: 'enter user email',
        pass: 'enter pass',

    },

})

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'asmitsingh@gmail.com',
        to,
        subject,
        text
    }
    try {
        const info = await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error(error);
    }
}


module.exports = { sendEmail }

