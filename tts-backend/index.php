<?php
require_once 'Text2Speach.php';

header("Expires: 0");
header('Content-Type: application/json');

if(isset($_GET['text']) && strlen($_GET['text']) > 2 && isset($_GET['lang']) && strlen($_GET['lang']) == 2 && isset($_GET['token'])){
    $tts = new Text2Speach();
    try{
    	$filePath = $tts->getFilePath($_GET['text'], $_GET['lang'], $_GET['token']);
    	setHeaders(200);
    	return toJson(array( "path" => getDomainName() . $filePath ));
    }catch(Exception $e){}
  }
setHeaders(400);
return toJson(array( "error" => "Invalid request, check required params [text], [lang] or [token]" ));



function toJson($data){
	echo json_encode($data);
}

function setHeaders($code){
	header("{$_SERVER['SERVER_PROTOCOL']} $code");
}


function getDomainName(){
	return (
			$_SERVER['REMOTE_ADDR'] == '127.0.0.1' ?
			'http://tts.dev' : 'http://tts.peterjurkovic.com'
			).'/tts-backend';
}
