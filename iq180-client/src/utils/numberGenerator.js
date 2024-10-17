const operators = ['+', '-', '*', '/'];

// function isSolvable(numbers, target) {
//     function helper(nums, target) {
//       if (nums.length === 1) {
//         return Math.abs(nums[0] - target) < 1e-6;
//       }
  
//       for (let i = 0; i < nums.length; i++) {
//         for (let j = 0; j < nums.length; j++) {
//           if (i !== j) {
//             const remaining = nums.filter((_, index) => index !== i && index !== j);
//             for (const op of operators) {
//               let result;
//               if (op === '+') result = nums[i] + nums[j];
//               if (op === '-') result = nums[i] - nums[j];
//               if (op === '*') result = nums[i] * nums[j];
//               if (op === '/' && nums[j] !== 0) result = nums[i] / nums[j];
  
//               if (result !== undefined) {
//                 if (helper([...remaining, result], target)) {
//                   return true;
//                 }
//               }
//             }
//           }
//         }
//       }
//       return false;
//     }
  
//     return helper(numbers, target);
//   }

// export function generateNumbers() {
//     let numbers;
//     let targetResult;
//     do {
//       numbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
//       targetResult = Math.floor(Math.random() * 10); // Ensure target result is a one-digit number
//     } while (!isSolvable(numbers, targetResult));

//     return [numbers,targetResult];
// }

// function isInteger() {

// }

export function generateNumbers(numberLength) {
    let numbers;
    let equation;
    let targetResult;
    
    do {
        // alert(equation)
        equation = "";
        // alert("test")
        numbers = Array.from({length: numberLength}, () => Math.floor(Math.random() * 9.9999))
        for (let i=0; i<numbers.length; i++) {
            equation+=numbers[i];
            if (i!=numbers.length-1) {
                equation+=operators[Math.floor(Math.random()*3.9999)]
            }
        }
        targetResult=eval(equation);
        // alert(targetResult);
    } while (targetResult - Math.floor(targetResult) != 0 || targetResult<=0);

    return [numbers,targetResult];
}