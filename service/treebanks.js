angular.module('pmltqWeb').factory('treebanks',function() {

  var example_data = [
  {
    "access": false,
    "name": "conll_english",
    "anonymous": false,
    "description": "Access requires special license. This service runs over the English training set from the CoNLL 2009 Shared Task (958K nodes). The annotation consists of syntactic dependency trees with an additional layer of relations representing semantic dependencies and their labeling.",
    "homepage": "http://ufal.mff.cuni.cz/conll2009-st/index.html",
    "stickers": [
    {
      "parent": {
        "comment": "Parent sticker for all languages",
        "name": "Languages",
        "id": "54b6242c3cfeab0207010000"
      },
      "comment": "",
      "name": "English",
      "id": "54b6255c3cfeab0205010000"
    },
    {
      "comment": "",
      "name": "CoNLL",
      "id": "54b6263e3cfeab0204040000"
    }
    ],
    "id": "54731d105b85981c6e110000",
    "title": "CoNLL 2009 ST (English Train Set)"
  },
  {
    "access": false,
    "name": "conll_german",
    "anonymous": false,
    "description": "Access requires special license. This service runs over the German training set from the CoNLL 2009 Shared Task (648K nodes). The annotation consists of syntactic dependency trees with an additional layer of relations representing semantic dependencies and their labeling.",
    "homepage": "http://ufal.mff.cuni.cz/conll2009-st/index.html",
    "stickers": [
    {
      "parent": {
        "comment": "Parent sticker for all languages",
        "name": "Languages",
        "id": "54b6242c3cfeab0207010000"
      },
      "comment": "",
      "name": "German",
      "id": "54b64c0c3cfeab1674010000"
    },
    {
      "comment": "",
      "name": "CoNLL",
      "id": "54b6263e3cfeab0204040000"
    }
    ],
    "id": "54731d105b85981c6e120000",
    "title": "CoNLL 2009 ST (German Train Set)"
  },
  {
    "access": true,
    "name": "bnc",
    "anonymous": true,
    "description": "The British National Corpus (BNC) is a 100 million word collection of samples of written and spoken language from a wide range of sources, designed to represent a wide cross-section of British English from the later part of the 20th century, both spoken and written. The latest edition is the BNC XML Edition, released in 2007.\r\n\r\nThis is sample of about 10 000 random sentences.",
    "homepage": "",
    "stickers": [
    {
      "parent": {
        "comment": "Parent sticker for all languages",
        "name": "Languages",
        "id": "54b6242c3cfeab0207010000"
      },
      "comment": "",
      "name": "English",
      "id": "54b6255c3cfeab0205010000"
    }
    ],
    "id": "54731d105b85981c6e2c0000",
    "title": "British National Corpus Sample (BNC)"
  },
  {
    "access": true,
    "name": "czeng",
    "anonymous": true,
    "description": "CzEng is a Czech-English parallel corpus compiled at the Institute of Formal and Applied Linguistics (ÚFAL), Charles University, Prague. The corpus contains no manual annotation. It is limited only to texts which have been already available in an electronic form and which are not protected by authors' rights in the Czech Republic. The main purpose of the corpus is to support Czech-English and English-Czech machine translation research with the necessary data. CzEng consists of a large set of parallel textual documents mainly from the fields of European law, information technology, and fiction, all of them converted into a uniform XML-based file format and provided with automatic sentence alignment.",
    "homepage": "http://ufal.mff.cuni.cz/czeng/",
    "stickers": [
    {
      "parent": {
        "comment": "Parent sticker for all languages",
        "name": "Languages",
        "id": "54b6242c3cfeab0207010000"
      },
      "comment": "",
      "name": "Czech",
      "id": "54b6254a3cfeab0204010000"
    },
    {
      "parent": {
        "comment": "Parent sticker for all languages",
        "name": "Languages",
        "id": "54b6242c3cfeab0207010000"
      },
      "comment": "",
      "name": "English",
      "id": "54b6255c3cfeab0205010000"
    }
    ],
    "id": "54731d105b85981c6e2d0000",
    "title": "CzEng Sample"
  },
  {
    "access": false,
    "name": "cac20",
    "anonymous": false,
    "description": "The project focuses on fulltext information systems (containing both written and spoken materials) in Czech (when standard methods fail due to the different type of languages they have been developed for). The project aims to strengthen and improve current methods for morphological analysis of Czech, in order to attain higher precision in identifying lexical units and in some cases also their meaning.",
    "homepage": "http://ufal.mff.cuni.cz/rest/cac.html",
    "stickers": [
    {
      "parent": {
        "comment": "Parent sticker for all languages",
        "name": "Languages",
        "id": "54b6242c3cfeab0207010000"
      },
      "comment": "",
      "name": "Czech",
      "id": "54b6254a3cfeab0204010000"
    }
    ],
    "id": "54731d105b85981c6e200000",
    "title": "Czech Academic Corpus"
  }];


	var treebanks = {
    getList: function() { return example_data; },
    getByName: function(name) {
      return _.find(example_data, function (tb) {
        return tb.name === name;
      });
    }
  };

	return treebanks;
});
