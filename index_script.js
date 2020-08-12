/*

** Autor: Václav Doleček

 */


async function mouse_in(block)
{
    if(block == 1)
    {
        /*zvětšení celého bloku aby se tam vešel obrázek*/
        document.getElementById("mine").style.height = "650px";
        /*zvětšení obrázku na šířku */
        document.getElementById("menu_part_picture").style.height = "650px";
        /*zvětšení obrázku na výšku */
        document.getElementById("menu_part_picture").style.width = "650px";
        /*zviditelnění popisku 1*/
        document.getElementById("sample_text_miner_p1").style.display = "block";
        /*zviditelnění popisku 2*/
        document.getElementById("sample_text_miner_p2").style.display = "block";
    }
}

function mouse_out(block)
{
    if(block == 1)
    {
        /*zmenšení obrázku na výšku */
        document.getElementById("menu_part_picture").style.width = "42%";
        /*zmenšení obrázku na šířku */
        document.getElementById("menu_part_picture").style.height = "200px";
        /*z neviditelnění popisku 1*/
        document.getElementById("sample_text_miner_p1").style.display = "none";
        /*z neviditelnění popisku 2*/
        document.getElementById("sample_text_miner_p2").style.display = "none";
        /*zmenšení bloku */
        document.getElementById("mine").style.height = "200px";
    }
}
