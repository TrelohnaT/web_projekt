

/*
** Verze: 0.1
** Autor: Václav Doleče
** Motivace: Našel jsem v zalíbení ve svaté trojici (HTML,CSS,JS) a tuto hru jsem chtěl už dlouho udělat


** Pár slov o pragramu:
** Věřím že zde jsou některé pasáže které jsou řešeny "dřevorubecky"
** avšak hlavní když to funguje

*/

/*
** Zde jsou deklarovány globální promněné
*/

var fuky_x;
var fuky_y;

var gold_own = 0;

var fuky_actual;

/*
** Zde je obstarání načtení mapy
** mapa není zalisovaná v HTML, ale "nakreslena" zde
** taky jsou zde zaznamenány duležité informace
*/
window.onload = (event) => {

    fuky_actual = "block_fuky_right_empty"

    document.getElementById("1_1").setAttribute("class", fuky_actual);

    fuky_x = 1;
    fuky_y = 1;

    for(var i = 0; i <= 9; i++)
    {
        for(var j = 2; j <= 9; j++)
        {
            if(j == 2)
            {
                document.getElementById(i + "_" + j).setAttribute("class", "block_grass");
            }
            else
            {
                document.getElementById(i + "_" + j).setAttribute("class", "block_stone");
            }
        }
    }
};





/*
** Toto čte input z klávesnice bez inputového okna
** vždy načte pouze jednu klávesu
** použito pro zjištění vstupu od hráče (uživatele)
*/
window.addEventListener("keydown", function(event)
{
    /*
    ** každý IF je pro obshluha jednoho příkazu, program neni Case Sensitive
    */
    if(event.key == "w" || event.key == "W")
    {
        game_logic("w");
    }
    else if(event.key == "s" || event.key == "S")
    {
        game_logic("s");
    }
    else if(event.key == "a" || event.key == "A")
    {
        game_logic("a")
    }
    else if(event.key == "d" || event.key == "D")
    {
        game_logic("d")
    }
    else if(event.key == "q" || event.key == "Q")
    {

    }
    else if(event.key == "e" || event.key == "E")
    {

    }

}, true);

/*
** zde je mozek celé hry, zde se zpracovávají všechny akce a volají obslužné funkce
*/
function game_logic(key)
{
    /**Pokud je přijat klič pro pohyb, je zavolána funkce pro pohyb 
     * Input: keyboard input
    */
    if(key == "w" || key == "s" || key == "a" || key == "d")
    {
        fuky_move(key);
    }
}

/*
** funkce pro pohyb, vykoná pohyb postavičky v závislosti na vstupním argumentu
 * Input: směrový klíč (w,s,a,d)
*/
function fuky_move(direction)
{
    if(direction == "w")
    {
        /*tyto IFy bráni v předtím aby hráč vylezl z hrací plochy */
        if((fuky_y-1) >= 0)
        {
            move_y_minus("block_empty");
        }
    }
    else if(direction == "s")
    {
        if((fuky_y+1) <= 9)
        {
            move_y_plus("block_empty");
        }
    }
    else if(direction == "a")
    {
       if((fuky_x-1) >= 0)
       {
            if(gold_own == 0)
            {
                fuky_actual = "block_fuky_left_empty";
            }
            else
            {
                fuky_actual = "block_fuky_left_gold";
            }    
            move_x_minus("block_empty", fuky_actual);
       }
    }
    else if(direction == "d")
    {
        if((fuky_x+1) <= 9)
        {
            if(gold_own == 0)
            {
                fuky_actual = "block_fuky_right_empty";
            }
            else
            {
                fuky_actual = "block_fuky_right_gold";
            }
            move_x_plus("block_empty", fuky_actual);
        }
    }

}

function move_x_plus(block_replace, fuky_replace)
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", block_replace);
    fuky_x = fuky_x+1;
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", fuky_replace);
    return;
}

function move_x_minus(block_replace, fuky_replace)
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", block_replace);
    fuky_x = fuky_x-1;
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", fuky_replace);
    return;
}

function move_y_plus(block_replace, fuky_replace)
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class",block_replace);
    fuky_y = fuky_y+1;
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", fuky_replace);
    return;
}

function move_y_minus(block_replace, fuky_replace)
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", block_replace);
    fuky_y = fuky_y-1;
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", fuky_replace);
    return;
}



