<?php 

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if(isset($_GET["key"]) && $_GET["key"] == "AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg"){

	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	header('content-type: application/json; charset=utf-8');

	if(isset($_POST["email"]) && $_POST["email"] == "yes"){

		/*=============================================
		Enviamos correo electrónico
		=============================================*/	

		date_default_timezone_set("America/Bogota");

		$mail = new PHPMailer;

		$mail->Charset = "UTF-8";

		$mail->isMail();

		$mail->setFrom("noreply@marketplace-tesis.firebaseapp.com", "Organic Gye");

		$mail->Subject  = $_POST["comment"];

		$mail->addAddress($_POST["address"]);

		$mail->msgHTML(' 

			<div>

				Hola, '.$_POST["name"].':
				
				<a href="http://organic-gye.000webhostapp.com/'.$_POST["url"].'">Haga clic en este enlace para obtener más información.
				</a>

				Si no solicitó verificar esta dirección, puede ignorar este correo electrónico.

				Gracias,

				Tu equipo de Organic Gye

			</div>

		');

		$send = $mail->Send();

		if(!$send){

			$json = array(

			 	'status' => 404,
			 	'result' =>$mail->ErrorInfo
			
			);

			echo json_encode($json, true);

			return;

		}else{

			$json = array(

			 	'status' => 200,
			 	'result' =>"ok"
			
			);

			echo json_encode($json, true);

			return;
		}
	}


}
