
// Ojbect Constructor
function GameChar(name, hp, ap, cap, attckCtr) {
    this.name = name;
    this.hp = hp;
    this.ap = ap;
    this.cap = cap;
    this.attckCtr = attckCtr;
    
    // METHODS
    this.attack = function(opp) {
        // increase attack multiplier (each click)
        this.attckCtr++;
        return this.battle(this, opp, this.attckCtr);
    }
    this.battle = function(att, opp, attckCtr) {
        // Set variable for attack points
        var attack = att.ap;
        // Run multiplier for attack points
        attack = (att.ap * att.attckCtr);
        // Attack opponent and set new Health Points
        opp.hp -= attack;
        // Take away Counter Attack points from attacker's HPs
        att.hp -= opp.cap;
        
        // Check to see if either is dead
        if (att.hp <= 0) {
            // You died
            this.gameOver("lose");
        } else if (opp.hp <= 0) {
            // Your opponent died
            console.log("You defeated " + opp.name);
            // Remove opp from characterArray
            this.removeEnemy(opp);
            // if array <= 1, game over
            if (characterArray.length <= 1) {
                this.gameOver("win");
            // else, choose another enemy to fight
            } else {
                console.log("Congrats!  Now pick another enemy!");
            }
        }
    }

    this.removeEnemy = function (enemy) {
        var index = characterArray.indexOf(enemy);
        if (index > -1) {
            characterArray.splice(index, 1);
            console.log(characterArray);
        }
    }

    this.gameOver = function gameOver (result) {
        if (result === "win")
            console.log("You win!  This game is now completely over!")
        else
            console.log("LOSER!");
    }
}

// Build Characters in Array
var characterArray = [ mario = new GameChar("Mario", 120, 12, 15, 0), 
    goomba = new GameChar("Goomba", 100, 6, 5, 0),
    koopa_troopa = new GameChar("Koopa Troopa", 150, 7, 20, 0),
    wario = new GameChar("Wario", 180, 10, 25, 0) ];

    // DOCUMENT READY FUNCTION
    $(document).ready(function() {


    // Animation for H1
    $("h1").fadeIn(1000);
    $("h1").animate({fontSize: '5vmax'}, 500);
    
    // Animation for Chars
    $(".char-select").slideDown(1000);

    // Initialize appropriate click divs
    $(".char-select").on("click", characterSelect);
    $(".enemy-select").off("click", enemySelect);
    $("#your-char-3").off("click", battle);

    // CHARACTER SELECTION FUNCTION
    function characterSelect() {

            // Array that holds Character Selection IDs for DIVS
        var yourCharArray = ["your-char-1", "your-char-2", "your-char-3", "your-char-4"];
            // Array that holds ids for enemies 
        var battleCharArray = ["battle-char-1", "battle-char-2", "battle-char-3"];
            // Array to load html of chars to move to other positions
        var charHtmlArray = [];
        

        // pulls (child) id for name (ie, 'mario')
        var character = $(this).children().siblings("img").attr("id");
        // pulls (parent) div id (ie, 'your-char-2')
        var charDiv = $(this).attr("id");

        // removes selected id from array
        yourCharArray.splice(yourCharArray.indexOf(charDiv), 1);

        // Load html for remaining chars and load enemy Array
        for (i = 0; i < yourCharArray.length; i++) {
            charHtmlArray[i] = $("#" + yourCharArray[i]).html();
        }

        // moves character to the first (left) spot
            // Pull html from selected character
        var newHtml = $("#" + charDiv).html();
            // Set html on first spot
        $("#your-char-1").html(newHtml);

        // Makes ids not selected blank and invisible
        for (i = 2; i <= 4; i++) {
            $("#your-char-" + i).html("").css("visibility", "hidden");
        }

        // Change #your-char-2 to "VS" img (include captions above and below)
        $("#your-char-2").append("&nbsp;");
        $("#your-char-2").append("<img src='assets/images/versus.jpg' />").css("visibility", "visible");
        $("#your-char-2").append("&nbsp;");

        // Update system message
        $("#system-message").text("Excellent! Please choose an enemy to battle!");
        
        // Disable click functions in char select area
        $(".char-select").off("click");

        // Takes the HTML Array from leftover 
        // characters and adds them to enemy area and makes them visible
        for (i = 1; i < charHtmlArray.length + 1; i++) {
            $("#battle-char-" + i).html(charHtmlArray[i-1]).css("visibility", "visible");
        }

        // Change Text from Choose to "Your Character"
        $("#your-char").text("Your Character...");
        // Change Text from blank to "Choose Enemy"
        $("#your-enemies").text("Choose Enemy to Battle...");

        // sets up click event for enemy divs
        $(".enemy-select").on("click", enemySelect);
        
    };
        

    // CHOOSE ENEMY FUNCTION
    function enemySelect () {
        
            // Reset bg color (if someone died previously)
        $("#your-char-3").css("background-color", "white").slideDown(500);
        
            // pulls (child) id for name (ie, 'mario')
        var character = $(this).children().siblings("img").attr("id");
            // pulls (parent) div id (ie, 'your-char-2')
        var charDiv = $(this).attr("id");


        // moves character to the first (left) spot
            // Pull html from selected character
        var newHtml = $("#" + charDiv).html();
            // Set html on 3rd spot and make visible
        $("#your-char-3").html(newHtml).css("visibility", "visible").css("display", "none").slideDown(300);

            // Remove enemy from available enemies
        $(this).slideUp(300);

            // Change message to "Enemies waiting"
        $("#your-enemies").text("Enemies waiting to Battle...");

            // Turn off ability to click enemies
        $(".enemy-select").off("click");

            // Change message to attack
        $("#system-message").text("Click on your enemy to attack!");
        $("#your-char-3").on("click", battle);

    };


    // BATTLE FUNCTION
    function battle () {

        // Assign battle participants in vars
        var enemy = $(this).children("img").attr("id");
        var character = $("#your-char-1").children("img").attr("id");

        
        // Attack (must reference window object)
        window[character].attack(window[enemy]);

        // Disable attack if either die
        if (window[character].hp <= 0 || window[enemy].hp <= 0) {
            $("#your-char-3").off("click");
        }

        // retrieve AP and attckCtr to display in system message
        var attckPnts = window[character].ap * window[character].attckCtr

        // Update HPs
        $("#" + character).siblings("div.hp").children("p").text(window[character].hp);
        $("#" + enemy).siblings("div.hp").children("p").text(window[enemy].hp);

        // Display results of attack in system message div
        $("#system-message").text(`You attacked ${window[enemy].name} for ${attckPnts} damage. 
        ${window[enemy].name} counter attacked for ${window[enemy].cap} damage.`)

            // if you die
        if (window[character].hp <= 0) {
            $("#your-char-1").css("background-color", "red").children("img").css("filter", "invert(100%)");
            // if only you die
            if (window[enemy].hp <= 0) {
                $("#system-message").text("You both have died. It's a draw.  Game Over!");
                $("#your-char-3").css("background-color", "red").children("img").css("filter", "invert(100%)");
            // if you both die
            } else {
                $("#system-message").text("You have been defeated!  Game Over!").addClass("alert-danger").removeClass("alert-info");
            }
            $("#restart").css("visibility", "visible").on("click", function() {
                location.reload();
            });
            // if enemy dies
        } else if (window[enemy].hp <= 0) {
            $("#your-char-3").css("background-color", "red").children("img").css("filter", "invert(100%)");
            $("#your-char-3").slideUp(500);

                // if enemies still left
            if (characterArray.length > 1) {
                $("#your-enemies").text("Choose Enemy to Battle...");
                $(".enemy-select").on("click", enemySelect);
                $("#system-message").text(`${window[enemy].name} has been defeated. Choose your next enemy to battle.`);
                // if no enemies left
            } else if (characterArray.length <= 1) {
                
                // Fade out enemy and VS
                $("#your-enemies").text("");
                $("#your-char-2").fadeOut(2000);
                $("#your-char-3").fadeOut(2000);

                // Show princes in battle spot 1
                $("#battle-char-1").children("div.caption").text("Princess Peach");
                $("#battle-char-1").children("div.hp").html("");
                $("#battle-char-1").fadeIn(3000).children("img").attr("src",'assets/images/princess-peach.jpg');

                // Display win message
                $("#system-message").text(`${window[enemy].name} has been defeated. There are no more enemies to battle.  Congratulations, you won!`);

                // Remove placeholders for enemies
                $("#battle-char-3").remove();
                $("#battle-char-4").remove();

                // Build Message from Princess Peach
                $("#battle-char-2").addClass("alert-success").css("display", "none").css("visibility", "visible").css("font-size", "20px").html(`${window[character].name}, you're my Hero!  Thank you for saving me from this evil kingdom!
                 Princess Peach`).parent("div").removeClass("col-xs-3 col-sm-2 col-lg-2").addClass("col-xs-9 col-sm-6 col-lg-4");
                // Fade In
                $("#battle-char-2").fadeIn(3000);
                

                // Load Restart Button
                $("#restart").css("visibility", "visible").on("click", function() {
                    location.reload();
                });
            }
        }
    };
});


