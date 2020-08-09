
/*
** Verze: 1.2
** Autor: Václav Doleček
** Motivace: Našel jsem v zalíbení ve svaté trojici (HTML,CSS,JS) a tuto hru jsem chtěl už dlouho udělat

** Pár slov o pragramu:
** Věřím že zde jsou některé pasáže které jsou řešeny "dřevorubecky" avšak hlavní když to funguje
** v HTML a CSS sekci nejsou komentáře, neboť se mi je nechce furt vyklikávat
*/

/*
** Legenda pro všechny promněné a funkce
* Promněnné:

** souřadnice:
*** min/max_x/y => zde jsou uloženy rozměry hrací plochy
*** fuky_x/y    => zde je uložena aktuální pozice fukyho(hráče)

** textury:
*** fuky_actual     => název aktuálního fuky bloku(aktuální textury, viz CSS)
*** actual_block    => název bloku na kterém fuky momentálně stojí(byl změněn na texturu hráče)
*** last_block      => nazev posledního bloku kde se hráč nacházel

** gold mechanika:
*** gold_own        => flag určující zda-li hráč nalezl zlato, používá se při výběru textury hráče
*** gold_total      => celkový počet zlata, používá se při generování a při zjištění výhry
*** gold_found      => počet zlata které už hráč našel a donesl, používá se při zjištění výhry

* základní funkce:

** game_logic(key)
*** input: key => znak stlačené klávesy
**** podle stisknuté klávesy volá funkce fuky_move(key) nebo opacity_setter() a nebo obsluhuje požadavek (při stalčení q nebo Q)

** fuky_move(key)
*** input: key => znak stlačené klávesy
**** podle stisknuté klávesy volá funkce podpurné funkce pro pohyb (texture desider(direction), actual_block_desider(future, past, direction)) a následně funkci pro pohyb samotnou (move_x/y_plus/minus(x, y, block_replace, person_replace))

*pohybové funkce:

** texture_desider(direction)
*** input: direction        => směr kterým se chce hráč pohnut (w,s,a,d)
*** output: -1              => pouze pokud pohyb není možný
**** nastavuje hodnotu fuky_actual podle toho kam se chce hráč pohnout a to tak, že volá pomocné funkce
look_left/look_right/look_up/look_down(x,y) a kterým se podívá, na jaký blok se hráč má pohnout.
Podle jako texturu hráč bude mít(resp. následují blok kam se hráč pohne) v závislosti na hodnotě v
promněné gold_own a jestli je pohyb vubec možný

** actual_block_desider(future, past, direction)
*** input: future           => blok kam se chce hráč posunout
*** input: past             => last_block
*** input: direction        => směr kterým se chce hráč posunout
*** output:                 => název bloku který bude novým actual_block
**** na základě vstupních argumentu rozhodne, jaky blok bude v actual_block, resp. jaký blok
by byl na místě kde je teď hráč kdyby tam hráč nebyl, resp. jaký blok bude na místě hráče
až se hráč pohne z něj pryč

** move_x_plus/move_x_minus/move_y_plus/move_y_minus(x, y, block_replace, person_replace)
*** input: x                => souřadnice osy X pohybovaného bloku
*** input: y                => souřadnice osy Y pohybovaného bloku
*** input: block_replace    => název bloku který bude na místě pohybovaného bloku
*** input: person_replace   => název ploku který bude na novém místě(tam kde se hráč pohne)
**** mění actual_block na last_block
**** samotný pohyb je vykonán pouze přehozením textur

** look_left/look_right/look_up/look_donw(x, y)
*** input: x                => souřadnice osy X bloku ze kterého se dívám
*** input: y                => souřadnice osy Y bloku ze kterého se dívám
*** output:                 => název bloku který na který se dívám
**** funkce vzme aktuální souřadnice bloku ze kterého se dívám a přičte/odečte k nim 1 podle toho kterým
směrem se chci podívat. Následně vrátí název bloku který ležícího tím směrem. Pokud tam žádný blok není, vrácí nono_defined(nebo tak něco)

* viditelnost:

** opacity_setter()
*** input/output: none
**** nastavuej opacity bloku hráče a jeho okolí, to ma za následek to, že hrač vidí pouze to kde už byl
fuknce nastaví opacity aktuálního bloku na hodnotu 1 a okolních na hodnout 0.65

* Ostatní:

** win()
*** input/output: none
**** nastaví block hráče na block pro vítěství (viž CSS)

** sleep(ms)
*** input: ms               => počet milisekund které se čeká
**** funkce pozastaví program na požadovaný počet milisekudn

** RNG(range)
*** input: range            => rozsah ze kterého chceme vybrat jedno náhodné číslo
*** output: [čislo]         => náhodné číslo ze zadaného rozsahu
**** funkce vybere jedno náhodné číslo ze zadaného rozsahu

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

var gold_total = 5;                 //celkem zlatat kolik se vygeneruje
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
    for(var n = 0; n < gold_total; n++)
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

    if(gold_total == gold_found)
    {
        win();
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
        if(look_left(fuky_x, fuky_y) == "block_stack_gold" || look_right(fuky_x, fuky_y) == "block_stack_gold")
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
            actual_block = actual_block_desider(look_up(fuky_x, fuky_y), last_block, direction);
            fuky_y = move_y_minus(fuky_x, fuky_y, last_block, fuky_actual);
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
            actual_block = actual_block_desider(look_down(fuky_x, fuky_y), last_block, direction);
            fuky_y = move_y_plus(fuky_x, fuky_y, "block_ladder", fuky_actual);
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
            actual_block = actual_block_desider(look_left(fuky_x, fuky_y), last_block, direction);    
            fuky_x = move_x_minus(fuky_x, fuky_y, last_block, fuky_actual);;
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
            actual_block = actual_block_desider(look_right(fuky_x, fuky_y), last_block, direction);
            fuky_x = move_x_plus(fuky_x, fuky_y, last_block, fuky_actual);
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
            if(look_right(fuky_x, fuky_y) == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_gold";
                return;
            }
            else if(look_right(fuky_x, fuky_y) == "block_tunnel" || look_right(fuky_x, fuky_y) == "block_stone" ||look_right(fuky_x, fuky_y) == "block_grass")
            {
                fuky_actual = "block_fuky_right_gold_tunnel";
                return;
            }
            else if(look_right(fuky_x, fuky_y) == "block_stack_gold")
            {
                return -1;
            }
            else if(look_right(fuky_x, fuky_y) == "block_deposite_gold")
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
            if(look_left(fuky_x, fuky_y) == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_gold";
                return;
            }
            else if(look_left(fuky_x, fuky_y) == "block_tunnel" || look_left(fuky_x, fuky_y) == "block_stone" || look_left(fuky_x, fuky_y) == "block_grass")
            {
                fuky_actual = "block_fuky_left_gold_tunnel";
                return;
            }
            else if(look_left(fuky_x, fuky_y) == "block_stack_gold")
            {
                return -1;
            }
            else if(look_left(fuky_x, fuky_y) == "block_deposite_gold")
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
            if(look_up(fuky_x, fuky_y) == "block_ladder")
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
            if(look_down(fuky_x, fuky_y) == "block_deposite_gold")
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
            if(look_left(fuky_x, fuky_y) == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_empty";
                return;
            }
            else if(look_left(fuky_x, fuky_y) == "block_tunnel" || look_left(fuky_x, fuky_y) == "block_stone" || look_left(fuky_x, fuky_y) == "block_grass")
            {
                fuky_actual = "block_fuky_left_empty_tunnel";
                return;
            }
            else if(look_left(fuky_x, fuky_y) == "block_stack_gold")
            {
                return -1;
            }
            else if(look_left(fuky_x, fuky_y) == "block_deposite_gold")
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
            if(look_right(fuky_x, fuky_y) == "block_ladder")
            {
                fuky_actual = "block_ladder_miner_empty";
                return;
            }
            else if(look_right(fuky_x, fuky_y) == "block_tunnel" || look_right(fuky_x, fuky_y) == "block_stone" || look_right(fuky_x, fuky_y) == "block_grass")
            {
                fuky_actual = "block_fuky_right_empty_tunnel";
                return;
            }
            else if(look_right(fuky_x, fuky_y) == "block_stack_gold")
            {
                return -1;
            }
            else if(look_right(fuky_x, fuky_y) == "block_deposite_gold")
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
            if(look_down(fuky_x, fuky_y) == "block_deposite_gold" || gold_own == 1)
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
            if(look_up(fuky_x, fuky_y) == "block_ladder")
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
function actual_block_desider(future, past, direction)
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
        if(look_right(fuky_x, fuky_y) != "block_grass" && fuky_y != 0)
        {
            document.getElementById((fuky_x + 1) + "_" + fuky_y).style.opacity = 0.65;
        }
    }

    if((fuky_x-1) >= min_x)
    {
        if(look_left(fuky_x, fuky_y) != "block_grass" && fuky_y != 0)
        {
            document.getElementById((fuky_x - 1) + "_" + fuky_y).style.opacity = 0.65;
        }
    }

    if((fuky_y-1) >= min_y)
    {
        /*zde je výjimka a kontroluje se zdali není hladina 1 neboť tato funkce se volá až po posunutí hráče, tedy při posunutí dolu je už hráč na hladině 1 při volání teto funkce */
        if(look_up(fuky_x, fuky_y) != "block_grass" && fuky_y != 1)
        {
            document.getElementById(fuky_x + "_" + (fuky_y - 1)).style.opacity = 0.65;
        }
    }
    
    if((fuky_y+1) <= max_y)
    {
        if(look_down(fuky_x, fuky_y) != "block_grass")
        {
            document.getElementById(fuky_x + "_" + (fuky_y + 1)).style.opacity = 0.65;
        }
    }
}


/*nahlédnutí jaký blok se nachází nalevo */
function look_left(x,y)
{
    return(document.getElementById((x-1) + "_" + y).getAttribute("class"));
}

/*nahlednutí jaký blok se nachází v pravo */
function look_right(x, y)
{
    return(document.getElementById((x+1) + "_" + y).getAttribute("class"));
}

/*nahlednutí jaky blok se nachazí nad ním */
function look_up(x, y)
{
    return(document.getElementById(x + "_" + (y-1)).getAttribute("class"));
}

/*nahlednutí jaky blok se nachazí pod ním */
function look_down(x, y)
{
    return(document.getElementById(x + "_" + (y+1)).getAttribute("class"));
}



function move_x_plus(x, y, block_replace, person_replace)
{
    document.getElementById(x + "_" + y).setAttribute("class", block_replace);
    last_block = document.getElementById(x + "_" + y).getAttribute("class");
    x = x+1;
    document.getElementById(x + "_" + y).setAttribute("class", person_replace);
    return(x);
}

function move_x_minus(x, y, block_replace, person_replace)
{
    document.getElementById(x + "_" + y).setAttribute("class", block_replace);
    last_block = document.getElementById(x + "_" + y).getAttribute("class");
    x = x-1;
    document.getElementById(x + "_" + y).setAttribute("class", person_replace);
    return(x);
}

function move_y_plus(x, y, block_replace, person_replace)
{
    document.getElementById(x + "_" + y).setAttribute("class", block_replace);
    last_block = document.getElementById(x + "_" + y).getAttribute("class");
    y = y+1;
    document.getElementById(x + "_" + y).setAttribute("class", person_replace);
    return(y);
}

function move_y_minus(x, y, block_replace, person_replace)
{
    document.getElementById(x + "_" + y).setAttribute("class", block_replace);
    last_block = document.getElementById(x + "_" + y).getAttribute("class");
    y = y-1;
    document.getElementById(x + "_" + y).setAttribute("class", person_replace);
    return(y);
}

/*když nastana výhra, neboli hráč najde všecky zlata */

function win()
{
    document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky_win");
    document.getElementById("test").innerHTML = "Congratulation, you win!!";
}


function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}


function RNG(range)
{
    return(Math.floor(Math.random() * range));
}
