export function checkNumbersLength(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 3 && n <= 9;
}

export function checkRoundLength(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 20 && n <= 120;
}

export function checkAttemptsAllowed(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 1 && n <= 5;
}