//Exporting this function for external usage.
exports.analyzeJSON = function(content, verbose, relevanceThreshold) {

    var jsonInput = content;

    //Initializing output array of JSON object(s)
    var jsonOutput = [];

    //For loop index
    var i;

    //Entity stats
    var skippedEntities = 0;
    var missingProperty = 0;
    var lowRelevance = 0;

    //Check for entities array in jsonInput
    if (!jsonInput.hasOwnProperty('entities')) {
        jsonOutput[0] = {};
        jsonOutput[0]['Text'] = "Error";
        jsonOutput[0]['Error Message'] = "JSON must have an \'entities\' array!";
        return jsonOutput;
    }

    //Ensure there is at least one entity to analyze in jsonInput
    if (jsonInput.entities.length == 0) {
        jsonOutput[0] = {};
        jsonOutput[0]['Text'] = "Error";
        jsonOutput[0]['Error Message'] = "Cannot have an empty \'entities\' array!";
        return jsonOutput;
    }

    //Ensure that status of jsonInput is OK.
    if (jsonInput.status !== "OK") {
        jsonOutput[0] = {};
        jsonOutput[0]['Text'] = "Error";
        jsonOutput[0]['Error Message'] = "Status not OK!";
        return jsonOutput;
    }

    console.log("jsoninput entities are: " , jsonInput.entities);
    //Looping through all entities in jsonInput
    for (i = 0; i < jsonInput.entities.length; i++) {

        //Ensure that type, text, sentimentType, and relevanceValue are not undefined
        if (!jsonInput.entities[i].type) {
            console.log("Error Message: \'type\' is undefined in entity " + i + "!");
            skippedEntities++;
            missingProperty++;
            continue;
        }

        if (!jsonInput.entities[i].text) {
            console.log("Error Message: \'text\' is undefined in entity " + i + "!");
            skippedEntities++;
            missingProperty++;
            continue;
        }

        if (!jsonInput.entities[i].relevance) {
            console.log("Error Message: \'relevanceValue\' is undefined in entity " +
                i + "!");
            skippedEntities++;
            missingProperty++;
            continue;
        }

        //Ensuring that the relevance value meets the relevance threshold
        if (jsonInput.entities[i].relevance >= relevanceThreshold) {
            //Populating output array
            var tmpObj = {};
            tmpObj['type'] = jsonInput.entities[i].type;
            tmpObj['text'] = jsonInput.entities[i].text;
            tmpObj['relevance'] = jsonInput.entities[i].relevance;
            tmpObj['count'] = jsonInput.entities[i].count;

            if (verbose) {
                tmpObj['Relevance'] = jsonInput.entities[i].relevance;
            }
            jsonOutput.push(tmpObj);
        } else {
            skippedEntities++;
            lowRelevance++;
        }

    }

    //Logging stats to console

    console.log('\nCompleted analysis of JSON data:\n');
    console.log('\nParsed ' + jsonInput.entities.length +
        ' entities in total from AlchemyLanguage.\n');

    if (skippedEntities > 0) {
        console.log(skippedEntities +
            ' entities have been filtered out for the following reasons:\n');

        if (missingProperty > 0) {
            console.log('\t** ' + missingProperty + ' out of ' +
                jsonInput.entities.length + ' entities had missing properties!');
        }

        if (lowRelevance > 0) {
            console.log('\t** ' + lowRelevance + ' out of ' +
                jsonInput.entities.length + ' entities had low relevance values!\n');
        }
    } else {
        console.log('\nNo entities have been filtered out!\n')
    }

    console.log('\nReturning jsonOutput with ' + jsonOutput.length +
        ' parsed entities: \n');

    console.log(JSON.stringify(jsonOutput, null, "\t"));

    return jsonOutput;
};



//Exporting this function for external usage.
exports.parseQuery = function(query) {

    //No query
    if (Object.keys(query).length === 0) {
        return false;
    }
    //'verbose' query
    else if (query.hasOwnProperty('verbose')) {
        if (query.verbose) {
            return query.verbose;
        }
    }
    //Other queries are not supported
    else {
        return 'error';
    }

};
