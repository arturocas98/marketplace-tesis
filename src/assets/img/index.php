<?php 

if(isset($_GET["key"]) && $_GET["key"] == "AIzaSyAhIFsYyuMjThfQhH_2IQnI3yUR9LgdVsg"){

	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	header('content-type: application/json; charset=utf-8');

	if(isset($_FILES['file']["tmp_name"]) && !empty($_FILES['file']["tmp_name"])){ 

		/*=============================================
		Configuramos la ruta del directorio donde se guardará la imagen
		=============================================*/

		$directory = strtolower($_POST["path"].'/'.$_POST["folder"]);

		/*=============================================
		Preguntamos primero si no existe el directorio, para crearlo
		=============================================*/

		if(!file_exists($directory)){

			mkdir($directory, 0755);

		}

		/*=============================================
		Eliminar todos los archivos que existan en ese directorio
		=============================================*/

		$files = glob($directory."/*");

		foreach ($files as $file) {
			
			unlink($file);
		}

		/*=============================================
		Capturar ancho y alto original de la imagen
		=============================================*/

		list($width, $height) = getimagesize($_FILES['file']["tmp_name"]);

		$newWidth = $_POST["width"];
		$newHeight = $_POST["height"];

		/*=============================================
		De acuerdo al tipo de imagen aplicamos las funciones por defecto
		=============================================*/

		if($_FILES["file"]["type"] == "image/jpeg"){

			//definimos nombre del archivo
			$name = mt_rand(100, 9999).'.jpg';

			//definimos el destino donde queremos guardar el archivo
			$folderPath = $directory.'/'.$name;

			//Crear una copia de la imagen
			$start = imagecreatefromjpeg($_FILES['file']["tmp_name"]);

			//Instrucciones para aplicar a la imagen definitiva
			$end = imagecreatetruecolor($newWidth, $newHeight);

			imagecopyresized($end, $start, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

			imagejpeg($end, $folderPath);

		}


		if($_FILES["file"]["type"] == "image/png"){

			//definimos nombre del archivo
			$name = mt_rand(100, 9999).'.png';

			//definimos el destino donde queremos guardar el archivo
			$folderPath = $directory.'/'.$name;

			//Crear una copia de la imagen
			$start = imagecreatefrompng($_FILES['file']["tmp_name"]);

			//Instrucciones para aplicar a la imagen definitiva
			$end = imagecreatetruecolor($newWidth, $newHeight);

			imagealphablending($end, FALSE);
			
			imagesavealpha($end, TRUE);		

			imagecopyresampled($end, $start, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

			imagepng($end, $folderPath);
			
		}


		$json = array(

		 	'status' => 200,
		 	'data' =>$name
		
		);

		echo json_encode($json, true);

		return;

	}

}
