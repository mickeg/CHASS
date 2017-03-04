<?php
    ini_set('max_execution_time', 0);
    header('Content-Type: text/html; charset=iso-8859-1');
    libxml_use_internal_errors(true);
    $doc = new DOMDocument;
    $doc->preserveWhiteSpace = false;
    $doc->strictErrorChecking = false;
    $doc->recover = true;
    $t = 106665; //blåmussla

    //250 st
    /*
    $listoftaxons = [6010265,216215,100146,100147,212363,102146,209467,1,100149,100150,103788,206118,215543,215544,215957,215956,100151,100152,106462,106463,213487,100154,257383,106370,106371,103046,253680,105944,100155,212519,206166,2905,233038,1961,2966,253683,214007,105964,100156,215869,266812,100001,102941,215444,102924,6009808,100158,201190,215533,215305,104426,104427,104428,103690,103689,206048,206049,100002,206050,267040,249905,214880,214892,214890,214877,214878,214888,249188,214884,214898,214906,214876,214893,214875,214895,214897,250432,214879,214904,214903,214901,214886,214881,214899,100160,100161,100162,214883,102360,214905,6010293,102361,214891,214882,214887,214889,104034,100163,100164,100165,100166,214791,6010196,102362,257385,6010408,100892,102363,101166,6002013,209090,232302,100180,103791,215345,215349,215347,6010333,215344,100167,215346,102364,205812,100003,103077,266872,205810,103005,103004,103006,214057,257387,100170,214213,214214,104371,104372,104373,215878,215874,215883,215884,100171,215879,215880,215882,215877,215885,100172,100173,2909,257388,104670,104801,104800,104907,104908,101979,104901,104898,104799,104906,101980,104902,104798,104797,104905,104909,210674,104903,104900,104899,104904,103882,103885,103874,103870,103879,103886,103873,103889,103868,209248,103880,103883,102148,103869,233456,103881,103877,103875,103884,103890,236325,103872,103876,103887,103888,103891,102149,103871,103878,104369,216279,6010442,216278,105170,216339,233039,209189,102150,233040,233041,257398,102151,216026,102961,205643,103525,100175,208744,103528,103524,208742,103526,103527,232301,100176,104175,215296,211960,105672,105675,213903,213902,213901,233226,102152,105704,214967,211184,211187,105195,211186,102366,6010412,105031,103019,102622];
    */

    //medium testing ~30 st:
    //$listoftaxons = [6010265, 216215, 100146, 100147, 212363, 102146, 209467, 100149, 100150, 103788, 206118, 215543, 215544, 215957, 215956, 100151, 100152, 106462, 106463, 213487, 100154, 257383, 106370, 106371, 103046, 253680, 105944, 100155];
    
    //testa med liten sample size.
    $listoftaxons = [6010265, 216215, 100146, 100147, 212363, 1021469];
    
    run($listoftaxons);

    function run($listoftaxons){
        //scrapeDescriptionFromArtfakta($listoftaxons);
        scrapeImagesFromArtportalen($listoftaxons);
    }

    function scrapeImagesFromArtportalen($listoftaxons){
        foreach($listoftaxons as $taxon){
            downloadImage($taxon);
        }
    }

    function downloadImage($taxon){
        
        $prefix = "http://www.artportalen.se";
        $url = $prefix."/Media/Taxon/".$taxon;
        $html = file_get_contents($url);
        $MAX_FILES = 5;

        $doc = new DOMDocument();
        @$doc->loadHTML($html);
        $tags = $doc->getElementsByTagName('img');

        $i = 1;
        foreach ($tags as $tag) {
            $imgpath = $tag->getAttribute('src');
            $imageurl = $prefix.$imgpath;
            $dirpath = realpath(dirname(getcwd()));
            copy($imageurl, $dirpath.'/php/img/'.$taxon.'_'.$i.'.jpg');
            $i++;
            if($i > $MAX_FILES)
                break;  //Ladda inte ner ALLA bilder...
        }
    }
    
    function scrapeDescriptionFromArtfakta($listoftaxons){
        createFile();
    
        foreach($listoftaxons as $taxon){
            $tmp = getTaxonDescription($taxon);
            writeLineToFile($tmp);
        }
    }
    
    function getTaxonDescription($t){
        $GLOBALS['doc']->loadHTMLFile('http://artfakta.artdatabanken.se/taxon/'.$t);
        $xpath = new DOMXPath($GLOBALS['doc']);
        $query = "//div[@class='expand-panel panel-preview']";
        $entries = $xpath->query($query);
        $r = $entries->item(0)->textContent;
        $r_utf8 = utf8_decode($r);
        $result = trim(preg_replace('/\s+/', ' ', $r_utf8)); 

        return unicodeString($t) .';'. unicodeString($result);
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
