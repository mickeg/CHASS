<?php
    header('Content-Type: text/html; charset=iso-8859-1');
    set_time_limit(300); //Long run times.
    libxml_use_internal_errors(true);
    $doc = new DOMDocument;
    $doc->preserveWhiteSpace = false;
    $doc->strictErrorChecking = false;
    $doc->recover = true;
    $t = 106665; //spara denna. (blåmussla)

    $listoftaxons = [6010265, 216215, 100146, 100147, 212363, 102146, 209467, 100149, 100150, 103788, 206118, 215543, 215544, 215957, 215956, 100151, 100152, 106462, 106463, 213487, 100154, 257383, 106370, 106371, 103046, 253680, 105944, 100155];

    createFile();
    getTaxonDescription($t); //blåmussla

    for ($i = 0; $i <= count($listoftaxons); $i++) {
        getTaxonDescription($listoftaxons[$i]);
        echo $i;
    } 

    function getTaxonDescription($t){
        $GLOBALS['doc']->loadHTMLFile('http://artfakta.artdatabanken.se/taxon/'.$t);
        $xpath = new DOMXPath($GLOBALS['doc']);
        $query = "//div[@class='expand-panel panel-preview']";
        $entries = $xpath->query($query);
        $r = $entries->item(0)->textContent;
        $r_utf8 = utf8_decode($r);
        $result = trim(preg_replace('/\s+/', ' ', $r_utf8));
        writeLineToFile(unicodeString($t) .';'. unicodeString($result));
        echo utf8_decode(unicodeString($t) .';'. unicodeString($result));
    }

    function createFile(){
        $file = 'artfakta.txt';
        $fp = fopen($file, 'w');
        fwrite($fp, 'TaxonID;Kännetecken'.PHP_EOL); 
    }

    function writeLineToFile($line){
        $file = 'artfakta.txt';
        $data = $line.PHP_EOL;
        $fp = fopen($file, 'a');
        fwrite($fp, $data); 
    }

    function unicodeString($str, $encoding=null) {
        if (is_null($encoding)) $encoding = ini_get('mbstring.internal_encoding');
    return preg_replace_callback('/\\\\u([0-9a-fA-F]{4})/u', create_function('$match', 'return mb_convert_encoding(pack("H*", $match[1]), '.var_export($encoding, true).', "UTF-16BE");'), $str);
}

?>
