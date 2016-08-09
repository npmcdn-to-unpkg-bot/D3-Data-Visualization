
//Get date in short format
Date.prototype.shortFormat = function() {
    return (this.toLocaleDateString() + " " +
        this.toLocaleTimeString());
}


function sentenceMatch(entities, transcript)
{
  if (!entities) {
      alert("No entities");
      console.log("No entities");
      return;
  }


  try {
      entities = JSON.parse(JSON.parse(entities).entities);

  } catch (e) {
      console.log(e);
      alert(e);
      return;
  }

  //Hide formInput and show reset button
  document.getElementById("formInput").style.display = 'none';
  document.getElementById("reset").style.display = 'block';

  console.log(JSON.stringify(entities, null, "\t"));

  var sentences = transcript.split('\n');
  console.log(sentences);
  console.log(sentences.length);


}


function reset() {

    //Show formInput and hide reset button
    document.getElementById("formInput").style.display = 'block';
    document.getElementById("reset").style.display = 'none';
}



function readTextFile()
{
  var file = "file:///C:/Users/omukadam/Desktop/D3-Data-Visualization/sentenceMatcher/earnings_call_transcript.txt"
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}



function getSampleEntities() {
    var input = {
      "conference-uuid": "B9500A25-B2F6-4379-B022-FA486ADC7262",
      "entities": "[{\"type\":\"JobTitle\",\"text\":\"president\",\"relevance\":\"0.979539\",\"count\":\"2\",\"Relevance\":\"0.979539\"},{\"type\":\"FieldTerminology\",\"text\":\"unified communications\",\"relevance\":\"0.911581\",\"count\":\"1\",\"Relevance\":\"0.911581\"},{\"type\":\"JobTitle\",\"text\":\"chief operating officer\",\"relevance\":\"0.910919\",\"count\":\"1\",\"Relevance\":\"0.910919\"},{\"type\":\"JobTitle\",\"text\":\"vice president\",\"relevance\":\"0.892146\",\"count\":\"1\",\"Relevance\":\"0.892146\"},{\"type\":\"JobTitle\",\"text\":\"chief executive officer\",\"relevance\":\"0.878394\",\"count\":\"1\",\"Relevance\":\"0.878394\"},{\"type\":\"Person\",\"text\":\"Alan maverick\",\"relevance\":\"0.839485\",\"count\":\"1\",\"Relevance\":\"0.839485\"},{\"type\":\"Person\",\"text\":\"Katherine\",\"relevance\":\"0.838896\",\"count\":\"1\",\"Relevance\":\"0.838896\"},{\"type\":\"Person\",\"text\":\"Clark Peterson\",\"relevance\":\"0.831748\",\"count\":\"1\",\"Relevance\":\"0.831748\"},{\"type\":\"Person\",\"text\":\"Joe\",\"relevance\":\"0.810659\",\"count\":\"1\",\"Relevance\":\"0.810659\"},{\"type\":\"JobTitle\",\"text\":\"CFO\",\"relevance\":\"0.796784\",\"count\":\"1\",\"Relevance\":\"0.796784\"},{\"type\":\"Company\",\"text\":\"NPR\",\"relevance\":\"0.775296\",\"count\":\"1\",\"Relevance\":\"0.775296\"},{\"type\":\"Person\",\"text\":\"Tony\",\"relevance\":\"0.760575\",\"count\":\"1\",\"Relevance\":\"0.760575\"},{\"type\":\"Country\",\"text\":\"Mexico\",\"relevance\":\"0.758649\",\"count\":\"1\",\"Relevance\":\"0.758649\"},{\"type\":\"JobTitle\",\"text\":\"CIO\",\"relevance\":\"0.758402\",\"count\":\"1\",\"Relevance\":\"0.758402\"},{\"type\":\"FieldTerminology\",\"text\":\"voice network\",\"relevance\":\"0.740985\",\"count\":\"1\",\"Relevance\":\"0.740985\"},{\"type\":\"Quantity\",\"text\":\"six hundred million dollars\",\"relevance\":\"0.740985\",\"count\":\"1\",\"Relevance\":\"0.740985\"},{\"type\":\"Quantity\",\"text\":\"sixty percent\",\"relevance\":\"0.740985\",\"count\":\"1\",\"Relevance\":\"0.740985\"}]"
    };

    return input;
}

//Insert sample JSON input
function insertSampleEntities() {


    if (document.getElementById("sampleEntities").checked == true) {

        document.getElementById('inputEntities').value = JSON.stringify(getSampleEntities(), null, "\t");
    } else {
        document.getElementById('inputEntities').value = "";
    }
}
