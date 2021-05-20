function containsAlphabetsLower(s) {
    for(let i=0;i<s.length;i++){
        if(s[i]>='a' && s[i]<='z')return true;
    }
    return false;
}
function containsAlphabetsUpper(s) {
    for(let i=0;i<s.length;i++){
        if(s[i]>='A' && s[i]<='Z')return true;
    }
    return false;
}
function containsAlphabetsSpecial(s) {
    let special = "#$%&*_-"
    for(let i=0;i<s.length;i++){
        if(special.indexOf(s[i]) >= 0)return true;
    }
    return false;
}
module.exports={containsAlphabetsLower,containsAlphabetsSpecial,containsAlphabetsUpper}