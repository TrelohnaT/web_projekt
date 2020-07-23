
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
            }
            else if(state == 3)
            {
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
            
        }


