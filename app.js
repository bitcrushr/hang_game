var game = { // game object
    elem(_id) { return document.getElementById(_id) },
    elems(_class) { return document.getElementsByClassName(_class) },
    init() {
        this.counter = this.elem("mancontainer");
        // make body get keypresses and send them as input to the game
        this.elem("keygrab").onkeypress = (e) => {
            this.handleInput(e.key.toLocaleLowerCase());
        }
        // make toolbar items fully depress down when clicked on and call handlers in game object
        var buttons = this.elems("toolbaritem");
        for (var i in buttons) {
            buttons[i].onclick = (e) => {
                e.target.classList.add("toolbarclick");
                setTimeout(() => {
                    e.target.classList.remove("toolbarclick");
                }, 500);
                switch (e.target.innerHTML) {
                    case "START":
                        this.start(); break;
                    case "RESET":
                        this.reset(); break;
                    default:
                        console.log("???"); // shouldn't happen
                }
            }
        }
    },
    words: [
        "breakout",   "helloworld", "infrasonic",
        "shatter",    "escape",     "gradient",
        "futuristic", "broken",     "visualization",
        "expression", "entropy",    "unanswered",
        "electrical", "cataclysm",  "abyssal" ], // wordlist
    started: false, // has it been started yet
    listening: true, // is it listening for chars
    dead: true, // has the player run out of tries (mostly for event listeners)
    counter: null, // the thing that holds the words
    wordarray: [], // the unaltered word
    playarray: [], // the word as it stands in the game
    elemarray: [], // array of letter html elements
    correctch: [], // array of correct, used chars
    tries: 0, // attempts remaining
    left: 0, // letters left to win
    start() { // set everything up
        if (this.started) { // return if started already
            console.log("Game has already been started.");
            return;
        }
        var wordbasis = this.getWordArray();
        this.wordarray = wordbasis[0];
        this.playarray = wordbasis[1];
        this.correctch = [];
        this.genElems();
        this.setTries(7);
        this.started = true;
        this.listening = true;
        this.dead = false;
    },
    reset() { // essentially calls start() again
        if (!this.started) { // return if not started yet
            console.log("Game hasn't been started yet.");
            return;
        }
        this.started = false;
        this.start();
    },
    genElems() {
        this.elemarray = [];
        this.elem("letters").innerHTML = "";
        for (var i in this.playarray)
            setTimeout(() => { // delay it a bit
                var item = document.createElement("li");
                item.classList.add("letter");
                setTimeout(() => {
                    item.classList.add("letterdown");
                }, 300);
                item.innerHTML = this.playarray[i];
                this.elemarray.push(item); 
                this.elem("letters").appendChild(item);
            }, 1000);
    },
    getWordArray() { // picks a word and populates arrays
        var word = this.words[Math.floor(Math.random() * this.words.length)];
        this.left = word.length;
        console.log("Selected \"" + word + "\".");
        var arr = []; var _arr = [];
        for (var i in word) {
            arr.push(word[i]); _arr.push('_');
        }
        return [arr, _arr]
    },
    setTries(num) { // sets logical and visual tries
        this.tries = num;
        this.counter.innerHTML = "ATTEMPTS LEFT: " + num;
    },
    handleInput(char) {
        if (!this.listening) { // do nothing for chars when game isn't running
            return;
        }
        var found = false;
        var num = 0;
        var dupe = false;
        for (var i in this.wordarray) {
            if (char === this.wordarray[i]) {
                found = true;
                if (this.correctch.indexOf(char) === -1) {
                    this.playarray[i] = char;
                    this.elemarray[i].innerHTML = char;
                    this.elemarray[i].classList.remove("letterdown");
                    num++;
                } else {
                    dupe = true;
                }
            }
        }
        this.correctch.push(char);
        this.left -= num;
        if (!found) {
            if (this.tries - 1 <= 0) {
                this.lose();
            } else {
                this.setTries(this.tries - 1);
            }
        } else if (this.left === 0) {
            this.win();
        } else if (dupe) {
            this.duplicate();
        }
    },
    duplicate(char) {
        var temp = this.counter.innerHTML;
        this.elem("mancontainer").innerHTML = "/// USED ///";
        setTimeout(() => {
            this.counter.innerHTML = temp;
        }, 250);
    },
    lose() {
        this.elem("mancontainer").innerHTML = "// FAILURE //";
        this.listening = false;
    },
    win() {
        this.elem("mancontainer").innerHTML = "// SUCCESS //";
        this.listening = false;
    }
}
game.init();