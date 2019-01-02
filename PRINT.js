//==================Зберігаємо файл з інтернета ======================//
{
  let xmlFileUrl = "https://toybox.com.ua/yml_data_4.xml";
  request(xmlFileUrl, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    console.log("body:", body); // Print the HTML for the Google homepage.

    fs.writeFile("new.xml", body, function(err) {
      if (err) throw err;
      console.log("Saved!");    });
  });
}

//========== Парсим XML файл із магазину іграшок =====================//
{
  //Отримумо текст
  var data = fs.readFileSync("./import.xml", { encoding: "UTF-8" });
  //console.dir(data);

  var parseString = xml2js.parseString;
  parseString(data, function(err, result) {
    console.dir(result);
    let categoriesArr = result.yml_catalog.shop[0].categories[0].category;
    let offersArr = result.yml_catalog.shop[0].offers[0].offer;
    console.dir(categoriesArr[0]);
    console.dir(offersArr[0]);
  });
}

//======================== Парсим XML із 1С ==========================//
{
  //Отримумо текст
  var data = fs.readFileSync("./importxoz.xml", { encoding: "UTF-8" });
  //console.dir(data);

  var parseString = xml2js.parseString;
  parseString(data, function(err, result) {
    let upgradeDate = result["КоммерческаяИнформация"]["$"]["ДатаФормирования"];
    //console.log("Дата обновления: " + upgradeDate);
    let catDirtyArr =
      result["КоммерческаяИнформация"]["Классификатор"][0]["Группы"][0][
        "Группа"
      ][0]["Группы"][0]["Группа"];
    //console.dir(catDirtyArr);
    let isChangesOnly =
      result["КоммерческаяИнформация"]["Каталог"][0]["СодержитТолькоИзменения"];
    let offersArr =
      result["КоммерческаяИнформация"]["Каталог"][0]["Товары"][0]["Товар"];

    //console.dir(offersArr[0]["Группы"][0]["Ид"][0]);

    createCatOrder(catDirtyArr);
  });

  function createCatOrder(catDirtyArr) {
    console.dir(catDirtyArr.length);
    console.dir(catDirtyArr[0]["Группы"][0]["Группа"].length);
    console.dir(catDirtyArr[2]["Группы"][0]["Группа"][3]);
    console.dir(
      catDirtyArr[2]["Группы"][0]["Группа"][3]["Группы"][0]["Группа"].length
    );
    console.dir(
      catDirtyArr[2]["Группы"][0]["Группа"][2]["Группы"][0]["Группа"][2]
    );

    let mass = [];

    function recPush(a, father = 0) {
      for (let i = 0; i < a.length; i++) {
        mass.push({
          Ид: a[i]["Ид"][0],
          Наименование: a[i]["Наименование"][0],
          Сортировка: a[i]["Сортировка"][0],
          Родительская: father
        });

        if (a[i].hasOwnProperty("Группы")) {
          let deep = a[i]["Группы"][0]["Группа"];
          //let father = a[i]["Ид"][0];
          let father = a[i]["Наименование"][0];
          recPush(deep, father);
        }
      }
    }

    recPush(catDirtyArr);

    console.dir(mass);

    console.log(
      catDirtyArr[2]["Группы"][0]["Группа"][2].hasOwnProperty("Группы")
    );
    console.log(
      catDirtyArr[2]["Группы"][0]["Группа"][2]["Группы"][0][
        "Группа"
      ][2].hasOwnProperty("Группы")
    );
  }
}

//========================= Обработка POST ===========================//
{
  const arr = ["Коля", "Галя", "Валя"];
  app.post("/create", function(req, res) {
    arr.push(req.body.text);
    res.redirect("/");
  });
}
