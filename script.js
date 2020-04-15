let eq;
var output = document.getElementById("output");
var factor = 1;
var position = {
    a: -1,
    b: -1,
    n: -1,
    t: -1,
    p: -1,
    f: -1
};
var a = 0,
    b = 1,
    n = 1,
    f = 0, // Function
    p = 1,
    sign = "+",
    e;
var tempFun;
function setup () {
    createCanvas(400, 400);
    eq = select("#equation");
    eq.input(resetT);
}
//For point
var t = 0;
//For line
var limit = 0;
function draw () {
    //Setup
    background(51);
    strokeWeight(1);
    stroke(255);
    //X & Y Axes
    strokeWeight(2.5);
    line(0, width/2, height, width/2);
    line(height/2, 0, height/2, width);
    translate(width/2, height/2);
    e = eq.value();
    //Remove spaces
    e = e.replace(/\s/g, "");
    //CHECK INPUT
    //Check for theta
    position.t = e.indexOf("t");
    if (position.t < 0)
        n = 0; //Only a will be considered
    else
        n = 1;
    //Check for functions sintheta
    if (e.indexOf("sin") >= 0) {
        f = "sin";
        position.f = e.indexOf("sin");
    } else if (e.indexOf("cos") >= 0) {
        f = "cos";
        position.f = e.indexOf("cos");
    } else {
        f = 0;
        position.f = -1;
    }
    //Check for n
    index = position.t - 1;
    if (index >= 0 && !isNaN(e[index])) { //Will only work if theta is present
        while (!isNaN(e[index-1])) //Keep going back till no number 333theta
            index--;
        n = parseInt(e.substring(index));
        n.position = index;
    } else
        n.position = -1;
    //Check for p
    index = e.indexOf("^");
    if (index >= 0 && !isNaN(e[index+1])) {
        p = parseFloat(e.substring(index+1));
        position.p = index+1;
    }
    else {
        p = 1;
        position.p = -1;
    }
    //Check for a or b using sign
    index = e.indexOf("-");
    sign = "-";
    if (index < 0) { //- does not exist
        index = e.indexOf("+");
        sign = "+";
    }
    if (index >= 0) { //Sign exists - is se pahle wala a hoga or baad wala b
        position.b = index + 1;
        if (!isNaN(e[position.b]))
            b = parseInt(e.substring(position.b));
        else {
            b = 1;
            b.position = -1;
        }
        position.a = 0;
        if (!isNaN(e[position.a])) {
            a = parseInt(e.substring(position.a));
        } else {
            a = 0;
            position.a = -1;
        }
    }
    //Check for a or b in the beginning
    else if (!isNaN(e[0])) { //If a number is present at the start
        if (position.f > 0) { //3sin...
            //This will be b
            b = parseInt(e.substring(0));
            position.b = 0;
            a = 0;
            position.a = -1;
        } else if (position.t < 0) { // 3 not 3theta <- n will handle this
            a = parseInt(e.substring(0));
            position.a = 0;
            b = 1;
            b.position = -1;
        } else {
            a = 0;
            position.a = -1;
            b = 1;
            position.b = -1;
        }
    } else {
        a = 0;
        position.a = -1;
        b = 1;
        position.b = -1;
    }
    //Check for - sign
    if (sign == "-" && b > 0) //Second condition so that it doesn't keep multiplying
        b *= -1;
    else if (sign == "+" && b < 0)
        b *= -1;
    //OUTPUT
    output.innerHTML = generateOutput();
    beginShape();
    if (n > 1)
        factor = n;
    else
        factor = 1;
    //Circle
    noFill();
    strokeWeight(2.5);
    stroke(255);
    for (let t = 0; t < limit; t+=0.01) {
        if (f == "sin")
            var r = -(a*10 + Math.pow(b*10*sin(n*t), p));
        else if (f == "cos")
            var r = a*10 + Math.pow(b*10*cos(n*t), p);
        else
            var r = a + Math.pow(b*n*t, p);
        var x = r*cos(t);
        var y = r*sin(t);
        vertex(x, y);
    }
    endShape();
    //Red
    beginShape();
    strokeWeight(8);
    stroke(255, 0, 0);
    if (f == "sin")
        var r = -(a*10 + Math.pow(b*10*sin(n*t), p));
    else if (f == "cos")
        var r = a*10 + Math.pow(b*10*cos(n*t), p);
    else
        var r = a + Math.pow(b*n*t, p);
    var x = r*cos(t);
    var y = r*sin(t);
    point(x, y);
    if (t < TWO_PI * factor || f == 0) {
        t += 0.04;
        limit += 0.04;
    }
    else {
        t = 0;
        limit = TWO_PI * factor;
    }
    endShape();
}
function resetT () {
    t = 0;
    limit = 0;
}
function getFunction (element) {
    if (element.selectedIndex == 0)
        return 0;
    else if (element.selectedIndex == 1)
        return "sin";
    else
        return "cos";
}
function generateOutput () {
    var string = "r = ";
    // r =  a
    if (a > 0)
        string += a;
    // r = + [bsin(ntheta)]^p
    if (b != 0 && n != 0 && p != 0) {
        // + sign
        if (a != 0)
            if (b > 0)
                string += " + ";
            else
                string += " - ";
        // [ bracket start
        if (p != 0 && p != 1)
            string += "[";
        // b
        if (b != 0 && b != 1)
            string += Math.abs(b) + " * ";
        // Function(
        if (f != 0)
            string += f + "(";
        //n/
        if (n != 0 && n != 1)
            string += n + " * ";
        string += "theta";
        // ) bracket end
        if (f != 0)
            string += ")";
        // ] bracket end
        if (p != 0 && p != 1)
            string += "]^" + p;
    }
    return string;
}