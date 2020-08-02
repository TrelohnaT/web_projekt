
/*
** Verze: 1.2
** Autor: Václav Doleček
** Motivace: Našel jsem v zalíbení ve svaté trojici (HTML,CSS,JS) a tuto hru jsem chtěl už dlouho udělat

** Pár slov o pragramu:
** Věřím že zde jsou některé pasáže které jsou řešeny "dřevorubecky" avšak hlavní když to funguje
** v HTML a CSS sekci nejsou komentáře, neboť se mi je nechce furt vyklikávat

*/

/*
** Zde jsou deklarovány globální promněné
*/
const min_x = 0;
const max_x = 12;

const min_y = 0;
const max_y = 12;

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

    document.getElementById("1_0").setAttribute("class", fuky_actual);

    document.getElementById("12_0").setAttribute("class", "block_stack_gold");

    fuky_x = 1;
    fuky_y = 0;

    for(var i = 0; i <= max_y; i++)
    {
        for(var j = 1; j <= max_x; j++)
        {
            if(j == 1)
            {
                document.getElementById(i + "_" + j).setAttribute("class", "block_grass");
                document.getElementById(i + "_" + j).style.opacity = 0.65;
            }
            else if(j == 2)
            {
                document.getElementById(i + "_" + j).setAttribute("class", "block_stone"); 
                document.getElementById(i + "_" + j).style.opacity = 0.45;  
            }
            else
            {
                document.getElementById(i + "_" + j).setAttribute("class", "block_stone"); 
                document.getElementById(i + "_" + j).style.opacity = 0.1;
            }
        }
    }
    for(var n = 0; n <= 5; n++)
    {
        document.getElementById(RNG(12) + "_" + (5 + RNG(8))).setAttribute("class", "block_deposite_gold");
    }
};





/*
** Toto čte input z klávesnice bez inputového okna
** vždy načte pouze jednu klávesu
** použito pro zjištění vstupu od hráče (uživatele)
*/
window.addEventListener("keydown", async function(event)
{
    await sleep(200);
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
function game_logic(key)
{
    /**Pokud je přijat klič pro pohyb, je zavolána funkce pro pohyb 
     * Input: keyboard input
    */
    /*
    ** sleep zde pro natažení herní doby
    */
    if(key == "w" || key == "s" || key == "a" || key == "d")
    {
        fuky_move(key);
        opacity_setter();
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
            return;
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
            actual_block = last_block_desider(look_down(), last_block, direction);
            move_y_plus("block_ladder", fuky_actual);
            return;
        }
    }
    else if(direction == "a")
    {
        if(texture_desider(direction) == -1)
        {
            return;
        }
       else if((fuky_x-1) >= min_x)
       {
            actual_block = last_block_desider(look_left(), last_block, direction);    
            move_x_minus(last_block, fuky_actual);;
            return;
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
            actual_block = last_block_desider(look_right(), last_block, direction);
            move_x_plus(last_block, fuky_actual);
            return;
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

            else if(gold_own == 1)
            {
                gold_own = 1;
                fuky_actual = "block_ladder_miner_gold";
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

/*
** tato funkce mění opacity bloku, tedy viditelnost podletoho jak se fuky pohybuje
** Input: global fuky_x, fuky_y
** Output: jiné opacity bloků okolo fukyho
*/
function opacity_setter()
{
    /*blok hráče bude vždy maximálně viditelný*/
    document.getElementById(fuky_x + "_" + fuky_y).style.opacity = 1;

    /*okolní bloky budou taky viditelné ale ne tak jasně, kromě grass blocku, ten bude viditelny furt stejně 
    ** nejdří se zkontroluje, zda-li je tím směrem ještě blok na který se dá dívet se
    ** poté se zkontroluje zda-li blok tím směrem není block_grass a jestli nejsem na hladině 0(tam je opaciti furt stejná)
    */
    if((fuky_x+1) <= max_x)
    {
        if(look_right() != "block_grass" && fuky_y != 0)
        {
            document.getElementById((fuky_x + 1) + "_" + fuky_y).style.opacity = 0.65;
        }
    }

    if((fuky_x-1) >= min_x)
    {
        if(look_left() != "block_grass" && fuky_y != 0)
        {
            document.getElementById((fuky_x - 1) + "_" + fuky_y).style.opacity = 0.65;
        }
    }

    if((fuky_y-1) >= min_y)
    {
        /*zde je výjimka a kontroluje se zdali není hladina 1 neboť tato funkce se volá až po posunutí hráče, tedy při posunutí dolu je už hráč na hladině 1 při volání teto funkce */
        if(look_up() != "block_grass" && fuky_y != 1)
        {
            document.getElementById(fuky_x + "_" + (fuky_y - 1)).style.opacity = 0.65;
        }
    }
    
    if((fuky_y+1) <= max_y)
    {
        if(look_down() != "block_grass")
        {
            document.getElementById(fuky_x + "_" + (fuky_y + 1)).style.opacity = 0.65;
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
