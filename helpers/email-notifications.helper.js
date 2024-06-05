const nodeMailer = require('nodemailer');

async function sendLearnArduinoNotificationEmail(recipient, subject, projectName, fileName, sensors) {

	try {
		const recipients = process.env.MAIL_RECIPIENTS.split(',');
		recipients.push(recipient);
		console.log('recipients', recipients);
		let sensorsHtml = '';

		sensors.forEach(sensor => {
			sensorsHtml += `<tr><td>${sensor.quantity} ${sensor.name}</td></tr>`
		});


		const html = `
		<!DOCTYPE html>
		<html lang="es">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<title>Mensaje desde Makers Lab</title>
			<style type="text/css">
				* {
					margin: 0;
					padding: 0;
					font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
					font-size: 100%;
					line-height: 1.6;
				}
				img {
					max-width: 100%;
					margin: 0 auto!important; /* makes it centered */
				}
				body {
					-webkit-font-smoothing: antialiased;
					-webkit-text-size-adjust: none;
					width: 100%!important;
					height: 100%;
				}
				a {
					color: #348eda;
				}
				.btn-primary {
					text-decoration: none;
					color: #FFF;
					background-color: #348eda;
					border: solid #348eda;
					border-width: 10px 20px;
					line-height: 2;
					font-weight: bold;
					margin-right: 10px;
					text-align: center;
					cursor: pointer;
					display: inline-block;
					border-radius: 25px;
				}
				.btn-secondary {
					text-decoration: none;
					color: #FFF;
					background-color: #aaa;
					border: solid #aaa;
					border-width: 10px 20px;
					line-height: 2;
					font-weight: bold;
					margin-right: 10px;
					text-align: center;
					cursor: pointer;
					display: inline-block;
					border-radius: 25px;
				}
				.last {
					margin-bottom: 0;
				}
				.first {
					margin-top: 0;
				}
				.padding {
					padding: 10px 0;
				}
				table.body-wrap {
					width: 100%;
					padding: 20px;
				}
				table.body-wrap .container {
					border: 2px solid #f0f0f0;
				}
				table.footer-wrap {
					width: 100%;
					clear: both!important;
				}
				.footer-wrap .container p {
					font-size: 12px;
					color: #666;
		
				}
				table.footer-wrap a {
					color: #999;
				}
				h1, h2, h3 {
					font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
					line-height: 1.1;
					margin-bottom: 15px;
					color: #000;
					margin: 40px 0 10px;
					line-height: 1.2;
					font-weight: 200;
				}
				h1 {
					font-size: 36px;
				}
				h2 {
					font-size: 28px;
				}
				h3 {
					font-size: 22px;
				}
				p, ul, ol {
					margin-bottom: 10px;
					font-weight: normal;
					font-size: 14px;
				}
				ul li, ol li {
					margin-left: 5px;
					list-style-position: inside;
				}
				.container {
					display: block!important;
					max-width: 600px!important;
					margin: 0 auto!important; /* makes it centered */
					clear: both!important;
				}
				.body-wrap .container {
					padding: 20px;
				}
				.content {
					max-width: 600px;
					margin: 0 auto;
					display: block;
				}
				.content table {
					width: 100%;
				}
				th, td {
				   padding: 0.5rem;
				   font-size: 14px;
				}
			</style>
		</head>
		<body bgcolor="#f6f6f6">
			<!-- Main Body -->
			<table class="body-wrap">
				<tr>
					<td></td>
					<td class="container" bgcolor="#FFFFFF">
						<div class="content">
							<table>
								<tr>
									<td align="center" colspan="2">
										<img src="https://www.enlacetecnologias.mx/assets/logo_makers.png" alt="logo Portal Proveedores Calimax"/>
									</td>
								</tr>
								<!-- Email content goes here .. -->
								<tr>
									<td colspan="2">
										<h4>Atención <i>Maker</i>,</h4>
										<p></p>
										<p>El siguiente archivo está diseñado para cargarse desde el IDE de Arduino. Siga las instrucciones para cablear todo su proyecto y a continuación haga la carga de este archivo en su Microcontrolador Arduino</p>
									</td>
								</tr>
								<tr>
									<td><u>Datos del Proyecto:</u></td>
								</tr>
								<tr>
									<td><b>Nombre del Proyecto: </b></td>
									<td>${projectName}</td>
								</tr>
								<tr>
									<td><b>Dificultad: </b></td>
									<td>Fácil</td>
								</tr>
								<tr>
									<td><b>Sensores:</b></td>
									${sensorsHtml}
								</tr>
								<tr>
									<td><b>Fecha/Hora SOLICITADA:</b></td>
									<td>${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}</td>
								</tr>
								<tr>
									<td align="left" colspan="2">
										<p>Puedes realizar la descarga del archivo en el siguiente <a href="https://enlacetecnologias.mx/assets/${fileName}">Link</a></p>
									</td>
								</tr>
								<tr>
									<td align="center" colspan="2">
										<p>Saludos Cordiales!,</p>
										<p><b>Maker's Lab Team</b></p>
									</td>
								</tr>
							</table>
						</div>
					</td>
					<td></td>
				</tr>
			</table>
			<!-- /Main Body -->
			<!-- Footer -->
			<table class="footer-wrap">
				<tr>
					<td></td>
					<td class="container">
						<div class="content">
							<table>
								<tr>
									<td align="center">
										<p>Enviado automáticamente desde <a href="https://enlacetecnologias.mx" title="Makers Lab Team">Makers Lab Team</a></p>
									</td>
								</tr>
							</table>
						</div>
					</td>
					<td></td>
				</tr>
			</table>
			<!-- /Footer -->
		</body>
		</html>
    `;


		const transporter = nodeMailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			secure: true,
			auth: {
				user: process.env.MAIL_USERNAME,
				pass: process.env.MAIL_PASSWORD
			}
		});

		const info = await transporter.sendMail({
			from: process.env.MAIL_FROM_NAME,
			to: recipients,
			subject: subject,
			html: html
		});

		console.log('Message sent: ', info.messageId);
		console.log('Recipient accepted: ', info.accepted);
		console.log('Recipient rejected: ', info.rejected);

		return info;
	} catch (error) {
		console.log(`No fue posible enviar el email. Error: ${error.response}`);
		console.log({ error });
		return null;
	}

}

async function sendLeadNotificationEmail(first_name, last_name, email, phone, business_name) {

	try {
		const subject = 'Tienes un Email desde ITSOFT ChatBot';
		const recipients = process.env.MAIL_RECIPIENTS.split(',');
		// recipients.push(email);
		console.log('recipients', recipients);
		
		const html = `
		<!DOCTYPE html>
		<html lang="es">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<title>Email Message</title>
			<style type="text/css">
				* {
					margin: 0;
					padding: 0;
					font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
					font-size: 100%;
					line-height: 1.6;
				}
				img {
					max-width: 100%;
					margin: 0 auto!important; /* makes it centered */
				}
				body {
					-webkit-font-smoothing: antialiased;
					-webkit-text-size-adjust: none;
					width: 100%!important;
					height: 100%;
				}
				a {
					color: #348eda;
				}
				.btn-primary {
					text-decoration: none;
					color: #FFF;
					background-color: #348eda;
					border: solid #348eda;
					border-width: 10px 20px;
					line-height: 2;
					font-weight: bold;
					margin-right: 10px;
					text-align: center;
					cursor: pointer;
					display: inline-block;
					border-radius: 25px;
				}
				.btn-secondary {
					text-decoration: none;
					color: #FFF;
					background-color: #aaa;
					border: solid #aaa;
					border-width: 10px 20px;
					line-height: 2;
					font-weight: bold;
					margin-right: 10px;
					text-align: center;
					cursor: pointer;
					display: inline-block;
					border-radius: 25px;
				}
				.last {
					margin-bottom: 0;
				}
				.first {
					margin-top: 0;
				}
				.padding {
					padding: 10px 0;
				}
				table.body-wrap {
					width: 100%;
					padding: 20px;
				}
				table.body-wrap .container {
					border: 2px solid #f0f0f0;
				}
				table.footer-wrap {
					width: 100%;
					clear: both!important;
				}
				.footer-wrap .container p {
					font-size: 12px;
					color: #666;
		
				}
				table.footer-wrap a {
					color: #999;
				}
				h1, h2, h3 {
					font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
					line-height: 1.1;
					margin-bottom: 15px;
					color: #000;
					margin: 40px 0 10px;
					line-height: 1.2;
					font-weight: 200;
				}
				h1 {
					font-size: 36px;
				}
				h2 {
					font-size: 28px;
				}
				h3 {
					font-size: 22px;
				}
				p, ul, ol {
					margin-bottom: 10px;
					font-weight: normal;
					font-size: 14px;
				}
				ul li, ol li {
					margin-left: 5px;
					list-style-position: inside;
				}
				.container {
					display: block!important;
					max-width: 600px!important;
					margin: 0 auto!important; /* makes it centered */
					clear: both!important;
				}
				.body-wrap .container {
					padding: 20px;
				}
				.content {
					max-width: 600px;
					margin: 0 auto;
					display: block;
				}
				.content table {
					width: 100%;
				}
				th, td {
				   padding: 0.5rem;
				   font-size: 14px;
				}
			</style>
		</head>
		<body bgcolor="#f6f6f6">
			<!-- Main Body -->
			<table class="body-wrap">
				<tr>
					<td></td>
					<td class="container" bgcolor="#FFFFFF">
						<div class="content">
							<table>
								<tr>
									<td align="center" colspan="2">
										<img src="https://itsoft.mx/img/brand/og-logo.png" alt="logo ITSOFT Services de México" height="300"/>
									</td>
								</tr>
								<!-- Email content goes here .. -->
								<tr>
									<td colspan="2">
										<h4>Atención <i>ITSOFT</i>,</h4>
										<p></p>
										<p>El siguiente mensaje está llegando desde el sitio de ITSoft por medio de un ChatBot hecho con Inteligencia Artificial de OPEN-AI</p>
									</td>
								</tr>
								<tr>
									<td><u>Datos del Usuario:</u></td>
								</tr>
								<tr>
									<td><b>Nombre Completo: </b></td>
									<td>${first_name} ${last_name}</td>
								</tr>
								<tr>
									<td><b>Teléfono: </b></td>
									<td>${phone}</td>
								</tr>
								<tr>
									<td><b>Email: </b></td>
									<td>${email}</td>
								</tr>
								<tr>
									<td><b>Nombre de la Empresa: </b></td>
									<td>${business_name}</td>
								</tr>
								<tr>
									<td><b>Fecha/Hora de la Notificación:</b></td>
									<td>${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}</td>
								</tr>
								<tr>
									<td align="center" colspan="2">
										<p>Saludos Cordiales!,</p>
										<p><b>ITSoft ChatBot</b></p>
									</td>
								</tr>
							</table>
						</div>
					</td>
					<td></td>
				</tr>
			</table>
			<!-- /Main Body -->
			<!-- Footer -->
			<table class="footer-wrap">
				<tr>
					<td></td>
					<td class="container">
						<div class="content">
							<table>
								<tr>
									<td align="center">
										<p>Enviado automáticamente desde <a href="https://itsoft.mx" title="ITSOFT Team">ITSOFT Team</a></p>
									</td>
								</tr>
							</table>
						</div>
					</td>
					<td></td>
				</tr>
			</table>
			<!-- /Footer -->
		</body>
		</html>
    `;


		const transporter = nodeMailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			secure: true,
			auth: {
				user: process.env.MAIL_USERNAME,
				pass: process.env.MAIL_PASSWORD
			}
		});

		const info = await transporter.sendMail({
			from: process.env.MAIL_FROM_NAME,
			to: recipients,
			subject: subject,
			html: html
		});

		console.log('Message sent: ', info.messageId);
		console.log('Recipient accepted: ', info.accepted);
		console.log('Recipient rejected: ', info.rejected);

		return info;
	} catch (error) {
		console.log(`No fue posible enviar el email. Error: ${error.response}`);
		console.log({ error });
		return null;
	}

}

module.exports = { sendLeadNotificationEmail, sendLearnArduinoNotificationEmail }
