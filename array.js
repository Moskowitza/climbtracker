
function solution(A) {
    B=A.sort(function(a, b){return a - b});
    console.log(B);
    // write your code in JavaScript (Node.js 8.9.4)
    if(B[B.length-1]<0){
        return 1;
    }
    else{
        for (i=0; i< B.length ; i++){
            if(B[i+1]>B[i] && B.includes(B[i]+1)) {
                return B[B.length-1];
            }
            else if (B[i+1] > B[i] && !B.includes(B[i]+1)){
                    return B[i]+1;
            
            }
        }
    }

    
}
solution([1,22,9,2,3,4,8])