

/*
** Verze: 1.0
** Autor: Václav Doleče
** Motivace: Našel jsem v zalíbení ve svaté trojici (HTML,CSS,JS) a tuto hru jsem chtěl už dlouho udělat


** Pár slov o pragramu:
** Věřím že zde jsou některé pasáže které jsou řešeny "dřevorubecky"
** avšak hlavní když to funguje

*/

/*
** Zde jsou deklarovány globální promněné
*/
const min_x = 0;
const max_x = 9;

const min_y = 0;
const max_y = 9;

var fuky_x;
var fuky_y;

var gold_own = 0;                   //flag, jestli fuky našel nebo nenašel zlato
var gold_found = 0;                 //počet vykopaného zlata

var last_block;                     //block který se nacházel na místě kde právě stojí fuky
var actual_block;                   


var fuky_actual;                    //aktualní podoba fukyho

/*
** Zde je obstarání načtení mapy
** mapa není zalisovaná v HTML, ale "nakreslena" zde
** taky jsou zde zaznamenány duležité informace
*/
window.onload = (event) => {

    fuky_actual = "block_fuky_right_empty"

    actual_block = "block_empty";

    document.getElementById("1_1").setAttribute("class", fuky_actual);

    document.getElementById("8_1").setAttribute("class", "block_stack_gold");

    fuky_x = 1;
    fuky_y = 1;

    for(var i = 0; i <= max_y; i++)
    {
        for(var j = 2; j <= max_x; j++)
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
    for(var n = 0; n <= 5; n++)
    {
        document.getElementById(RNG(10) + "_" + (5 + RNG(5))).setAttribute("class", "block_deposite_gold");
    }
};





/*
** Toto čte input z klávesnice bez inputového okna
** vždy načte pouze jednu klávesu
** použito pro zjištění vstupu od hráče (uživatele)
*/
window.addEventListener("keydown", function(event)
{

    last_block = actual_block;
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
        game_logic("q");
    }
    else if(event.key == "e" || event.key == "E")
    {

    }

}, true);

/*
** zde je mozek celé hry, zde se zpracovávají všechny akce a volají obslužné funkce
*/
async function game_logic(key)
{
    /**Pokud je přijat klič pro pohyb, je zavolána funkce pro pohyb 
     * Input: keyboard input
    */
    /*
    ** sleep zde pro natažení herní doby
    */
    await sleep(200);
    if(key == "w" || key == "s" || key == "a" || key == "d")
    {
        fuky_move(key);
    }
    else if(key == "q")
    {
        if(look_left() == "block_stack_gold" || look_right() == "block_stack_gold")
        {
            gold_own = 0;
            gold_found = gold_found + 1;
            if(fuky_actual == "block_fuky_right_gold")
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky_right_empty");
                return;
            }
            else if(fuky_actual == "block_fuky_left_gold")
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky_left_empty");
                return;
            }
        }
        else
        {
            alert("Need find gold stack")
        }
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
        if((fuky_y-1) >= min_y)
        {
            /*-1 jedna je vráceno pouze tehdy pokud nelze se posunou do prava */
            if(texture_desider(direction) == -1)
            {
                return;
            }
            actual_block = last_block_desider(look_up(), last_block, direction);
            move_y_minus(last_block, fuky_actual);
            document.getElementById("test").innerHTML = last_block;
        }
    }
    else if(direction == "s")
    {
        if(texture_desider(direction) == -1)
        {
            return;
        }
        if((fuky_y+1) <= max_y)
        {
            //texture_desider(direction);
            move_y_plus("block_ladder", fuky_actual);
            actual_block = last_block_desider(look_down(), last_block, direction);
        }
    }
    else if(direction == "a")
    {
        if(texture_desider(direction) == -1)
        {
            return;
        }
       if((fuky_x-1) >= min_x)
       {
            //texture_desider(direction);
            actual_block = last_block_desider(look_left(), last_block, direction);    
            move_x_minus(last_block, fuky_actual);;
       }
    }
    else if(direction == "d")
    {
        if(texture_desider(direction) == -1)
        {
            return;
        }
        if((fuky_x+1) <= max_x)
        {
            //texture_desider(direction);
            actual_block = last_block_desider(look_right(), last_block, direction);
            move_x_plus(last_block, fuky_actual);
        }
    }
}

/*
** funce která nastavuje správné textury podle kontextu na hrací ploše
** zde je implementována hlavní logiky
** Input: Direction(w,a,s,d)
** Output: přepisování globálních promněných: fuky_replace, block_replace
** 
*/
function texture_desider(direction)
{
    document.getElementById("test").innerHTML = gold_own;
    /*pokud hrač našel zlato */
    if(gold_own == 1)
    {
        if(direction == "d")
        {
            if(look_right() == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_gold";
                return;
            }
            else if(look_right() == "block_tunnel" || look_right() == "block_stone")
            {
                fuky_actual = "block_fuky_right_gold_tunnel";
                return;
            }
            else if(look_right() == "block_stack_gold")
            {
                return -1;
            }
            else if(look_right() == "block_deposite_gold")
            {
                if(gold_own == 1)
                {
                    alert("bag is full");
                    return -1;
                }
            }
            else
            {
                fuky_actual = "block_fuky_right_gold";
                return;
            }
            return;
        }
        else if(direction == "a")
        {
            if(look_left() == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_gold";
                return;
            }
            else if(look_left() == "block_tunnel" || look_left() == "block_stone")
            {
                fuky_actual = "block_fuky_left_gold_tunnel";
                return;
            }
            else if(look_left() == "block_stack_gold")
            {
                return -1;
            }
            else if(look_left() == "block_deposite_gold")
            {
                if(gold_own == 1)
                {
                    alert("bag is full");
                    return -1;
                }
            }
            else
            {
                fuky_actual = "block_fuky_left_gold";
                return;
            }
            return;
        }
        else if(direction == "w")
        {
            if(look_up() == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_gold";   
                return;
            }
            else
            {
                alert("ladder needed");
                return -1;
                
            }
        }
        else if(direction == "s")
        {
            if(look_down() == "block_deposite_gold")
            {
                alert("bag is full");
                return -1;
            }

            if(gold_own == 1)
            {
                gold_own = 1;
                fuky_actual == "block_ladder_miner_gold";
                return;
            }
        }
    } 

    /*pokud hráč ještě nenašel zlato */
    else if(gold_own == 0)
    {
        /*podle toho jakým směrem se kouká se změní jeho texture (0 -> vpravo, 1 -> vlevo) */
        if(direction == "a")
        {
            if(look_left() == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_empty";
                return;
            }
            else if(look_left() == "block_tunnel" || look_left() == "block_stone")
            {
                fuky_actual = "block_fuky_left_empty_tunnel";
                return;
            }
            else if(look_left() == "block_stack_gold")
            {
                return -1;
            }
            else if(look_left() == "block_deposite_gold")
            {
                if(gold_own == 0)
                {
                    gold_own = 1;
                    fuky_actual = "block_fuky_left_gold_tunnel";
                    return;
                }
            }
            else
            {
                fuky_actual = "block_fuky_left_empty";
                return;
            }
            return;
        }
        else if(direction == "d")
        {
            if(look_right() == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_empty";
                return;
            }
            else if(look_right() == "block_tunnel" || look_right() == "block_stone")
            {
                fuky_actual = "block_fuky_right_empty_tunnel";
                return;
            }
            else if(look_right() == "block_stack_gold")
            {
                return -1;
            }
            else if(look_right() == "block_deposite_gold")
            {
                if(gold_own == 0)
                {
                    gold_own = 1;
                    fuky_actual = "block_fuky_right_gold_tunnel";
                    return;
                }
            }
            else
            {
                fuky_actual = "block_fuky_right_empty";
                return;
            }
            return;
        }
        /**dolu */
        else if(direction == "s")
        {
            if(look_down() == "block_deposite_gold" || gold_own == 1)
            {
                fuky_actual = "block_ladder_miner_gold";
                gold_own = 1;
                return;
            }
            else
            {
                fuky_actual = "block_ladder_miner_empty";
                return;
            }
        }
        /**nahoru */
        else if(direction == "w")
        {
            if(look_up() == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_empty";   
                return;
            }
            else
            {
                alert("ladder needed");
                return -1;
                
            }
        }
    }
}

/*
** rozhoduje jaký bude blok na místě kde se aktualně nachází fuky potom co se posune
** v podobě else if jsou implementovány veškeré výjimky
** Input: future - boudí blok kam se chce posunout, last - minulý blok kam se už posunul 
*/
function last_block_desider(future, past, direction)
{
    if(direction == "s" || direction == "w")
    {
        return("block_ladder");
    }
    else if(direction == "a" || direction == "d")
    {
        if(future == "block_empty" && past == "block_empty")
        {
            return(past);
        }
        else if(future == "block_ladder")
        {
            return(future);
        }
        else if(future == "block_empty" && past == "block_ladder")
        {
            return("block_empty");
        }
        else
        {
            return("block_tunnel");
        }
    }
}


/*nahlédnutí jaký blok se nachází nalevo */
function look_left()
{
    return(document.getElementById((fuky_x-1) + "_" + fuky_y).getAttribute("class"));
}

/*nahlednutí jaký blok se nachází v pravo */
function look_right()
{
    return(document.getElementById((fuky_x+1) + "_" + fuky_y).getAttribute("class"));
}

/*nahlednutí jaky blok se nachazí nad ním */
function look_up()
{
    return(document.getElementById(fuky_x + "_" + (fuky_y-1)).getAttribute("class"));
}

/*nahlednutí jaky blok se nachazí pod ním */
function look_down()
{
    return(document.getElementById(fuky_x + "_" + (fuky_y+1)).getAttribute("class"));
}



function move_x_plus(block_replace, fuky_replace)
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", block_replace);
    last_block = document.getElementById(fuky_x + "_" + fuky_y).getAttribute("class");
    fuky_x = fuky_x+1;
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", fuky_replace);
    return;
}

function move_x_minus(block_replace, fuky_replace)
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", block_replace);
    last_block = document.getElementById(fuky_x + "_" + fuky_y).getAttribute("class");
    fuky_x = fuky_x-1;
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", fuky_replace);
    return;
}

function move_y_plus(block_replace, fuky_replace)
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", block_replace);
    last_block = document.getElementById(fuky_x + "_" + fuky_y).getAttribute("class");
    fuky_y = fuky_y+1;
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", fuky_replace);
    return;
}

function move_y_minus(block_replace, fuky_replace)
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", block_replace);
    last_block = document.getElementById(fuky_x + "_" + fuky_y).getAttribute("class");
    fuky_y = fuky_y-1;
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", fuky_replace);
    return;
}

//tato funkce byla "vypujčena" z internetu (sitepoint)
function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*tato taky... */
function RNG(range)
{
    return(Math.floor(Math.random() * range));
}
