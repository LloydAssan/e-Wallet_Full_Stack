let trash = document.getElementsByClassName("trash");
let button1 = document.getElementsByClassName("button1")
let accpay = document.getElementsByClassName("accpay")
let accrec = document.getElementsByClassName("accrec")
let calculate = document.getElementById("calculate")
let total = document.getElementsByClassName("total")

console.log(total)

 calculate.addEventListener('click', function(){
   fetch("currentBal")
   .then(res => res.json())
   .then(response => {
     console.log(response.balTotal);
     results.innerHTML = response.balTotal
   })
   .catch(err => console.log(err))
   // let totalCalorieCount = document.getElementsByClassName("total")
   //        let total = 0
   //         Array.from(totalCalorieCount).forEach(function(element) {
   //        total = total + Number(element.innerText)
   //          console.log("calorie", Number(element.innerText))
   //         })
   //         console.log("calories", total)
   //         var results = document.getElementById("results")
   //         results.innerHTML = total
  })

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(trash)
        const acct = this.parentNode.childNodes[1].innerText;
        const ar = this.parentNode.childNodes[3].innerText;
        const ap = this.parentNode.childNodes[5].innerText;
        // const date = this.parentNode.parentNode.childNodes[5].innerText
        console.log(element)
        fetch("wallet", {
          method: 'delete',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            'acct': acct,
            'ar': ar,
            'ap': ap
            // 'date': date
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
