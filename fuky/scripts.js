
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

        var food_found = 0;             //kolikrát našel jídlo

        var footprint_value = 1;        //hodnota bloku (stopy) na bloku na kterém stojí

        var last_direction = 0;         //poslední směr kterým se pohyboval

        var RN = 0;                     //Random Number

        var last_pythagor_distace;      //Pythagorova vzdálenost z předešlého políčka


        var next_place;

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
                    }
                }
                else if(state == 5)
                {
                    if(food_x == -1 && food_y == -1)
                    {
                        document.getElementById(x + "_" + y).setAttribute("class", "block_food");
                        food_x = x;
                        food_y = y;
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
        ** Fuky Mind 2.0
        ** Nová verze mozku pro Fuky fungující na principu drobečků
        ** Fuky za sebou nechává jiné stopy při každém průchodu přes pole
        ** podle toho se pak rozhoduje kam pujde dál
        ** přes každé políčko může projít maximálně 4krát
         */
        async function smarter_fuky()
        {
            /*kontrola zdali je fuky a food na hrací ploše*/
            if((fuky_x != -1 || fuky_y != -1) && (food_x != -1 || food_y != -1))
            {
                document.getElementById("test").innerHTML = "RUN SMATER!";
                /*dokud fuky nenalezne jídlo */
                while(fuky_x != food_x || fuky_y != food_y)
                {
                    await sleep(500);
                    RNG();
                    think_and_move();
                }
                //fuky našel jídlo
                if(fuky_x == food_x && fuky_y == food_y)
                {
                    food_x = -1;
                    food_y = -1;
                    last_direction = 0;
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
            if(food_y >= 0 && food_y <= 8)
            {
                last_pythagor_distace = pythagor(fuky_x, fuky_y, food_x, food_y);
                leave_footprint(footprint_value);
                fuky_y = fuky_y+1;
                see_footprint(fuky_x, fuky_y);
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
                last_direction = 4;
                return;
            }
            return;
        }

        /*fukce pro posun v ose Y do minusu */
        function move_y_minus()
        {
            if(food_y >= 0 && food_y <= 8)
            {
                last_pythagor_distace = pythagor(fuky_x, fuky_y, food_x, food_y);
                leave_footprint(footprint_value);
                fuky_y = fuky_y-1;
                see_footprint(fuky_x, fuky_y);
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
                last_direction = 3;
                return;
            }
            return;
        }

        /*funkce pro posun v ose X do plusu */
        function move_x_plus()
        {
            if(food_x >= 0 && food_x <= 8)
            {
                last_pythagor_distace = pythagor(fuky_x, fuky_y, food_x, food_y);
                leave_footprint(footprint_value);
                fuky_x = fuky_x+1;
                see_footprint(fuky_x, fuky_y);
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
                last_direction = 2;
                return;
            }
            return;
        }

        /*funkce pro prosun v ose X do minusu */
        function move_x_minus()
        {
            if(food_x >= 0 && food_x <= 8)
            {
                last_pythagor_distace = pythagor(fuky_x, fuky_y, food_x, food_y);
                leave_footprint(footprint_value);
                fuky_x = fuky_x-1;
                see_footprint(fuky_x, fuky_y);
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_fuky");
                last_direction = 1;
                return;    
            }
            return;
        }

        function RNG_move()
        {
            if(RN == 1)
            {
                if(fuky_x > food_x)
                {
                    if(last_direction != 2)
                    {
                        move_x_minus();
                        return;
                    }
                }
                else if(fuky_x < food_x)
                {
                    if(last_direction != 1)
                    {
                        move_x_plus();
                        return;
                    }
                }
            }
            else if(RN == 2)
            {
                if(fuky_y > food_y)
                {
                    if(last_direction != 4)
                    {
                        move_y_minus();
                        return;
                    }
                }
                else if(fuky_y < food_y)
                {
                    if(last_direction != 3)
                    {
                        move_y_plus();
                        return;
                    }
                }   
            }
            return;
        }

        function think_and_move()
        {
            var arr;
            var pythagor_distace = pythagor(fuky_x, fuky_y, food_x, food_y);
            document.getElementById("RNG").innerHTML ="last " + last_direction;
            document.getElementById("test").innerHTML = "pythagor " + pythagor_distace;

            if(last_direction == 4)
            {
                /*zjišťování ohodnocení okolních políček */
                arr = [scaning(fuky_x+1, fuky_y), scaning(fuky_x-1, fuky_y), scaning(fuky_x, fuky_y+1)];
                
                /*Pokud jsou mají všechny okolní políčka stejnou hodnotu */
                if((arr[0] == arr[1]) && (arr[1] == arr[2]))
                {
                    RNG_move();
                    return;
                }
                
                //poličko s nejvetšim ohodnocenim je v pravo
                if(arr.indexOf(Math.max.apply(Math, arr)) == 0)
                {
                    move_x_plus();
                    return;
                }
                //poličko s nejvetším ohodnocením je v levo
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 1)
                {
                    move_x_minus();
                    return;
                }
                //poličko s nejvetším ohodnocením je dole
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 2)
                {
                    move_y_plus();
                    return;
                }
                else
                {
                    return 0;
                }
            }
            else if(last_direction == 3)
            {
                /*zjišťování ohodnocení okolních políček */
                arr = [scaning(fuky_x+1,fuky_y), scaning(fuky_x-1, fuky_y), scaning(fuky_x, fuky_y-1)];
                
                /*Pokud jsou mají všechny okolní políčka stejnou hodnotu */
                if((arr[0] == arr[1]) && (arr[1] == arr[2]))
                {
                    RNG_move();
                    return;
                }

                //poličko s nejvetšim ohodnocenim je v pravo
                if(arr.indexOf(Math.max.apply(Math, arr)) == 0)
                {
                    move_x_plus();
                    return;
                }
                //poličko s nejvetším ohodnocením je v levo
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 1)
                {
                    move_x_minus();
                    return;
                }
                //políčko s největším ohodnocením na nahore
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 2)
                {
                    move_y_minus();
                    return;
                }
                //pokud mají všechna políčka stejné ohodnoceni
                else
                {
                    return 0;
                }
            }
            else if(last_direction == 2)
            {
                /*zjišťování ohodnocení okolních políček */
                arr = [scaning(fuky_x+1, fuky_y), scaning(fuky_x, fuky_y+1), scaning(fuky_x, fuky_y-1)];
                
                /*Pokud jsou mají všechny okolní políčka stejnou hodnotu */
                if((arr[0] == arr[1]) && (arr[1] == arr[2]))
                {
                    RNG_move();
                    return;
                }
                
                //poličko s nejvetšim ohodnocenim je v pravo
                if(arr.indexOf(Math.max.apply(Math, arr)) == 0)
                {
                    move_x_plus();
                    return;
                }
                //poličko s nejvetším ohodnocením je dole
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 1)
                {
                    move_y_plus();
                    return;
                }
                //políčko s největším ohodnocením na nahore
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 2)
                {
                    move_y_minus();
                    return;
                }
                else
                {
                    return 0;
                }
            }
            else if(last_direction == 1)
            {
                /*zjišťování ohodnocení okolních políček */
                arr = [scaning(fuky_x-1, fuky_y), scaning(fuky_x, fuky_y+1), scaning(fuky_x, fuky_y-1)];
                
                /*Pokud jsou mají všechny okolní políčka stejnou hodnotu */
                if((arr[0] == arr[1]) && (arr[1] == arr[2]))
                {
                    RNG_move();
                    return;
                }

                //poličko s nejvetším ohodnocením je v levo
                if(arr.indexOf(Math.max.apply(Math, arr)) == 0)
                {
                    move_x_minus();
                    return;
                }
                //poličko s nejvetším ohodnocením je dole
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 1)
                {
                    move_y_plus();
                    return;
                }
                //políčko s největším ohodnocením na nahore
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 2)
                {
                    move_y_minus();
                    return;
                }
                else
                {
                    return 0;
                }
            }
            //tento else se provede vždy po spušteni hledání
            else
            {
                /*zjišťování ohodnocení okolních políček */
                arr = [scaning(fuky_x+1, fuky_y), scaning(fuky_x-1, fuky_y), scaning(fuky_x, fuky_y+1), scaning(fuky_x, fuky_y-1)];
                if((arr[0] == arr[1]) && (arr[1] == arr[2]) && (arr[2] == arr[3]))
                {
                    RNG_move();
                    return;
                }
                //poličko s nejvetšim ohodnocenim je v pravo
                if(arr.indexOf(Math.max.apply(Math, arr)) == 0)
                {
                    move_x_plus();
                    return;
                }
                //poličko s nejvetším ohodnocením je v levo
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 1)
                {
                    move_x_minus();
                    return;
                }
                //poličko s nejvetším ohodnocením je dole
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 2)
                {
                    move_y_plus();
                    return;
                }
                //poličko s nejvetším ohodnocením je nahore
                else if(arr.indexOf(Math.max.apply(Math, arr)) == 3)
                {
                    move_y_minus();
                    return;
                }
                else
                {
                    return 0;
                }
            }
        
        }

        function scaning(x, y)
        {
            if((x == -1 || x == 9) || (y == -1 || y == 9))
            {      
                return -2;
            }
            if(document.getElementById(x + "_" + y).getAttribute("class") == "block_field")
            {
                return 0,5;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_footprint_1")
            {
                return 1;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_footprint_2")
            {
                return 2;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_footprint_3")
            {
                return 3;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_footprint_4")
            {
                return 4;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_food")
            {
                return 5;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_empty")
            {
                return -1;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_wather")
            {
                return -2;
            }
            return-2;
            
        }

        /*
        ** Podívá se na to, jaký block je ve směru kam se chce pohnout a uloží si hodnotu bloku
        ** který na tom místě po sobě nechá (zjistí jaký druh stopy má vytvořit)
         */
        function see_footprint(x, y)
        {
            if(document.getElementById(x + "_" + y).getAttribute("class") == "block_field")
            {
                footprint_value = 1;
                return;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_footprint_1")
            {
                footprint_value = 2;
                return;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_footprint_2")
            {
                footprint_value = 3;
                return;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_footprint_3")
            {
                footprint_value = 4;
                return;
            }
            else if(document.getElementById(x + "_" + y).getAttribute("class") == "block_footprint_4")
            {
                footprint_value = 4;
                return;
            }
            if(document.getElementById(x + "_" + y).getAttribute("class") == "block_empty")
            {
                footprint_value = 1;
                return;
            }
        }
        
        /*
        ** Tato funkce zanechá za Fukym správnou stopu dle předané hodnoty
         */
        function leave_footprint(value)
        {
            if(value == 1)
            {
               document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_footprint_1"); 
            }
            else if(value == 2)
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_footprint_2");
            }
            else if(value == 3)
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_footprint_3");
            }
            else if(value == 4)
            {
                document.getElementById(fuky_x + "_" + fuky_y).setAttribute("class", "block_footprint_4");
            }
        }

        /*
        ** Pythagorova veta pro pocítání príme vzdálenosti fukyho od jídla
        ** vyuzito pri detekování zacyklení
        */
        function pythagor(fuky_x, fuky_y, food_x, food_y)
        {
           return(Math.sqrt(Math.pow(Math.abs(fuky_x - food_x), 2) + (Math.pow(Math.abs(fuky_y - food_y), 2)))); 
        }


        //tato funkce byla "vypujčena" z internetu (sitepoint)
        function sleep(ms) 
        {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function RNG()
        {
            RN = Math.floor((Math.random() * 2) + 1);
        }




