var a = 5;
console.log(typeof(a)); 

for(i=0;i < 1000; i++)
{
    console.log(i);  
}

const arr = new Array('1','2','3');
console.log(arr);

for(f = 0; f <= 4; f++)
{
    try {
        console.log(arr[f]);
    } catch (error) {
        console.error(error);
    }
}


 