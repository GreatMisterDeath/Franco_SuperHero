$(document).ready(function()
{
    var pData

    $("#searchButton").click
    (
        function()
        {
            let searchResult = $("#searchField").val()
            searchResult = searchResult.trim()

            if (isValidSearch(searchResult))
                getDataFromAPI(parseInt(searchResult))
        }
    )

    let isValidSearch = (paramText) =>
    {
        let isValid = true
        let testExpression = /^[0-9]*$/gm;

        if (!testExpression.test(paramText) || paramText == "")
        {
            isValid = false
            alert("Debe ingresar un valor numerico valido")
        }
        else if (parseInt(paramText) < 1)
        {
            isValid = false
            alert("Debe ingresar un valor numerico mayor o igual a 1")
        }

        return isValid;
    }

    let getDataFromAPI = (pSearchResult) =>
    {
        $.ajax(
        {
            type: "GET",
            url: `https://www.superheroapi.com/api.php/4635019093177645/${pSearchResult}`,
            dataType: "json",
            success: function(pTempData)
            {
                pData = pTempData

                if (pData.response == "error")
                {
                    alert("El valor ingresado esta fuera de rango")
                    return
                }

                sendDataFromAPI()

                console.log("Conexion exitosa")
            },
            error: function(pTempData)
            {
                console.log("Error en la conexion")
            },
            async: true,
        })
    }

    let sendDataFromAPI = () =>
    {
        sendHTML()

        var options =
        {
            title:
            {
                text: `Estadisticas de poder para ${pData.name}`
            },

            animationEnabled: true,
            data:
            [{
                type: "pie",
                startAngle: 40,
                toolTipContent: "<b>{label}</b>: {y} / 100",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y} / 100",
                dataPoints:
                [
                    { y: pData.powerstats.intelligence, label: "Inteligencia" },
                    { y: pData.powerstats.strength, label: "Fuerza" },
                    { y: pData.powerstats.speed, label: "Velocidad" },
                    { y: pData.powerstats.durability, label: "Durabilidad" },
                    { y: pData.powerstats.power, label: "Poder" },
                    { y: pData.powerstats.combat, label: "Combate" }
                ]
            }]
        };

        $("#heroDataChart").CanvasJSChart(options);
    };

    let sendHTML = () =>
    {
        $("#heroData").html
        (
            `<article class="heroData__article1">
                <img src="${pData.image.url}" alt="sh1-alt" style="width: 30%">
                <div class="card" style="width: 70%;">
                <div class="card-body">
                    <h5 class="card-title">Nombre: ${pData.name}</h5>
                    <p class="card-text">Conexiones: ${pData.connections["group-affiliation"]}</p>
                    <p class="card-text"><i>Publicado por:</i> ${pData.biography.publisher}</p>
                </div>
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item"><i>Primera aparicion:</i> ${pData.biography["first-appearance"]}</li>
                    <li class="list-group-item"><i>Altura:</i> ${pData.appearance.height[0]} - ${pData.appearance.height[1]}</li>
                    <li class="list-group-item"><i>Peso:</i> ${pData.appearance.weight[0]} - ${pData.appearance.weight[1]}</li>
                    <li class="list-group-item"><i>Alianzas:</i> ${pData.biography.aliases}</li>
                </ul>
            </div>
            </article>
            <article id="heroDataChart" class="heroData__article2">
            </article>`
        );
    }
});
