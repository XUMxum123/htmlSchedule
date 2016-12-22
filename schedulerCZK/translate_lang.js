var translateBeforewords = {"Quick settings": "MAIN_VB_QUICK_SETTINGS",
						   "Picture format":"EXP_SETTING_PIC_FORMAT",
						   "Headphones volume":"EXP_SETTING_HDPHONE_VOL",
						   "Sound style":"EXP_SETTING_SMART_SND",
						   "Picture style":"EXP_SETTING_SMART_PIC",
						   "Personal":"SMART_PIC_1",
						   "Vivid":"SMART_PIC_2",
						   "Natural":"SAMRT_PIC_3",
						   "Standard":"SMART_PIC_4",
						   "Movie":"SMART_PIC_5",
						   "Photo":"SMART_PIC_6",
						   "Personal_1":"SMART_SND_1",
						   "Original":"SMART_SND_2",
						   "Movie_1":"SMART_SND_3",
						   "Music": "SMART_SND_4",
						   "Game":"SMART_SND_5",
						   "News":"SMART_SND_6"
};
					   
var translateAfterwords = {};

function getKeyWords(originalName){
	if(originalName == ""){
		return undefined;
	}
	return translateBeforewords[originalName];
}

function getTranslate(originalName){
	var KeyWord = getKeyWords(originalName);
	if (KeyWord == undefined ){
		return originalName;
	}
	if(!translateAfterwords.hasOwnProperty(KeyWord)){
		var transText = mtvObj.getLangString(KeyWord);
		if(transText){
			translateAfterwords[KeyWord] = mtvObj.getLangString(KeyWord);
		} else {
			return originalName;
		}
	}
	return translateAfterwords[KeyWord];
}

function updateUIString(langDict) {

  for ( var p in translateBeforewords ){  
	  if ( typeof ( translateBeforewords[ p ]) == " function " ){
		  
	  } else { 
				var result = getKeyWords(p);
				if(result != undefined){
					if (langDict.hasOwnProperty(result))
						translateAfterwords[result] = langDict[result];
				}
		} 
	} 
};