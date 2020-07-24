
        /*
        ** Autor: Václav Doleček
        ** datum: konec července 2020
        ** motivace: prahnutí po vědomostech a absence podkladů pro personalisty
        ** pár slov o programu:
        *** Nevím ještě co to vlastně bude, takže to sem pak dopíšu

        ** důvod absence komentářu v HTML:
        *** nechce se mi furt psát <!--- a pak --->
        */

        /*hlavní řídící promněná, díky tomuto program pozná, na co se kliklo a jak má reagovat*/
        var state = 0;

        /*zde jsou ulozeny dulezite souradnice*/
        /*vychozi hodnota je -1, když kostička neexistuje*/
        var fuky_x = -1;
        var fuky_y = -1;

        var food_x = -1;
        var food_y = -1;

        /*
        ** tato funkce slouží k měnění barvu čtverečků
        ** pro adresování jednotlivých kostiček používám id, každý má svoje unikátní x_y
        ** předání id funkci je pomoci parametru x a y, každý čtvereček (div block_[něco]) předá své souřadnice (id)
        ** celá ta změna je pouze změnění atribudu class
        */
        function block_click_pl(x, y)
        {

            document.getElementById("test").innerHTML = document.getElementById(x + "_" + y).getAttribute("class");
            
            if(document.getElementById(x + "_" + y).getAttribute("class") == "block_empty")
            {
                if(state == 1)
                {
                    document.getElementById(x + "_" + y).setAttribute("class", "block_field");
                }
                else if(state == 2)
                {
                    document.getElementById(x + "_" + y).setAttribute("class", "block_wather");
                }  
                else if(state == 4)
                {
                    if(fuky_x == -1 && fuky_y == -1)
                    {
                        document.getElementById(x + "_" + y).setAttribute("class", "block_fuky");
                        fuky_x = x;
                        fuky_y = y;
                        document.getElementById("test").innerHTML = "x:" + fuky_x + " y:" + fuky_y;
                    }
                }
                else if(state == 5)
                {
                    if(food_x == -1 && food_y == -1)
                    {
                        document.getElementById(x + "_" + y).setAttribute("class", "block_food");
                        food_x = x;
                        food_y = y;
                        document.getElementById("test").innerHTML = "x:" + food_x + " y:" + food_y;

                    }
                }
                
            }
            else if(state == 3)
            {
                //mazani starych souradnic pri mazani bloku
                if(x == fuky_x && y == fuky_y)
                {
                    fuky_x = -1;
                    fuky_y = -1;
                }
                else if(x == food_x && y == food_y)
                {
                    food_x = -1;
                    food_y = -1;
                }
                document.getElementById(x + "_" +y).setAttribute("class", "block_empty");
            }
            
        }

        function block_mouse_in()
        {
            document.getElementById("test").innerHTML = "good";

        }

        function block_mouse_out()
        {
            document.getElementById("test").innerHTML = "test";
        }

        function block_click_menu(m)
        {
            /*resetování okraju z předchozích výběru*/
            document.getElementById("m_e").style.borderColor = "white";
            document.getElementById("m_w").style.borderColor = "steelblue";
            document.getElementById("m_f").style.borderColor = "seagreen";
            document.getElementById("m_fu").style.borderColor = "pink";
            document.getElementById("m_fo").style.borderColor = "darkorange";

            /*je kliknuto na menu tlačítko pro zemi (zelene)*/
            if(m == 1)
            {
                state = m;
                document.getElementById("m_f").style.borderColor = "orange";
            }
             /*je kliknuto na menu tlačítko pro vodu (modre)*/
            else if(m == 2)
            {
                state = m;
                document.getElementById("m_w").style.borderColor = "orange";
            }
             /*je kliknuto na menu tlačítko pro prazdno (bile)*/
            else if(m == 3)
            {
                state = m;
                document.getElementById("m_e").style.borderColor = "orange";   
            }
            else if(m == 4)
            {
                state = m;
                document.getElementById("m_fu").style.borderColor = "orange";
            }
            else if(m == 5)
            {
                state = m;
                document.getElementById("m_fo").style.borderColor = "orange";
            }
            
        }

        async function find_food()
        {
            if((fuky_x != -1 && fuky_y != -1) && (food_x != -1 && food_y != -1))
            {
                //dokud fuky nenajde jidlo...
                while(fuky_x != food_x)
                {
                    await sleep(1000);
                    if(fuky_x > food_x)
                    {
                        move_x_minus();
                    }
                    else if(fuky_x < food_x)
                    {
                        move_x_plus();
                    }
                }
                while(fuky_y != food_y)
                {
                    await sleep(1000);
                    if(fuky_y < food_y)
                    {
                        move_y_plus();
                    }
                    else if(fuky_y > food_y)
                    {
                        move_y_minus();
                    }
                    
                }

                if(fuky_x == food_x && fuky_y == food_y)
                {
                    food_x = -1;
                    food_y = -1;
                }
                
            }
            else
            {
                alert("fuky or food doest exist");
            }
        }

        function move_y_plus()
        {
            document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
            fuky_y = fuky_y+1;
            document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
            return;
        }

        function move_y_minus()
        {
            document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
            fuky_y = fuky_y-1;
            document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
            return;
        }

        function move_x_plus()
        {
            document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
            fuky_x = fuky_x+1;
            document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
            return;
        }

        function move_x_minus()
        {
            document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
            fuky_x = fuky_x-1;
            document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
            return;
        }

        
        //tato funkce byla "vypujčena" z internetu (sitepoint)
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }




