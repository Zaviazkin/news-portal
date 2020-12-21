const nodemailer = require("nodemailer");

async function main(req, res) {
    try {
        const{ email, password} = req.body
  const transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'ggnewskg@gmail.com',
        pass: '1236zzzz',
      },
    // tls:{
    //     rejectUnauthorized:false
    // }
  });
  const info = await transporter.sendMail({
    from: '"GG News KG" <ggnewskg@gmail.com>', // sender address
    to: `${email}`, // list of receivers 
    subject: "Восстановление пароля на новостном портале GG NEWS", // Subject line
    text:
    `if forget password`, // plain text body
    html:
     `<h1><b>GG NEWS<b><h1/>
     <h5>Здравствуйте,
    для восстановления доступа на GG NEWS, введите этот код-пароль для входа:<h5/>
    <h5> ${password} <h5/>
<h6> Если вы считаете, что данное сообщение отправлено вам ошибочно,
    просто проигнорируйте его. <h6/>
    <h6>Мы отправили это письмо, потому что вы или кто-то другой указал этот адрес на Новостном портале GG News <h6/>`, // html body
  });
  res.status(200).json(info)
}
  catch(e) {console.log(e); }
}

module.exports = {
    main
}