var MatchGame = {};
$(document).ready(function() {
    var point = new Audio('https://opengameart.org/sites/default/files/sd_0.wav');
    var flip = new Audio('https://opengameart.org/sites/default/files/whoosh%20%28phaser%29.wav');
    var click = new Audio('https://opengameart.org/sites/default/files/mouseclick.wav');
    /*
      Sets up a new game after HTML document has loaded.
      Renders a 4x4 board of cards.
    */

    /*
      Generates and returns an array of matching card values.
     */

    MatchGame.generateCardValues = function() {
        var temp = [];
        var rando = [];
        for (var i = 1; i < 9; i++) {
            temp.push(i);
            temp.push(i);
        }
        while (temp.length) {
            var randInt = Math.floor((Math.random() * temp.length));
            rando.push(temp[randInt]);
            temp.splice(randInt, 1);
        }
        return rando;
    };

    /*
      Converts card values to jQuery card objects and adds them to the supplied game
      object.
    */

    MatchGame.renderCards = function(cardValues, $game) {
        $game.empty();
        $game.data("flippedCards", []);
        var colors = ["hsl(25, 85%, 65%)", "hsl(55, 85%, 65%)", "hsl(0, 100%, 60%)", "hsl(120, 100%, 65%)", "hsl(220, 85%, 65%)", "hsl(265, 85%, 65%)", "hsl(310, 85%, 65%)", "hsl(360, 85%, 65%)"];
        for (var i = 0; i < cardValues.length; i++) {
            var $card = $('<div class="col-xs-3 card"></div>');
            $card.data({
                value: cardValues[i],
                flipped: false,
                color: colors[cardValues[i] - 1]
            });
            $game.append($card);
        }
        $(".card").on("click", function() {
            MatchGame.flipCard($(this), $game);
        });
    };

    /*
      Flips over a given card and checks to see if two cards are flipped over.
      Updates styles on flipped cards depending whether they are a match or not.
     */

    MatchGame.flipCard = function($card, $game) {
        if ($card.data("flipped")) {
            return;
        }
        flip.play();
        flip.volume = 0.1;
        $card.css({
            "transform": "rotateY(180deg) scale(-1, 1)",
            "background-color": $card.data("color")
        });
        $card.text($card.data("value"));
        $card.data("flipped", true);
        $game.data("flippedCards").push($card);
        if ($game.data("flippedCards").length === 2) {
            var $card1 = $game.data("flippedCards").pop();
            var $card2 = $game.data("flippedCards").pop();
            if ($card1.data("value") === $card2.data("value")) {
                point.play();
                $card1.css({
                    "transform": "rotate(2deg)",
                    "background-color": "#F8C7CC"
                });
                $card2.css({
                    "transform": "rotate(2deg)",
                    "background-color": "#F8C7CC"
                });
            } else {
                setTimeout(function() {
                    $card1.css({
                        "transform": "rotateY(-180deg) scale(-1, 1)",
                        "background-color": "#3ab795"
                    });
                    $card2.css({
                        "transform": "rotateY(-180deg) scale(-1, 1)",
                        "background-color": "#3ab795"
                    });
                    $card1.text("");
                    $card2.text("");
                    $card1.data("flipped", false);
                    $card2.data("flipped", false);
                }, 500);
            }
        }
    };
    var cardValues = MatchGame.generateCardValues();
    MatchGame.renderCards(cardValues, $("#game"));
    // Restart the game on click.
    $(".button").on("click", function() {
        click.play();
        var cardValues = MatchGame.generateCardValues();
        MatchGame.renderCards(cardValues, $("#game"));
    });
});
