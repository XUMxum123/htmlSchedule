var PusStateType = {
	none:0,
	started:1,
	stoped:2,
	error:3,
	paused:4,
	resumed:5,
	seekEnd:6,
	position:7
};

var PusPlayErrorType = {
	none:0,
	file_not_exists:1,
	play_fail:2
};

var PusPlayCmdType = {
	none:0,
	start:1,
	stop:2,
	pause:3,
	resume:4,
	prepare:5,
	seek:6
};

var PusFileType = {
	scrambled:0x80,
	scheduled:0x1,
	newed:0x2,
	viewed:0x3,
	deleted:0x4,
	expired:0x10,
	ongoing:0x20
};

var curPusPlayObj;

var pusCmdNotifyFunc = function(jsonStr){
	var pusNotify = JSON.parse(jsonStr);
	for(index in pusNotify.ITEMS){
		pusItem = pusNotify.ITEMS[index];
		switch(Number(pusItem.playCmd)){
			case PusPlayCmdType.start:
			pusPlayCmd(pusItem);
			break;
			case PusPlayCmdType.pause:
			videoPlayObj.dmrCmdOperator(DmrNotifyCmdType.pause);
			pusSyncPlayState(pusItem.instance, PusStateType.paused, 0);
			break;
			case PusPlayCmdType.resume: 
			videoPlayObj.dmrCmdOperator(DmrNotifyCmdType.resume);
			pusSyncPlayState(pusItem.instance, PusStateType.resumed, 0);
			break;
			case PusPlayCmdType.stop:
			videoPlayObj.dmrCmdOperator(DmrNotifyCmdType.stop);
			pusSyncPlayState(pusItem.instance, PusStateType.stoped, 0);
			break;
			case PusPlayCmdType.seek:
			videoPlayObj.dmrCmdOperator(DmrNotifyCmdType.seekTime, Number(pusItem.value));
			break;
		}
	}
};

function pusPlayCmd(pusItem){
	console.log("pusPlayCmd");
	playInfoObj.mediaPath = pusItem.value;
	playInfoObj.instance = pusItem.instance;
	var tempObj = pusObj.pusGetFileInfo(pusItem.instance);
	if(tempObj){
		curPusPlayObj = tempObj;
		if(curPusPlayObj.fileInfo.eventName){
			playInfoObj.title = curPusPlayObj.fileInfo.eventName;
		} else {
			playInfoObj.title = curPusPlayObj.fileInfo.channelName;
		}
	} else {
		curPusPlayObj = {'instance':playInfoObj.instance};
	}
	videoPlayObj.init(playInfoObj, SourceType.Pus);
}

function pusCmpbStateNotify(cmpbNotify){
	console.log("pusCmpbStateNotify");
	var arg1 = Number(cmpbNotify.ARG1);
	switch(Number(cmpbNotify.TYPE)){
		case MmpEventType.total_time_update:
		break;
		case MmpEventType.icur_time_update:
		pusSyncPlayState(curPusPlayObj.instance, PusStateType.position, Math.floor(arg1/1000));
		break;
		case MmpEventType.eos:
		pusSyncPlayState(curPusPlayObj.instance, PusStateType.stoped, 0);
		break;
		case MmpEventType.play_done:
		pusSyncPlayState(curPusPlayObj.instance, PusStateType.started, 0);
		break;
		case MmpEventType.timeseek_done:
		pusSyncPlayState(curPusPlayObj.instance, PusStateType.seekEnd, 0);
		break;
		case MmpEventType.playback_error:
		pusSyncPlayState(curPusPlayObj.instance, PusStateType.error, 0);
		curPusPlayObj = null;
		break;

	}
}

function pusSyncPlayState (inst, state, value){
	pusObj.pusSubmitStatus(inst, state, value);
}

var PusPvrObj = function(){
	
};

PusPvrObj.prototype.pusGetFileInfo = function(inst){
	var arg = '{"PARAMETER":{"instance":'+inst+',"REQUEST":"QUERY"}}';
	res = mtvObj.pusGetFileInfo(arg);
	if(res){
		res = JSON.parse(res);
		return res.ITEMS[0];
	}
	return null;
};

PusPvrObj.prototype.pusSubmitStatus = function(inst, state, value){
	var ret = -1;
	var arg = '{"PARAMETER":{"instance":' + inst + ',"state":"' + state + '","value":"' + value + '","REQUEST":"SET"}}';
	ret = mtvObj.pusSubmitStatus(arg);
	return ret;
};

var pusObj = new PusPvrObj();