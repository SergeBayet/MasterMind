(() => {
  class Combination {
    items = null;
    constructor(maxColors, combinationLength, items) {
      this.combinationLength = combinationLength;
      this.maxColors = maxColors;
      this.items = items;
      if (items == null) {
        this.items = this.createRandomSet();
      }
    }
    reset() {
      this.items = [];
    }
    addItem(color) {
      if (this.items.length < this.combinationLength) {
        this.items.push(color);
        return false;
      }
      return true;
    }
    removeItem(index) {
      this.items.splice(index, 1);
      return true;
    }
    compare(combination) {
      if (!this.isComplete()) return false;
      var whitePins = 0;
      var blackPins = 0;
      var maskCombination = new Array(this.items.length);
      maskCombination.fill(false);

      // Check for correct position (white pins)

      for (var i = 0; i < this.items.length; i++) {
        if (combination.items[i] == this.items[i]) {
          whitePins++;
          maskCombination[i] = true;
        }
      }

      // Check for incorrect position (black pins)

      for (var i = 0; i < combination.items.length; i++) {
        if (!maskCombination[i]) {
          for (var j = 0; j < this.items.length; j++) {
            if (!maskCombination[j] && this.items[j] == combination.items[i]) {
              blackPins++;
              maskCombination[i] = true;
              break;
            }
          }
        }
      }

      return { blackPins: blackPins, whitePins: whitePins };
    }

    isComplete() {
      if (this.items.length == this.combinationLength) {
        return true;
      }
      return false;
    }
    createRandomSet() {
      var items = [];
      console.log(Combination.colors());
      for (var i = 0; i < this.combinationLength; i++) {
        let randomColor = Math.floor(Math.random() * this.maxColors);

        items[i] = Combination.colors()[randomColor];
      }
      return items;
    }
    comparisonToHTML(results, element) {
      element.innerHTML = "";
      for (var i = 0; i < results.blackPins; i++) {
        let span = document.createElement("span");
        span.setAttribute("class", "diff");
        span.setAttribute("style", "background-color: black");
        element.appendChild(span);
      }
      for (var i = 0; i < results.whitePins; i++) {
        let span = document.createElement("span");
        span.setAttribute("class", "diff");
        span.setAttribute("style", "background-color: white");
        element.appendChild(span);
      }
    }
    toHTML(element) {
      element.innerHTML = "";
      for (var i = 0; i < this.items.length; i++) {
        let span = document.createElement("span");
        span.setAttribute("class", "item");
        span.setAttribute("data-color", this.items[i]);
        span.setAttribute("data-id", i.toString());
        span.setAttribute(
          "style",
          "background: radial-gradient(circle at 5px 5px, " +
            this.items[i] +
            ", white);"
        );
        element.appendChild(span);
      }
    }
    historyToHTML(results) {
      let histCombination = document.createElement("div");
      histCombination.setAttribute("class", "history-combination row");
      var html = [];
      html.push('<div class="combination col s9">');
      console.log(this.items);
      for (var i = 0; i < this.items.length; i++) {
        html.push(
          '<span class="item" style="background: radial-gradient(circle at 5px 5px, ' +
            this.items[i] +
            ', white);"></span>'
        );
      }
      html.push("</div>");
      html.push('<div class="differences col s3">');
      for (var i = 0; i < results.whitePins; i++) {
        html.push('<span class="diff" style="background-color:white"></span>');
      }
      for (var i = 0; i < results.blackPins; i++) {
        html.push('<span class="diff" style="background-color:black"></span>');
      }
      html.push("</div>");
      histCombination.innerHTML = html.join("");
      return histCombination;
    }
    static choiceBox(n, element) {
      let colors = Combination.colors();
      for (var i = 0; i < n; i++) {
        let span = document.createElement("span");
        span.setAttribute("class", "item");
        span.setAttribute("data-color", colors[i]);
        span.setAttribute(
          "style",
          "background: radial-gradient(circle at 5px 5px, " +
            colors[i] +
            ", white);"
        );

        element.appendChild(span);
      }
    }
    static colors() {
      return [
        "yellow",
        "blue",
        "green",
        "red",
        "black",
        "white",
        "gray",
        "brown",
        "orange",
        "cyan"
      ];
    }
  }
  var difficulty = 4;
  var nColors = 6;
  restart();
  document.getElementById("difficulty").addEventListener("change", event => {
    difficulty = event.target.value;
    nColors = document.getElementById("ncolors").value;

    restart();
  });
  document.getElementById("ncolors").addEventListener("change", event => {
    nColors = event.target.value;
    difficulty = document.getElementById("difficulty").value;

    restart();
  });
  document.getElementById("restart").addEventListener("click", event => {
    restart();
  });

  function restart() {
    secret_combination = new Combination(nColors, difficulty);

    el = document.querySelector(".history-combinations");
    el.innerHTML = "";

    el = document.querySelector(".current-combination .combination");
    el.innerHTML = "";

    el = document.querySelector(".secret-combination");
    el.classList.add("hidden");

    el = document.querySelector(".secret-combination .combination");
    secret_combination.toHTML(el);

    el = document.querySelector(".choice-box");
    el.innerHTML = "";
    Combination.choiceBox(nColors, el);

    current_combination = new Combination(nColors, difficulty, []);
    eventsOnCurrentCombination();
    choiceItemsDOM = document.querySelectorAll(".choice-box .item");
    choiceItemsDOM.forEach(item => {
      item.addEventListener("click", event => {
        color = event.target.getAttribute("data-color");
        current_combination.addItem(color);

        if (current_combination.isComplete()) {
          results = current_combination.compare(secret_combination);
          if (results.whitePins == difficulty) {
            win();
          } else {
            let historyHTML = current_combination.historyToHTML(results);
            el = document.querySelector(".history-combinations");
            el.appendChild(historyHTML);
            current_combination.reset();
            var objDiv = document.querySelector(".combinations");
            objDiv.scrollTop = objDiv.scrollHeight;
          }
        }
        el = document.querySelector(".current-combination .combination");
        current_combination.toHTML(el);
      });
    });
    stopConfetti();
  }
  // Attach event dynamically to the current combination items.

  function eventsOnCurrentCombination() {
    document.addEventListener("click", event => {
      attr = event.target.attributes["data-id"];
      if (attr !== undefined) {
        current_combination.removeItem(attr.value);
        el = document.querySelector(".current-combination .combination");
        current_combination.toHTML(el);
      }
    });
  }

  function win() {
    el = document.querySelector(".secret-combination");
    el.classList.remove("hidden");

    startConfetti();
  }
})();
