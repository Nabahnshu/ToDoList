//jshint esversion:6

exports.getDate=function(){
    let today = new Date();
    let option={weekday:'long',day:'numeric',month:'long'};
    return today.toLocaleDateString("hi-HN",option);
    
};

    