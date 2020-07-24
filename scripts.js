
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

        var RN;         //Random Number


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
                        /* test */
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
                        /* test */
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
            /*je kliknuto na menu talčítko pro fuky (ružove)*/
            else if(m == 4)
            {
                state = m;
                document.getElementById("m_fu").style.borderColor = "orange";
            }
            /*je kliknuto na menu tlačítko pro food (oranžové)*/
            else if(m == 5)
            {
                state = m;
                document.getElementById("m_fo").style.borderColor = "orange";
            }
            
        }

        /*
        ** Funkce pro Fuky(ružova) pro hledaní jídla(oranžova)
        ** porovnáváním se vyhodnotí další krok který je nutný pro nalezení jidla
        ** porovnává svou polohu s polohou jídla
         */
        async function find_food()
        {
            /*kontrola zdali je fuky a food na hrací ploše*/
            if((fuky_x != -1 && fuky_y != -1) && (food_x != -1 && food_y != -1))
            {
                document.getElementById("test").innerHTML = "RUN!";
                /*dokud fuky nenalezne jídlo */
                while(fuky_x != food_x || fuky_y != food_y)
                {
                    RNG();                      //vygenerování náhodného čísla
                    document.getElementById("RNG").innerHTML = RN;
                    await sleep(1000);          //nastavení spoždění mezi jednotlivými kroky
                    /*pokud je Random číslo jedna, Fuky se posune po X ose */
                    if(RN == 1)
                    {
                        /*pokud je fukyho x souřadnice větší než food */
                        if(fuky_x > food_x)
                        {
                            /*vykonání posuvu */
                            move_x_minus();
                            
                        }// if fuky_x > food_x
                        /*pokud je fukyho x souřadnice menší než food */
                        else if(fuky_x < food_x)
                        {
                            /*vykonání posuvu */
                            move_x_plus();
                        }// else if fuky_x < food_x
                    }// if RN == 1
                    /*pokud je Random číslo jedna, Fuky se posune po Y ose */
                    else if(RN == 2)
                    {
                        /*pokud je fukyho y souřadnice menší než food */
                        if(fuky_y < food_y)
                        {
                            /*vykonání posuvu */
                            move_y_plus();
                        }
                        /*pokud je fukyho y souřadnice větší než food */
                        else if(fuky_y > food_y)
                        {
                            /*vykonání posuvu */
                            move_y_minus();
                        }// if fuky_y > food_y
                    }// if RN == 2
                }// hlavni while
                /*když fuky nalezne food, jsou souřadnice food nastaveny na výchozí hodnotu */
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

        /*
        ** Tyto funkce fungují všecky na stejném principu
        ** aktualní poloha Fukyho je přepsána na defaultni blok a blok vedle(podle toho kam se chceme posunout)
        ** je přepsan na Fuky
        ** souřadnice Fukyho jsou samozřejmě upraveny aby seděly na jeho aktuální polohu
         */
        /*funkce pro posun v ose Y do plusu */
        function move_y_plus()
        {
            /*Kontrla, zda-li má vedle sebe block na který se může posunout */
            if(document.getElementById(fuky_x + "_" + (fuky_y+1)).getAttribute("class") == "block_field" || document.getElementById(fuky_x + "_" + (fuky_y+1)).getAttribute("class") == "block_food")
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
                fuky_y = fuky_y+1;
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
                return;
            }
            else
            {
                /*vypis že se nemuže posunout */
                document.getElementById("test").innerHTML = "cant move to plus y";
                dodge_y();
                return;
            }
        }

        /*fukce pro posun v ose Y do minusu */
        function move_y_minus()
        {
            /*Kontrla, zda-li má vedle sebe block na který se může posunout */
            if(document.getElementById(fuky_x + "_" + (fuky_y-1)).getAttribute("class") == "block_field" || document.getElementById(fuky_x + "_" + (fuky_y-1)).getAttribute("class") == "block_food")
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
                fuky_y = fuky_y-1;
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
                return;
            }
            else
            {
                /*vypis že se nemuže posunout */
                document.getElementById("test").innerHTML = "cant move to minus y";
                dodge_y();
                return;
            }
        }

        /*funkce pro posun v ose X do plusu */
        function move_x_plus()
        {
            /*Kontrla, zda-li má vedle sebe block na který se může posunout */
            if(document.getElementById(fuky_x+1 + "_" + fuky_y).getAttribute("class") == "block_field" || document.getElementById(fuky_x+1 + "_" + fuky_y).getAttribute("class") == "block_food")
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
                fuky_x = fuky_x+1;
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
                return;
            }
            else
            {
                /*vypis že se nemuže posunout */
                document.getElementById("test").innerHTML = "cant move to plus x";
                dodge_x();
                return;
            }
        }

        /*funkce pro prosun v ose X do minusu */
        function move_x_minus()
        {
            /*Kontrola, zda-li má vedle sebe block na který se může posunout */
            if(document.getElementById(fuky_x-1 + "_" + fuky_y).getAttribute("class") == "block_field" || document.getElementById(fuky_x-1 + "_" + fuky_y).getAttribute("class") == "block_food")
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_field");
                fuky_x = fuky_x-1;
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
                return;
            }
            else
            {
                /*vypis že se nemuže posunout */
                document.getElementById("test").innerHTML = "cant move to minus x";
                dodge_x();
                return;
            }
        }

        function dodge_x()
        {
            RN = RNG();
            if(RN == 1)
            {
                move_y_minus();
                return;
            }
            else
            {
                move_y_plus();
                return;
            }
        }

        function dodge_y()
        {
            RN = RNG();
            if(RN == 1)
            {
                move_x_minus();
                return;
            }
            else
            {
                move_x_plus();
                return;
            }
        }

        
        //tato funkce byla "vypujčena" z internetu (sitepoint)
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }

        function RNG()
        {
            RN = Math.floor((Math.random() * 2) + 1);
        }




