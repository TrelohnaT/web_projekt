/*
** Autor:Václav Doleček
*/

/*poloha fukyho */
var fuky_x = 1;
var fuky_y = 1;

/*poloha kliknutí, tedy budoucí poloha fukyho */
var dest_x;
var dest_y;

/*Random Number */
var RN;

/*po kliknutí na poličko se uloží jeho souřadnice a nasledně zavola funkce pro pohyb */
function block_click_pl(x,y)
{
    dest_x = x;
    dest_y = y;

    move_to_dest();
    
}

/*dokud fuky farmař nedosáhne destinace se pohybuje k destinaci */
async function move_to_dest()
{
    while(fuky_x != dest_x || fuky_y != dest_y)
    {
        document.getElementById("test").innerHTML = "Started";
        await sleep(500);
        RNG(2);
        document.getElementById("RNG").innerHTML = "X dest: " + dest_x + " Y dest: " + dest_y + " RNG: " + RN;

        if(RN == 1)
        {
            if(fuky_x < dest_x)
            {
                move_x_plus();
            }
            else if(fuky_x > dest_x)
            {
                move_x_minus();
            }
        }
        else if(RN == 2)
        {
            if(fuky_y < dest_y)
            {
                move_y_plus();
            }
            else if(fuky_y > dest_y)
            {
                move_y_minus();
            }
        }
    }

}

function move_x_plus()
{
    if(dest_y >= 0 && dest_y <= 12)
    {
        document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
        fuky_x = fuky_x+1;
        document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
        return;
    }
    return;

}

function move_x_minus()
{
    if(dest_y >= 0 && dest_y <= 12)
    {
        document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
        fuky_x = fuky_x-1;
        document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
        return;
    }
    return;

}

function move_y_plus()
{
    if(dest_y >= 0 && dest_y <= 12)
    {
        document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
        fuky_y = fuky_y+1;
        document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
        return;
    }
    return;

}

function move_y_minus()
{
    if(dest_y >= 0 && dest_y <= 12)
    {
        document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
        fuky_y = fuky_y-1;
        document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
        return;
    }
    return;

}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function RNG(range)
{
    RN = Math.floor((Math.random() * range) + 1);
}

