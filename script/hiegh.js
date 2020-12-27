let hi = sessionStorage.getItem('score');
if(hi == null){
    document.getElementById('display').innerHTML = "No game played yet"; 
}
else{
    document.getElementById('display').innerHTML = "Highest score is  " + hi;
}